"use client"
import { useMemo, useState, useEffect } from 'react';
import { Calendar, Clock, Sun } from 'lucide-react';
import { prayerTimesData } from '../data/prayerTimes';
import CountdownTimer from './CountdownTimer';

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

const MonthlyPrayerTimes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monthData, setMonthData] = useState<DayPrayerTimes[]>([]);

  const today = useMemo(() => new Date(), []);
  const currentDate = today.getDate().toString();
  const currentMonth = (today.getMonth() + 1).toString().replace(/^0/, '');
  const currentYear = today.getFullYear().toString();

  useEffect(() => {
    const fetchMonthData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch from API first
        try {
          const response = await fetch('/api/prayerTimes');
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              const filteredData = data.filter(
                day => day.month === currentMonth && day.year === currentYear
              );
              if (filteredData.length > 0) {
                setMonthData(filteredData);
                return;
              }
            }
          }
        } catch (apiError) {
          console.warn('Failed to fetch from API, falling back to static data:', apiError);
        }

        // Fall back to static data
        const staticData = prayerTimesData.filter(
          (day: DayPrayerTimes) => day.month === currentMonth && day.year === currentYear
        );

        if (staticData.length === 0) {
          throw new Error('No prayer times available for this month');
        }

        // Validate data structure
        if (!staticData.every(day =>
          day.date && day.month && day.year &&
          day.fajr?.azzan && day.fajr?.iqamah &&
          day.zuhr?.azzan && day.zuhr?.iqamah &&
          day.asr?.azzan && day.asr?.iqamah &&
          day.maghrib?.azzan && day.maghrib?.iqamah &&
          day.isha?.azzan && day.isha?.iqamah
        )) {
          throw new Error('Invalid prayer times data structure');
        }

        setMonthData(staticData);
      } catch (error) {
        console.error('Error loading prayer times:', error);
        setError(error instanceof Error ? error.message : 'Failed to load prayer times');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthData();
  }, [currentMonth, currentYear]);

  // Find today's prayer times
  const todayPrayerTimes = monthData.find(day => day.date === currentDate);

  const prayerColors = {
    fajr: 'text-blue-600',
    sunrise: 'text-yellow-500',
    zuhr: 'text-green-600',
    asr: 'text-purple-600',
    maghrib: 'text-orange-600',
    isha: 'text-indigo-600'
  };

  // Format date with month name
  const formatDate = (date: string, month: string, year: string) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[parseInt(month) - 1]} ${date}, ${year}`;
  };

  // Format full month name
  const fullMonthName = useMemo(() => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[parseInt(currentMonth) - 1];
  }, [currentMonth]);

  const options = { year: "numeric" as const, month: "long" as const, day: "numeric" as const, calendar: "islamic" };
  const hijriDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic', options).format(new Date());

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Error State */}
      {error && (
        <div className="bg-red-50 rounded-2xl shadow-lg p-6 mb-8">
          <p className="text-red-600 text-center font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 rounded-2xl shadow-lg p-6 mb-8">
          <p className="text-blue-600 text-center font-medium">Loading prayer times...</p>
        </div>
      )}

      {/* Today's Prayer Times Section */}
      {!isLoading && !error && todayPrayerTimes && (
        <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-lg overflow-hidden">
          <div className='flex gap-4 items-center justify-center'>
            <div className="bg-white/10 backdrop-blur-sm p-4 text-center">
              <h2 className="text-xl font-bold text-gray-800">
                Today&apos;s Prayer Times
              </h2>
              <p className="text-blue-800 text-sm">
                {formatDate(currentDate, currentMonth, currentYear)}
              </p>
              <p className="text-blue-800 text-sm">
                {hijriDate}
              </p>
            </div>
            <CountdownTimer />
          </div>


          {/* Horizontally Compact Prayer Times */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 p-4">
            {(['fajr', 'sunrise', 'zuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
              <div
                key={prayer}
                className="flex flex-col items-center p-2 bg-white/20 rounded-lg"
              >
                {prayer === 'sunrise' ? (
                  <Sun className={`w-6 h-6 ${prayerColors[prayer]}`} />
                ) : (
                  <Clock className={`w-6 h-6 ${prayerColors[prayer]}`} />
                )}
                <span className={`text-xs font-semibold capitalize ${prayerColors[prayer]}`}>
                  {prayer === 'sunrise' ? 'Sunrise' : prayer}
                </span>
                {prayer === 'sunrise' ? (
                  <span className={`text-sm ${prayerColors[prayer]}`}>
                    {todayPrayerTimes.fajr.sunrise}
                  </span>
                ) : (
                  <>
                    <span className={`text-sm ${prayerColors[prayer]}`}>
                      {todayPrayerTimes[prayer].azzan}
                    </span>
                    <span className="text-sm text-gray-500">
                      {todayPrayerTimes[prayer].iqamah}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Prayer Times Section */}
      <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-white/10 backdrop-blur-sm p-4 text-center">
          <h1 className="text-xl font-bold text-gray-800">
            {fullMonthName} Prayer Times
          </h1>
        </div>

        {/* DST Alert Banner */}
        {currentMonth === '3' && currentYear === '2026' && (
          <div className="bg-amber-100 border-l-4 border-amber-500 p-4 mx-4 my-2 rounded-md shadow-sm">
            <div className="flex items-center">
              <Sun className="w-5 h-5 text-amber-600 mr-2" />
              <p className="text-amber-800 font-semibold text-sm">
                Daylight Saving Time starts on <span className="underline">March 8th</span>.
                Clocks move forward by one hour.
              </p>
            </div>
          </div>
        )}

        {/* Responsive Mobile Layout */}
        <div className="lg:hidden overflow-x-auto">
          <div className="min-w-[700px] w-full">
            <div className="grid grid-cols-7 border-b border-purple-300">
              {['Date', 'Fajr', 'Sunrise', 'Zuhr', 'Asr', 'Maghrib', 'Isha'].map((header) => (
                <div
                  key={header}
                  className="p-2 text-center font-semibold text-blue-800 bg-white/10"
                >
                  {header}
                </div>
              ))}
            </div>
            {monthData.map((dayData) => (
              <div
                key={`${dayData.date}-${dayData.month}`}
                className={`grid grid-cols-7 border-b border-purple-300 last:border-b-0 transition-colors 
                  ${dayData.date === currentDate
                    ? 'bg-blue-100 hover:bg-blue-200'
                    : 'hover:bg-blue-50'}`}
              >
                {/* Date Column */}
                <div className="p-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-medium text-gray-800">{dayData.date}</div>
                    <div className="text-xs text-gray-500">{dayData.day}</div>
                  </div>
                </div>

                {/* Prayer Times Columns */}
                {(['fajr', 'sunrise', 'zuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
                  <div key={prayer} className="p-2 text-center">
                    {prayer === 'sunrise' ? (
                      <div className="flex flex-col items-center">
                        <Sun className={`w-4 h-4 mb-1 ${prayerColors[prayer]}`} />
                        <span className={`text-xs font-semibold ${prayerColors[prayer]}`}>
                          {dayData.fajr.sunrise || 'N/A'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Clock className={`w-4 h-4 mb-1 ${prayerColors[prayer]}`} />
                        <span className={`text-xs font-semibold ${prayerColors[prayer]}`}>
                          {dayData[prayer as keyof Omit<DayPrayerTimes, 'date' | 'day' | 'dst' | 'month' | 'year'>].azzan}
                        </span>
                        <span className="text-xs text-gray-500">
                          {dayData[prayer as keyof Omit<DayPrayerTimes, 'date' | 'day' | 'dst' | 'month' | 'year'>].iqamah}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Original Table for Large Screens */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/10 backdrop-blur-sm">
                <th className="p-3 text-left font-semibold text-blue-800">Date</th>
                <th className="p-3 text-left font-semibold text-blue-800">Fajr</th>
                <th className="p-3 text-left font-semibold text-blue-800">Sunrise</th>
                <th className="p-3 text-left font-semibold text-blue-800">Zuhr</th>
                <th className="p-3 text-left font-semibold text-blue-800">Asr</th>
                <th className="p-3 text-left font-semibold text-blue-800">Maghrib</th>
                <th className="p-3 text-left font-semibold text-blue-800">Isha</th>
              </tr>
            </thead>
            <tbody>
              {monthData.map((dayData) => (
                <tr
                  key={`${dayData.date}-${dayData.month}`}
                  className={`border-b border-purple-300 last:border-b-0 transition-colors 
                    ${dayData.date === currentDate
                      ? 'bg-blue-100 hover:bg-blue-200'
                      : 'hover:bg-blue-50'}`}
                >
                  <td className="p-3 font-medium text-gray-800 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    <div>
                      <span>{dayData.date}</span>
                      <span className="text-sm text-gray-500 block">{dayData.day}</span>
                    </div>
                  </td>
                  {(['fajr', 'sunrise', 'zuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
                    <td key={prayer} className="p-3 text-gray-700">
                      {prayer === 'sunrise' ? (
                        <div className="flex items-center">
                          <Sun className={`w-4 h-4 mr-1 ${prayerColors[prayer]}`} />
                          <span className={`font-semibold ${prayerColors[prayer]}`}>
                            {dayData.fajr.sunrise || 'N/A'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Clock className={`w-4 h-4 mr-1 ${prayerColors[prayer]}`} />
                            <span className={`font-semibold ${prayerColors[prayer]}`}>
                              {dayData[prayer as keyof Omit<DayPrayerTimes, 'date' | 'day' | 'dst' | 'month' | 'year'>].azzan}
                            </span>
                          </div>
                          <span className="text-gray-500">
                            {dayData[prayer as keyof Omit<DayPrayerTimes, 'date' | 'day' | 'dst' | 'month' | 'year'>].iqamah}
                          </span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPrayerTimes;