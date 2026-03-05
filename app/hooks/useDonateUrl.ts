"use client";

import { useState, useEffect } from "react";

const FALLBACK_URL = "https://donorchoice.ca/dia";

export function useDonateUrl(): string {
  const [url, setUrl] = useState(FALLBACK_URL);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { if (data.donateUrl) setUrl(data.donateUrl); })
      .catch(() => {});
  }, []);

  return url;
}
