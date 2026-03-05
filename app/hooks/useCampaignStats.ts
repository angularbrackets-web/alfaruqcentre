"use client";

import { useState, useEffect } from "react";

export interface CampaignStats {
  raised:             number;
  donations:          number;
  donationsLastHour:  number;
}

const DEFAULTS: CampaignStats = {
  raised:            4154,
  donations:         7,
  donationsLastHour: 0,
};

function fetchStats(set: (s: CampaignStats) => void) {
  fetch("/api/settings")
    .then((r) => r.json())
    .then((data: Record<string, string>) => {
      set({
        raised:            data.campaign_raised             ? Number(data.campaign_raised)              : DEFAULTS.raised,
        donations:         data.campaign_donations          ? Number(data.campaign_donations)           : DEFAULTS.donations,
        donationsLastHour: data.campaign_donations_last_hour ? Number(data.campaign_donations_last_hour) : DEFAULTS.donationsLastHour,
      });
    })
    .catch(() => {});
}

export function useCampaignStats(): CampaignStats {
  const [stats, setStats] = useState<CampaignStats>(DEFAULTS);

  useEffect(() => {
    fetchStats(setStats);
    const interval = setInterval(() => fetchStats(setStats), 60_000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
