import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { EventFormData } from '@/app/types/event';
import { Status } from '@prisma/client';

// Helper function to generate unique ID
function generateId(): string {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
}

// Helper function to convert database status to API status
function convertStatus(status: Status): 'active' | 'inactive' {
  return status === 'ACTIVE' ? 'active' : 'inactive';
}

// Helper function to convert API status to database status
function convertStatusToDb(status: 'active' | 'inactive'): Status {
  return status === 'active' ? 'ACTIVE' : 'INACTIVE';
}

// GET - Fetch all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Fetch events from database
    const dbEvents = await prisma.event.findMany({
      where: includeInactive ? {} : { status: 'ACTIVE' },
      orderBy: { order: 'asc' }
    });

    // Convert database format to API format
    const events = dbEvents.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      poster: e.poster,
      video: e.video,
      thumbnail: e.thumbnail,
      registrationLink: e.registrationLink,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate.toISOString(),
      expiryDate: e.expiryDate.toISOString(),
      summary: e.summary,
      tags: e.tags,
      status: convertStatus(e.status),
      order: e.order,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const body: EventFormData & {
      poster?: string;
      video?: string;
      thumbnail?: string;
    } = await request.json();

    // Validate required fields
    if (!body.title || !body.startDate || !body.endDate || !body.expiryDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', message: 'Title, start date, end date, and expiry date are required' },
        { status: 400 }
      );
    }

    // Validate date logic
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const expiryDate = new Date(body.expiryDate);

    if (endDate < startDate) {
      return NextResponse.json(
        { success: false, error: 'Invalid dates', message: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (expiryDate < endDate) {
      return NextResponse.json(
        { success: false, error: 'Invalid dates', message: 'Expiry date must be after end date' },
        { status: 400 }
      );
    }

    // Get the next order number
    const maxOrder = await prisma.event.aggregate({
      _max: { order: true }
    });
    const nextOrder = (maxOrder._max.order || 0) + 1;

    // Create new event in database
    const dbEvent = await prisma.event.create({
      data: {
        id: generateId(),
        title: body.title,
        description: body.description || null,
        poster: body.poster || null,
        video: body.video || null,
        thumbnail: body.thumbnail || null,
        registrationLink: body.registrationLink || null,
        startDate: startDate,
        endDate: endDate,
        expiryDate: expiryDate,
        summary: body.summary || [],
        tags: body.tags || [],
        status: convertStatusToDb(body.status || 'active'),
        order: body.order || nextOrder
      }
    });

    // Convert to API format
    const newEvent = {
      id: dbEvent.id,
      title: dbEvent.title,
      description: dbEvent.description,
      poster: dbEvent.poster,
      video: dbEvent.video,
      thumbnail: dbEvent.thumbnail,
      registrationLink: dbEvent.registrationLink,
      startDate: dbEvent.startDate.toISOString(),
      endDate: dbEvent.endDate.toISOString(),
      expiryDate: dbEvent.expiryDate.toISOString(),
      summary: dbEvent.summary,
      tags: dbEvent.tags,
      status: convertStatus(dbEvent.status),
      order: dbEvent.order,
      createdAt: dbEvent.createdAt.toISOString(),
      updatedAt: dbEvent.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event', message: 'Internal server error' },
      { status: 500 }
    );
  }
}