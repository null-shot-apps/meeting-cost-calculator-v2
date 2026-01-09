'use client';

import { MeetingStatus } from '@/types';
import { formatCurrency, formatTime, getCostColor, getCostGradient } from '@/lib/utils';

interface CostDisplayProps {
  cost: number;
  duration: number;
  costPerMinute: number;
  status: MeetingStatus;
  currency: string;
}

export function CostDisplay({ cost, duration, costPerMinute, status, currency }: CostDisplayProps) {
  const isRunning = status === 'running';
  const costColor = getCostColor(cost);
  const gradient = getCostGradient(cost);

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12 overflow-hidden">
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
      
      {/* Floating dollar signs animation */}
      {isRunning && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="dollar-float">$</div>
          <div className="dollar-float" style={{ animationDelay: '1s', left: '70%' }}>$</div>
          <div className="dollar-float" style={{ animationDelay: '2s', left: '30%' }}>$</div>
        </div>
      )}

      <div className="relative z-10">
        {/* Timer */}
        <div className="text-center mb-6">
          <div className="text-2xl md:text-3xl font-mono text-slate-600 dark:text-slate-400">
            {formatTime(duration)}
          </div>
        </div>

        {/* Main Cost */}
        <div className="text-center mb-8">
          <div className={`text-6xl md:text-8xl font-bold ${costColor} transition-colors duration-300 ${isRunning ? 'animate-pulse-subtle' : ''}`}>
            {formatCurrency(cost, currency)}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Current Meeting Cost
          </div>
        </div>

        {/* Cost per minute */}
        {duration > 0 && (
          <div className="text-center pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="text-slate-600 dark:text-slate-400 text-sm mb-1">
              Cost per minute
            </div>
            <div className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(costPerMinute, currency)}
            </div>
          </div>
        )}

        {/* Status indicator */}
        {status !== 'idle' && (
          <div className="absolute top-4 right-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              status === 'running' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : status === 'paused'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-current'
              }`} />
              {status === 'running' ? 'In Progress' : status === 'paused' ? 'Paused' : 'Ended'}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dollar-float {
          position: absolute;
          font-size: 2rem;
          opacity: 0.1;
          animation: float 4s ease-in-out infinite;
          left: 50%;
          bottom: -20px;
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(-50%);
            opacity: 0;
          }
          50% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-400px) translateX(-50%);
            opacity: 0;
          }
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}

