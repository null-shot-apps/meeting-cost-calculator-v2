'use client';

import { useState, useEffect, useCallback } from 'react';
import { Meeting, Attendee, MeetingStatus } from '@/types';
import { generateId, formatCurrency, formatTime } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { CostDisplay } from './CostDisplay';
import { TimerControls } from './TimerControls';
import { AttendeeList } from './AttendeeList';
import { SettingsPanel } from './SettingsPanel';
import { MeetingInsights } from './MeetingInsights';

export function MeetingCalculator() {
  const [meeting, setMeeting] = useState<Meeting>({
    id: generateId(),
    name: 'New Meeting',
    startTime: null,
    duration: 0,
    status: 'idle',
    frequency: 'one-time',
    overheadMultiplier: 1.5,
    pausedAt: null,
    totalPausedTime: 0,
  });

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [currentCost, setCurrentCost] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [currency, setCurrency] = useState('USD');

  // Load saved data on mount
  useEffect(() => {
    const savedCurrency = storage.getCurrency();
    const savedOverhead = storage.getOverheadMultiplier();
    const lastMeeting = storage.getLastMeeting();

    setCurrency(savedCurrency);
    setMeeting(prev => ({ ...prev, overheadMultiplier: savedOverhead }));

    if (lastMeeting && lastMeeting.attendees.length > 0) {
      setAttendees(lastMeeting.attendees);
    }
  }, []);

  // Calculate cost
  const calculateCurrentCost = useCallback(() => {
    if (meeting.status !== 'running' || !meeting.startTime) return currentCost;

    const now = Date.now();
    const elapsed = (now - meeting.startTime - meeting.totalPausedTime) / 1000; // seconds
    
    const totalHourlyRate = attendees.reduce((sum, attendee) => {
      return sum + (attendee.hourlyRate * meeting.overheadMultiplier);
    }, 0);

    const cost = (totalHourlyRate / 3600) * elapsed;
    return cost;
  }, [meeting, attendees, currentCost]);

  // Timer effect
  useEffect(() => {
    if (meeting.status !== 'running') return;

    const interval = setInterval(() => {
      const cost = calculateCurrentCost();
      setCurrentCost(cost);
      
      setMeeting(prev => ({
        ...prev,
        duration: Math.floor((Date.now() - (prev.startTime || 0) - prev.totalPausedTime) / 1000),
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [meeting.status, calculateCurrentCost]);

  // Save meeting state
  useEffect(() => {
    if (attendees.length > 0) {
      storage.saveLastMeeting(attendees, meeting.overheadMultiplier);
    }
  }, [attendees, meeting.overheadMultiplier]);

  const handleStart = () => {
    if (attendees.length === 0) return;
    
    setMeeting(prev => ({
      ...prev,
      status: 'running',
      startTime: Date.now(),
      duration: 0,
      totalPausedTime: 0,
    }));
    setCurrentCost(0);
  };

  const handlePause = () => {
    setMeeting(prev => ({
      ...prev,
      status: 'paused',
      pausedAt: Date.now(),
    }));
  };

  const handleResume = () => {
    setMeeting(prev => {
      const pauseDuration = prev.pausedAt ? Date.now() - prev.pausedAt : 0;
      return {
        ...prev,
        status: 'running',
        pausedAt: null,
        totalPausedTime: prev.totalPausedTime + pauseDuration,
      };
    });
  };

  const handleReset = () => {
    if (currentCost > 0) {
      const confirmed = window.confirm(
        `This will clear ${formatCurrency(currentCost, currency)} - continue?`
      );
      if (!confirmed) return;
    }

    setMeeting(prev => ({
      ...prev,
      id: generateId(),
      startTime: null,
      duration: 0,
      status: 'idle',
      pausedAt: null,
      totalPausedTime: 0,
    }));
    setCurrentCost(0);
  };

  const handleEnd = () => {
    if (meeting.duration > 0 && attendees.length > 0) {
      storage.addToHistory({
        id: meeting.id,
        name: meeting.name,
        date: meeting.startTime || Date.now(),
        duration: meeting.duration,
        finalCost: currentCost,
        attendeeCount: attendees.length,
        attendees: attendees,
      });
      setShowInsights(true);
    }

    setMeeting(prev => ({
      ...prev,
      status: 'ended',
    }));
  };

  const costPerMinute = meeting.duration > 0 ? (currentCost / (meeting.duration / 60)) : 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Meeting Cost Calculator
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              What&apos;s this meeting really costing?
            </p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow"
            aria-label="Settings"
          >
            <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Display */}
          <div className="lg:col-span-2 space-y-6">
            <CostDisplay
              cost={currentCost}
              duration={meeting.duration}
              costPerMinute={costPerMinute}
              status={meeting.status}
              currency={currency}
            />

            <TimerControls
              status={meeting.status}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onEnd={handleEnd}
              disabled={attendees.length === 0}
            />
          </div>

          {/* Attendees */}
          <div className="lg:col-span-1">
            <AttendeeList
              attendees={attendees}
              setAttendees={setAttendees}
              overheadMultiplier={meeting.overheadMultiplier}
              duration={meeting.duration}
              currency={currency}
              disabled={meeting.status === 'running'}
            />
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            meeting={meeting}
            setMeeting={setMeeting}
            currency={currency}
            setCurrency={setCurrency}
            attendees={attendees}
            setAttendees={setAttendees}
            onClose={() => setShowSettings(false)}
          />
        )}

        {/* Insights */}
        {showInsights && meeting.status === 'ended' && (
          <MeetingInsights
            meeting={meeting}
            attendees={attendees}
            finalCost={currentCost}
            currency={currency}
            onClose={() => {
              setShowInsights(false);
              handleReset();
            }}
          />
        )}
      </div>
    </div>
  );
}

