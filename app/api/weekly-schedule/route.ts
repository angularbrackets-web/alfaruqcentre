import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { WeeklyClassFormData } from '@/app/types/weeklyClass';
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const rows = await prisma.weeklyClass.findMany({
      where: includeInactive ? {} : { status: 'ACTIVE' },
      orderBy: { order: 'asc' },
    });

    const data = rows.map((r) => ({
      id: r.id,
      name: r.name,
      days: r.days,
      startTime: r.startTime,
      endTime: r.endTime,
      audience: r.audience,
      category: r.category,
      status: convertStatus(r.status),
      order: r.order,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching weekly classes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weekly classes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: WeeklyClassFormData = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }
    if (!body.days || body.days.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one day must be selected' },
        { status: 400 }
      );
    }
    if (!body.startTime?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Start time is required' },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.weeklyClass.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order || 0) + 1;

    const row = await prisma.weeklyClass.create({
      data: {
        id: generateId(),
        name: body.name.trim(),
        days: body.days,
        startTime: body.startTime.trim(),
        endTime: body.endTime?.trim() || null,
        audience: body.audience?.trim() || null,
        category: body.category || 'other',
        status: convertStatusToDb(body.status || 'active'),
        order: body.order || nextOrder,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        days: row.days,
        startTime: row.startTime,
        endTime: row.endTime,
        audience: row.audience,
        category: row.category,
        status: convertStatus(row.status),
        order: row.order,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      },
      message: 'Weekly class created successfully',
    });
  } catch (error) {
    console.error('Error creating weekly class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create weekly class' },
      { status: 500 }
    );
  }
}
