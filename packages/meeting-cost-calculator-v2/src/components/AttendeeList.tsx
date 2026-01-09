'use client';

import React, { useState } from 'react';
import { Attendee, ExperienceLevel, CompanySize } from '../types';

interface AttendeeListProps {
  attendees: Attendee[];
  onAddAttendee: (attendee: Omit<Attendee, 'id'>) => void;
  onRemoveAttendee: (id: string) => void;
  onUpdateAttendee: (id: string, attendee: Partial<Attendee>) => void;
  duration: number;
}

export default function AttendeeList({
  attendees,
  onAddAttendee,
  onRemoveAttendee,
  onUpdateAttendee,
  duration,
}: AttendeeListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    inputMethod: 'manual' as 'manual' | 'ai_estimated',
    salaryType: 'annual' as 'annual' | 'hourly',
    annualSalary: 0,
    hourlyRate: 0,
  });

  const [aiEstimation, setAiEstimation] = useState({
    jobTitle: '',
    location: '',
    experience: 'Mid-Level (3-5 years)',
    companySize: '',
    industry: '',
  });

  const [estimating, setEstimating] = useState(false);
  const [estimationResult, setEstimationResult] = useState<{
    median_salary: number;
    range_low: number;
    range_high: number;
    confidence: 'high' | 'medium' | 'low';
    notes: string;
  } | null>(null);

  const handleAddAttendee = () => {
    if (!newAttendee.name) return;

    const attendee = {
      name: newAttendee.name,
      inputMethod: newAttendee.inputMethod,
      annualSalary: newAttendee.annualSalary,
      hourlyRate: newAttendee.hourlyRate,
      estimationData: newAttendee.inputMethod === 'ai_estimated' ? {
        jobTitle: aiEstimation.jobTitle,
        location: aiEstimation.location,
        experience: aiEstimation.experience as ExperienceLevel,
        companySize: aiEstimation.companySize ? aiEstimation.companySize as CompanySize : undefined,
        industry: aiEstimation.industry || undefined,
        confidence: (estimationResult?.confidence || 'medium') as 'high' | 'medium' | 'low',
        range: estimationResult ? [estimationResult.range_low, estimationResult.range_high] as [number, number] : [0, 0] as [number, number],
      } : undefined,
    };

    onAddAttendee(attendee);
    setShowAddForm(false);
    setNewAttendee({
      name: '',
      inputMethod: 'manual',
      salaryType: 'annual',
      annualSalary: 0,
      hourlyRate: 0,
    });
    setEstimationResult(null);
  };

  const handleEstimateSalary = async () => {
    if (!aiEstimation.jobTitle || !aiEstimation.location) {
      alert('Please enter job title and location');
      return;
    }

    setEstimating(true);
    try {
      const response = await fetch('/api/estimate-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiEstimation),
      });

      const data = await response.json() as {
        median_salary: number;
        range_low: number;
        range_high: number;
        confidence: 'high' | 'medium' | 'low';
        notes: string;
      };
      setEstimationResult(data);
      setNewAttendee({
        ...newAttendee,
        annualSalary: data.median_salary,
        hourlyRate: Math.round((data.median_salary / 2080) * 100) / 100,
      });
    } catch (error) {
      alert('Failed to estimate salary. Please try manual entry.');
    } finally {
      setEstimating(false);
    }
  };

  const handleSalaryChange = (value: number, type: 'annual' | 'hourly') => {
    if (type === 'annual') {
      setNewAttendee({
        ...newAttendee,
        annualSalary: value,
        hourlyRate: Math.round((value / 2080) * 100) / 100,
      });
    } else {
      setNewAttendee({
        ...newAttendee,
        hourlyRate: value,
        annualSalary: Math.round(value * 2080),
      });
    }
  };

  const calculateIndividualCost = (hourlyRate: number) => {
    return (hourlyRate / 60) * (duration / 1000);
  };

  const presets = [
    { label: 'C-Suite', salary: 300000 },
    { label: 'Senior', salary: 135000 },
    { label: 'Mid-level', salary: 90000 },
    { label: 'Junior', salary: 60000 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendees ({attendees.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          + Add Attendee
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4 border-2 border-blue-500">
          <input
            type="text"
            placeholder="Name/Role (e.g., Sarah - Senior Engineer)"
            value={newAttendee.name}
            onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />

          <div className="flex gap-4">
            <button
              onClick={() => setNewAttendee({ ...newAttendee, inputMethod: 'manual' })}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                newAttendee.inputMethod === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setNewAttendee({ ...newAttendee, inputMethod: 'ai_estimated' })}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                newAttendee.inputMethod === 'ai_estimated'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              🤖 AI Estimate
            </button>
          </div>

          {newAttendee.inputMethod === 'manual' && (
            <>
              <div className="flex gap-2 mb-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleSalaryChange(preset.salary, 'annual')}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Salary</label>
                  <input
                    type="number"
                    placeholder="$100,000"
                    value={newAttendee.annualSalary || ''}
                    onChange={(e) => handleSalaryChange(Number(e.target.value), 'annual')}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hourly Rate</label>
                  <input
                    type="number"
                    placeholder="$48.08"
                    value={newAttendee.hourlyRate || ''}
                    onChange={(e) => handleSalaryChange(Number(e.target.value), 'hourly')}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </>
          )}

          {newAttendee.inputMethod === 'ai_estimated' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Job Title (e.g., Software Engineer)"
                  value={aiEstimation.jobTitle}
                  onChange={(e) => setAiEstimation({ ...aiEstimation, jobTitle: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Location (e.g., San Francisco, CA)"
                  value={aiEstimation.location}
                  onChange={(e) => setAiEstimation({ ...aiEstimation, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <select
                  value={aiEstimation.experience}
                  onChange={(e) => setAiEstimation({ ...aiEstimation, experience: e.target.value })}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option>Entry Level (0-2 years)</option>
                  <option>Mid-Level (3-5 years)</option>
                  <option>Senior (6-10 years)</option>
                  <option>Lead/Principal (10+ years)</option>
                </select>

                <select
                  value={aiEstimation.companySize}
                  onChange={(e) => setAiEstimation({ ...aiEstimation, companySize: e.target.value })}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Company Size</option>
                  <option>Startup (&lt;50)</option>
                  <option>Small (50-200)</option>
                  <option>Medium (200-1,000)</option>
                  <option>Large (1,000-5,000)</option>
                  <option>Enterprise (5,000+)</option>
                </select>

                <select
                  value={aiEstimation.industry}
                  onChange={(e) => setAiEstimation({ ...aiEstimation, industry: e.target.value })}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Industry</option>
                  <option>Tech</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Retail</option>
                  <option>Manufacturing</option>
                  <option>Education</option>
                </select>
              </div>

              <button
                onClick={handleEstimateSalary}
                disabled={estimating}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {estimating ? '⏳ Estimating...' : '🤖 Estimate Salary'}
              </button>

              {estimationResult && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold">
                      ${estimationResult.median_salary.toLocaleString()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      estimationResult.confidence === 'high' ? 'bg-green-200 text-green-800' :
                      estimationResult.confidence === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-orange-200 text-orange-800'
                    }`}>
                      {estimationResult.confidence} confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Range: ${estimationResult.range_low.toLocaleString()} - ${estimationResult.range_high.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{estimationResult.notes}</p>
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAddAttendee}
              disabled={!newAttendee.name || (!newAttendee.annualSalary && !newAttendee.hourlyRate)}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Attendee
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEstimationResult(null);
              }}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {attendees.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Add your first attendee to start calculating</p>
          </div>
        ) : (
          attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{attendee.name}</h3>
                  {attendee.inputMethod === 'ai_estimated' && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                      🤖 AI Estimated
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ${attendee.annualSalary.toLocaleString()}/year • ${attendee.hourlyRate.toFixed(2)}/hr
                </p>
                {duration > 0 && (
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Individual cost: ${calculateIndividualCost(attendee.hourlyRate).toFixed(2)}
                  </p>
                )}
              </div>
              <button
                onClick={() => onRemoveAttendee(attendee.id)}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}








