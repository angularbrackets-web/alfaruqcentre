import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { UpdateHeroSlideRequest } from '@/app/types/heroSlide'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slide = await prisma.heroSlide.findUnique({
      where: { id: params.id }
    })
    
    if (!slide) {
      return NextResponse.json(
        { error: 'Hero slide not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error fetching hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero slide' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateHeroSlideRequest = await request.json()
    
    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.linkUrl !== undefined && { linkUrl: body.linkUrl }),
        ...(body.linkText !== undefined && { linkText: body.linkText }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
        ...(body.duration !== undefined && { duration: body.duration })
      }
    })
    
    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error updating hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to update hero slide' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.heroSlide.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Hero slide deleted successfully' })
  } catch (error) {
    console.error('Error deleting hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to delete hero slide' },
      { status: 500 }
    )
  }
}