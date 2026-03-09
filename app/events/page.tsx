"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useHeaderHeight } from "../hooks/useHeaderHeight";

interface Event {
  id: string | number;
  title: string;
  poster?: string;
  video?: string;
  thumbnail?: string;
  registrationLink?: string;
  startDate: string;
  endDate: string;
  expiryDate: string;
  summary?: string[];
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function EventCard({ event, isPast = false }: { event: Event; isPast?: boolean }) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMedia, setPopupMedia] = useState<{ src: string; type: "image" | "video" } | null>(null);

  const openPopup = (src: string, type: "image" | "video") => {
    setPopupMedia({ src, type });
    setPopupOpen(true);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopupOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div
        className={`group border border-black/8 rounded-none bg-white transition-shadow hover:shadow-lg ${
          isPast ? "opacity-60" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row">
          {/* Media */}
          <div className="md:w-72 lg:w-80 flex-shrink-0">
            {event.video ? (
              <div
                className="relative w-full h-52 md:h-full min-h-[200px] bg-[#0A0A0A] cursor-pointer overflow-hidden"
                onClick={() => openPopup(event.video!, "video")}
              >
                {event.thumbnail ? (
                  <Image src={event.thumbnail} alt={event.title} fill className="object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                ) : event.video.includes("youtube.com") || event.video.includes("youtu.be") ? (
                  <Image
                    src={`https://img.youtube.com/vi/${
                      event.video.split("v=")[1]?.split("&")[0] || event.video.split("/").pop()
                    }/hqdefault.jpg`}
                    alt={event.title}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-14 h-14 bg-white/10 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : event.poster ? (
              <div
                className="relative w-full h-52 md:h-full min-h-[200px] cursor-pointer overflow-hidden bg-[#F5F3EE]"
                onClick={() => openPopup(event.poster!, "image")}
              >
                <Image src={event.poster} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ) : (
              <div className="w-full h-52 md:h-full min-h-[200px] bg-[#F5F3EE] flex items-center justify-center">
                <svg className="h-12 w-12 text-black/20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35 mb-3">
                {event.startDate === event.endDate
                  ? formatDate(event.startDate)
                  : `${formatDate(event.startDate)} — ${formatDate(event.endDate)}`}
              </p>
              <h3 className={`font-black text-2xl lg:text-3xl tracking-tight leading-tight mb-4 ${isPast ? "text-black/50" : "text-[#0A0A0A]"}`}>
                {event.title}
              </h3>
              {event.summary && event.summary.map((msg, i) => (
                <p key={i} className="text-black/60 text-sm leading-relaxed mb-2">{msg}</p>
              ))}
            </div>
            {!isPast && event.registrationLink && event.registrationLink !== "#" && (
              <div className="mt-6">
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#0A0A0A] text-white text-xs uppercase tracking-widest font-medium px-6 py-3 rounded-full hover:bg-black/80 transition-colors"
                >
                  Register Now
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup */}
      {popupOpen && popupMedia && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4"
          onClick={() => setPopupOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-4 -right-4 w-9 h-9 bg-white text-[#0A0A0A] rounded-full flex items-center justify-center hover:bg-white/80 transition-colors z-10"
              onClick={() => setPopupOpen(false)}
              aria-label="Close"
            >
              <X size={16} />
            </button>
            {popupMedia.type === "image" ? (
              <Image src={popupMedia.src} alt="Event" width={800} height={600} className="rounded max-w-[90vw] max-h-[85vh] object-contain" />
            ) : (
              <div className="relative w-[88vw] h-[50vw] max-w-4xl max-h-[70vh]">
                {popupMedia.src.includes("youtube.com") || popupMedia.src.includes("youtu.be") ? (
                  <iframe
                    src={
                      popupMedia.src
                        .replace("watch?v=", "embed/")
                        .split("&")[0]
                        .replace("youtu.be/", "youtube.com/embed/") + "?autoplay=1"
                    }
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded"
                    title="Event Video"
                  />
                ) : (
                  <video src={popupMedia.src} controls autoPlay className="w-full h-full rounded">
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function Events() {
  const headerHeight = useHeaderHeight();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setEvents(
            data.data.map((e: {
              id: string; title: string; poster?: string; video?: string;
              thumbnail?: string; registrationLink?: string;
              startDate: string; endDate: string; expiryDate: string; summary: string[];
            }) => ({
              id: e.id,
              title: e.title,
              poster: e.poster,
              video: e.video,
              thumbnail: e.thumbnail,
              registrationLink: e.registrationLink || "#",
              startDate: e.startDate.split("T")[0],
              endDate: e.endDate.split("T")[0],
              expiryDate: e.expiryDate.split("T")[0],
              summary: e.summary || [],
            }))
          );
        } else {
          setError("Failed to load events. Please try again later.");
        }
      })
      .catch(() => setError("Failed to load events. Please try again later."))
      .finally(() => setIsLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const currentEvents = events.filter((e) => e.startDate <= today && e.endDate >= today).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const upcomingEvents = events.filter((e) => e.startDate > today).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const pastEvents = events.filter((e) => e.endDate < today && e.expiryDate >= today).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pb-20 bg-[#0A0A0A] text-white" style={{ paddingTop: headerHeight || 160 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/40 mb-6">
            Al-Faruq Islamic Centre
          </p>
          <h1 className="font-black tracking-tight leading-none"
              style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}>
            COMMUNITY{" "}
            <span className="inline-block bg-white text-[#0A0A0A] px-3 py-1.5 rounded-sm uppercase tracking-[0.08em] align-middle"
                  style={{ fontSize: "clamp(2rem, 6vw, 5.5rem)" }}>
              EVENTS
            </span>
          </h1>
          <p className="mt-8 text-white/50 text-lg max-w-xl leading-relaxed">
            Stay connected with upcoming programs, community gatherings, and special occasions.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <p className="text-black/40 text-sm uppercase tracking-widest">Loading events...</p>
            </div>
          )}

          {error && (
            <div className="border border-red-200 bg-red-50 text-red-700 px-6 py-4 rounded mb-8 text-sm">
              {error}
            </div>
          )}

          {!isLoading && !error && events.length === 0 && (
            <div className="text-center py-24">
              <p className="text-black/40 text-sm uppercase tracking-widest mb-3">No events available</p>
              <p className="text-black/30 text-sm">Check back soon for upcoming community events.</p>
            </div>
          )}

          {!isLoading && !error && events.length > 0 && (
            <div className="space-y-20">
              {/* Current */}
              {currentEvents.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35">Now Happening</p>
                    <div className="flex-1 h-px bg-black/8" />
                    <span className="inline-block bg-[#C9A84C] text-white text-[10px] uppercase tracking-widest font-medium px-3 py-1 rounded-sm">
                      Live
                    </span>
                  </div>
                  <div className="space-y-6">
                    {currentEvents.map((e) => <EventCard key={e.id} event={e} />)}
                  </div>
                </div>
              )}

              {/* Upcoming */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35">Upcoming Events</p>
                  <div className="flex-1 h-px bg-black/8" />
                </div>
                {upcomingEvents.length === 0 && currentEvents.length === 0 ? (
                  <p className="text-black/35 text-sm">No upcoming events at this time. Check back soon.</p>
                ) : upcomingEvents.length === 0 ? null : (
                  <div className="space-y-6">
                    {upcomingEvents.map((e) => <EventCard key={e.id} event={e} />)}
                  </div>
                )}
              </div>

              {/* Past */}
              {pastEvents.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35">Past Events</p>
                    <div className="flex-1 h-px bg-black/8" />
                  </div>
                  <div className="space-y-6">
                    {pastEvents.map((e) => <EventCard key={e.id} event={e} isPast={true} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
