// Hero Section Component (HeroSectionImage.tsx)
import NavbarOverlay from './NavbarOverlay';
import Image from 'next/image';
import heroImage from '../../public/Al.FaruqPrayerHall.jpeg'; // Import your image

export default function HeroSectionImage() {
  return (
    <section className="w-full h-screen relative overflow-hidden">
      <Image src={heroImage} alt="Hero Background" fill className="object-cover" />
      <div className="absolute inset-0 bg-black/50" /> {/* Image Overlay */}
      <NavbarOverlay />
      <div className="relative z-10 container mx-auto px-6 text-center flex items-center justify-center h-full">
        <div className="text-white">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight">
            Visually <span className="text-blue-400">Stunning</span> Hero
          </h1>
          <p className="mt-6 text-lg md:text-xl">
            Immersive experience with a full-screen image and overlay navigation.
          </p>
          {/* Optional: Button */}
        </div>
      </div>
    </section>
  );
}