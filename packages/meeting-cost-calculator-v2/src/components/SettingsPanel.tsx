'use client';

import React from 'react';
import { MeetingSettings } from '../types';

interface SettingsPanelProps {
  settings: MeetingSettings;
  onUpdateSettings: (settings: Partial<MeetingSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({
  settings,
  onUpdateSettings,
  isOpen,
  onClose,
}: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Meeting Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Overhead Multiplier */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Overhead Multiplier: {settings.overheadMultiplier}x
            </label>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.1"
              value={settings.overheadMultiplier}
              onChange={(e) =>
                onUpdateSettings({ overheadMultiplier: Number(e.target.value) })
              }
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accounts for benefits, taxes, office costs, equipment. Each $100K salary costs
              company ~${(100000 * settings.overheadMultiplier).toLocaleString()}
            </p>
          </div>

          {/* Meeting Frequency */}
          <div>
            <label className="block text-sm font-medium mb-2">Meeting Frequency</label>
            <select
              value={settings.frequency}
              onChange={(e) =>
                onUpdateSettings({
                  frequency: e.target.value as MeetingSettings['frequency'],
                })
              }
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="one-time">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => onUpdateSettings({ currency: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateSettings({ theme: 'light' })}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  settings.theme === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  settings.theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => onUpdateSettings({ theme: 'auto' })}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  settings.theme === 'auto'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                🔄 Auto
              </button>
            </div>
          </div>

          {/* Quick Duration Buttons */}
          <div>
            <label className="block text-sm font-medium mb-2">Quick Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => onUpdateSettings({ targetDuration: minutes * 60 })}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {minutes}m
                </button>
              ))}
            </div>
            {settings.targetDuration && (
              <p className="text-xs text-gray-500 mt-2">
                Target: {Math.floor(settings.targetDuration / 60)} minutes
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

