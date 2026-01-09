'use client';

import React from 'react';

interface CostDisplayProps {
  totalCost: number;
  duration: number;
  costPerMinute: number;
  status: 'idle' | 'running' | 'paused' | 'ended';
}

export default function CostDisplay({
  totalCost,
  duration,
  costPerMinute,
  status,
}: CostDisplayProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCostColor = () => {
    if (totalCost === 0) return 'text-gray-400';
    if (totalCost < 100) return 'text-green-600 dark:text-green-400';
    if (totalCost < 500) return 'text-yellow-600 dark:text-yellow-400';
    if (totalCost < 1000) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBackgroundGradient = () => {
    if (totalCost === 0) return 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900';
    if (totalCost < 100) return 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20';
    if (totalCost < 500) return 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20';
    if (totalCost < 1000) return 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20';
    return 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20';
  };

  return (
    <div className={`text-center p-8 rounded-lg bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-500 relative`}>
      {/* Timer */}
      <div className="mb-4">
        <div className="text-6xl font-mono font-bold text-gray-700 dark:text-gray-300">
          {formatTime(duration)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {status === 'running' && '⏱️ Running'}
          {status === 'paused' && '⏸️ Paused'}
          {status === 'idle' && '⏱️ Ready to start'}
          {status === 'ended' && '✓ Ended'}
        </div>
      </div>

      {/* Total Cost */}
      <div className="mb-6">
        <div className={`text-8xl font-bold ${getCostColor()} transition-all duration-300 ${
          status === 'running' ? 'animate-pulse' : ''
        }`}>
          ${totalCost.toFixed(2)}
        </div>
        <div className="text-xl text-gray-600 dark:text-gray-400 mt-2">
          Total Meeting Cost
        </div>
      </div>

      {/* Cost Per Minute */}
      {costPerMinute > 0 && (
        <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
          <div className="text-3xl font-semibold text-gray-700 dark:text-gray-300">
            ${costPerMinute.toFixed(2)}/min
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Cost per minute
          </div>
        </div>
      )}

      {/* Floating dollar signs animation */}
      {status === 'running' && totalCost > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div className="animate-float-slow text-4xl absolute top-10 left-10">💰</div>
          <div className="animate-float-medium text-3xl absolute top-20 right-20">💵</div>
          <div className="animate-float-fast text-2xl absolute bottom-20 left-1/4">💸</div>
        </div>
      )}
    </div>
  );
}

