// Types for the Volunteer Enrollment System

export type VolunteerStatusType = 'pending' | 'contacted' | 'enrolled' | 'declined';

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  areasOfInterest: string[];
  availability: string[];
  message: string | null;
  status: VolunteerStatusType;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface VolunteerFormData {
  name: string;
  email: string;
  phone?: string;
  areasOfInterest: string[];
  availability: string[];
  message?: string;
}

// For API responses
export interface VolunteersResponse {
  success: boolean;
  data: Volunteer[];
  message?: string;
}

export interface VolunteerResponse {
  success: boolean;
  data: Volunteer;
  message?: string;
}

// Areas of interest options
export const AREAS_OF_INTEREST = [
  'Events & Hospitality',
  'Education (Islamic School/Weekend School)',
  'Facility Maintenance',
  'Administrative Support',
  'Youth Programs',
  'Community Outreach',
  'Other'
] as const;

// Availability options
export const AVAILABILITY_OPTIONS = [
  'Weekdays',
  'Weekends',
  'Morning (before 12pm)',
  'Afternoon (12pm - 5pm)',
  'Evening (after 5pm)'
] as const;

// Status labels for display
export const VOLUNTEER_STATUS_LABELS: Record<VolunteerStatusType, string> = {
  pending: 'Pending',
  contacted: 'Contacted',
  enrolled: 'Enrolled',
  declined: 'Declined'
};

// Status colors for UI
export const VOLUNTEER_STATUS_COLORS: Record<VolunteerStatusType, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-blue-100 text-blue-800',
  enrolled: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800'
};
