import { useMemo } from 'react';
import prayerTimesData from '../data/prayerTimes.json';

type DayPrayerTimes = {
  date: string;
  fajr: { iqamah: string };
  zuhr: { iqamah: string };
  asr: { iqamah: string };
  maghrib: { iqamah: string };
  isha: { iqamah: string };
};

const IqamahChanges = () => {
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

  if (iqamahChanges.length === 0) {
    return null;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-purple-900 text-center">
        Iqamah Time Changes for tomorrow
      </h2>
      <div className="space-y-1">
        {iqamahChanges.map((change) => (
          <div 
            key={change.prayer} 
            className="flex items-center justify-between p-1 bg-white rounded-lg shadow-sm"
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
  );
};

export default IqamahChanges;