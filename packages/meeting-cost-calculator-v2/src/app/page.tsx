'use client';

import { MeetingCalculator } from '@/components/MeetingCalculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <MeetingCalculator />
    </main>
  );
}

