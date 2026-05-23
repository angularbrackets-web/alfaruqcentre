"use client";

import { useEffect } from "react";

const HOUR_MS = 60 * 60 * 1000;
const VIDEO_RETRY_MS = 5 * 60 * 1000;

function isAnyVideoPlaying(): boolean {
  if (typeof document === "undefined") return false;
  const videos = document.querySelectorAll("video");
  for (const v of Array.from(videos)) {
    if (!v.paused && !v.ended && v.currentTime > 0) return true;
  }
  return false;
}

export default function TVAutoRefresh({ intervalMs = HOUR_MS }: { intervalMs?: number }) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const schedule = (delay: number) => {
      timer = setTimeout(() => {
        if (isAnyVideoPlaying()) {
          schedule(VIDEO_RETRY_MS);
        } else {
          window.location.reload();
        }
      }, delay);
    };

    schedule(intervalMs);
    return () => clearTimeout(timer);
  }, [intervalMs]);

  return null;
}
