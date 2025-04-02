import { useEffect, useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import prayerTimesData from '../data/prayerTimes.json';

interface DayPrayerTimes {
  date: string;
  month: string;
  year: string;
  fajr: { iqamah: string };
  zuhr: { iqamah: string };
  asr: { iqamah: string };
  maghrib: { iqamah: string };
  isha: { iqamah: string };
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

const CountdownTimer = () => {
  const prayerTimes: DayPrayerTimes[] = prayerTimesData;
  const today = new Date();
    const currentDay = today.getDate().toString();
    const currentMonth = (today.getMonth() + 1).toString().replace(/^0/, '');
    const currentYear = today.getFullYear().toString();
  
    const currentDayData: DayPrayerTimes = useMemo(() => 
      prayerTimes.find((day) => day.date === currentDay && day.month === currentMonth && day.year === currentYear) || prayerTimes[0], 
      [currentDay, currentMonth, currentYear, prayerTimes]
    );

  const prayerList = useMemo(() => [
    { name: 'Fajr', timeStr: currentDayData.fajr.iqamah },
    { name: 'Zuhr', timeStr: currentDayData.zuhr.iqamah },
    { name: 'Asr', timeStr: currentDayData.asr.iqamah },
    { name: 'Maghrib', timeStr: currentDayData.maghrib.iqamah },
    { name: 'Isha', timeStr: currentDayData.isha.iqamah }
  ], [currentDayData]);

  const getNextIqamahTime = useMemo(() => {
    return (now: Date) => {
      // Check for upcoming prayers in the current day.
      for (let i = 0; i < prayerList.length; i++) {
        const iqamahTime = parseTimeForDate(prayerList[i].timeStr, now);
        if (iqamahTime && now < iqamahTime) {
          return { prayerName: prayerList[i].name, time: iqamahTime };
        }
      }
      // If no upcoming prayer is found, it means Isha has passed for today.
      // Calculate tomorrow's Fajr iqamah time.
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      const tomorrowNumber = tomorrow.getDate().toString();
      const tomorrowData = prayerTimes.find(day => day.date === tomorrowNumber) || prayerTimes[0];
      const fajrTimeTomorrow = parseTimeForDate(tomorrowData.fajr.iqamah, tomorrow);
      if (fajrTimeTomorrow) {
        return { prayerName: 'Fajr', time: fajrTimeTomorrow };
      }
      return null;
    };
  }, [prayerList, prayerTimes]);

  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0, 
    minutes: 0, 
    seconds: 0
  });
  const [nextPrayer, setNextPrayer] = useState<string>('');

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
    <div className="p-1 text-center">
      {nextPrayer ? (
        <div>
          <p className="text-lg text-purple-900">
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
  );
};

export default CountdownTimer;
