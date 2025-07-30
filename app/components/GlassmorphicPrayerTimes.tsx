"use client"
import { useMemo, useState, useEffect } from 'react';
import { Clock, Sun } from 'lucide-react';
import { prayerTimesData } from '../data/prayerTimes';
import Countdown from './CountdownTimer';
import IqamahChanges from './IqamahChanges';
import Link from 'next/link';

interface PrayerTime {
  azzan: string;
  iqamah: string;
  sunrise?: string;
}

interface JummahTimes {
  firstJummah: string;
  secondJummah: string;
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

const defaultJummahTimes: JummahTimes = {
  firstJummah: "01:45 PM",
  secondJummah: "03:00 PM"
};

const GlassmorphicPrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<DayPrayerTimes[]>(prayerTimesData);
  const [jummahTimes, setJummahTimes] = useState<JummahTimes>(defaultJummahTimes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);
  const currentDay = useMemo(() => today.getDate().toString(), [today]);
  const currentMonth = useMemo(() => (today.getMonth() + 1).toString().replace(/^0/, ''), [today]);
  const currentYear = useMemo(() => today.getFullYear().toString(), [today]);

  useEffect(() => {
    // Function to fetch prayer times and Jummah times
    const fetchTimes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch prayer times
        const prayerResponse = await fetch('/api/prayerTimes');
        if (!prayerResponse.ok) {
          throw new Error(`Failed to fetch prayer times. Please try again later.`);
        }
        const prayerData = await prayerResponse.json();
        if (!Array.isArray(prayerData) || prayerData.length === 0) {
          throw new Error('Invalid prayer times data received');
        }

        // Validate prayer times data structure
        if (!prayerData.every(day => 
          day.date && day.month && day.year && 
          day.fajr?.azzan && day.fajr?.iqamah &&
          day.zuhr?.azzan && day.zuhr?.iqamah &&
          day.asr?.azzan && day.asr?.iqamah &&
          day.maghrib?.azzan && day.maghrib?.iqamah &&
          day.isha?.azzan && day.isha?.iqamah
        )) {
          throw new Error('Invalid prayer times data structure');
        }

        setPrayerTimes(prayerData);

        // Fetch Jummah times if it's Friday
        if (today.getDay() === 5) {
          try {
            const jummahResponse = await fetch('/api/jummahTimes');
            if (jummahResponse.ok) {
              const jummahData = await jummahResponse.json();
              // Validate Jummah times data structure
              if (typeof jummahData?.firstJummah === 'string' && 
                  typeof jummahData?.secondJummah === 'string' &&
                  jummahData.firstJummah.match(/^\d{1,2}:\d{2} [AP]M$/) &&
                  jummahData.secondJummah.match(/^\d{1,2}:\d{2} [AP]M$/)) {
                setJummahTimes(jummahData);
              } else {
                console.warn('Invalid Jummah times format, using defaults');
              }
            }
          } catch (jummahError) {
            console.warn('Could not fetch Jummah times, using defaults:', jummahError);
          }
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately on mount
    fetchTimes();

    // Set up polling every hour
    const interval = setInterval(fetchTimes, 60 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [today]);

  const currentDayData = useMemo(() => 
    prayerTimes.find((day) => day.date === currentDay && day.month === currentMonth && day.year === currentYear),
    [currentDay, currentMonth, currentYear, prayerTimes]
  );

  const prayerList = useMemo(() => {
    if (!currentDayData) {
      return [];
    }

    return [
      { name: 'Fajr', icon: <Clock className="w-5 h-5 text-blue-600" />, data: currentDayData.fajr },
      { name: 'Sunrise', icon: <Sun className="w-5 h-5 text-yellow-500" />, data: { azzan: currentDayData.fajr.sunrise || 'N/A', iqamah: 'N/A' } },
      { name: 'Zuhr', icon: <Clock className="w-5 h-5 text-green-600" />, data: currentDayData.zuhr },
      { name: 'Asr', icon: <Clock className="w-5 h-5 text-purple-600" />, data: currentDayData.asr },
      { name: 'Maghrib', icon: <Clock className="w-5 h-5 text-orange-600" />, data: currentDayData.maghrib },
      { name: 'Isha', icon: <Clock className="w-5 h-5 text-indigo-600" />, data: currentDayData.isha }
    ];
  }, [currentDayData]);

  // Removed unused getNextIqamahTime variable
    
  // Removed unused changes calculation as it's now handled in IqamahChanges component



  const currentDate = useMemo(() => {
    const options = { year: "numeric" as const, month: "long" as const, day: "numeric" as const };
    return today.toLocaleDateString('en-US', options);
  }, [today]);

  const hijriDate = useMemo(() => {
    const hijriDateOptions = { 
      year: "numeric" as const, 
      month: "long" as const, 
      day: "numeric" as const, 
      calendar: "islamic-umalqura" as const
    };
    return new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', hijriDateOptions).format(today);
  }, [today]);

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
        {!isLoading && !error && currentDayData && <Countdown />}

        {/* Prayer Times Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-blue-600 text-lg">Loading prayer times...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 text-lg">{error}</p>
                <p className="text-gray-500 text-sm mt-2">Using last available data</p>
              </div>
            ) : !currentDayData ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">Prayer times are not available for today.</p>
                <p className="text-gray-500 text-sm mt-2">Please check back later.</p>
              </div>
            ) : (
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
            )}

            {/* Show Jummah times only on Friday */}
            {today.getDay() === 5 && (
              <table className="w-full border-collapse mt-2">
                <thead>
                  <tr className="bg-white/10 backdrop-blur-sm">
                    <th className="p-3 text-center font-semibold text-purple-900">1st Jummah</th>
                    <th className="p-3 text-center font-semibold text-purple-900">2nd Jummah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b last:border-b-0 hover:bg-blue-50 transition-colors font-bold text-blue-800">
                    <td className="p-2 items-center text-center">
                      <span>{jummahTimes.firstJummah}</span>
                    </td>
                    <td className="p-2 text-center">
                      <span>{jummahTimes.secondJummah}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Iqamah Changes */}
        <IqamahChanges prayerTimes={prayerTimes} />

        <div className='items-center justify-center text-center p-4'>
            <Link href="/prayertimes">VIEW MONTHLY PRAYER TIMES</Link>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphicPrayerTimes;