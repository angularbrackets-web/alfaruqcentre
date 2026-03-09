export interface VideoPost {
  id: string;
  title: string;
  description?: string | null;
  facebookUrl: string;
  isFeatured: boolean;
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface VideoFormData {
  title: string;
  description: string;
  facebookUrl: string;
  isFeatured: boolean;
  displayOrder: number;
  status: 'active' | 'inactive';
}
