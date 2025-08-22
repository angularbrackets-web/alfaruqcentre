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

        // Fetch Jummah times
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
    try {
      // Test if browser supports islamic-umalqura calendar
      const testFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura');
      const testDate = testFormatter.format(new Date('2024-01-01'));
      
      // If the test returns a date with BC, the calendar is not properly supported
      if (testDate.includes('BC') || testDate.includes('AD')) {
        throw new Error('Islamic calendar not supported');
      }
      
      const hijriDateOptions = { 
        year: "numeric" as const, 
        month: "long" as const, 
        day: "numeric" as const, 
        calendar: "islamic-umalqura" as const
      };
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', hijriDateOptions);
      const formatted = formatter.format(today);
      
      // Double-check the result doesn't contain BC
      if (formatted.includes('BC')) {
        throw new Error('Invalid Hijri date format');
      }
      
      return formatted;
    } catch {
      // Fallback: Calculate approximate Hijri date manually
      const gregorianYear = today.getFullYear();
      const gregorianMonth = today.getMonth() + 1;
      const gregorianDay = today.getDate();
      
      // Simple approximation (not astronomically precise, but better than showing BC)
      // Hijri year is approximately 33 years behind Gregorian in cycles
      const hijriYear = Math.floor((gregorianYear - 622) * 1.030684) + 1;
      
      // Simplified month mapping (approximate)
      const hijriMonths = [
        'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
      ];
      
      // Rough approximation - adjust month and day based on lunar calendar offset
      const dayOfYear = Math.floor((Date.UTC(gregorianYear, gregorianMonth - 1, gregorianDay) - Date.UTC(gregorianYear, 0, 0)) / (1000 * 60 * 60 * 24));
      const hijriMonthIndex = Math.floor((dayOfYear / 29.5) % 12);
      const hijriDay = Math.floor((dayOfYear % 29.5)) + 1;
      
      return `${hijriMonths[hijriMonthIndex]} ${hijriDay}, ${hijriYear} AH`;
    }
  }, [today]);

  return (
    <div className="flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-indigo-200/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Glassmorphic Header */}
        <div className="bg-white/20 backdrop-blur-md p-6 text-center border-b border-white/20">
          <h1 className="text-2xl font-bold text-indigo-900 drop-shadow-sm mb-2">
            Prayer Times
          </h1>
          <p className="text-indigo-700 font-medium">
            {`${currentDate}`}
          </p>
          <p className="text-indigo-600 text-sm">
            {`${hijriDate}`}
          </p>
        </div>

        {/* Countdown Section */}
        {!isLoading && !error && currentDayData && <Countdown />}

        {/* Prayer Times Table */}
        <div className="p-3 sm:p-6">
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
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-white/15 backdrop-blur-sm">
                    <th className="p-2 sm:p-4 text-left font-semibold text-indigo-800 text-xs sm:text-sm uppercase tracking-wide">Prayer</th>
                    <th className="p-2 sm:p-4 text-center font-semibold text-indigo-800 text-xs sm:text-sm uppercase tracking-wide">Adhan</th>
                    <th className="p-2 sm:p-4 text-center font-semibold text-indigo-800 text-xs sm:text-sm uppercase tracking-wide">Iqamah</th>
                  </tr>
                </thead>
                <tbody>
                  {prayerList.map((prayer) => (
                    <tr 
                      key={prayer.name} 
                      className="border-b border-indigo-200/50 last:border-b-0 hover:bg-white/20 transition-all duration-200 hover:shadow-sm"
                    >
                      <td className="p-2 sm:p-3 flex items-center space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0">{prayer.icon}</div>
                        <span className="font-medium text-slate-800 text-sm sm:text-base truncate">{prayer.name}</span>
                      </td>
                      <td className="p-2 sm:p-3 text-center text-slate-700 font-medium text-sm sm:text-base whitespace-nowrap">
                        {prayer.data.azzan || 'N/A'}
                      </td>
                      <td className="p-2 sm:p-3 text-center text-indigo-800 font-bold text-sm sm:text-base whitespace-nowrap">
                        {prayer.data.iqamah || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Jummah Times Section */}
            <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/60 rounded-2xl shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center bg-amber-100/80 px-4 py-2 rounded-full border border-amber-300/50">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-3 animate-pulse"></div>
                  <h3 className="text-lg font-bold text-amber-800 tracking-wide">Jummah Prayer</h3>
                </div>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-amber-200/50 overflow-hidden">
                <div className="grid grid-cols-2 gap-0">
                  <div className="bg-gradient-to-br from-amber-100/60 to-orange-100/60 p-4 text-center border-r border-amber-200/50">
                    <div className="text-xs sm:text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">
                      1st Jummah
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-amber-800 font-mono">
                      {jummahTimes.firstJummah}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-100/60 to-amber-100/60 p-4 text-center">
                    <div className="text-xs sm:text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">
                      2nd Jummah
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-amber-800 font-mono">
                      {jummahTimes.secondJummah}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-xs text-amber-600 font-medium">
                  📍 Join us for weekly congregational prayer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Iqamah Changes */}
        <IqamahChanges prayerTimes={prayerTimes} />

        <div className="text-center p-4 border-t border-white/20">
          <Link 
            href="/prayertimes"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 text-sm"
          >
            VIEW MONTHLY PRAYER TIMES
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphicPrayerTimes;