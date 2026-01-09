'use client';

import React from 'react';

interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused' | 'ended';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  totalCost: number;
}

export default function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  totalCost,
}: TimerControlsProps) {
  const handleReset = () => {
    if (totalCost > 0) {
      if (confirm(`This will clear $${totalCost.toFixed(2)} - continue?`)) {
        onReset();
      }
    } else {
      onReset();
    }
  };

  return (
    <div className="flex gap-4 justify-center items-center">
      {status === 'idle' && (
        <button
          onClick={onStart}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
        >
          ▶ Start Meeting
        </button>
      )}

      {status === 'running' && (
        <button
          onClick={onPause}
          className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
        >
          ⏸ Pause
        </button>
      )}

      {status === 'paused' && (
        <button
          onClick={onResume}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
        >
          ▶ Resume
        </button>
      )}

      {(status === 'running' || status === 'paused' || status === 'ended') && (
        <button
          onClick={handleReset}
          className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
        >
          ↻ Reset
        </button>
      )}
    </div>
  );
}

