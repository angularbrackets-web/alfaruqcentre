"use client";

import { useEffect, useState } from "react";
import IslamicReliefCampaignSection from "./home-v3/IslamicReliefCampaignSection";
import FundraiserBanner from "./home-v3/FundraiserBanner";
import MobileStickyBar from "./home-v2/MobileStickyBar";
import HeroV3 from "./home-v3/HeroV3";
import MissionQuoteBlock from "./home-v3/MissionQuoteBlock";
import GetConnectedSection from "./home-v3/GetConnectedSection";
import PrayerTimesV3 from "./home-v3/PrayerTimesV3";
import SchoolFeatureSection from "./home-v3/SchoolFeatureSection";
import DonationCTAV3 from "./home-v3/DonationCTAV3";
import ProgramsCarousel from "./home-v3/ProgramsCarousel";
import EventsCarousel from "./home-v3/EventsCarousel";

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

function parseTimeToday(timeStr: string): Date {
  const parts = timeStr.trim().split(" ");
  const meridiem = parts[1];
  const [hoursStr, minutesStr] = parts[0].split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function getNextPrayerInfo(
  prayers: DayPrayerTimes
): { name: string; time: string; minutesUntil: number } {
  const now = new Date();
  const prayerList = [
    { name: "Fajr",    time: prayers.fajr.iqamah,    parsed: parseTimeToday(prayers.fajr.iqamah)    },
    { name: "Dhuhr",   time: prayers.zuhr.iqamah,    parsed: parseTimeToday(prayers.zuhr.iqamah)    },
    { name: "Asr",     time: prayers.asr.iqamah,     parsed: parseTimeToday(prayers.asr.iqamah)     },
    { name: "Maghrib", time: prayers.maghrib.iqamah, parsed: parseTimeToday(prayers.maghrib.iqamah) },
    { name: "Isha",    time: prayers.isha.iqamah,    parsed: parseTimeToday(prayers.isha.iqamah)    },
  ];
  for (const p of prayerList) {
    if (now < p.parsed) {
      return { name: p.name, time: p.time, minutesUntil: Math.floor((p.parsed.getTime() - now.getTime()) / 60000) };
    }
  }
  return { name: "Fajr", time: prayers.fajr.iqamah, minutesUntil: 0 };
}

export default function Home() {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<DayPrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; minutesUntil: number }>(
    { name: "Loading", time: "", minutesUntil: 0 }
  );

  useEffect(() => {
    fetch("/api/prayerTimes")
      .then((res) => res.json())
      .then((data: DayPrayerTimes[]) => {
        const now = new Date();
        const today = data.find(
          (t) =>
            t.date === String(now.getDate()) &&
            t.month === String(now.getMonth() + 1) &&
            t.year === String(now.getFullYear())
        );
        if (today) {
          setPrayerTimes(today);
          setNextPrayer(getNextPrayerInfo(today));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;
    const interval = setInterval(() => setNextPrayer(getNextPrayerInfo(prayerTimes)), 60_000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <div className="min-h-screen bg-white">
      {/* ── IRC RAMADAN CAMPAIGN (temporary) ────────────────────────────────────
          When campaign ends: remove <IslamicReliefCampaignSection />.
          Update numbers in IslamicReliefCampaignSection.tsx → CAMPAIGN config.
      ─────────────────────────────────────────────────────────────────────── */}
      <IslamicReliefCampaignSection />

      {/* ── FUNDRAISER BANNER (temporary) ──────────────────────────────────────
          When the fundraiser ends: remove <FundraiserBanner />.
          Update assets in FundraiserBanner.tsx CONFIG block before reusing.
      ─────────────────────────────────────────────────────────────────────── */}
      <FundraiserBanner dismissed={bannerDismissed} onDismiss={() => setBannerDismissed(true)} />

      <HeroV3
        nextPrayerName={nextPrayer.name}
        minutesUntil={nextPrayer.minutesUntil}
        noTopPadding={true}
      />

      <ProgramsCarousel />
      <EventsCarousel />
      <MissionQuoteBlock />
      <GetConnectedSection />
      <PrayerTimesV3 prayerTimes={prayerTimes} />
      <SchoolFeatureSection />
      <DonationCTAV3 />

      <MobileStickyBar prayerTimes={prayerTimes} />
    </div>
  );
}
