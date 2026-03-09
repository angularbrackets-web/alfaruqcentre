"use client";

import React from "react";
import { useHeaderHeight } from "../hooks/useHeaderHeight";

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
      "Collaborate with colleagues for school-wide events and initiatives.",
    ],
    qualifications: [
      "Bachelor's Degree in Education or relevant field (required).",
      "Teaching certification (preferred).",
      "Knowledge of Islamic principles and teachings.",
      "Previous teaching experience (preferred, but not required).",
      "Strong classroom management skills.",
      "Excellent communication and interpersonal skills.",
    ],
    additional: {
      education: "Bachelor's Degree (required)",
      workLocation: "In person",
    },
    applyLink: "https://ca.indeed.com/viewjob?jk=86676fea6f3348da",
  },
  {
    id: 2,
    title: "Weekend Quran Teacher",
    company: "Al-Faruq Islamic School",
    location: "4410 127 St SW, Edmonton, AB",
    salary: "$20 an hour",
    jobType: "Temporary, Fixed term contract (6 hours/week, weekends only)",
    overview:
      "Al-Furqan Islamic Centre is seeking a passionate, qualified, and experienced Quran Teacher to lead weekend classes for children aged 5–12 years. The teacher will deliver engaging lessons in Tajweed, Quran recitation, memorization, and teaching Qaidah An-Nouraniyah or any other similar book, with a focus on strong classroom management, individual student progress, and community values.",
    responsibilities: [
      "Conduct Quran classes on Saturday and Sunday (approx. 11:00 AM – 2:00 PM), subject to change due to daylight saving time.",
      "Teach how to read Quran from the book fluently and smoothly.",
      "Correct Quranic recitation with full Tajweed.",
      "Memorization (Hifdh) and revision.",
      "Basic Islamic values, manners, and short Duas.",
      "Develop and follow a lesson plan/curriculum.",
      "Monitor and assess each student's progress and update the system daily.",
      "Maintain class discipline and create a nurturing Islamic environment.",
      "Attend occasional staff meetings and training sessions if required.",
      "Communicate effectively with parents and guardians regarding student progress.",
    ],
    qualifications: [
      "Must be proficient in Quran recitation with strong Tajweed.",
      "Ijazah in Quran, diploma in Islamic studies, or equivalent certification preferred.",
      "Minimum 2 years of teaching experience, especially with children or teens.",
      "Fluent in English (spoken and written); Arabic proficiency is an asset.",
      "Excellent classroom management and interpersonal skills.",
      "Must be punctual, reliable, and professional.",
    ],
    additional: {
      education: "Ijazah in Quran, diploma in Islamic studies, or equivalent (preferred)",
      workLocation: "In person",
    },
    applyLink: "https://ca.indeed.com/viewjob?from=appshareios&jk=4ec9730e15fe8e81",
  },
];

const NowHiring: React.FC = () => {
  const headerHeight = useHeaderHeight();
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pb-20 bg-[#0A0A0A] text-white" style={{ paddingTop: headerHeight || 160 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/40 mb-6">
            Al-Faruq Islamic School
          </p>
          <h1
            className="font-black tracking-tight leading-none"
            style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
          >
            NOW{" "}
            <span
              className="inline-block bg-[#C9A84C] text-white px-3 py-1.5 rounded-sm uppercase tracking-[0.08em] align-middle"
              style={{ fontSize: "clamp(2rem, 6vw, 5.5rem)" }}
            >
              HIRING
            </span>
          </h1>
          <p className="mt-8 text-white/50 text-lg max-w-xl leading-relaxed">
            Join our dedicated team and help shape the next generation of Muslim leaders.
          </p>
          <p className="mt-2 text-white/30 text-sm">
            {jobOpportunities.length} open position{jobOpportunities.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Job listings */}
      <section className="bg-[#F5F3EE] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {jobOpportunities.map((job, idx) => (
            <div key={job.id} className="bg-white border border-black/8">
              {/* Card header */}
              <div className="px-8 py-8 border-b border-black/6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35 mb-2">
                      Position {String(idx + 1).padStart(2, "0")}
                    </p>
                    {job.title && (
                      <h2 className="font-black text-2xl md:text-3xl tracking-tight text-[#0A0A0A] mb-1">
                        {job.title}
                      </h2>
                    )}
                    {job.company && (
                      <p className="text-black/50 text-sm font-medium">{job.company}</p>
                    )}
                    {job.location && (
                      <p className="text-black/35 text-xs mt-1">{job.location}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    {job.salary && (
                      <span className="inline-block bg-[#0A0A0A] text-white text-[10px] uppercase tracking-widest font-medium px-4 py-2 rounded-sm whitespace-nowrap">
                        {job.salary}
                      </span>
                    )}
                    {job.jobType && (
                      <p className="text-black/40 text-xs">{job.jobType}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="px-8 py-8 space-y-8">
                {job.overview && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-medium text-black/35 mb-3">Overview</p>
                    <p className="text-black/60 text-sm leading-relaxed">{job.overview}</p>
                  </div>
                )}

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-medium text-black/35 mb-3">Responsibilities</p>
                    <ul className="space-y-2">
                      {job.responsibilities.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-black/60">
                          <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.qualifications && job.qualifications.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-medium text-black/35 mb-3">Qualifications</p>
                    <ul className="space-y-2">
                      {job.qualifications.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-black/60">
                          <span className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.additional && (job.additional.education || job.additional.workLocation) && (
                  <div className="flex flex-wrap gap-6 pt-2 border-t border-black/6">
                    {job.additional.education && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] font-medium text-black/35 mb-1">Education</p>
                        <p className="text-black/55 text-xs">{job.additional.education}</p>
                      </div>
                    )}
                    {job.additional.workLocation && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] font-medium text-black/35 mb-1">Work Location</p>
                        <p className="text-black/55 text-xs">{job.additional.workLocation}</p>
                      </div>
                    )}
                  </div>
                )}

                {job.applyLink && (
                  <div className="pt-2">
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#0A0A0A] text-white text-xs uppercase tracking-widest font-semibold px-7 py-3 rounded-full hover:bg-black/80 transition-colors"
                    >
                      Apply on Indeed
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NowHiring;
