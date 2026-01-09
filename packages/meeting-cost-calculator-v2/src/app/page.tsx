'use client';

import MeetingCalculator from '../components/MeetingCalculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Meeting Cost Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            What&apos;s this meeting really costing?
          </p>
        </div>
        <MeetingCalculator />
      </div>
    </main>
  );
}

