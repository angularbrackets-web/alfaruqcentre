interface PrayerTime {
  azzan: string;
  iqamah: string;
  sunrise?: string;
}

interface DayPrayerTimes {
  date: string;
  day: string;
  dst: boolean;
  month: string;
  year: string;
  fajr: PrayerTime;
  zuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
}

// Import the JSON data directly
import prayerTimesJson from './prayerTimes.json';

// Export the typed data
export const prayerTimesData: DayPrayerTimes[] = prayerTimesJson;
