"use client"
import { useMemo } from 'react';
import { Clock, Sun } from 'lucide-react';
import prayerTimesData from '../data/prayerTimes.json';
import Countdown from './CountdownTimer';
import IqamahChanges from './IqamahChanges';
import Link from 'next/link';

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

const GlassmorphicPrayerTimes = () => {
  const prayerTimes: DayPrayerTimes[] = prayerTimesData;
  
  const today = new Date();
  const currentDay = today.getDate().toString();
  const currentMonth = (today.getMonth() + 1).toString().replace(/^0/, '');
  const currentYear = today.getFullYear().toString();

  const currentDayData: DayPrayerTimes = useMemo(() => 
    prayerTimes.find((day) => day.date === currentDay && day.month === currentMonth && day.year === currentYear) || prayerTimes[0], 
    [currentDay, currentMonth, currentYear, prayerTimes]
  );

  const nextDayData = useMemo(() => {
    const currentIndex = prayerTimes.findIndex((day) => day.date === currentDayData.date);
    return currentIndex >= 0 && currentIndex < prayerTimes.length - 1
      ? prayerTimes[currentIndex + 1]
      : prayerTimes[0];
  }, [currentDayData.date, prayerTimes]);

  const prayerList = useMemo(() => [
    { name: 'Fajr', icon: <Clock className="w-5 h-5 text-blue-600" />, data: currentDayData.fajr },
    { name: 'Sunrise', icon: <Sun className="w-5 h-5 text-yellow-500" />, data: { azzan: currentDayData.fajr.sunrise || 'N/A', iqamah: 'N/A' } },
    { name: 'Zuhr', icon: <Clock className="w-5 h-5 text-green-600" />, data: currentDayData.zuhr },
    { name: 'Asr', icon: <Clock className="w-5 h-5 text-purple-600" />, data: currentDayData.asr },
    { name: 'Maghrib', icon: <Clock className="w-5 h-5 text-orange-600" />, data: currentDayData.maghrib },
    { name: 'Isha', icon: <Clock className="w-5 h-5 text-indigo-600" />, data: currentDayData.isha }
  ], [currentDayData]);

  // Removed unused getNextIqamahTime variable
    
  const prayerKeys: (keyof Pick<DayPrayerTimes, 'fajr' | 'zuhr' | 'asr' | 'maghrib' | 'isha'>)[] 
    = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'];
  
  const changes: { prayer: string; oldTime: string; newTime: string }[] = [];
  
  prayerKeys.forEach(key => {
    const currentTime = currentDayData[key].iqamah;
    const nextTime = nextDayData[key]?.iqamah || ''; // Ensure nextDayData is safely accessed
    
    if (currentTime !== nextTime) {
      changes.push({
        prayer: key.charAt(0).toUpperCase() + key.slice(1),
        oldTime: currentTime,
        newTime: nextTime
      });
    }
  });



  const options = { year: "numeric" as const, month: "long" as const, day: "numeric" as const };
  const currentDate = new Date().toLocaleDateString('en-US', options);

  const hijriDateOptions = { year: "numeric" as const, month: "long" as const, day: "numeric" as const, calendar: "islamic" };
  const hijriDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic', hijriDateOptions).format(new Date());

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100  border border-purple/20 rounded-3xl shadow-2xl overflow-hidden">
        {/* Glassmorphic Header */}
        <div className="bg-white/10 backdrop-blur-sm p-6 text-center border-b border-white/10">
          <h1 className="text-2xl font-bold text-gray-800 drop-shadow-lg">
            Prayer Times
          </h1>
          <p className="text-blue-800">
            {`${currentDate}`}
          </p>
          <p className="text-blue-800">
            {`${hijriDate}`}
          </p>
        </div>

        {/* Countdown Section */}
        <Countdown />

        {/* Prayer Times Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/10 backdrop-blur-sm text-lg">
                  <th className="p-3 text-left font-semibold text-purple-800">Prayer</th>
                  <th className="p-3 text-left font-semibold text-purple-800">Adhan</th>
                  <th className="p-3 text-left font-semibold text-purple-800">Iqamah</th>
                </tr>
              </thead>
              <tbody>
                {prayerList.map((prayer) => (
                  <tr 
                    key={prayer.name} 
                    className="border-b border-purple-300 last:border-b-0 hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-2 flex items-center space-x-2">
                      {prayer.icon}
                      <span className="font-medium text-gray-800">{prayer.name}</span>
                    </td>
                    <td className="p-2 text-gray-700">
                      {prayer.data.azzan || 'N/A'}
                    </td>
                    <td className="p-2 text-blue-800 font-bold">
                      {prayer.data.iqamah || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className="w-full border-collapse mt-2">
              <thead>
                <tr className="bg-white/10 backdrop-blur-sm">
                  <th className="p-3 text-center font-semibold text-purple-900">1st Jummah</th>
                  <th className="p-3 text-center font-semibold text-purple-900">2nd Jummah</th>
                </tr>
              </thead>
              <tbody>
              <tr 
                    className="border-b last:border-b-0 hover:bg-blue-50 transition-colors font-bold text-blue-800"
                  >
                    <td className="p-2 items-center text-center">
                      <span>02:00 PM</span>
                    </td>
                    <td className="p-2 text-center">
                    <span>03:00 PM</span>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Iqamah Changes */}
        <IqamahChanges />

        <div className='items-center justify-center text-center p-4'>
            <Link href="/prayertimes">VIEW MONTHLY PRAYER TIMES</Link>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphicPrayerTimes;