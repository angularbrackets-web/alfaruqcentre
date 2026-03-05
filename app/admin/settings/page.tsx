'use client';

import { useState, useEffect } from 'react';
import { Link2, TrendingUp, Clock, QrCode, ExternalLink, BookOpen, Plus, Trash2, Eye, LayoutList } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface DonationQuote {
  type: 'quran' | 'hadith';
  arabic: string;
  translation: string;
  reference: string;
}

// ─── Next Prayer Bar Toggle ───────────────────────────────────────────────────

function NextPrayerBarSection() {
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data.showNextPrayerBar === 'false') setShow(false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(value: boolean) {
    setSaving(true);
    setMessage(null);
    setShow(value);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'showNextPrayerBar', value: String(value) }),
      });
      setMessage(res.ok
        ? { type: 'success', text: 'Saved. Changes are live on the site.' }
        : { type: 'error', text: 'Failed to save. Please try again.' }
      );
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-1 flex items-center gap-2">
          <Eye className="h-5 w-5 text-gray-400" />
          Next Prayer Countdown Bar
        </h3>
        <p className="text-sm text-gray-500 mb-1">
          Show or hide the &ldquo;Next Prayer&rdquo; countdown strip in the navbar (the bar showing the prayer name, live timer, and Hijri date).
        </p>
        <p className="text-xs text-blue-500 font-medium mb-6">Saves automatically when you select an option.</p>

        {loading ? (
          <div className="h-10 bg-gray-100 rounded animate-pulse w-48" />
        ) : (
          <div className="space-y-3">
            <div className="flex gap-6">
              {[{ label: 'Show', value: true }, { label: 'Hide', value: false }].map(({ label, value }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="showNextPrayerBar"
                    checked={show === value}
                    onChange={() => handleSave(value)}
                    disabled={saving}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Campaign Display Mode ────────────────────────────────────────────────────

function CampaignDisplaySection() {
  const [mode, setMode] = useState<'default' | 'medium' | 'compact'>('default');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data.campaignDisplayMode === 'compact') setMode('compact');
        else if (data.campaignDisplayMode === 'medium') setMode('medium');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(value: 'default' | 'medium' | 'compact') {
    setSaving(true);
    setMessage(null);
    setMode(value);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'campaignDisplayMode', value }),
      });
      setMessage(res.ok
        ? { type: 'success', text: 'Saved. Changes are live on the site.' }
        : { type: 'error', text: 'Failed to save. Please try again.' }
      );
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-1 flex items-center gap-2">
          <LayoutList className="h-5 w-5 text-gray-400" />
          Campaign Section Display
        </h3>
        <p className="text-sm text-gray-500 mb-1">
          Choose how the Ramadan matching campaign appears on the home page.
        </p>
        <p className="text-xs text-blue-500 font-medium mb-6">Saves automatically when you select an option.</p>

        {loading ? (
          <div className="h-10 bg-gray-100 rounded animate-pulse w-64" />
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              {([
                {
                  value: 'default',
                  label: 'Default',
                  desc: 'Full two-column layout with headline, description, progress card, and all stat tiles.',
                },
                {
                  value: 'medium',
                  label: 'Medium',
                  desc: 'Two-column compact layout: logo + headline left, progress + stats right. No description.',
                },
                {
                  value: 'compact',
                  label: 'Compact',
                  desc: 'Single-row banner: raised amount, inline progress bar, and Donate button only.',
                },
              ] as const).map(({ value, label, desc }: { value: 'default' | 'medium' | 'compact'; label: string; desc: string }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSave(value)}
                  disabled={saving}
                  className={`text-left p-3 rounded-lg border-2 transition-colors duration-150 ${
                    mode === value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{label}</p>
                  <p className="text-xs text-gray-500 leading-snug">{desc}</p>
                </button>
              ))}
            </div>
            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Donate URL ───────────────────────────────────────────────────────────────

function DonateUrlSection() {
  const [donateUrl, setDonateUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setDonateUrl(data.donateUrl || 'https://donorchoice.ca/dia'))
      .catch(() => setDonateUrl('https://donorchoice.ca/dia'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'donateUrl', value: donateUrl }),
      });
      setMessage(res.ok
        ? { type: 'success', text: 'Saved successfully.' }
        : { type: 'error',   text: 'Failed to save. Please try again.' }
      );
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-1 flex items-center gap-2">
          <Link2 className="h-5 w-5 text-gray-400" />
          Donation Link
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          The URL used for all &ldquo;Donate&rdquo; buttons across the site (navbar, footer, banners, etc.)
        </p>

        {loading ? (
          <div className="h-10 bg-gray-100 rounded animate-pulse w-full max-w-lg" />
        ) : (
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <div>
              <label htmlFor="donateUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Donate URL
              </label>
              <input
                id="donateUrl"
                type="url"
                value={donateUrl}
                onChange={(e) => setDonateUrl(e.target.value)}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://donorchoice.ca/dia"
              />
            </div>

            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
                text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Jummah Times ─────────────────────────────────────────────────────────────

function JummahTimesSection() {
  const [jummah1, setJummah1] = useState('');
  const [jummah2, setJummah2] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setJummah1(data.jummah1Time || '1:15 PM');
        setJummah2(data.jummah2Time || '2:15 PM');
      })
      .catch(() => {
        setJummah1('1:15 PM');
        setJummah2('2:15 PM');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await Promise.all([
        fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'jummah1Time', value: jummah1 }) }),
        fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'jummah2Time', value: jummah2 }) }),
      ]);
      setMessage({ type: 'success', text: 'Jummah times saved. Changes are live on the site.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-1 flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          Jummah Prayer Times
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Set the time for each Friday Jummah prayer. Use 12-hour format, e.g. <code className="bg-gray-100 px-1 rounded">1:15 PM</code>.
          These times appear in the navbar, prayer times page, home page, and footer.
        </p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse w-full max-w-xs" />)}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="jummah1Time" className="block text-sm font-medium text-gray-700 mb-1">
                  1st Jummah Time
                </label>
                <input
                  id="jummah1Time"
                  type="text"
                  value={jummah1}
                  onChange={(e) => setJummah1(e.target.value)}
                  required
                  placeholder="1:15 PM"
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="jummah2Time" className="block text-sm font-medium text-gray-700 mb-1">
                  2nd Jummah Time
                </label>
                <input
                  id="jummah2Time"
                  type="text"
                  value={jummah2}
                  onChange={(e) => setJummah2(e.target.value)}
                  required
                  placeholder="2:15 PM"
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
                text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Jummah Times'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Ramadan Campaign Stats ───────────────────────────────────────────────────

function CampaignStatsSection() {
  const [raised, setRaised] = useState('');
  const [donations, setDonations] = useState('');
  const [donationsLastHour, setDonationsLastHour] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setRaised(data.campaign_raised             ?? '4154');
        setDonations(data.campaign_donations        ?? '7');
        setDonationsLastHour(data.campaign_donations_last_hour ?? '0');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function save(key: string, value: string) {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) throw new Error('Failed');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await Promise.all([
        save('campaign_raised',              raised),
        save('campaign_donations',           donations),
        save('campaign_donations_last_hour', donationsLastHour),
      ]);
      setMessage({ type: 'success', text: 'Campaign stats updated. Changes are live on the site.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-1 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gray-400" />
          Ramadan Campaign Stats
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Update these numbers from the{' '}
          <a
            href="https://fundraise.islamicreliefcanada.org/en_US/campaign/support-sahaba-and-al-faruq-mosque-3952#attr="
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Islamic Relief Canada campaign page
          </a>
          . Changes reflect immediately on the home page (desktop &amp; mobile).
        </p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse w-full max-w-xs" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="campaign_raised" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Raised (CAD)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">$</span>
                  <input
                    id="campaign_raised"
                    type="number"
                    min="0"
                    step="0.01"
                    value={raised}
                    onChange={(e) => setRaised(e.target.value)}
                    required
                    className="block w-full border border-gray-300 rounded-md shadow-sm pl-7 pr-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="4154"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="campaign_donations" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Donations
                </label>
                <input
                  id="campaign_donations"
                  type="number"
                  min="0"
                  step="1"
                  value={donations}
                  onChange={(e) => setDonations(e.target.value)}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="7"
                />
              </div>

              <div>
                <label htmlFor="campaign_donations_last_hour" className="block text-sm font-medium text-gray-700 mb-1">
                  Donations (last hour)
                </label>
                <input
                  id="campaign_donations_last_hour"
                  type="number"
                  min="0"
                  step="1"
                  value={donationsLastHour}
                  onChange={(e) => setDonationsLastHour(e.target.value)}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
                text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Update Campaign Stats'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Donation Quotes ──────────────────────────────────────────────────────────

const EMPTY_QUOTE: DonationQuote = { type: 'quran', arabic: '', translation: '', reference: '' };

const DEFAULT_QUOTES: DonationQuote[] = [
  {
    type: 'quran',
    arabic: 'وَأَنفِقُوا فِي سَبِيلِ اللَّهِ وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ',
    translation: 'And spend in the way of Allah and do not throw yourselves into destruction…',
    reference: 'Al-Quran 2:195',
  },
  {
    type: 'hadith',
    arabic: '',
    translation: 'Whoever builds a mosque for the sake of Allah — even if it is as small as a bird\'s nest — Allah will build for him a house in Paradise.',
    reference: 'Sahih al-Bukhari & Muslim',
  },
];

function DonationQuotesSection() {
  const [quotes, setQuotes] = useState<DonationQuote[]>(DEFAULT_QUOTES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data.donationQuotes) {
          const parsed = JSON.parse(data.donationQuotes);
          if (Array.isArray(parsed) && parsed.length > 0) setQuotes(parsed);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateQuote(index: number, field: keyof DonationQuote, value: string) {
    setQuotes((prev) => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  }

  function addQuote() {
    setQuotes((prev) => [...prev, { ...EMPTY_QUOTE }]);
  }

  function removeQuote(index: number) {
    setQuotes((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'donationQuotes', value: JSON.stringify(quotes) }),
      });
      setMessage(res.ok
        ? { type: 'success', text: 'Quotes saved. Changes are live on the site.' }
        : { type: 'error', text: 'Failed to save. Please try again.' }
      );
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-1 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-400" />
          Donation Section — Quran &amp; Hadith Quotes
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          These quotes rotate every 8 seconds in the donation section on the home page.
          Each entry can be a Quranic verse (with optional Arabic text) or a Hadith.
        </p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="h-28 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {quotes.map((quote, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quote {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeQuote(index)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove quote"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Type */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name={`type-${index}`}
                      value="quran"
                      checked={quote.type === 'quran'}
                      onChange={() => updateQuote(index, 'type', 'quran')}
                      className="text-blue-600"
                    />
                    Quranic Verse
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name={`type-${index}`}
                      value="hadith"
                      checked={quote.type === 'hadith'}
                      onChange={() => updateQuote(index, 'type', 'hadith')}
                      className="text-blue-600"
                    />
                    Hadith
                  </label>
                </div>

                {/* Arabic (optional) */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Arabic Text <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={quote.arabic}
                    onChange={(e) => updateQuote(index, 'arabic', e.target.value)}
                    rows={2}
                    dir="rtl"
                    placeholder="اكتب النص العربي هنا..."
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  />
                </div>

                {/* Translation */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    English Translation <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={quote.translation}
                    onChange={(e) => updateQuote(index, 'translation', e.target.value)}
                    rows={2}
                    required
                    placeholder="Enter English translation..."
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Reference */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Reference <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={quote.reference}
                    onChange={(e) => updateQuote(index, 'reference', e.target.value)}
                    required
                    placeholder="e.g. Al-Quran 2:195 or Sahih al-Bukhari"
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuote}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Another Quote
            </button>

            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
                text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Quotes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── QR Card ──────────────────────────────────────────────────────────────────

function QRCardSection() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-1 flex items-center gap-2">
          <QrCode className="h-5 w-5 text-gray-400" />
          Islamic Relief Canada — Matching Gift QR Card
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          A print-ready portrait card with a QR code linking to the Islamic Relief Canada matching gift campaign.
          Print and display at the masjid to encourage donations.
        </p>

        {/* Preview thumbnail */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm" style={{ width: '192px', height: '288px' }}>
            <iframe
              src="/qr-card"
              title="QR Card Preview"
              style={{ width: '384px', height: '576px', transform: 'scale(0.5)', transformOrigin: '0 0', border: 'none', pointerEvents: 'none' }}
            />
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <p className="text-sm text-gray-600 max-w-xs">
              Card size: <strong>4 × 6 inches</strong> (postcard). Works on any printer.
              For best results, print at 100% scale on 4×6 photo paper or card stock.
            </p>
            <p className="text-sm text-gray-600 max-w-xs">
              QR code links to the{' '}
              <a
                href="https://fundraise.islamicreliefcanada.org/en_US/campaign/support-sahaba-and-al-faruq-mosque-3952#attr="
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                IRC matching gift campaign
              </a>
              . For every $2 donated, IRC matches $1.
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="/qr-card"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm
                  text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ExternalLink className="h-4 w-4" />
                Open Print View
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSettings() {
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Site Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage global configuration for the website
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <NextPrayerBarSection />
        <CampaignDisplaySection />
        <JummahTimesSection />
        <DonateUrlSection />
        <DonationQuotesSection />
        <CampaignStatsSection />
        <QRCardSection />
      </div>
    </div>
  );
}
