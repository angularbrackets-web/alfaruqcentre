"use client";
import React from "react";

interface JobOpportunity {
  id: number;
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  jobType?: string;
  overview?: string;
  responsibilities?: string[];
  qualifications?: string[];
  additional?: {
    education?: string;
    workLocation?: string;
  };
  applyLink?: string;
}

const jobOpportunities: JobOpportunity[] = [
  {
    id: 1,
    title: "Elementary School Teacher",
    company: "Al-Faruq Islamic School",
    location: "4410 127 St SW, Edmonton, AB T6W 1A7",
    salary: "$53,437.44–$67,510.67 a year",
    jobType: "Permanent, Full-time",
    overview:
      "Al-Faruq Islamic School is committed to providing high-quality, Islamic-based education to students from diverse backgrounds. We are seeking dedicated teachers to inspire the next generation of Muslim leaders.",
    responsibilities: [
      "Plan and deliver engaging lessons in accordance with curriculum standards.",
      "Encourage academic and personal growth in a nurturing, Islamic environment.",
      "Foster positive relationships with students, parents, and staff.",
      "Integrate Islamic teachings in all subject areas.",
      "Maintain a safe and respectful classroom environment.",
      "Evaluate student progress and provide constructive feedback.",
      "Collaborate with colleagues for school-wide events and initiatives."
    ],
    qualifications: [
      "Bachelor’s Degree in Education or relevant field (required).",
      "Teaching certification (preferred).",
      "Knowledge of Islamic principles and teachings.",
      "Previous teaching experience (preferred, but not required).",
      "Strong classroom management skills.",
      "Excellent communication and interpersonal skills."
    ],
    additional: {
      education: "Bachelor's Degree (required)",
      workLocation: "In person"
    },
    applyLink: "https://ca.indeed.com/viewjob?jk=86676fea6f3348da"
  }
  ,
  // {
  //   id: 2,
  //   title: "Quran and Islamic Studies Teacher",
  //   company: "Al-Faruq Islamic School",
  //   location: "4410 127 St SW, Edmonton, AB",
  //   salary: "$20.00 per hour",
  //   jobType: "Part-time (Expected hours: 20 per week)",
  //   overview:
  //     "The Al-Faruq Islamic Centre is seeking passionate and knowledgeable Part-Time Teachers to join our team, specializing in Quran, Hifz (memorization), and Islamic Studies. We are looking for educators who are committed to nurturing students’ spiritual and academic development through high-quality Islamic instruction.",
  //   responsibilities: [ ... ],
  //   qualifications: [ ... ],
  //   additional: {
  //     education: "Certification or formal education in Islamic or Quranic Studies (asset)",
  //     workLocation: "In person"
  //   },
  //   applyLink: "https://ca.indeed.com/viewjob?from=appshareios&jk=fe90262726c28dc3"
  // },
  {
    id: 2,
    title: "Weekend Quran Teacher",
    company: "Al-Faruq Islamic School",
    location: "4410 127 St SW, Edmonton, AB",
    salary: "$20 an hour",
    jobType: "Temporary, Fixed term contract (6 hours/week, weekends only)",
    overview:
      "Al-Furqan Islamic Centre is seeking a passionate, qualified, and experienced Quran Teacher to lead weekend classes for children aged 5–12 years. The teacher will deliver engaging lessons in Tajweed, Quran recitation, memorization, and teaching Qaidah An-Nouraniyah or any other similar book, with a focus on strong classroom management, individual student progress, and community values. This is a weekend-only position, ideal for teachers with a flexible schedule looking to serve the community and help young Muslims grow spiritually and academically.",
    responsibilities: [
      "Conduct Quran classes on Saturday and Sunday (approx. 11:00 AM – 2:00 PM), subject to change due to daylight saving time.",
      "Teach: How to read Quran from the book fluently and smoothly.",
      "Correct Quranic recitation with full Tajweed.",
      "Memorization (Hifdh) and revision.",
      "Basic Islamic values, manners, and short Duas.",
      "Develop and follow a lesson plan/curriculum.",
      "Monitor and assess each student’s progress and update the system daily.",
      "Maintain class discipline and create a nurturing Islamic environment.",
      "Attend occasional staff meetings and training sessions if required.",
      "Develop and implement lesson plans that align with curriculum standards.",
      "Create a supportive classroom environment that encourages student participation and engagement.",
      "Assess and evaluate student performance through various methods, including tests and observations.",
      "Provide constructive feedback to students to support their learning journey.",
      "Collaborate with colleagues to enhance instructional practices and share resources.",
      "Communicate effectively with parents and guardians regarding student progress and classroom activities.",
      "Maintain classroom discipline while promoting respect and inclusivity among students."
    ],
    qualifications: [
      "Must be proficient in Quran recitation with strong Tajweed.",
      "Ijazah in Quran, diploma in Islamic studies, or equivalent certification preferred.",
      "Minimum 2 years of teaching experience, especially with children or teens.",
      "Fluent in English (spoken and written); Arabic proficiency is an asset.",
      "Excellent classroom management and interpersonal skills.",
      "Must be punctual, reliable, and professional."
    ],
    additional: {
      education: "Ijazah in Quran, diploma in Islamic studies, or equivalent (preferred)",
      workLocation: "In person"
    },
    applyLink: "https://ca.indeed.com/viewjob?from=appshareios&jk=4ec9730e15fe8e81"
  }
  // Additional opportunity example:
//   {
//     id: 2,
//     title: "Secondary School Teacher",
//     company: "Al-Faruq Islamic School",
//     location: "4410 127 St SW, Edmonton, AB T6W 1A7",
//     salary: "$55,000–$70,000 a year",
//     jobType: "Permanent, Full-time",
//     overview:
//       "We are looking for an experienced Secondary School Teacher with a strong background in subject matter expertise.",
//     responsibilities: [
//       "Develop and deliver engaging lessons aligned with curriculum standards.",
//       "Mentor students and foster a supportive classroom atmosphere.",
//       "Collaborate with colleagues to enhance educational strategies."
//     ],
//     qualifications: [
//       "Bachelor’s Degree in Education or relevant subject area.",
//       "Relevant teaching certification.",
//       "Strong interpersonal and communication skills."
//     ],
//     additional: {
//       education: "Bachelor's Degree (required)",
//       workLocation: "In person"
//     },
//     applyLink: "https://ca.indeed.com/viewjob?jk=EXAMPLE123456" // Replace with actual link.
//   }
];

const NowHiring: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sky-800">Now Hiring</h1>
      </header>

      {jobOpportunities.map((job) => (
        <div key={job.id} className="border p-6 rounded-lg shadow-md">
          {/* Job Header */}
          <header className="mb-4">
            {job.title && (
              <h2 className="text-2xl font-bold text-sky-800">{job.title}</h2>
            )}
            {job.company && (
              <h3 className="text-xl font-semibold text-gray-700">{job.company}</h3>
            )}
            {job.location && <p className="text-gray-600">{job.location}</p>}
          </header>

          {/* Job Details */}
          {(job.salary || job.jobType) && (
            <section className="mb-4">
              {job.salary && (
                <div className="inline-block px-4 py-1 mb-4 bg-sky-100 text-emerald-800 rounded-full text-sm font-medium">
                <strong>Pay:</strong> {job.salary}
                </div>
              )}
              {job.jobType && (
                <p className="text-gray-600">
                  <strong>Job Type:</strong> {job.jobType}
                </p>
              )}
            </section>
          )}

          {/* Overview */}
          {job.overview && (
            <section className="mb-4">
              <h4 className="text-lg font-bold text-gray-800 mb-2">Overview</h4>
              <p className="text-gray-600">{job.overview}</p>
            </section>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="mb-4">
              <h4 className="text-lg font-bold text-gray-800 mb-2">Responsibilities:</h4>
              <ul className="list-disc ml-6 text-gray-600">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Qualifications */}
          {job.qualifications && job.qualifications.length > 0 && (
            <section className="mb-4">
              <h4 className="text-lg font-bold text-gray-800 mb-2">Qualifications:</h4>
              <ul className="list-disc ml-6 text-gray-600">
                {job.qualifications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Additional Details */}
          {job.additional && (job.additional.education || job.additional.workLocation) && (
            <section className="mb-4">
              {job.additional.education && (
                <p className="text-gray-600">
                  <strong>Education:</strong> {job.additional.education}
                </p>
              )}
              {job.additional.workLocation && (
                <p className="text-gray-600">
                  <strong>Work Location:</strong> {job.additional.workLocation}
                </p>
              )}
            </section>
          )}

          {/* Call-to-Action */}
          {job.applyLink && (
            <div className="text-center">
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Apply on Indeed
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NowHiring;
