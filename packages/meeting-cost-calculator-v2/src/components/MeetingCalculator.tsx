'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Attendee, MeetingSettings } from '../types';
import CostDisplay from './CostDisplay';
import TimerControls from './TimerControls';
import AttendeeList from './AttendeeList';
import SettingsPanel from './SettingsPanel';
import MeetingInsights from './MeetingInsights';

export default function MeetingCalculator() {
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'ended'>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [settings, setSettings] = useState<MeetingSettings>({
    overheadMultiplier: 1.5,
    frequency: 'one-time',
    currency: 'USD',
    theme: 'auto',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('meetingCalculator');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.attendees) setAttendees(data.attendees);
        if (data.settings) setSettings(data.settings);
      } catch (e) {
        console.error('Failed to load saved data', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      'meetingCalculator',
      JSON.stringify({ attendees, settings })
    );
  }, [attendees, settings]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'running') {
      interval = setInterval(() => {
        setDuration(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status, startTime]);

  const handleStart = () => {
    if (attendees.length === 0) {
      alert('Please add at least one attendee');
      return;
    }
    setStartTime(Date.now());
    setDuration(0);
    setStatus('running');
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleResume = () => {
    setStartTime(Date.now() - duration);
    setStatus('running');
  };

  const handleReset = () => {
    setStatus('idle');
    setDuration(0);
    setStartTime(0);
  };

  const handleAddAttendee = (attendee: Omit<Attendee, 'id'>) => {
    setAttendees([
      ...attendees,
      {
        ...attendee,
        id: Math.random().toString(36).substr(2, 9),
      },
    ]);
  };

  const handleRemoveAttendee = (id: string) => {
    setAttendees(attendees.filter((a) => a.id !== id));
  };

  const handleUpdateAttendee = (id: string, updates: Partial<Attendee>) => {
    setAttendees(
      attendees.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const calculateTotalCost = useCallback(() => {
    const durationHours = duration / 1000 / 60 / 60;
    const baseCost = attendees.reduce(
      (sum, attendee) => sum + attendee.hourlyRate * durationHours,
      0
    );
    return baseCost * settings.overheadMultiplier;
  }, [duration, attendees, settings.overheadMultiplier]);

  const totalCost = calculateTotalCost();
  const costPerMinute = duration > 0 ? totalCost / (duration / 1000 / 60) : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Display */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
            <CostDisplay
              totalCost={totalCost}
              duration={duration}
              costPerMinute={costPerMinute}
              status={status}
            />
            <div className="mt-8">
              <TimerControls
                status={status}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onReset={handleReset}
                totalCost={totalCost}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => setShowInsights(true)}
              disabled={totalCost === 0}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📊 Insights
            </button>
          </div>
        </div>

        {/* Attendee List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
            <AttendeeList
              attendees={attendees}
              onAddAttendee={handleAddAttendee}
              onRemoveAttendee={handleRemoveAttendee}
              onUpdateAttendee={handleUpdateAttendee}
              duration={duration}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <SettingsPanel
        settings={settings}
        onUpdateSettings={(updates) => setSettings({ ...settings, ...updates })}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <MeetingInsights
        duration={duration}
        totalCost={totalCost}
        attendees={attendees}
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
      />
    </div>
  );
}

