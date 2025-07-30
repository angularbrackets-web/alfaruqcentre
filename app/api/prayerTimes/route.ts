import { NextResponse } from 'next/server';
import { prayerTimesData } from '@/app/data/prayerTimes';

export async function GET() {
  try {
    return NextResponse.json(prayerTimesData);
  } catch (error) {
    console.error('Error in prayer times API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
