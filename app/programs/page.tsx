import PosterGallery from "../components/PosterGallery";

export default function Programs() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-[260px] sm:pt-[220px] lg:pt-[160px] pb-20 bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/40 mb-6">
            Al-Faruq Islamic Centre
          </p>
          <h1 className="font-black tracking-tight leading-none"
              style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}>
            COMMUNITY{" "}
            <span className="inline-block bg-white text-[#0A0A0A] px-3 py-1.5 rounded-sm uppercase tracking-[0.08em] align-middle"
                  style={{ fontSize: "clamp(2rem, 6vw, 5.5rem)" }}>
              PROGRAMS
            </span>
          </h1>
          <p className="mt-8 text-white/50 text-lg max-w-xl leading-relaxed">
            Explore our programs and initiatives designed to enrich your spiritual,
            educational, and community life.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-[#F5F3EE] py-16">
        <PosterGallery />
      </section>
    </div>
  );
}
