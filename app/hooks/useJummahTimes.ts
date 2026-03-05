"use client";

import { useState, useEffect } from "react";
import { JUMMAH_FALLBACK } from "@/app/data/jummahTimes";

export interface JummahSlot {
  label: string; // "1st Jummah", "2nd Jummah"
  name:  string; // "Jummah I", "Jummah II"
  time:  string; // e.g. "1:15 PM"
}

export function useJummahTimes(): JummahSlot[] {
  const [slots, setSlots] = useState<JummahSlot[]>([
    { label: "1st Jummah", name: "Jummah I",  time: JUMMAH_FALLBACK.jummah1 },
    { label: "2nd Jummah", name: "Jummah II", time: JUMMAH_FALLBACK.jummah2 },
  ]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setSlots([
          { label: "1st Jummah", name: "Jummah I",  time: data.jummah1Time || JUMMAH_FALLBACK.jummah1 },
          { label: "2nd Jummah", name: "Jummah II", time: data.jummah2Time || JUMMAH_FALLBACK.jummah2 },
        ]);
      })
      .catch(() => {});
  }, []);

  return slots;
}
