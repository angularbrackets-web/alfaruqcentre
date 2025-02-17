import React from 'react';

const HeroSectionMinimal = () => {
  return (
<section className="w-full h-screen flex items-center justify-center bg-gray-50">
  <div className="container mx-auto px-6 text-center">
    <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight text-gray-900">
      Your <span className="text-blue-500">Minimalist</span> Hero Section
    </h1>
    <p className="mt-6 text-lg md:text-xl text-gray-600">
      Concise and impactful messaging for a clean and modern website.
    </p>
    {/* Optional: Button */}
  </div>
</section>
);
};

export default HeroSectionMinimal;