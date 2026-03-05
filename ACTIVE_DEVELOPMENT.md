# Active Feature Development Log

> **⚠️ IMPORTANT**: This file tracks only the CURRENT feature being developed. Once complete, move content to feature-specific archive.

## 🎯 CURRENT FEATURE
**Feature Name**: home-v3 Vous Church Editorial Redesign
**Started**: 2026-03-03
**Status**: ✅ COMPLETE — ready for visual QA
**Priority**: High

---

## 📋 WHAT WAS DONE THIS SESSION

### Goal
Redesign `home-v3` (NavbarV3 + HeroV3) to match the editorial layout of vouschurch.com:
white background, black announcement bar, white sub-brands bar, white navbar, contained video box.

### Files Modified
- `app/home-v3/NavbarV3.tsx` — **full rewrite**
- `app/home-v3/HeroV3.tsx` — **full rewrite**

### NavbarV3 — New structure
Three stacked bars, all `fixed top-0`, entire header always white (no transparent/scroll behavior):

1. **Black utility bar** (`bg-[#0A0A0A]`)
   - Desktop: 8 prayer columns (Fajr | Sunrise | Dhuhr | Asr | Maghrib | Isha | Jummah I | Jummah II)
   - Each column: name (gold, 9px), adhan time, iqamah time (or —)
   - Far right: address + phone
   - Mobile: horizontally scrollable `.hide-scrollbar` row

2. **White sub-brands bar**
   - Left: "Al-Faruq Islamic School" · "Weekend Quran School" links
   - Right: "Prayer Request" (outlined pill) + "Member Portal" (dark filled pill)

3. **White main navbar**
   - Logo in `bg-[#0A0A0A] rounded` pill (logo is white-on-transparent, needs dark bg)
   - Nav links: dark text, hover underline
   - Right: Donate (dark pill) + Menu (with text label on desktop)
   - `shadow-md` added on scroll

### HeroV3 — New structure
- White background (`bg-white`)
- `pt-[160px]` to clear fixed 3-bar header
- **Content zone**: label row `LABEL ——— SUBLABEL` + large black title (clamp 60–128px)
- **Media zone** (desktop): `grid-cols-[48px_1fr_60px]`
  - Left 48px: social icons + "Connect" rotated text
  - Center: `aspect-video` image/video box, play button, next prayer badge
  - Right 60px: ChevronUp/Down arrows + slide dots + "Discover" rotated text
- **Mobile**: full-width video box + controls row below
- AnimatePresence transitions preserved, auto-advance every 6s preserved

---

## 🔄 NEXT STEPS / OPEN ITEMS

1. **Visual QA** — navigate to `http://localhost:3001/home-v3` and verify:
   - 3-bar header renders correctly on desktop + mobile
   - Prayer columns fit in utility bar without overflow
   - Hero content zone clears the header (no overlap)
   - 3-col media grid aligns properly
   - Logo is visible inside dark pill

2. **Prayer times** — currently hardcoded in NavbarV3. Update monthly or wire to the same
   `/api/prayerTimes` API used by the page for live data.

3. **Header height calibration** — if content overlaps or has too much gap, adjust `pt-[160px]`
   in HeroV3.tsx (currently estimated: utility ~58px + sub-brands ~34px + navbar ~68px = ~160px).

4. **Logo dark variant** — consider adding `/public/AlFaruqLogoDark.png` (dark text version)
   to avoid the dark-pill workaround on the white navbar.

5. **Deploy to main** — once home-v3 is approved, integrate into `app/page.tsx`.

---

## 🔄 SESSION HANDOFF SUMMARY
**Last Updated**: 2026-03-03
**Current Status**: home-v3 header + hero redesign complete, needs visual QA
**Blocking Issues**: None — lint and tsc both pass
**Immediate Next Step**: Open browser at `/home-v3` and verify layout
