import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { Status } from '@prisma/client';

function convertStatus(status: Status): 'active' | 'inactive' {
  return status === 'ACTIVE' ? 'active' : 'inactive';
}

function convertStatusToDb(status: 'active' | 'inactive'): Status {
  return status === 'active' ? 'ACTIVE' : 'INACTIVE';
}

// GET - Fetch single video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbVideo = await prisma.videoPost.findUnique({ where: { id } });

    if (!dbVideo) {
      return NextResponse.json(
        { success: false, error: 'Video not found', message: 'No video found with this ID' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: dbVideo.id,
        title: dbVideo.title,
        description: dbVideo.description,
        facebookUrl: dbVideo.facebookUrl,
        isFeatured: dbVideo.isFeatured,
        displayOrder: dbVideo.displayOrder,
        status: convertStatus(dbVideo.status),
        createdAt: dbVideo.createdAt.toISOString(),
        updatedAt: dbVideo.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.videoPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Video not found', message: 'No video found with this ID' },
        { status: 404 }
      );
    }

    const dbVideo = await prisma.videoPost.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        description: body.description !== undefined ? body.description || null : existing.description,
        facebookUrl: body.facebookUrl ?? existing.facebookUrl,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
        displayOrder: body.displayOrder !== undefined ? body.displayOrder : existing.displayOrder,
        status: body.status ? convertStatusToDb(body.status) : existing.status,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: dbVideo.id,
        title: dbVideo.title,
        description: dbVideo.description,
        facebookUrl: dbVideo.facebookUrl,
        isFeatured: dbVideo.isFeatured,
        displayOrder: dbVideo.displayOrder,
        status: convertStatus(dbVideo.status),
        createdAt: dbVideo.createdAt.toISOString(),
        updatedAt: dbVideo.updatedAt.toISOString(),
      },
      message: 'Video updated successfully',
    });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update video', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.videoPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Video not found', message: 'No video found with this ID' },
        { status: 404 }
      );
    }

    await prisma.videoPost.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete video', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
