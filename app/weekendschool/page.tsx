"use client"
//import Head from 'next/head';
import Image from 'next/image';
import { FC, useState } from 'react';
const weekendSchoolUrl = "/AlFaruqWeekendSchool.mp4";
const WeekendSchool: FC = () => {
    const [activeSections, setActiveSections] = useState({
        arabic: true,
        quran: true,
        islamic: true,
        seerah: true
      });
      
      // Update the toggleSection function to handle multiple expanded sections
      const toggleSection = (section: keyof typeof activeSections) => {
        setActiveSections({
          ...activeSections,
          [section]: !activeSections[section]
        });
      };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">      

      {/* Hero Section */}
      <header className="pt-32 md:pt-28 pb-12 bg-gradient-to-b from-gray-900 to-sky-400 md:from-gray-950 md:to-sky-500 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Al-Faruq Weekend Quran School</h1>
            <p className="text-md md:text-xl mb-6 font-medium">Nurturing young minds with <span className='font-black text-sky-200 underline'>Quranic education</span> and <span className='font-black text-sky-200 underline'>Islamic values</span></p>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLScV2xkunYsiua7s9srJdhPGaMFQDN4JN_nRWwK8nYGEnDd5kw/viewform" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-sky-950 text-sky-100 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-950 hover:text-sky-100 transition-colors inline-block"
              aria-label="Register your child for Al-Faruq Weekend Quran School"
            >
              Register Your Child
            </a>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="rounded-lg overflow-hidden shadow-xl w-full max-w-lg">
              {/* School video with proper dimensions */}
              <div className="relative w-full" style={{ aspectRatio: '1600/837' }}>
                <video
                  src={weekendSchoolUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover rounded-lg"
                  style={{ display: 'block' }}
                  poster="/AlFaruqWeekendQuranSchool.jpeg"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* School Poster Images displayed together */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
          <div className="rounded-lg overflow-hidden shadow-xl w-full max-w-md">
            <Image 
              src="/AlFaruqWeekendQuranSchool.jpeg" 
              alt="Al-Faruq Weekend Quran School Poster" 
              width={400}
              height={209}
              className="w-full h-auto object-cover rounded-lg"
              priority
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl w-full max-w-md">
            <Image 
              src="/AlFaruq.Weekend.Quran.School.March2025.jpeg" 
              alt="Al-Faruq Weekend Quran School March 2025 Poster" 
              width={400}
              height={209}
              className="w-full h-auto object-cover rounded-lg"
              priority
            />
          </div>
        </div>
        {/* Mission Section */}
        <section id="mission" className="mb-16">
            <div className='flex flex-col lg:flex-row gap-4'>
                {/* Image above now shown together with the other poster */}
                <div className="flex-1" />
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-sky-800 text-center">Our Mission</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="mb-6">
              Al-Faruq Weekend Quran School is dedicated to providing students with Quranic education and fundamental Islamic values. 
              Due to limited teaching time, our curriculum focuses on four key areas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sky-800">
              {[
                { number: "1", text: "Arabic Reading Skills" },
                { number: "2", text: "Quran Studies" },
                { number: "3", text: "Islamic Studies" },
                { number: "4", text: "Seerah of the Prophet S.A.W" }
              ].map((item, index) => (
                <div key={index} className="bg-sky-50 p-6 rounded-lg border-l-4 border-sky-600">
                  <div className="flex items-center">
                    {/* <div className="bg-sky-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">
                      {item.number}
                    </div> */}
                    <h3 className="font-semibold text-md">{item.text}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
                </div>
            </div>
          
        </section>

        {/* Programs Section */}
        <section id="programs" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-sky-800 text-center">Our Programs</h2>
          
          {/* Program Cards */}
          <div className="space-y-6">
            {/* Arabic Reading Skills */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={() => toggleSection('arabic')}
                className="w-full flex items-center justify-between p-6 focus:outline-none"
                aria-expanded={activeSections.arabic}
                aria-controls="arabic-content"
              >
                <div className="flex items-center text-sky-800">
                  <div className="bg-sky-100 p-4 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Arabic Reading Skills</h3>
                </div>
                <svg className={`w-6 h-6 transform transition-transform ${activeSections.arabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div 
                id="arabic-content"
                className={`px-6 pb-6 transition-all duration-300 ease-in-out text-gray-600 ${activeSections.arabic ? 'block' : 'hidden'}`}
              >
                <p className="mb-4">
                  To effectively learn the Quran, students must be able to read fluently from the Mushaf with Tajweed. We assess each student&apos;s reading ability and provide targeted instruction to strengthen their skills. Our Arabic reading program consists of 12 progressive levels.
                </p>
                <p>
                  While students are in the reading program, they collectively memorize Surah An-Nas to Surah Al-Asr, along with Surah Al-Fatiha, through repetition. Once they complete the reading course, they begin individual Quran lessons.
                </p>
              </div>
            </div>

            {/* Quran Studies */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={() => toggleSection('quran')}
                className="w-full flex items-center justify-between p-6 focus:outline-none"
                aria-expanded={activeSections.quran}
                aria-controls="quran-content"
              >
                <div className="flex items-center text-sky-800">
                  <div className="bg-sky-100 p-4 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Quran Studies</h3>
                </div>
                <svg className={`w-6 h-6 transform transition-transform ${activeSections.quran ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div 
                id="quran-content" 
                className={`px-6 pb-6 transition-all duration-300 ease-in-out text-gray-600 ${activeSections.quran ? 'block' : 'hidden'}`}
              >
                <p className="mb-4">
                  Our Quran Studies program emphasizes fluency in recitation with Tajweed, ensuring proper pronunciation and application of recitation rules. To support learning, we use an online Quran platform, enabling students to practice and memorize easily at home with parental guidance.
                </p>
                <p className="mb-2">Due to the challenges some students face, we have divided Quran learning into two sessions:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><span className="font-semibold">Recitation Session:</span> Students practice reading from the Mushaf with proper Tajweed and without mistakes.</li>
                  <li><span className="font-semibold">Memorization Session:</span> Once students can recite fluently, they begin memorizing the Quran.</li>
                </ul>
              </div>
            </div>

            {/* Islamic Studies */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={() => toggleSection('islamic')}
                className="w-full flex items-center justify-between p-6 focus:outline-none"
                aria-expanded={activeSections.islamic}
                aria-controls="islamic-content"
              >
                <div className="flex items-center text-sky-800">
                  <div className="bg-sky-100 p-4 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Islamic Studies</h3>
                </div>
                <svg className={`w-6 h-6 transform transition-transform ${activeSections.islamic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div 
                id="islamic-content"
                className={`px-6 pb-6 transition-all duration-300 ease-in-out text-gray-600 ${activeSections.islamic ? 'block' : 'hidden'}`}
              >
                <p className="mb-4">Al-Faruq Weekend School provides essential Islamic education, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Performing acts of worship (prayer, zakat, fasting, Hajj, etc.).</li>
                  <li>Strengthening faith and understanding core Islamic beliefs.</li>
                  <li>Developing good character and manners through interactive lessons.</li>
                </ul>
              </div>
            </div>

            {/* Seerah */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={() => toggleSection('seerah')}
                className="w-full flex items-center justify-between p-6 focus:outline-none"
                aria-expanded={activeSections.seerah}
                aria-controls="seerah-content"
              >
                <div className="flex items-center text-sky-800">
                  <div className="bg-sky-100 p-4 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Seerah of the Prophet S.A.W</h3>
                </div>
                <svg className={`w-6 h-6 transform transition-transform ${activeSections.seerah ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div 
                id="seerah-content"
                className={`px-6 pb-6 transition-all duration-300 ease-in-out text-gray-600 ${activeSections.seerah ? 'block' : 'hidden'}`}
              >
                <p>
                  Children naturally learn through imitation. Our Seerah sessions introduce students to the life of Prophet Muhammad (peace be upon him) and his companions, offering them strong role models to follow in their daily lives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Location and Timing Section */}
        <section id="location" className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location */}
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold mb-4 text-sky-800">Location</h2>
  <p className="mb-4">All classes are held at Al-Faruq Islamic Centre.</p>
  <address className="not-italic mb-6">
    4410 127 St SW<br />
    Edmonton, AB T6W1A2
  </address>
  <div className="rounded-lg overflow-hidden w-full h-80">
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2379.2586477432274!2d-113.54445322326558!3d53.39231297230264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a01d10fe5dfb53%3A0xc7f45b21bddbfb4a!2sAl%20Faruq%20Mosque%20and%20Islamic%20School%20(Southside)!5e0!3m2!1sen!2sca!4v1742368108390!5m2!1sen!2sca" 
      width="100%" 
      height="100%" 
      style={{ border: 0 }} 
      allowFullScreen={true} 
      loading="lazy" 
      referrerPolicy="no-referrer-when-downgrade"
      title="Al-Faruq Islamic Centre Location"
      className="w-full h-full"
    />
  </div>
</div>

          {/* Timing and Fees */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-sky-800">School Timing</h2>
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-sky-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Saturday:</strong> 11:00 AM – 2:00 PM (3 hours)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-sky-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Sunday:</strong> 11:00 AM – 2:00 PM (3 hours)</span>
              </li>
            </ul>
            <p className="text-sm italic mb-8">Note: The schedule is subject to change due to daylight saving time.</p>

            <h2 className="text-2xl font-bold mb-4 text-sky-800">Fees</h2>
            <div className="bg-sky-50 p-4 rounded-lg border-l-4 border-sky-600">
              <p className="flex items-center">
                <svg className="w-5 h-5 text-sky-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>$65</strong> per month per child, plus the cost of books.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Registration CTA */}
        <section id="register" className="text-center py-12 bg-sky-50 rounded-lg shadow-inner mb-16">
          <h2 className="text-3xl font-bold mb-6 text-sky-800">Ready to Enroll Your Child?</h2>
          <p className="max-w-lg mx-auto mb-8">Join our weekend school to provide your child with quality education in Quranic studies, Arabic reading, Islamic knowledge, and character development.</p>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLScV2xkunYsiua7s9srJdhPGaMFQDN4JN_nRWwK8nYGEnDd5kw/viewform" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-sky-600 text-white font-semibold px-8 py-4 rounded-lg shadow-md hover:bg-sky-700 transition-colors inline-block"
            aria-label="Register your child for Al-Faruq Weekend Quran School"
          >
            Register Now
          </a>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-sky-800 text-center">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {[
                {
                  q: "What age groups do you accept?",
                  a: "We accept students from ages 5 to 16 years old. If your child is older than 12 years, we have Al-Tarteel Quran Institute available. Please feel free to reach out for more information."
                },
                {
                  q: "Do you provide textbooks?",
                  a: "Yes, textbooks are available for purchase at the school. The cost is not included in the monthly fee."
                },
                {
                  q: "What if my child misses a class?",
                  a: "We understand that absences sometimes happen. Please notify the school administration in advance. Teachers can provide materials to help catch up on missed lessons."
                },
                {
                  q: "Is there homework assigned?",
                  a: "Yes, students receive homework to practice their reading and memorization skills. Parental support at home is crucial for students&apos; progress."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold mb-2 text-sky-500">{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
};

export default WeekendSchool;