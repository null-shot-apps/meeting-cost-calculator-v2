export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
    JPY: '¥',
  };

  const symbol = symbols[currency] || '$';
  
  if (currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateHourlyRate(annualSalary: number): number {
  // Assume 2,080 working hours per year (40 hours/week * 52 weeks)
  return annualSalary / 2080;
}

export function calculateAnnualSalary(hourlyRate: number): number {
  return hourlyRate * 2080;
}

export function getCostColor(cost: number): string {
  if (cost < 100) return 'text-green-600 dark:text-green-400';
  if (cost < 500) return 'text-yellow-600 dark:text-yellow-400';
  if (cost < 1000) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

export function getCostGradient(cost: number): string {
  if (cost < 100) return 'from-green-500 to-green-600';
  if (cost < 500) return 'from-yellow-500 to-yellow-600';
  if (cost < 1000) return 'from-orange-500 to-orange-600';
  return 'from-red-500 to-red-600';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getMeetingGrade(duration: number, attendeeCount: number, totalCost: number): string {
  let score = 100;
  
  // Duration penalty (prefer shorter meetings)
  if (duration > 3600) score -= 20; // > 1 hour
  else if (duration > 2700) score -= 10; // > 45 min
  
  // Attendee count penalty (prefer fewer attendees)
  if (attendeeCount > 10) score -= 20;
  else if (attendeeCount > 8) score -= 15;
  else if (attendeeCount > 6) score -= 10;
  
  // Cost penalty
  const costPerMinute = totalCost / (duration / 60);
  if (costPerMinute > 20) score -= 20;
  else if (costPerMinute > 15) score -= 10;
  
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-green-600 dark:text-green-400';
    case 'B': return 'text-blue-600 dark:text-blue-400';
    case 'C': return 'text-yellow-600 dark:text-yellow-400';
    case 'D': return 'text-orange-600 dark:text-orange-400';
    case 'F': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
}

export function formatSalary(salary: number): string {
  return salary.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function parseSalary(value: string): number {
  return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
}

