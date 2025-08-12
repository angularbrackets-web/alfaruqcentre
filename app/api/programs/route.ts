import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { ProgramFormData } from '@/app/types/program';
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

// GET - Fetch all programs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    // Fetch programs from database
    const dbPrograms = await prisma.program.findMany({
      where: includeInactive ? {} : { status: 'ACTIVE' },
      orderBy: { order: 'asc' }
    });
    
    // Convert database format to API format
    const programs = dbPrograms.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      linkUrl: p.linkUrl,
      linkText: p.linkText,
      status: convertStatus(p.status),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      order: p.order
    }));

    return NextResponse.json({
      success: true,
      data: programs
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch programs', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new program
export async function POST(request: NextRequest) {
  try {
    const body: ProgramFormData & { imageUrl: string } = await request.json();
    
    // Validate required fields
    if (!body.title || !body.imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', message: 'Title and image are required' },
        { status: 400 }
      );
    }

    // Get the next order number
    const maxOrder = await prisma.program.aggregate({
      _max: { order: true }
    });
    const nextOrder = (maxOrder._max.order || 0) + 1;
    
    // Create new program in database
    const dbProgram = await prisma.program.create({
      data: {
        id: generateId(),
        title: body.title,
        description: body.description || '',
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl || null,
        linkText: body.linkText || null,
        status: convertStatusToDb(body.status || 'active'),
        order: body.order || nextOrder
      }
    });

    // Convert to API format
    const newProgram = {
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
      data: newProgram,
      message: 'Program created successfully'
    });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create program', message: 'Internal server error' },
      { status: 500 }
    );
  }
}