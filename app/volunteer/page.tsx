"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { AREAS_OF_INTEREST, AVAILABILITY_OPTIONS, VolunteerFormData } from "@/app/types/volunteer";

const VolunteerPage: React.FC = () => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    name: "",
    email: "",
    phone: "",
    areasOfInterest: [],
    availability: [],
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleCheckboxChange = (field: "areasOfInterest" | "availability", value: string) => {
    setFormData((prev) => {
      const cur = prev[field];
      return {
        ...prev,
        [field]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
      };
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name.trim()) return setError("Please enter your name");
    if (!formData.email.trim()) return setError("Please enter your email address");
    if (formData.areasOfInterest.length === 0) return setError("Please select at least one area of interest");
    if (formData.availability.length === 0) return setError("Please select your availability");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to submit registration");
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] pt-[260px] sm:pt-[220px] lg:pt-[160px]">
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-[#0A0A0A] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35 mb-4">Submission Received</p>
            <h1 className="font-black text-4xl md:text-5xl tracking-tight text-[#0A0A0A] mb-6">
              Thank you for volunteering!
            </h1>
            <p className="text-black/55 text-lg leading-relaxed mb-4">
              Your registration has been received. We appreciate your willingness to serve our community.
              Someone from our team will contact you soon.
            </p>
            <p className="text-[#C9A84C] font-medium mb-10">
              May Allah reward you for your intention to serve.
            </p>
            <a
              href="/"
              className="inline-block bg-[#0A0A0A] text-white text-xs uppercase tracking-widest font-medium px-8 py-3 rounded-full hover:bg-black/80 transition-colors"
            >
              Return Home
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-[260px] sm:pt-[220px] lg:pt-[160px] pb-20 bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/40 mb-6">
            Al-Faruq Islamic Centre
          </p>
          <h1
            className="font-black tracking-tight leading-none"
            style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
          >
            VOLUNTEER{" "}
            <span
              className="inline-block bg-white text-[#0A0A0A] px-3 py-1.5 rounded-sm uppercase tracking-[0.08em] align-middle"
              style={{ fontSize: "clamp(2rem, 6vw, 5.5rem)" }}
            >
              WITH US
            </span>
          </h1>
          <p className="mt-8 text-white/50 text-lg max-w-xl leading-relaxed">
            Join our team of dedicated volunteers and make a meaningful difference in our community.
          </p>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="bg-[#F5F3EE] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35 mb-4">Why Give Your Time</p>
          <h2 className="font-black text-4xl md:text-5xl tracking-tight text-[#0A0A0A] mb-10 leading-tight">
            The reward of service
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Earn rewards from Allah by serving His community",
              "Connect with fellow Muslims and build lasting friendships",
              "Develop new skills and gain valuable experience",
              "Be part of meaningful community initiatives",
              "Make a positive impact on families and youth",
              "Flexible opportunities that fit your schedule",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white p-5 border border-black/5">
                <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full mt-2 flex-shrink-0" />
                <p className="text-black/65 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-black/35 mb-4">Registration</p>
          <h2 className="font-black text-4xl tracking-tight text-[#0A0A0A] mb-10 leading-tight">
            Register as a Volunteer
          </h2>

          {error && (
            <div className="mb-8 px-5 py-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.2em] font-medium text-black/50 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-black/15 rounded-none bg-[#FAFAF9] focus:outline-none focus:border-[#0A0A0A] transition-colors text-sm"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] font-medium text-black/50 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-black/15 rounded-none bg-[#FAFAF9] focus:outline-none focus:border-[#0A0A0A] transition-colors text-sm"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-[10px] uppercase tracking-[0.2em] font-medium text-black/50 mb-2">
                Phone Number <span className="text-black/25 normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-black/15 rounded-none bg-[#FAFAF9] focus:outline-none focus:border-[#0A0A0A] transition-colors text-sm"
                placeholder="(780) 555-1234"
              />
            </div>

            {/* Areas of Interest */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-black/50 mb-1">
                Areas of Interest <span className="text-red-500">*</span>
              </label>
              <p className="text-black/30 text-xs mb-4">Select all that apply</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {AREAS_OF_INTEREST.map((area) => {
                  const selected = formData.areasOfInterest.includes(area);
                  return (
                    <label
                      key={area}
                      className={`flex items-center gap-3 p-4 border cursor-pointer transition-all text-sm ${
                        selected
                          ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                          : "border-black/10 hover:border-black/30 text-black/65"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleCheckboxChange("areasOfInterest", area)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 ${
                          selected ? "border-white bg-transparent" : "border-black/20"
                        }`}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {area}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-black/50 mb-1">
                Availability <span className="text-red-500">*</span>
              </label>
              <p className="text-black/30 text-xs mb-4">When are you available to volunteer?</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {AVAILABILITY_OPTIONS.map((option) => {
                  const selected = formData.availability.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-4 border cursor-pointer transition-all text-sm ${
                        selected
                          ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                          : "border-black/10 hover:border-black/30 text-black/65"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleCheckboxChange("availability", option)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 ${
                          selected ? "border-white bg-transparent" : "border-black/20"
                        }`}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {option}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.2em] font-medium text-black/50 mb-2">
                Additional Message <span className="text-black/25 normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-black/15 rounded-none bg-[#FAFAF9] focus:outline-none focus:border-[#0A0A0A] transition-colors text-sm resize-none"
                placeholder="Tell us about your experience, skills, or anything else you'd like us to know..."
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 text-sm uppercase tracking-widest font-semibold rounded-full transition-all ${
                  isSubmitting
                    ? "bg-black/20 text-black/40 cursor-not-allowed"
                    : "bg-[#0A0A0A] text-white hover:bg-black/80"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default VolunteerPage;
