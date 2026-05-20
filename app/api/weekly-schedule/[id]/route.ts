import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { WeeklyClassFormData } from '@/app/types/weeklyClass';
import { Status } from '@prisma/client';

function convertStatus(status: Status): 'active' | 'inactive' {
  return status === 'ACTIVE' ? 'active' : 'inactive';
}

function convertStatusToDb(status: 'active' | 'inactive'): Status {
  return status === 'active' ? 'ACTIVE' : 'INACTIVE';
}

function formatRow(r: {
  id: string; name: string; days: string[]; startTime: string;
  endTime: string | null; audience: string | null; category: string;
  status: Status; order: number; createdAt: Date; updatedAt: Date;
}) {
  return {
    id: r.id, name: r.name, days: r.days, startTime: r.startTime,
    endTime: r.endTime, audience: r.audience, category: r.category,
    status: convertStatus(r.status), order: r.order,
    createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(),
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const row = await prisma.weeklyClass.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: formatRow(row) });
  } catch (error) {
    console.error('Error fetching weekly class:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.weeklyClass.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const body: Partial<WeeklyClassFormData> = await request.json();

    if (body.days !== undefined && body.days.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one day must be selected' },
        { status: 400 }
      );
    }

    const updated = await prisma.weeklyClass.update({
      where: { id },
      data: {
        name: body.name?.trim() ?? existing.name,
        days: body.days ?? existing.days,
        startTime: body.startTime?.trim() ?? existing.startTime,
        endTime: body.endTime !== undefined ? (body.endTime?.trim() || null) : existing.endTime,
        audience: body.audience !== undefined ? (body.audience?.trim() || null) : existing.audience,
        category: body.category ?? existing.category,
        status: body.status ? convertStatusToDb(body.status) : existing.status,
        order: body.order ?? existing.order,
      },
    });

    return NextResponse.json({
      success: true,
      data: formatRow(updated),
      message: 'Weekly class updated successfully',
    });
  } catch (error) {
    console.error('Error updating weekly class:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.weeklyClass.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    await prisma.weeklyClass.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Weekly class deleted successfully' });
  } catch (error) {
    console.error('Error deleting weekly class:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
