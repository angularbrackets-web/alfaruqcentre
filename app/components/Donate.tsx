"use client";
import React from 'react';
import Image from "next/image";
import CanadaHelpImage from '../../public/CanadaHelp.png';
import Link from 'next/link';

interface DonateProps {
  paymentLink?: string;
  buttonText?: string;
  title?: string;
  thankYouMessage?: string;
  backgroundImageUrl?: string; // Optional background image
  impactMessage?: string; // Optional message highlighting impact
}

const Donate: React.FC<DonateProps> = ({
  paymentLink="https://donorchoice.ca/dia",
  buttonText = "Donate Now",
  title = "Donate generously to support Al-Faruq Islamic Center and Islamic School",
  thankYouMessage = "Thank you for your generous donation!",
  backgroundImageUrl = "/credit-card.jpg",
  impactMessage,
}) => {
  const handleDonateClick = () => {
    window.open(paymentLink, '_blank');
  };

  return (
    <div
      className="shadow-xl overflow-hidden relative"
      style={{
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 md:p-16"> {/* Add background overlay for better text readability */}
        <div className="text-center">
          {title && (
            <h3 className="text-5xl font-bold text-sky-900 mb-10">
              {title}
            </h3>
          )}
          <div className='flex flex-col md:flex-row justify-center items-center'>
          <div className='flex flex-col items-center gap-4'>
          <Image
            src={CanadaHelpImage.src}
            alt="CanadaHelps Logo"
            className="object-cover"
            width={400}
            height={600}
          />

          <Link href="https://www.canadahelps.org/en/tax-time/" target='_blank' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm lg:text-md transition-colors duration-300">Calculate your Tax Benefits</Link>  
        </div>

            <div className='p-5'>
            <div>
            <p className="text-lg text-gray-800 mb-6">
                Join us in supporting Al Faruq Islamic School (AFIS), ensuring a better learning environment for our students and fostering their educational journey.




            </p>
            <p className="text-lg text-gray-800 mb-6">
            And please contribute generously toward your Masjid.
            </p>
            <p className="text-lg text-gray-800 mb-6">
            Your contribution is crucial in making this vision a reality.
            </p>
          
        </div>

        {impactMessage && (
          <div className="bg-blue-100 p-4 rounded-md mb-6 border border-blue-200">
            <p className="text-blue-700 font-medium">{impactMessage}</p>
          </div>
        )}


        <div className="flex justify-center">
          <button
            onClick={handleDonateClick}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-colors duration-300"
          >
            {buttonText}
          </button>
        </div>
        {thankYouMessage && (
          <p className="text-center text-gray-700 mt-5 text-sm italic">
            {thankYouMessage}
          </p>
        )}
            </div>
            
        
        

            
          </div>
            
        
      </div>
    </div>
    </div>
  );
};

export default Donate;