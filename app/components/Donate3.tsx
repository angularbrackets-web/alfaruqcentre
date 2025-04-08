"use client";
import { useState } from 'react';
import TaxCreditCalculator from './TaxCreditCalculator2'; // Import the previously created component
import CanadaHelpImage from '../../public/CanadaHelp.png';
import Image from 'next/image'; // Import Image from next/image

export default function Donate3() {
  // State for animation effects
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Donate generously to support Al-Faruq Islamic Center and Islamic School
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Join us in supporting Al Faruq Islamic School (AFIS), ensuring a better learning environment for our students and fostering their educational journey. And please contribute generously toward your Masjid. Your contribution is crucial in making this vision a reality.
          </p>
          
          <a 
            href="https://donorchoice.ca/dia" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`
              self-start py-4 px-8 font-semibold text-white bg-green-600 rounded-lg 
              shadow-lg transition-all duration-300 ease-in-out
              hover:bg-green-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500
              ${isHovered ? 'transform scale-105' : ''}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Donate Now
          </a>
        </div>
        
        {/* Right Image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
          <Image
              src={CanadaHelpImage.src}
              alt="CanadaHelps Logo"
              width={300}
              height={450}
              className="object-cover object-top w-full h-full"
            />
          </div>
        </div>
      </section>
      
      {/* Donation Benefits Section */}
      <section className="mb-12 bg-gray-50 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          The Impact of Your Donation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Support Education</h3>
            <p className="text-gray-600">Your donation helps provide quality Islamic education, learning materials, and resources for students.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Improve Facilities</h3>
            <p className="text-gray-600">Help us maintain and enhance our masjid and school facilities for the benefit of the entire community.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Strengthen Community</h3>
            <p className="text-gray-600">Your generosity helps us organize community events, classes, and programs for all ages.</p>
          </div>
        </div>
      </section>
      
      {/* Tax Calculator Section */}
      <section className="mb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 p-6 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Calculate Your Tax Credit
            </h2>
            <p className="text-white/90">
              As a registered charity, donations to Al-Faruq Islamic Center are eligible for Canadian tax credits.
            </p>
          </div>
          
          <div className="p-4 md:p-6">
            <TaxCreditCalculator />
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          <details className="bg-white p-6 rounded-lg shadow-md">
            <summary className="text-lg font-semibold text-gray-800 cursor-pointer">
              How will my donation be used?
            </summary>
            <div className="mt-3 text-gray-600">
              <p>Your donations primarily support:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Educational programs and learning materials for students</li>
                <li>Facility maintenance and improvements</li>
                <li>Operational costs of the school and masjid</li>
                <li>Community events and services</li>
              </ul>
            </div>
          </details>
          
          <details className="bg-white p-6 rounded-lg shadow-md">
            <summary className="text-lg font-semibold text-gray-800 cursor-pointer">
              Are my donations tax-deductible?
            </summary>
            <div className="mt-3 text-gray-600">
              <p>Yes, Al-Faruq Islamic Center is a registered Canadian charity. All donations are eligible for tax credits as per Canadian tax regulations. You will receive an official tax receipt for your donations.</p>
            </div>
          </details>
          
          <details className="bg-white p-6 rounded-lg shadow-md">
            <summary className="text-lg font-semibold text-gray-800 cursor-pointer">
              Can I make a recurring donation?
            </summary>
            <div className="mt-3 text-gray-600">
              <p>Yes, we offer monthly donation options that allow you to support our cause consistently throughout the year. This helps us plan our programs and budget more effectively.</p>
            </div>
          </details>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="text-center bg-gray-50 rounded-xl p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Make a Difference Today
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Your generosity can help shape the future of our students and strengthen our community. Every contribution, regardless of size, makes a meaningful impact.
        </p>
        <a 
          href="https://donorchoice.ca/dia" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block py-4 px-8 font-semibold text-white bg-green-600 rounded-lg shadow-lg 
            transition-all duration-300 ease-in-out hover:bg-green-700 hover:shadow-xl 
            focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Donate Now
        </a>
      </section>
      
    </div>
  );
}