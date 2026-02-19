import { useMemo } from 'react';

type DayPrayerTimes = {
  date: string;
  month: string;
  year: string;
  dst: boolean;
  fajr: { iqamah: string };
  zuhr: { iqamah: string };
  asr: { iqamah: string };
  maghrib: { iqamah: string };
  isha: { iqamah: string };
};

interface IqamahChangesProps {
  prayerTimes: DayPrayerTimes[];
}

const IqamahChanges = ({ prayerTimes }: IqamahChangesProps) => {
  const today = useMemo(() => new Date(), []);
  const currentDay = useMemo(() => today.getDate().toString(), [today]);
  const currentMonth = useMemo(() => (today.getMonth() + 1).toString().replace(/^0/, ''), [today]);
  const currentYear = useMemo(() => today.getFullYear().toString(), [today]);

  const currentDayData = useMemo(() =>
    prayerTimes.find((day) => day.date === currentDay && day.month === currentMonth && day.year === currentYear),
    [currentDay, currentMonth, currentYear, prayerTimes]
  );

  const nextDayData = useMemo(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();
    const tomorrowMonth = (tomorrow.getMonth() + 1).toString().replace(/^0/, '');
    const tomorrowYear = tomorrow.getFullYear().toString();

    return prayerTimes.find((day) =>
      day.date === tomorrowDay &&
      day.month === tomorrowMonth &&
      day.year === tomorrowYear
    );
  }, [today, prayerTimes]);

  const iqamahChanges = useMemo(() => {
    const changes: { prayer: string, oldTime: string, newTime: string }[] = [];

    // If we don't have current or next day's data, return empty changes
    if (!currentDayData || !nextDayData) {
      return changes;
    }

    const prayerKeys: (keyof Pick<DayPrayerTimes, 'fajr' | 'zuhr' | 'asr' | 'maghrib' | 'isha'>)[]
      = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'];

    prayerKeys.forEach(key => {
      try {
        const currentTime = currentDayData[key]?.iqamah;
        const nextTime = nextDayData[key]?.iqamah;

        // Only add to changes if both times exist and are different
        if (currentTime && nextTime && currentTime !== nextTime) {
          changes.push({
            prayer: key.charAt(0).toUpperCase() + key.slice(1),
            oldTime: currentTime,
            newTime: nextTime
          });
        }
      } catch (error) {
        console.warn(`Error processing prayer time changes for ${key}:`, error);
      }
    });

    return changes;
  }, [currentDayData, nextDayData]);

  const isDSTTransition = useMemo(() => {
    if (!currentDayData || !nextDayData) return false;
    return currentDayData.dst !== nextDayData.dst;
  }, [currentDayData, nextDayData]);

  if (iqamahChanges.length === 0 && !isDSTTransition) {
    return null;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2 text-purple-900 text-center">
        {isDSTTransition
          ? `Daylight Saving Time starts tomorrow!`
          : `Iqamah Time Changes for tomorrow`}
      </h2>

      {isDSTTransition && (
        <p className="text-sm text-amber-700 text-center mb-4 font-medium italic">
          Clocks move forward by 1 hour. All times below reflect the new schedule.
        </p>
      )}

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