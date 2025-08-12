// Types for the Programs Content Management System

export interface Program {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Cloudinary URL
  linkUrl?: string; // Optional external link
  linkText?: string; // Text for the link button
  status: 'active' | 'inactive';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  order: number; // For sorting/ordering programs
}

export interface ProgramFormData {
  title: string;
  description: string;
  linkUrl?: string;
  linkText?: string;
  status: 'active' | 'inactive';
  order: number;
}

// For API responses
export interface ProgramsResponse {
  success: boolean;
  data: Program[];
  message?: string;
}

export interface ProgramResponse {
  success: boolean;
  data: Program;
  message?: string;
}

// For API error responses
export interface ApiError {
  success: false;
  error: string;
  message: string;
}

// For file upload
export interface UploadResponse {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

// Admin authentication
export interface AdminSession {
  isAuthenticated: boolean;
  timestamp: number;
}