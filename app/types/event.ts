// Types for the Events Content Management System

export interface Event {
  id: string;
  title: string;
  description?: string;
  poster?: string; // Cloudinary URL for poster image
  video?: string; // Video URL (Cloudinary/YouTube/local)
  thumbnail?: string; // Cloudinary URL for video thumbnail
  registrationLink?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  expiryDate: string; // ISO date string - when event should be hidden
  summary: string[]; // Array of summary points
  tags: string[]; // Simple tags array
  status: 'active' | 'inactive';
  order: number; // For sorting/ordering events
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface EventFormData {
  title: string;
  description?: string;
  registrationLink?: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  expiryDate: string; // ISO date string (YYYY-MM-DD)
  summary: string[]; // Array of summary points
  tags: string[]; // Simple tags array
  status: 'active' | 'inactive';
  order: number;
}

// For API responses
export interface EventsResponse {
  success: boolean;
  data: Event[];
  message?: string;
}

export interface EventResponse {
  success: boolean;
  data: Event;
  message?: string;
}

// For API error responses
export interface ApiError {
  success: false;
  error: string;
  message: string;
}

// For file upload (extending the existing one)
export interface UploadResponse {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
  message?: string;
}

// Media upload types for events
export interface EventMediaUpload {
  poster?: File;
  video?: File;
  thumbnail?: File;
}

// For frontend event display (compatible with existing events page)
export interface FrontendEvent {
  id: number | string;
  title: string;
  poster?: string;
  video?: string;
  thumbnail?: string;
  registrationLink: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  expiryDate: string; // YYYY-MM-DD format
  summary?: string[];
}