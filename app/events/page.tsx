"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';

interface Event {
  id: number;
  title: string;
  poster?: string;
  video?: string;
  thumbnail?: string;
  registrationLink: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD (e.g., registration deadline, or when event details should be removed)
  summary?: string[];
}

const events: Event[] = [
  {
    id: 1,
    title: 'Summer Camp 2025',
    poster: '/AFIS.SummerCamp.2025.jpeg',
    registrationLink: 'https://forms.gle/eaNc7Wi7L2LRiApL9',
    startDate: '2025-07-07',
    endDate: '2025-08-21',
    expiryDate: '2025-12-31',
    summary: [
      'Get ready for a summer full of learning, fun, and unforgettable memories! Al-Faruq Summer Camp is now accepting registrations.',
      'Our program includes engaging courses in Qur’an, Arabic, Islamic Studies, Language Arts, and Math—alongside exciting activities like sports, games, and field trips.',
      'Spaces are limited, so don’t wait!'
    ]
  },
  {
    id: 2,
    title: 'School Trip to Half Moon Farm',
    video: '/AFIS.FieldTrip.May10.2025.mp4', // Example with YouTube video
    thumbnail: '/AFIS.FieldTrip.May10.2025.Thumbnail.png', // Local thumbnail for the video
    registrationLink: '#', // Placeholder link
    startDate: '2025-05-10',
    endDate: '2025-05-10',
    expiryDate: '2025-06-30', // Still visible as past event
    summary: [
      'A Day of Learning and Reflection',
      'Our students enjoyed a beautiful and enriching trip to Half Moon Farm, where we explored the wonders of nature and deepened our understanding of the world through the lens of our faith.',
      'From the gentle animals to the vibrant plants and peaceful surroundings, every part of the farm reminded us of Allah’s magnificent creations. We took time to reflect on how everything in nature big or small points to His wisdom, mercy, and power.',
      'May these moments plant seeds of love, curiosity, and appreciation for the world Allah has given us.'
    ]
  }
];

// Helper function for date formatting
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function Events() {
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [popupMedia, setPopupMedia] = useState<{ src: string; type: 'image' | 'video' } | null>(null);

  const openPopup = (src: string, type: 'image' | 'video') => {
    setPopupMedia({ src, type });
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setPopupMedia(null);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopup();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Filter and sort events
  const currentEvents = events
    .filter((e) => e.startDate <= today && e.endDate >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const upcomingEvents = events
    .filter((e) => e.startDate > today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const pastEvents = events
    .filter((e) => e.endDate < today && e.expiryDate >= today) // Only show past events that haven't expired yet
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); // Sort past events by most recent first

  // Helper component for rendering an individual event card
  const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => (
    <div key={event.id} className={`mb-6 border rounded-lg p-4 shadow-md ${isPast ? 'bg-gray-50 opacity-80' : 'bg-white'}`}>
      <h2 className={`text-2xl font-semibold mb-3 ${isPast ? 'text-gray-700' : 'text-blue-800'}`}>{event.title}</h2>
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Media Display: Image or Video Thumbnail */}
        {event.video ? (
          <div
            className="relative w-full md:w-72 h-48 flex items-center justify-center bg-black rounded-lg overflow-hidden shadow-sm cursor-pointer"
            onClick={() => openPopup(event.video!, 'video')}
          >
            {event.thumbnail ? (
              <Image
                src={event.thumbnail}
                alt={`Thumbnail for ${event.title} video`}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0"
              />
            ) : (event.video.includes('youtube.com') || event.video.includes('youtu.be')) ? (
              <Image
                src={`https://img.youtube.com/vi/${event.video.split('v=')[1]?.split('&')[0] || event.video.split('/').pop()}/hqdefault.jpg`}
                alt={`Thumbnail for ${event.title} video`}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <svg className="h-16 w-16 text-white opacity-75" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {/* Play icon overlay always on top of the thumbnail/fallback */}
            <svg className="absolute h-16 w-16 text-white opacity-75 hover:opacity-100 transition-opacity z-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        ) : (
          <Image
            src={event.poster!}
            alt={event.title}
            width={300}
            height={200}
            className="rounded-lg cursor-pointer object-cover w-full md:w-72 h-48 md:h-auto shadow-sm"
            onClick={() => openPopup(event.poster!, 'image')}
          />
        )}

        <div className="flex-1">
          {/* Date Display: One day event vs. date range */}
          {event.startDate === event.endDate ? (
            <p className={`mb-2 ${isPast ? 'text-gray-600' : 'text-gray-700'}`}>
              <strong>Date:</strong> {formatDate(event.startDate)}
            </p>
          ) : (
            <p className={`mb-2 ${isPast ? 'text-gray-600' : 'text-gray-700'}`}>
              <strong>From:</strong> {formatDate(event.startDate)} <br className="md:hidden"/> <strong>To:</strong> {formatDate(event.endDate)}
            </p>
          )}
          {event.summary && event.summary.map((message, index) => (
            <p key={index} className={`mb-2 ${isPast ? 'text-gray-600' : 'text-gray-700'}`}>
              {message}
            </p>
          ))}
          {!isPast && event.registrationLink && ( // Only show registration link for non-past events
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 bg-green-600 text-white py-2 px-5 rounded-md hover:bg-green-700 transition duration-300 ease-in-out text-lg font-medium"
            >
              Register Now
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Alfaruq Islamic Centre - Events</title>
        <meta name="description" content="Upcoming and past events at Alfaruq Islamic Centre." />
        <meta property="og:title" content="Alfaruq Islamic Centre Events" />
        <meta property="og:description" content="Join us for various community events." />
        <meta property="og:image" content="/images/alfaruq-event.jpg" />
      </Head>

      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">Community Events</h1>

        {/* Current Events Section */}
        {currentEvents.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 border-b-2 border-blue-500 pb-2">Current Events</h2>
            {currentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            <div className="border-t border-gray-300 my-12"></div>
          </>
        )}

        {/* Upcoming Events Section */}
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700 border-b-2 border-green-500 pb-2">Upcoming Events</h2>
        {upcomingEvents.length === 0 && currentEvents.length === 0 && (
          <p className="text-center text-lg text-gray-600 mb-8">No upcoming events at this time. Please check back later!</p>
        )}
        {upcomingEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {upcomingEvents.length > 0 && <div className="border-t border-gray-300 my-12"></div>}


        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-700 border-b-2 border-gray-500 pb-2">Past Events</h2>
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast={true} />
            ))}
          </>
        )}

        {/* Popup for Image or Video */}
        {isPopupOpen && popupMedia && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closePopup}
          >
            <div className="relative bg-white p-2 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute -top-3 -right-3 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold transition-transform duration-200 hover:scale-110"
                onClick={closePopup}
                aria-label="Close popup"
              >
                ×
              </button>
              {popupMedia.type === 'image' ? (
                <Image
                  src={popupMedia.src}
                  alt="Event Media"
                  width={800}
                  height={600}
                  className="rounded-lg max-w-full max-h-[90vh] object-contain"
                />
              ) : (
                <div className="relative w-[90vw] h-[50vw] max-w-4xl max-h-[70vh] flex items-center justify-center">
                  {/* Embed YouTube/Vimeo or display direct video */}
                  {(popupMedia.src.includes('youtube.com') || popupMedia.src.includes('youtu.be')) ? (
                    <iframe
                      src={popupMedia.src.replace("watch?v=", "embed/").split('&')[0].replace("youtu.be/", "youtube.com/embed/") + "?autoplay=1"} // Autoplay on popup
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                      title="Event Video"
                    ></iframe>
                  ) : (
                    <video
                      src={popupMedia.src}
                      controls
                      autoPlay // Autoplay on popup
                      className="w-full h-full rounded-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}