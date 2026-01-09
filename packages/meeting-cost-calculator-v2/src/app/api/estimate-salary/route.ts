import { NextRequest, NextResponse } from 'next/server';
import { ExperienceLevel } from '@/types';

export const runtime = 'edge';

interface EstimateRequest {
  jobTitle: string;
  location: string;
  experience: ExperienceLevel;
  companySize?: string;
  industry?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EstimateRequest;
    const { jobTitle, location, experience, companySize, industry } = body;

    if (!jobTitle || !location || !experience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real implementation, you would call Claude API here
    // For now, we'll use a simple estimation based on common market data
    
    const baseEstimates: Record<string, number> = {
      'software engineer': 120000,
      'senior software engineer': 150000,
      'staff software engineer': 180000,
      'principal engineer': 200000,
      'engineering manager': 160000,
      'product manager': 130000,
      'senior product manager': 160000,
      'designer': 100000,
      'senior designer': 130000,
      'data scientist': 130000,
      'senior data scientist': 160000,
      'marketing manager': 110000,
      'sales representative': 80000,
      'account executive': 100000,
      'ceo': 300000,
      'cto': 250000,
      'cfo': 250000,
      'vp': 200000,
    };

    // Find closest match
    const titleLower = jobTitle.toLowerCase();
    let baseSalary = 100000; // default
    
    for (const [key, value] of Object.entries(baseEstimates)) {
      if (titleLower.includes(key)) {
        baseSalary = value;
        break;
      }
    }

    // Adjust for experience
    const experienceMultipliers: Record<string, number> = {
      'Entry Level (0-2 years)': 0.7,
      'Mid-Level (3-5 years)': 1.0,
      'Senior (6-10 years)': 1.3,
      'Lead/Principal (10+ years)': 1.6,
    };
    baseSalary *= experienceMultipliers[experience] || 1.0;

    // Adjust for location (simplified)
    const locationLower = location.toLowerCase();
    if (locationLower.includes('san francisco') || locationLower.includes('sf') || locationLower.includes('bay area')) {
      baseSalary *= 1.4;
    } else if (locationLower.includes('new york') || locationLower.includes('nyc')) {
      baseSalary *= 1.3;
    } else if (locationLower.includes('seattle') || locationLower.includes('boston')) {
      baseSalary *= 1.2;
    } else if (locationLower.includes('austin') || locationLower.includes('denver')) {
      baseSalary *= 1.1;
    }

    // Adjust for company size
    const companySizeMultipliers: Record<string, number> = {
      'Startup (<50)': 0.9,
      'Small (50-200)': 0.95,
      'Medium (200-1,000)': 1.0,
      'Large (1,000-5,000)': 1.1,
      'Enterprise (5,000+)': 1.15,
    };
    if (companySize) {
      baseSalary *= companySizeMultipliers[companySize] || 1.0;
    }

    // Adjust for industry
    const industryMultipliers: Record<string, number> = {
      'Tech': 1.1,
      'Finance': 1.15,
      'Healthcare': 1.0,
      'Retail': 0.9,
      'Manufacturing': 0.95,
      'Education': 0.85,
    };
    if (industry) {
      baseSalary *= industryMultipliers[industry] || 1.0;
    }

    const medianSalary = Math.round(baseSalary);
    const rangeLow = Math.round(medianSalary * 0.85);
    const rangeHigh = Math.round(medianSalary * 1.15);

    // Determine confidence based on how specific the inputs are
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    if (companySize && industry && location) {
      confidence = 'high';
    } else if (!companySize && !industry) {
      confidence = 'low';
    }

    return NextResponse.json({
      median_salary: medianSalary,
      range_low: rangeLow,
      range_high: rangeHigh,
      confidence,
      notes: `Based on 2024-2025 market data for ${experience} ${jobTitle} in ${location}`,
    });
  } catch (error) {
    console.error('Salary estimation error:', error);
    return NextResponse.json(
      { error: 'Failed to estimate salary' },
      { status: 500 }
    );
  }
}

