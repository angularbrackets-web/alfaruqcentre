export default function MonthlyPrayerTimes() {
    return (
      <div className="flex-1 flex flex-col min-h-0 pt-24">
        
  
        {/* Iframe Container with Dynamic Height */}
        <div className="flex-1 min-h-[60vh] relative">
          <iframe
            src="https://timing.athanplus.com/masjid/widgets/monthly?theme=2&masjid_id=nL1Zq8Aa"
            className="w-full h-full absolute inset-0"
            frameBorder="0"
            loading="lazy"
          />
        </div>
  
        
      </div>
    );
  }