import { useEffect, useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import prayerTimesData from '../data/prayerTimes.json';

interface DayPrayerTimes {
  date: string;
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
  const todayNumber = new Date().getDate().toString();
  
  const currentDayData = useMemo(() => 
    prayerTimes.find((day) => day.date === todayNumber) || prayerTimes[0], 
    [prayerTimes, todayNumber]
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
      for (let i = 0; i < prayerList.length; i++) {
        const iqamahTime = parseTimeForDate(prayerList[i].timeStr, now);
        if (iqamahTime && now < iqamahTime) {
          return { prayerName: prayerList[i].name, time: iqamahTime };
        }
      }
      return null;
    };
  }, [prayerList]);

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