export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface WeeklyClass {
  id: string;
  name: string;
  days: DayOfWeek[];
  startTime: string;
  endTime?: string;
  audience?: string;
  category: "quran" | "arabic" | "weekend-school" | "series";
}

export const WEEKLY_SCHEDULE: WeeklyClass[] = [
  {
    id: "arabic-mon",
    name: "Arabic Class",
    days: ["Mon"],
    startTime: "5:00 PM",
    endTime: "6:15 PM",
    audience: "Sisters",
    category: "arabic",
  },
  {
    id: "tarteel-adults",
    name: "Tarteel Quran for Adults",
    days: ["Mon", "Thu"],
    startTime: "TBD",
    audience: "All",
    category: "quran",
  },
  {
    id: "arabic-fri",
    name: "Arabic Class",
    days: ["Fri"],
    startTime: "6:30 PM",
    endTime: "9:00 PM",
    audience: "Sisters",
    category: "arabic",
  },
  {
    id: "weekend-school",
    name: "Al-Faruq Weekend School",
    days: ["Sat", "Sun"],
    startTime: "11:00 AM",
    endTime: "2:00 PM",
    audience: "All",
    category: "weekend-school",
  },
  {
    id: "manners-series",
    name: "Manners & Etiquettes Series",
    days: ["Sun"],
    startTime: "8:00 PM",
    audience: "All",
    category: "series",
  },
];

export const DAYS_ORDERED: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const DAY_TO_JS_INDEX: Record<DayOfWeek, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export const DAY_FULL_LABELS: Record<DayOfWeek, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};
