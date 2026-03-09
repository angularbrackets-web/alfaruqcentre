import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { Status } from '@prisma/client';

function generateId(): string {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
}

function convertStatus(status: Status): 'active' | 'inactive' {
  return status === 'ACTIVE' ? 'active' : 'inactive';
}

function convertStatusToDb(status: 'active' | 'inactive'): Status {
  return status === 'active' ? 'ACTIVE' : 'INACTIVE';
}

// GET - Fetch all videos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const featuredOnly = searchParams.get('featuredOnly') === 'true';

    const where = {
      ...(includeInactive ? {} : { status: 'ACTIVE' as Status }),
      ...(featuredOnly ? { isFeatured: true } : {}),
    };

    const dbVideos = await prisma.videoPost.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    const videos = dbVideos.map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      facebookUrl: v.facebookUrl,
      isFeatured: v.isFeatured,
      displayOrder: v.displayOrder,
      status: convertStatus(v.status),
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.facebookUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', message: 'Title and Facebook URL are required' },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.videoPost.aggregate({ _max: { displayOrder: true } });
    const nextOrder = (maxOrder._max.displayOrder || 0) + 1;

    const dbVideo = await prisma.videoPost.create({
      data: {
        id: generateId(),
        title: body.title,
        description: body.description || null,
        facebookUrl: body.facebookUrl,
        isFeatured: body.isFeatured ?? false,
        displayOrder: body.displayOrder || nextOrder,
        status: convertStatusToDb(body.status || 'active'),
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
      message: 'Video created successfully',
    });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create video', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
