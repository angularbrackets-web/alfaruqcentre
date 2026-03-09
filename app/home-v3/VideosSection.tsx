'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { VideoPost } from '@/app/types/video';

const LANDSCAPE_WIDTH = 480;
const PORTRAIT_WIDTH = 270;
const CARD_GAP = 24;

function getVideoAspect(embedSrc: string): { paddingBottom: string; isPortrait: boolean } {
  try {
    const url = new URL(embedSrc);
    const w = parseInt(url.searchParams.get('width') || '0');
    const h = parseInt(url.searchParams.get('height') || '0');
    if (w > 0 && h > 0) {
      return {
        paddingBottom: `${((h / w) * 100).toFixed(2)}%`,
        isPortrait: h > w,
      };
    }
  } catch { /* ignore */ }
  return { paddingBottom: '56.25%', isPortrait: false };
}

function VideosSectionDecoration() {
  return (
    <svg
      width="240"
      height="240"
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      className="absolute top-0 right-0 opacity-[0.07] pointer-events-none select-none"
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const cx = 120 + 52 * Math.cos(angle);
        const cy = 120 + 52 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r={52} stroke="#0A0A0A" strokeWidth={1} />;
      })}
      <circle cx={120} cy={120} r={22} stroke="#0A0A0A" strokeWidth={1.5} />
      <circle cx={120} cy={120} r={105} stroke="#0A0A0A" strokeWidth={0.75} />
    </svg>
  );
}

export default function VideosSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    fetch('/api/videos?featuredOnly=true')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setVideos(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && videos.length === 0) return null;

  const sync = () => {
    const el = carouselRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanL(el.scrollLeft > 8);
    setCanR(el.scrollLeft < maxScroll - 8);
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 1);
  };

  const scroll = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({
      left: dir === 'right' ? LANDSCAPE_WIDTH + CARD_GAP : -(LANDSCAPE_WIDTH + CARD_GAP),
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-[#F5F3EE] py-16 md:py-24 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <VideosSectionDecoration />
          </div>

          <div>
            <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.25em] mb-3">
              Watch
            </p>
            <h2
              className="text-[#0A0A0A] font-black leading-none"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
            >
              Videos
            </h2>
            <p className="text-[#0A0A0A]/50 text-sm mt-3 max-w-xs leading-relaxed">
              Khutbahs, lectures, and community highlights from Al-Faruq Islamic Centre.
            </p>
          </div>

          {videos.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => scroll('left')}
                disabled={!canL}
                aria-label="Scroll left"
                className="w-11 h-11 rounded-full border border-[#0A0A0A]/20 text-[#0A0A0A] flex items-center justify-center
                  hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200
                  disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canR}
                aria-label="Scroll right"
                className="w-11 h-11 rounded-full border border-[#0A0A0A]/20 text-[#0A0A0A] flex items-center justify-center
                  hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200
                  disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Carousel */}
      <motion.div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto scroll-smooth hide-scrollbar cursor-grab active:cursor-grabbing
          pl-4 sm:pl-6 lg:pl-[max(24px,calc((100vw-1280px)/2+24px))] pr-8 items-start"
        style={{ scrollbarWidth: 'none' }}
        onScroll={sync}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {loading ? (
          <>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-2xl bg-[#0A0A0A]/10 animate-pulse"
                style={{ width: LANDSCAPE_WIDTH, height: Math.round(LANDSCAPE_WIDTH * 0.5625) + 88 }}
              />
            ))}
          </>
        ) : (
          videos.map((video) => {
            const { paddingBottom, isPortrait } = getVideoAspect(video.facebookUrl);
            const cardWidth = isPortrait ? PORTRAIT_WIDTH : LANDSCAPE_WIDTH;

            return (
              <div
                key={video.id}
                className="group flex-shrink-0 rounded-2xl overflow-hidden bg-[#0A0A0A]
                  border-t-2 border-[#C9A84C]
                  shadow-lg shadow-[#0A0A0A]/15
                  hover:shadow-2xl hover:shadow-[#0A0A0A]/25
                  hover:-translate-y-1.5 transition-all duration-300"
                style={{ width: cardWidth }}
              >
                {/* Embed */}
                <div className="relative w-full bg-[#111]" style={{ paddingBottom, height: 0 }}>
                  <iframe
                    src={video.facebookUrl}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-[#C9A84C] transition-colors duration-200">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-white/55 text-sm mt-1.5 line-clamp-2">{video.description}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </motion.div>

      {/* Progress bar + CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {videos.length > 1 && (
          <div className="h-px bg-[#0A0A0A]/10 rounded-full overflow-hidden mb-8 max-w-[200px]">
            <div
              className="h-full bg-[#C9A84C] transition-all duration-200 ease-out rounded-full"
              style={{ width: `${Math.max(6, scrollProgress * 100)}%` }}
            />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            href="/videos"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full
              border-2 border-[#0A0A0A] text-[#0A0A0A] font-bold text-sm uppercase tracking-[0.15em]
              hover:bg-[#0A0A0A] hover:text-white transition-all duration-200"
          >
            See All Videos
            <ChevronRight size={15} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
