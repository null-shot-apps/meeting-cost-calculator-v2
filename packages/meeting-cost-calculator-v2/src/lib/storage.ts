import { Attendee, MeetingTemplate, MeetingHistory } from '@/types';

const STORAGE_KEYS = {
  TEMPLATES: 'meeting_templates',
  HISTORY: 'meeting_history',
  LAST_MEETING: 'last_meeting',
  USER_RATE: 'user_rate',
  THEME: 'theme',
  CURRENCY: 'currency',
  OVERHEAD: 'overhead_multiplier',
  ESTIMATES_CACHE: 'salary_estimates_cache',
};

export const storage = {
  // Templates
  getTemplates(): MeetingTemplate[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return data ? JSON.parse(data) : [];
  },

  saveTemplate(template: MeetingTemplate): void {
    if (typeof window === 'undefined') return;
    const templates = this.getTemplates();
    const index = templates.findIndex(t => t.id === template.id);
    if (index >= 0) {
      templates[index] = template;
    } else {
      templates.push(template);
    }
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  },

  deleteTemplate(id: string): void {
    if (typeof window === 'undefined') return;
    const templates = this.getTemplates().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  },

  // History
  getHistory(): MeetingHistory[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },

  addToHistory(meeting: MeetingHistory): void {
    if (typeof window === 'undefined') return;
    const history = this.getHistory();
    history.unshift(meeting);
    // Keep only last 50 meetings
    if (history.length > 50) {
      history.splice(50);
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  deleteFromHistory(id: string): void {
    if (typeof window === 'undefined') return;
    const history = this.getHistory().filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  clearHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  },

  // Last meeting state
  saveLastMeeting(attendees: Attendee[], overheadMultiplier: number): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LAST_MEETING, JSON.stringify({ attendees, overheadMultiplier }));
  },

  getLastMeeting(): { attendees: Attendee[]; overheadMultiplier: number } | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.LAST_MEETING);
    return data ? JSON.parse(data) : null;
  },

  // User rate
  saveUserRate(rate: { name: string; annualSalary: number; hourlyRate: number }): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_RATE, JSON.stringify(rate));
  },

  getUserRate(): { name: string; annualSalary: number; hourlyRate: number } | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER_RATE);
    return data ? JSON.parse(data) : null;
  },

  // Settings
  getTheme(): 'light' | 'dark' | 'auto' {
    if (typeof window === 'undefined') return 'auto';
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | 'auto') || 'auto';
  },

  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  getCurrency(): string {
    if (typeof window === 'undefined') return 'USD';
    return localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'USD';
  },

  setCurrency(currency: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  },

  getOverheadMultiplier(): number {
    if (typeof window === 'undefined') return 1.5;
    const value = localStorage.getItem(STORAGE_KEYS.OVERHEAD);
    return value ? parseFloat(value) : 1.5;
  },

  setOverheadMultiplier(multiplier: number): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.OVERHEAD, multiplier.toString());
  },

  // Salary estimates cache
  getCachedEstimate(key: string): any {
    if (typeof window === 'undefined') return null;
    const cache = localStorage.getItem(STORAGE_KEYS.ESTIMATES_CACHE);
    if (!cache) return null;
    const parsed = JSON.parse(cache);
    const item = parsed[key];
    if (!item) return null;
    // Cache for 30 days
    if (Date.now() - item.timestamp > 30 * 24 * 60 * 60 * 1000) {
      return null;
    }
    return item.data;
  },

  cacheEstimate(key: string, data: any): void {
    if (typeof window === 'undefined') return;
    const cache = localStorage.getItem(STORAGE_KEYS.ESTIMATES_CACHE);
    const parsed = cache ? JSON.parse(cache) : {};
    parsed[key] = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.ESTIMATES_CACHE, JSON.stringify(parsed));
  },
};

