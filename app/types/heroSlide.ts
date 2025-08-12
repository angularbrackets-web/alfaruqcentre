export interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  description?: string
  imageUrl: string
  linkUrl?: string
  linkText?: string
  status: 'ACTIVE' | 'INACTIVE'
  displayOrder: number
  duration: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateHeroSlideRequest {
  title: string
  subtitle?: string
  description?: string
  imageUrl: string
  linkUrl?: string
  linkText?: string
  status: 'ACTIVE' | 'INACTIVE'
  displayOrder: number
  duration: number
}

export interface UpdateHeroSlideRequest {
  title?: string
  subtitle?: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  linkText?: string
  status?: 'ACTIVE' | 'INACTIVE'
  displayOrder?: number
  duration?: number
}

export interface HeroSlideFormData {
  title: string
  subtitle: string
  description: string
  linkUrl: string
  linkText: string
  status: 'ACTIVE' | 'INACTIVE'
  displayOrder: number
  duration: number
  image?: File
  currentImageUrl?: string
}