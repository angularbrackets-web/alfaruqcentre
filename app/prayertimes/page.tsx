export default function PrayerTimes() {
    return (
        <div className="px-4 mt-32">
  <div className="grid grid-cols-12 gap-4 md:grid-cols-1 md:gap-6 overflow-x-auto md:overflow-visible">
    {/* Left Column - Smaller on Desktop, Full Width on Mobile */}
    <div className="col-span-12 md:col-span-2 min-w-[300px]">
      <iframe
        src="https://timing.athanplus.com/masjid/widgets/embed?theme=1&masjid_id=nL1Zq8Aa"
        width="100%"
        height="560"
        frameBorder="0"
        className="block"
        scrolling="no"
      ></iframe>
    </div>

    {/* Right Column - Wider on Desktop, Full Width on Mobile */}
    <div className="col-span-12 md:col-span-10 min-w-[500px]">
      <iframe
        src="https://timing.athanplus.com/masjid/widgets/monthly?theme=2&masjid_id=nL1Zq8Aa"
        width="100%"
        height="1550"
        frameBorder="0"
        loading="lazy"
        className="block"
      />
    </div>
  </div>
</div>

    );
  }