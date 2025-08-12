import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { CreateHeroSlideRequest } from '@/app/types/heroSlide'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { displayOrder: 'asc' }
    })
    
    return NextResponse.json(slides)
  } catch (error) {
    console.error('Error fetching hero slides:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero slides' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateHeroSlideRequest = await request.json()
    
    // Generate a unique ID
    const id = `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const slide = await prisma.heroSlide.create({
      data: {
        id,
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        linkText: body.linkText,
        status: body.status,
        displayOrder: body.displayOrder,
        duration: body.duration
      }
    })
    
    return NextResponse.json(slide, { status: 201 })
  } catch (error) {
    console.error('Error creating hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to create hero slide' },
      { status: 500 }
    )
  }
}