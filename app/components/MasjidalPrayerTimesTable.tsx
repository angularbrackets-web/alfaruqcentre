"use client";
import React from "react";

interface PrayerTime {
  name_en: string;
  name_ar: string;
  adhan: string;
  iqama?: string;
  isJummah?: boolean;
}

interface PrayerTimesTableProps {
  prayerTimesData: PrayerTime[];
  englishDate: string | null;
  hijriDateEnglish: string | null;
  hijriDateArabic: string | null; // Added for Arabic Hijri date
}

const arabicHijriMonths = [
  "مُحَرَّم", "صَفَر", "رَبيع الأوّل", "رَبيع الثاني", "جُمادى الأولى", "جُمادى الآخرة",
  "رَجَب", "شَعْبان", "رَمَضان", "شَوّال", "ذو القعدة", "ذو الحجة"
];

const arabicNumbers = [
  '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠',
  '١١', '١٢', '١٣', '١٤', '١٥', '١٦', '١٧', '١٨', '١٩', '٢٠',
  '٢١', '٢٢', '٢٣', '٢٤', '٢٥', '٢٦', '٢٧', '٢٨', '٢٩', '٣٠'
];

const getArabicHijriDate = (hijriDateEnglish: string): string => {
  if (!hijriDateEnglish) return "";
  const parts = hijriDateEnglish.split(", "); // Split "Shaban 17, 1446" into ["Shaban 17", "1446"]
  const monthDay = parts[0].split(" "); // Split "Shaban 17" into ["Shaban", "17"]
  const monthEnglish = monthDay[0];
  const dayNumberEnglish = parseInt(monthDay[1], 10);
  const yearArabic = parts[1].split("").map(digit => arabicNumbers[parseInt(digit)]).join(""); // Convert year digits to Arabic numerals

  const monthIndex = arabicHijriMonths.findIndex(month => monthEnglish.startsWith(month.substring(0, 3))); // Match month by first 3 letters
  const monthArabic = monthIndex !== -1 ? arabicHijriMonths[monthIndex] : monthEnglish; // Fallback to English month name if not found

  const dayNumberArabic = dayNumberEnglish > 0 && dayNumberEnglish <= 30 ? arabicNumbers[dayNumberEnglish] : String(dayNumberEnglish); // Convert day number to Arabic numerals

  return `${monthArabic} ${dayNumberArabic}، ${yearArabic}`; // Construct Arabic Hijri date string
};


const PrayerTimesTable: React.FC<PrayerTimesTableProps> = ({
  prayerTimesData,
  englishDate,
  hijriDateEnglish,
  hijriDateArabic,
}) => {
  return (
    <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-700 py-6 px-6">
        <h3 className="text-xl font-bold text-white text-center">
          Prayer Timetable{" "}
          <span className="text-sm text-gray-300">(مواقيت الصلاة)</span>
        </h3>
        {(englishDate && hijriDateEnglish && hijriDateArabic) && (
          <div className="text-center mt-2">
            <p className="text-white text-sm">{englishDate}</p>
            <p className="text-white text-sm font-arabic">
              {hijriDateEnglish} <span className="text-sm">({hijriDateArabic})</span>
            </p>
          </div>
        )}
      </div>
      <table className="min-w-full divide-y divide-gray-700 bg-gray-100 text-xl">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left font-semibold text-white uppercase tracking-wider"
            >
              Prayer <span> (الصلاة)</span>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center font-semibold text-white uppercase tracking-wider"
              colSpan={2}
            >
              {!prayerTimesData.some((prayer) => prayer.isJummah) ? (
                <>
                  Adhan <span> (الأذان)</span> / Iqama <span> (إقامة)</span>
                </>
              ) : (
                <>
                  Time <span> (الوقت)</span>
                </>
              )}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {prayerTimesData.map((prayer, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                {prayer.name_en} <span>({prayer.name_ar})</span>
              </td>
              {prayer.isJummah ? (
                <td
                  colSpan={2}
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-900 font-mono"
                >
                  {prayer.adhan}
                </td>
              ) : (
                <>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900 font-mono">
                    {prayer.adhan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900 font-mono">
                    {prayer.iqama}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MasjidalPrayerTimesTable: React.FC = () => {
  const [prayerTimesData, setPrayerTimesData] = React.useState<PrayerTime[]>([]);
  const [englishDate, setEnglishDate] = React.useState<string | null>(null);
  const [hijriDateEnglish, setHijriDateEnglish] = React.useState<string | null>(null);
  const [hijriDateArabic, setHijriDateArabic] = React.useState<string | null>(null);


  React.useEffect(() => {
    const masjidalGetPrayerTimesUrl = 'https://masjidal.com/api/v1/time/range?masjid_id=nL1Zq8Aa';
    fetch(masjidalGetPrayerTimesUrl)
      .then(response => response.json())
      .then(masjidalPrayerTimes => {
        if (
          masjidalPrayerTimes.data &&
          masjidalPrayerTimes.data.salah &&
          masjidalPrayerTimes.data.iqamah
        ) {
          const salah = masjidalPrayerTimes.data.salah[0];
          const iqamah = masjidalPrayerTimes.data.iqamah[0];

          setEnglishDate(salah.date);
          setHijriDateEnglish(`${salah.hijri_month} ${salah.hijri_date}, ${salah.hijri_year}`);
          setHijriDateArabic(getArabicHijriDate(`${salah.hijri_month} ${salah.hijri_date}, ${salah.hijri_year}`));


          const prayerData: PrayerTime[] = [
            {
              name_en: "Fajr",
              name_ar: "الفجر",
              adhan: salah.fajr,
              iqama: iqamah.fajr,
            },
            {
              name_en: "Sunrise",
              name_ar: "الشروق",
              adhan: salah.sunrise,
              iqama: salah.sunrise,
            },
            {
              name_en: "Zuhr",
              name_ar: "الظهر",
              adhan: salah.zuhr,
              iqama: iqamah.zuhr,
            },
            {
              name_en: "Asr",
              name_ar: "العصر",
              adhan: salah.asr,
              iqama: iqamah.asr,
            },
            {
              name_en: "Maghrib",
              name_ar: "المغرب",
              adhan: salah.maghrib,
              iqama: iqamah.maghrib,
            },
            {
              name_en: "Isha",
              name_ar: "العشاء",
              adhan: salah.isha,
              iqama: iqamah.isha,
            },
            {
              name_en: "Jummah 1",
              name_ar: "الجمعة 1",
              adhan: iqamah.jummah1,
              isJummah: true,
            },
            {
              name_en: "Jummah 2",
              name_ar: "الجمعة 2",
              adhan: iqamah.jummah2,
              isJummah: true,
            },
          ];
          setPrayerTimesData(prayerData);
        }
      })
      .catch(error => {
        console.error("Error fetching prayer times from Masjidal API:", error);
      });
  }, []);

  return (
    <PrayerTimesTable
      prayerTimesData={prayerTimesData}
      englishDate={englishDate}
      hijriDateEnglish={hijriDateEnglish}
      hijriDateArabic={hijriDateArabic}
    />
  );
};

export default MasjidalPrayerTimesTable;