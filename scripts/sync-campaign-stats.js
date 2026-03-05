#!/usr/bin/env node
/**
 * sync-campaign-stats.js
 *
 * Scrapes the Islamic Relief Canada fundraising page and updates
 * the Al-Faruq Centre website with the latest campaign stats.
 *
 * Requires:
 *   SITE_URL      - Base URL of the site (default: https://www.alfaruqcentre.com)
 *   CRON_SECRET   - Must match the CRON_SECRET env var on the server
 *
 * Usage:
 *   node scripts/sync-campaign-stats.js
 *
 * Cron (every minute):
 *   * * * * * cd /path/to/project && node scripts/sync-campaign-stats.js >> /var/log/campaign-sync.log 2>&1
 */

'use strict';

const { chromium } = require('playwright');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────

// Load .env.local if it exists (for local runs)
try {
  const fs = require('fs');
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (match) process.env[match[1]] ??= match[2].replace(/^["']|["']$/g, '');
    }
  }
} catch {
  // Not critical — env vars may be set by the OS
}

const CAMPAIGN_URL =
  'https://fundraise.islamicreliefcanada.org/en_US/campaign/support-sahaba-and-al-faruq-mosque-3952';
const SITE_URL = (process.env.SITE_URL || 'https://www.alfaruqcentre.com').replace(/\/$/, '');
const CRON_SECRET = process.env.CRON_SECRET || '';
const SETTINGS_API = `${SITE_URL}/api/settings`;

// ── Scraper ───────────────────────────────────────────────────────────────────

async function scrapeCampaignStats() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    // Use 'load' instead of 'networkidle' — fundraising pages have perpetual
    // background requests (live counters, analytics) that never fully settle.
    await page.goto(CAMPAIGN_URL, { waitUntil: 'load', timeout: 45_000 });

    // Wait up to 15 s for the JS-rendered donation amount to appear.
    await page.waitForFunction(
      () => document.body.innerText.includes('raised'),
      { timeout: 15_000 }
    ).catch(() => {
      // Continue anyway — we'll extract whatever is on the page.
    });

    const stats = await page.evaluate(() => {
      const text = document.body.innerText;

      // "$4,154.00 raised" — grab numeric value only (strip $ and commas)
      const raisedMatch = text.match(/\$([\d,]+(?:\.\d{1,2})?)\s+raised/i);
      const raised = raisedMatch
        ? Math.round(parseFloat(raisedMatch[1].replace(/,/g, '')))
        : null;

      // "7 donations" but NOT "7 donations in the last hour"
      const donationsMatch = text.match(/\b(\d+)\s+donations?(?!\s+in\s+the)/i);
      const totalDonations = donationsMatch ? parseInt(donationsMatch[1], 10) : null;

      // "2 donations in the last hour"
      const lastHourMatch = text.match(/\b(\d+)\s+donations?\s+in\s+the\s+last\s+hour/i);
      const donationsLastHour = lastHourMatch ? parseInt(lastHourMatch[1], 10) : null;

      return { raised, totalDonations, donationsLastHour };
    });

    return stats;
  } finally {
    await browser.close();
  }
}

// ── API updater ───────────────────────────────────────────────────────────────

async function updateSetting(key, value) {
  const res = await fetch(SETTINGS_API, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(CRON_SECRET ? { 'x-cron-secret': CRON_SECRET } : {}),
    },
    body: JSON.stringify({ key, value: String(value) }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status} updating ${key}: ${body}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const ts = () => new Date().toISOString();

  console.log(`[${ts()}] Starting campaign stats sync`);
  console.log(`[${ts()}] Source: ${CAMPAIGN_URL}`);
  console.log(`[${ts()}] Target: ${SETTINGS_API}`);

  let stats;
  try {
    stats = await scrapeCampaignStats();
  } catch (err) {
    console.error(`[${ts()}] Scrape failed: ${err.message}`);
    process.exit(1);
  }

  const { raised, totalDonations, donationsLastHour } = stats;
  console.log(`[${ts()}] Scraped — raised: ${raised}, donations: ${totalDonations}, last hour: ${donationsLastHour}`);

  if (raised === null && totalDonations === null && donationsLastHour === null) {
    console.error(`[${ts()}] No data extracted — page structure may have changed`);
    process.exit(1);
  }

  try {
    const updates = [];
    if (raised !== null)           updates.push(updateSetting('campaign_raised',              raised));
    if (totalDonations !== null)   updates.push(updateSetting('campaign_donations',           totalDonations));
    if (donationsLastHour !== null) updates.push(updateSetting('campaign_donations_last_hour', donationsLastHour));

    await Promise.all(updates);
    console.log(`[${ts()}] Settings updated successfully`);
  } catch (err) {
    console.error(`[${ts()}] API update failed: ${err.message}`);
    process.exit(1);
  }
}

main();
