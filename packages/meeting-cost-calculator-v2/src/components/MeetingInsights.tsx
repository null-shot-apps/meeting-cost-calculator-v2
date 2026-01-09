'use client';

import React from 'react';
import { Attendee } from '../types';

interface MeetingInsightsProps {
  duration: number;
  totalCost: number;
  attendees: Attendee[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MeetingInsights({
  duration,
  totalCost,
  attendees,
  isOpen,
  onClose,
}: MeetingInsightsProps) {
  if (!isOpen) return null;

  const durationMinutes = Math.floor(duration / 1000 / 60);
  const costPerMinute = durationMinutes > 0 ? totalCost / durationMinutes : 0;

  const getEfficiencyScore = () => {
    let score = 100;
    
    // Penalize long meetings
    if (durationMinutes > 60) score -= 20;
    else if (durationMinutes > 45) score -= 10;
    
    // Penalize large meetings
    if (attendees.length > 8) score -= 20;
    else if (attendees.length > 5) score -= 10;
    
    // Penalize expensive meetings
    if (totalCost > 1000) score -= 20;
    else if (totalCost > 500) score -= 10;
    
    return Math.max(0, score);
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const score = getEfficiencyScore();
  const grade = getGrade(score);

  const comparisons = [
    { item: 'Junior developer hours', value: totalCost / 30 },
    { item: 'Team lunches', value: totalCost / 150 },
    { item: 'Monthly software subscriptions', value: totalCost / 50 },
    { item: 'New laptops', value: totalCost / 1500 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Meeting Insights</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Meeting Score */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg text-center">
            <div className="text-6xl font-bold mb-2">{grade}</div>
            <div className="text-xl font-semibold">Meeting Efficiency Score: {score}/100</div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{durationMinutes}m</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{attendees.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Attendees</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">${costPerMinute.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Per Minute</div>
            </div>
          </div>

          {/* Cost Comparisons */}
          <div>
            <h3 className="font-semibold mb-3">This meeting cost the equivalent of:</h3>
            <div className="space-y-2">
              {comparisons.map((comp) => (
                <div
                  key={comp.item}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded"
                >
                  <span>{comp.item}</span>
                  <span className="font-semibold">{comp.value.toFixed(1)}x</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="font-semibold mb-3">💡 Suggestions:</h3>
            <div className="space-y-2">
              {durationMinutes < 10 && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                  📧 This could have been an email!
                </div>
              )}
              {attendees.length > 8 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                  👥 Consider if everyone needs to be here. Smaller meetings are often more effective.
                </div>
              )}
              {totalCost > 500 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded border border-orange-200 dark:border-orange-800">
                  💰 High-impact meeting - make sure it was worth the investment!
                </div>
              )}
              {durationMinutes > 60 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                  ⏰ Long meeting - consider breaking into smaller focused sessions.
                </div>
              )}
            </div>
          </div>

          {/* Share Options */}
          <div>
            <h3 className="font-semibold mb-3">📤 Share Summary:</h3>
            <button
              onClick={() => {
                const summary = `Meeting Summary\nDuration: ${durationMinutes} minutes\nAttendees: ${attendees.length}\nTotal Cost: $${totalCost.toFixed(2)}\nCost per minute: $${costPerMinute.toFixed(2)}`;
                navigator.clipboard.writeText(summary);
                alert('Summary copied to clipboard!');
              }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              📋 Copy Summary
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

