export interface WeeklyClass {
  id: string;
  name: string;
  days: string[];
  startTime: string;
  endTime?: string | null;
  audience?: string | null;
  category: string;
  status: 'active' | 'inactive';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyClassFormData {
  name: string;
  days: string[];
  startTime: string;
  endTime: string;
  audience: string;
  category: string;
  status: 'active' | 'inactive';
  order: number;
}

export const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export const DAY_FULL: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};
export const CATEGORY_OPTIONS = [
  { value: 'quran',          label: 'Quran' },
  { value: 'arabic',         label: 'Arabic' },
  { value: 'weekend-school', label: 'Weekend School' },
  { value: 'series',         label: 'Series / Lecture' },
  { value: 'other',          label: 'Other' },
];
