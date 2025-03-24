"use client";
import React from "react";

const NowHiring = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sky-800 mb-2">
          Elementary School Teacher
        </h1>
        <h2 className="text-xl font-semibold text-gray-700">
          Al-Faruq Islamic School
        </h2>
        <p className="text-gray-600">4410 127 St SW, Edmonton, AB T6W 1A7</p>
      </header>

      {/* Job Details Section */}
      <section className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Job Details</h3>
        <div className="inline-block px-4 py-1 mb-4 bg-sky-100 text-emerald-800 rounded-full text-sm font-medium">
        <strong>Pay:</strong> $53,437.44–$67,510.67 a year
        </div>
        <p className="text-gray-600">
          <strong>Job Type:</strong> Permanent, Full-time
        </p>
      </section>

      {/* Job Overview Section */}
      <section className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Job Overview</h3>
        <p className="text-gray-600 mb-4">
          Al-Faruq Islamic School is committed to providing high-quality, Islamic-based education to students from diverse backgrounds. We strive to cultivate an environment that encourages academic excellence, spiritual growth, and moral integrity. We are seeking dedicated and passionate teachers who are enthusiastic about inspiring the next generation of Muslim leaders.
        </p>
        <p className="text-gray-600">
          As a teacher at Al-Faruq Islamic School, you will be responsible for planning, implementing, and assessing lessons in accordance with our curriculum. We offer both Islamic and secular subjects, with an emphasis on integrating Islamic teachings and values in all aspects of learning.
        </p>
      </section>

      {/* Responsibilities Section */}
      <section className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Responsibilities:</h3>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Plan and deliver engaging lessons in accordance with curriculum standards.</li>
          <li>Encourage academic and personal growth in a nurturing, Islamic environment.</li>
          <li>Foster positive relationships with students, parents, and staff.</li>
          <li>Integrate Islamic teachings in all subject areas.</li>
          <li>Maintain a safe and respectful classroom environment.</li>
          <li>Evaluate student progress and provide constructive feedback.</li>
          <li>Collaborate with colleagues for school-wide events, activities, and initiatives.</li>
        </ul>
      </section>

      {/* Qualifications Section */}
      <section className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Qualifications:</h3>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Bachelor’s Degree in Education or relevant field (required).</li>
          <li>Teaching certification (preferred).</li>
          <li>Knowledge of Islamic principles and teachings.</li>
          <li>Previous teaching experience (preferred, but not required).</li>
          <li>Strong classroom management skills.</li>
          <li>Excellent communication and interpersonal skills.</li>
          <li>Commitment to fostering an inclusive and supportive learning environment.</li>
          <li>Ability to work collaboratively with school staff and administration.</li>
        </ul>
      </section>

      {/* Additional Details Section */}
      <section className="mb-8">
        <p className="text-gray-600 mb-2">
          <strong>Job Types:</strong> Full-time, Permanent
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Education:</strong> Bachelor&apos;s Degree (preferred)
        </p>
        <p className="text-gray-600">
          <strong>Work Location:</strong> In person
        </p>
      </section>

      {/* Call-to-Action Button */}
      <div className="text-center">
        <a
          href="https://ca.indeed.com/viewjob?jk=86676fea6f3348da"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors"
        >
          Apply on Indeed
        </a>
      </div>
    </div>
  );
};

export default NowHiring;
