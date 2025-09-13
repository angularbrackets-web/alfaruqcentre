import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { EventFormData } from '@/app/types/event';
import { Status } from '@prisma/client';

// Helper function to convert database status to API status
function convertStatus(status: Status): 'active' | 'inactive' {
  return status === 'ACTIVE' ? 'active' : 'inactive';
}

// Helper function to convert API status to database status
function convertStatusToDb(status: 'active' | 'inactive'): Status {
  return status === 'active' ? 'ACTIVE' : 'INACTIVE';
}

// GET - Fetch single event by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const dbEvent = await prisma.event.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!dbEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found', message: 'No event found with this ID' },
        { status: 404 }
      );
    }

    // Convert to API format
    const event = {
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
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body: Partial<EventFormData> & {
      poster?: string;
      video?: string;
      thumbnail?: string;
    } = await request.json();

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found', message: 'No event found with this ID' },
        { status: 404 }
      );
    }

    // Validate date logic if dates are being updated
    if (body.startDate || body.endDate || body.expiryDate) {
      const startDate = body.startDate ? new Date(body.startDate) : existingEvent.startDate;
      const endDate = body.endDate ? new Date(body.endDate) : existingEvent.endDate;
      const expiryDate = body.expiryDate ? new Date(body.expiryDate) : existingEvent.expiryDate;

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
    }

    // Update the event in database
    const dbEvent = await prisma.event.update({
      where: { id: resolvedParams.id },
      data: {
        title: body.title ?? existingEvent.title,
        description: body.description ?? existingEvent.description,
        poster: body.poster ?? existingEvent.poster,
        video: body.video ?? existingEvent.video,
        thumbnail: body.thumbnail ?? existingEvent.thumbnail,
        registrationLink: body.registrationLink ?? existingEvent.registrationLink,
        startDate: body.startDate ? new Date(body.startDate) : existingEvent.startDate,
        endDate: body.endDate ? new Date(body.endDate) : existingEvent.endDate,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : existingEvent.expiryDate,
        summary: body.summary ?? existingEvent.summary,
        tags: body.tags ?? existingEvent.tags,
        status: body.status ? convertStatusToDb(body.status) : existingEvent.status,
        order: body.order ?? existingEvent.order
      }
    });

    // Convert to API format
    const updatedEvent = {
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
      data: updatedEvent,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found', message: 'No event found with this ID' },
        { status: 404 }
      );
    }

    // Delete the event from database
    const deletedEvent = await prisma.event.delete({
      where: { id: resolvedParams.id }
    });

    // Convert to API format
    const deletedEventFormatted = {
      id: deletedEvent.id,
      title: deletedEvent.title,
      description: deletedEvent.description,
      poster: deletedEvent.poster,
      video: deletedEvent.video,
      thumbnail: deletedEvent.thumbnail,
      registrationLink: deletedEvent.registrationLink,
      startDate: deletedEvent.startDate.toISOString(),
      endDate: deletedEvent.endDate.toISOString(),
      expiryDate: deletedEvent.expiryDate.toISOString(),
      summary: deletedEvent.summary,
      tags: deletedEvent.tags,
      status: convertStatus(deletedEvent.status),
      order: deletedEvent.order,
      createdAt: deletedEvent.createdAt.toISOString(),
      updatedAt: deletedEvent.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: deletedEventFormatted,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event', message: 'Internal server error' },
      { status: 500 }
    );
  }
}