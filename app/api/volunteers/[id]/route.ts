import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { VolunteerStatusType } from '@/app/types/volunteer';
import { VolunteerStatus } from '@prisma/client';

// Helper function to convert database status to API status
function convertStatus(status: VolunteerStatus): VolunteerStatusType {
  const statusMap: Record<VolunteerStatus, VolunteerStatusType> = {
    PENDING: 'pending',
    CONTACTED: 'contacted',
    ENROLLED: 'enrolled',
    DECLINED: 'declined'
  };
  return statusMap[status];
}

// Helper function to convert API status to database status
function convertStatusToDb(status: VolunteerStatusType): VolunteerStatus {
  const statusMap: Record<VolunteerStatusType, VolunteerStatus> = {
    pending: 'PENDING',
    contacted: 'CONTACTED',
    enrolled: 'ENROLLED',
    declined: 'DECLINED'
  };
  return statusMap[status];
}

// GET - Fetch single volunteer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const dbVolunteer = await prisma.volunteer.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!dbVolunteer) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found', message: 'No volunteer found with this ID' },
        { status: 404 }
      );
    }

    // Convert to API format
    const volunteer = {
      id: dbVolunteer.id,
      name: dbVolunteer.name,
      email: dbVolunteer.email,
      phone: dbVolunteer.phone,
      areasOfInterest: dbVolunteer.areasOfInterest,
      availability: dbVolunteer.availability,
      message: dbVolunteer.message,
      status: convertStatus(dbVolunteer.status),
      createdAt: dbVolunteer.createdAt.toISOString(),
      updatedAt: dbVolunteer.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    console.error('Error fetching volunteer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch volunteer', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update volunteer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body: { status?: VolunteerStatusType } = await request.json();

    // Check if volunteer exists
    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingVolunteer) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found', message: 'No volunteer found with this ID' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: { status?: VolunteerStatus } = {};
    if (body.status) {
      updateData.status = convertStatusToDb(body.status);
    }

    // Update the volunteer in database
    const dbVolunteer = await prisma.volunteer.update({
      where: { id: resolvedParams.id },
      data: updateData
    });

    // Convert to API format
    const updatedVolunteer = {
      id: dbVolunteer.id,
      name: dbVolunteer.name,
      email: dbVolunteer.email,
      phone: dbVolunteer.phone,
      areasOfInterest: dbVolunteer.areasOfInterest,
      availability: dbVolunteer.availability,
      message: dbVolunteer.message,
      status: convertStatus(dbVolunteer.status),
      createdAt: dbVolunteer.createdAt.toISOString(),
      updatedAt: dbVolunteer.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedVolunteer,
      message: 'Volunteer updated successfully'
    });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update volunteer', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete volunteer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    // Check if volunteer exists
    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingVolunteer) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found', message: 'No volunteer found with this ID' },
        { status: 404 }
      );
    }

    // Delete the volunteer from database
    const deletedVolunteer = await prisma.volunteer.delete({
      where: { id: resolvedParams.id }
    });

    // Convert to API format
    const deletedVolunteerFormatted = {
      id: deletedVolunteer.id,
      name: deletedVolunteer.name,
      email: deletedVolunteer.email,
      phone: deletedVolunteer.phone,
      areasOfInterest: deletedVolunteer.areasOfInterest,
      availability: deletedVolunteer.availability,
      message: deletedVolunteer.message,
      status: convertStatus(deletedVolunteer.status),
      createdAt: deletedVolunteer.createdAt.toISOString(),
      updatedAt: deletedVolunteer.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: deletedVolunteerFormatted,
      message: 'Volunteer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete volunteer', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
