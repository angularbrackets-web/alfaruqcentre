'use client';

import { useEffect, useState } from 'react';
import { VideoPost } from '@/app/types/video';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

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

function HeaderDecoration() {
  return (
    <svg
      width="420"
      height="420"
      viewBox="0 0 420 420"
      fill="none"
      aria-hidden="true"
      className="absolute right-0 top-0 opacity-[0.06] pointer-events-none select-none"
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const cx = 210 + 90 * Math.cos(angle);
        const cy = 210 + 90 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r={90} stroke="white" strokeWidth={1} />;
      })}
      <circle cx={210} cy={210} r={36} stroke="white" strokeWidth={1.5} />
      <circle cx={210} cy={210} r={185} stroke="white" strokeWidth={0.75} />
    </svg>
  );
}

// Shared dark card used for all videos on this page
function VideoCard({ video, index, featured = false }: { video: VideoPost; index: number; featured?: boolean }) {
  const { paddingBottom, isPortrait } = getVideoAspect(video.facebookUrl);
  const delay = featured ? index * 0.12 : (index % 3) * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: featured ? 0.55 : 0.5, delay }}
      className="group"
    >
      <div
        className={`rounded-2xl overflow-hidden bg-[#0A0A0A]
          border-t-[${featured ? '3' : '2'}px] border-[#C9A84C]
          shadow-lg shadow-black/20
          hover:shadow-2xl hover:shadow-black/35
          hover:-translate-y-1.5 transition-all duration-300`}
      >
        {/* Embed area */}
        <div className="relative">
          {featured && (
            <span className="absolute top-3 left-3 z-10 bg-[#C9A84C] text-[#0A0A0A]
              text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm">
              Featured
            </span>
          )}
          <div className={isPortrait ? (featured ? 'max-w-[320px] mx-auto' : 'max-w-[280px] mx-auto') : 'w-full'}>
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
          </div>
        </div>

        {/* Info */}
        <div className={featured ? 'p-6' : 'p-5'}>
          <h3
            className={`font-bold text-white leading-snug group-hover:text-[#C9A84C] transition-colors duration-200 ${
              featured ? 'text-lg' : 'text-base'
            }`}
          >
            {video.title}
          </h3>
          {video.description && (
            <p className={`text-white/55 mt-1.5 ${featured ? 'text-sm line-clamp-3' : 'text-sm line-clamp-2'}`}>
              {video.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/videos')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setVideos(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featuredVideos = videos.filter((v) => v.isFeatured);
  const regularVideos = videos.filter((v) => !v.isFeatured);
  const hasFeatured = featuredVideos.length > 0;
  const hasRegular = regularVideos.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Dark header */}
      <div className="bg-[#0A0A0A] relative overflow-hidden">
        <HeaderDecoration />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/80
                text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-200 mb-8 group"
            >
              <ChevronLeft
                size={14}
                strokeWidth={2.5}
                className="group-hover:-translate-x-0.5 transition-transform duration-200"
              />
              Home
            </Link>

            <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.25em] mb-4">
              Al-Faruq Islamic Centre
            </p>
            <h1
              className="text-white font-black leading-none"
              style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
            >
              Videos
            </h1>
            <p className="text-white/50 text-base mt-4 max-w-lg leading-relaxed">
              Khutbahs, lectures, community events, and highlights from Al-Faruq Islamic Centre.
            </p>
            {!loading && videos.length > 0 && (
              <p className="text-white/30 text-sm mt-3 font-medium tabular-nums">
                {videos.length} {videos.length === 1 ? 'video' : 'videos'}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden bg-[#0A0A0A]/8">
                <div style={{ paddingBottom: '56.25%', height: 0 }} />
                <div className="p-5 space-y-2.5">
                  <div className="h-5 bg-[#0A0A0A]/10 rounded w-3/4" />
                  <div className="h-4 bg-[#0A0A0A]/5 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0A0A0A]/5 mb-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-[#0A0A0A]/30"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <p className="text-[#0A0A0A] font-bold text-xl">No videos yet</p>
            <p className="text-[#0A0A0A]/40 text-sm mt-2">
              Check back soon for khutbahs and community highlights.
            </p>
          </div>
        ) : hasFeatured ? (
          <>
            {/* Featured section */}
            <div className="mb-16">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.25em] mb-1">
                  Highlighted
                </p>
                <h2 className="text-[#0A0A0A] font-black text-3xl">Featured Videos</h2>
              </motion.div>

              <div
                className={`grid gap-8 ${
                  featuredVideos.length === 1
                    ? 'grid-cols-1 max-w-2xl'
                    : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {featuredVideos.map((video, i) => (
                  <VideoCard key={video.id} video={video} index={i} featured />
                ))}
              </div>
            </div>

            {/* Regular videos */}
            {hasRegular && (
              <div>
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.25em] mb-1">
                    Library
                  </p>
                  <h2 className="text-[#0A0A0A] font-black text-3xl">All Videos</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {regularVideos.map((video, i) => (
                    <VideoCard key={video.id} video={video} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* No featured — show all in standard 3-col grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {videos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
