export type MeetingStatus = 'idle' | 'running' | 'paused' | 'ended';

export type InputMethod = 'manual' | 'ai_estimated';

export type ExperienceLevel = 'Entry Level (0-2 years)' | 'Mid-Level (3-5 years)' | 'Senior (6-10 years)' | 'Lead/Principal (10+ years)';

export type CompanySize = 'Startup (<50)' | 'Small (50-200)' | 'Medium (200-1,000)' | 'Large (1,000-5,000)' | 'Enterprise (5,000+)';

export type Confidence = 'high' | 'medium' | 'low';

export type MeetingFrequency = 'one-time' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface EstimationData {
  jobTitle: string;
  location: string;
  experience: ExperienceLevel;
  companySize?: CompanySize;
  industry?: string;
  confidence: Confidence;
  range: [number, number];
  notes?: string;
}

export interface Attendee {
  id: string;
  name: string;
  inputMethod: InputMethod;
  annualSalary: number;
  hourlyRate: number;
  estimationData?: EstimationData;
}

export interface Meeting {
  id: string;
  name: string;
  startTime: number | null;
  duration: number;
  status: MeetingStatus;
  frequency: MeetingFrequency;
  overheadMultiplier: number;
  pausedAt: number | null;
  totalPausedTime: number;
}

export interface MeetingTemplate {
  id: string;
  name: string;
  attendees: Attendee[];
  overheadMultiplier: number;
  createdAt: number;
}

export interface MeetingHistory {
  id: string;
  name: string;
  date: number;
  duration: number;
  finalCost: number;
  attendeeCount: number;
  attendees: Attendee[];
}

export interface SalaryEstimateResponse {
  median_salary: number;
  range_low: number;
  range_high: number;
  confidence: Confidence;
  notes: string;
}

export interface MeetingSettings {
  overheadMultiplier: number;
  frequency: MeetingFrequency;
  currency: string;
  theme: 'light' | 'dark' | 'auto';
  targetDuration?: number;
}


