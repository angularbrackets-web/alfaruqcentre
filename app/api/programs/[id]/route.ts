import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { ProgramFormData } from '@/app/types/program';
import { Status } from '@prisma/client';

// Helper function to convert database status to API status
function convertStatus(status: Status): 'active' | 'inactive' {
  return status === 'ACTIVE' ? 'active' : 'inactive';
}

// Helper function to convert API status to database status
function convertStatusToDb(status: 'active' | 'inactive'): Status {
  return status === 'active' ? 'ACTIVE' : 'INACTIVE';
}

// GET - Fetch single program by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const dbProgram = await prisma.program.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!dbProgram) {
      return NextResponse.json(
        { success: false, error: 'Program not found', message: 'No program found with this ID' },
        { status: 404 }
      );
    }

    // Convert to API format
    const program = {
      id: dbProgram.id,
      title: dbProgram.title,
      description: dbProgram.description,
      imageUrl: dbProgram.imageUrl,
      linkUrl: dbProgram.linkUrl,
      linkText: dbProgram.linkText,
      status: convertStatus(dbProgram.status),
      createdAt: dbProgram.createdAt.toISOString(),
      updatedAt: dbProgram.updatedAt.toISOString(),
      order: dbProgram.order
    };

    return NextResponse.json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch program', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update program
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body: Partial<ProgramFormData> & { imageUrl?: string } = await request.json();
    
    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id: resolvedParams.id }
    });
    
    if (!existingProgram) {
      return NextResponse.json(
        { success: false, error: 'Program not found', message: 'No program found with this ID' },
        { status: 404 }
      );
    }

    // Update the program in database
    const dbProgram = await prisma.program.update({
      where: { id: resolvedParams.id },
      data: {
        title: body.title ?? existingProgram.title,
        description: body.description ?? existingProgram.description,
        imageUrl: body.imageUrl ?? existingProgram.imageUrl,
        linkUrl: body.linkUrl ?? existingProgram.linkUrl,
        linkText: body.linkText ?? existingProgram.linkText,
        status: body.status ? convertStatusToDb(body.status) : existingProgram.status,
        order: body.order ?? existingProgram.order,
      }
    });

    // Convert to API format
    const updatedProgram = {
      id: dbProgram.id,
      title: dbProgram.title,
      description: dbProgram.description,
      imageUrl: dbProgram.imageUrl,
      linkUrl: dbProgram.linkUrl,
      linkText: dbProgram.linkText,
      status: convertStatus(dbProgram.status),
      createdAt: dbProgram.createdAt.toISOString(),
      updatedAt: dbProgram.updatedAt.toISOString(),
      order: dbProgram.order
    };

    return NextResponse.json({
      success: true,
      data: updatedProgram,
      message: 'Program updated successfully'
    });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update program', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete program
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    
    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id: resolvedParams.id }
    });
    
    if (!existingProgram) {
      return NextResponse.json(
        { success: false, error: 'Program not found', message: 'No program found with this ID' },
        { status: 404 }
      );
    }

    // Delete the program from database
    const deletedProgram = await prisma.program.delete({
      where: { id: resolvedParams.id }
    });

    // Convert to API format
    const deletedProgramFormatted = {
      id: deletedProgram.id,
      title: deletedProgram.title,
      description: deletedProgram.description,
      imageUrl: deletedProgram.imageUrl,
      linkUrl: deletedProgram.linkUrl,
      linkText: deletedProgram.linkText,
      status: convertStatus(deletedProgram.status),
      createdAt: deletedProgram.createdAt.toISOString(),
      updatedAt: deletedProgram.updatedAt.toISOString(),
      order: deletedProgram.order
    };

    return NextResponse.json({
      success: true,
      data: deletedProgramFormatted,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete program', message: 'Internal server error' },
      { status: 500 }
    );
  }
}