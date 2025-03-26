"use client"
import { useEffect, useState, useMemo } from 'react';
import { Clock, Sun, RefreshCw } from 'lucide-react';
import prayerTimesData from '../data/prayerTimes.json';

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

const parseTimeForDate = (timeStr: string, referenceDate: Date): Date | null => {
  if (!timeStr) return null;
  const [time, meridiem] = timeStr.split(' ');
  const [hoursStr, minutesStr] = time.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  if (meridiem.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (meridiem.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  const date = new Date(referenceDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const PrayerTimesCard = () => {
  const prayerTimes: DayPrayerTimes[] = prayerTimesData;
  const todayNumber = new Date().getDate().toString();
  
  const currentDayData = useMemo(() => 
    prayerTimes.find((day) => day.date === todayNumber) || prayerTimes[0], 
    [prayerTimes, todayNumber]
  );

  const nextDayData = useMemo(() => {
    const currentIndex = prayerTimes.findIndex((day) => day.date === currentDayData.date);
    return currentIndex >= 0 && currentIndex < prayerTimes.length - 1
      ? prayerTimes[currentIndex + 1]
      : prayerTimes[0];
  }, [currentDayData.date, prayerTimes]);

  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0, 
    minutes: 0, 
    seconds: 0
  });
  const [nextPrayer, setNextPrayer] = useState<string>('');

  const prayerList = useMemo(() => [
    { name: 'Fajr', icon: <Clock className="w-5 h-5 text-blue-600" />, data: currentDayData.fajr },
    { name: 'Sunrise', icon: <Sun className="w-5 h-5 text-yellow-500" />, data: { azzan: currentDayData.fajr.sunrise || 'N/A', iqamah: 'N/A' } },
    { name: 'Zuhr', icon: <Clock className="w-5 h-5 text-green-600" />, data: currentDayData.zuhr },
    { name: 'Asr', icon: <Clock className="w-5 h-5 text-purple-600" />, data: currentDayData.asr },
    { name: 'Maghrib', icon: <Clock className="w-5 h-5 text-orange-600" />, data: currentDayData.maghrib },
    { name: 'Isha', icon: <Clock className="w-5 h-5 text-indigo-600" />, data: currentDayData.isha }
  ], [currentDayData]);

  const getNextIqamahTime = useMemo(() => {
    const prayers: { name: string; timeStr: string }[] = prayerList
      .filter(prayer => prayer.name !== 'Sunrise')
      .map(prayer => ({ 
        name: prayer.name, 
        timeStr: prayer.data.iqamah 
      }));

    return (now: Date) => {
      for (let i = 0; i < prayers.length; i++) {
        const iqamahTime = parseTimeForDate(prayers[i].timeStr, now);
        if (iqamahTime && now < iqamahTime) {
          return { prayerName: prayers[i].name, time: iqamahTime };
        }
      }
      return null;
    };
  }, [prayerList]);

  // Modify to only check next day's changes
  const iqamahChanges = useMemo(() => {
    const changes: { prayer: string, oldTime: string, newTime: string }[] = [];
    
    const prayerKeys: (keyof Pick<DayPrayerTimes, 'fajr' | 'zuhr' | 'asr' | 'maghrib' | 'isha'>)[] 
      = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'];
    
    prayerKeys.forEach(key => {
      const currentTime = currentDayData[key].iqamah;
      const nextTime = nextDayData[key].iqamah;
      
      if (currentTime !== nextTime) {
        changes.push({
          prayer: key.charAt(0).toUpperCase() + key.slice(1),
          oldTime: currentTime,
          newTime: nextTime
        });
      }
    });
    
    return changes;
  }, [currentDayData, nextDayData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nextIqamah = getNextIqamahTime(now);
      
      if (nextIqamah) {
        setNextPrayer(nextIqamah.prayerName);
        const diff = nextIqamah.time.getTime() - now.getTime();
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          
          setCountdown({ hours, minutes, seconds });
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getNextIqamahTime]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Prayer Times</h1>
          <p className="text-blue-100">
            {`${currentDayData.month}/${currentDayData.year} - ${currentDayData.day}, ${currentDayData.date}`}
          </p>
        </div>

        {/* Countdown Section */}
        <div className="bg-blue-50 p-4 text-center">
          {nextPrayer ? (
            <div>
              <p className="text-lg text-blue-900 mb-2">
                <RefreshCw className="inline-block mr-2 w-4 h-4 animate-spin" />
                Next: {nextPrayer} Iqamah
              </p>
              <p className="text-3xl font-bold text-blue-800">
                {String(countdown.hours).padStart(2, '0')}:
                {String(countdown.minutes).padStart(2, '0')}:
                {String(countdown.seconds).padStart(2, '0')}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">All iqamah times have passed.</p>
          )}
        </div>

        {/* Prayer Times Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-3 text-left font-semibold text-blue-900">Prayer</th>
                  <th className="p-3 text-left font-semibold text-blue-900">Azzan</th>
                  <th className="p-3 text-left font-semibold text-blue-900">Iqamah</th>
                </tr>
              </thead>
              <tbody>
                {prayerList.map((prayer) => (
                  <tr 
                    key={prayer.name} 
                    className="border-b last:border-b-0 hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-3 flex items-center space-x-2">
                      {prayer.icon}
                      <span className="font-medium text-gray-800">{prayer.name}</span>
                    </td>
                    <td className="p-3 text-gray-700">
                      {prayer.data.azzan || 'N/A'}
                    </td>
                    <td className="p-3 text-gray-700">
                      {prayer.data.iqamah || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Iqamah Changes */}
        {iqamahChanges.length > 0 && (
          <div className="bg-blue-50 p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              Iqamah Time Changes for {nextDayData.day} ({nextDayData.date})
            </h2>
            <div className="space-y-2">
              {iqamahChanges.map((change) => (
                <div 
                  key={change.prayer} 
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                >
                  <span className="font-medium text-blue-900">{change.prayer}</span>
                  <div className="flex items-center">
                    <span className="line-through text-red-500 mr-2 text-sm">{change.oldTime}</span>
                    <span className="text-green-600 font-semibold">{change.newTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerTimesCard;