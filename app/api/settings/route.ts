import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const obj: Record<string, string> = {};
    for (const s of settings) obj[s.key] = s.value;
    return NextResponse.json(obj);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    // Allow requests from the admin UI (cookie session) or from the cron sync script (CRON_SECRET header).
    const cronSecret = process.env.CRON_SECRET;
    const sessionCookie = req.headers.get('cookie') ?? '';
    const authHeader = req.headers.get('x-cron-secret') ?? '';

    const hasSession = sessionCookie.includes('admin-session=');
    const hasCronSecret = cronSecret && authHeader === cronSecret;

    if (!hasSession && !hasCronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, value } = await req.json();
    if (!key || typeof value !== 'string') {
      return NextResponse.json({ error: 'key and value required' }, { status: 400 });
    }
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return NextResponse.json(setting);
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
