"use client";
import React, { useState, ChangeEvent } from "react";

interface ProvinceRates {
  first: number; // rate for the first $200 of donations
  rest: number;  // rate for donation amounts above $200
}

// Define provincial rates for selected provinces (approximate values)
const provincialRates: { [key: string]: ProvinceRates } = {
  "Alberta": { first: 0.10, rest: 0.21 },
  "British Columbia": { first: 0.05, rest: 0.10 },
  "Ontario": { first: 0.0505, rest: 0.1116 },
  "Saskatchewan": { first: 0.10, rest: 0.21 },
  "Manitoba": { first: 0.10, rest: 0.21 },
  "New Brunswick": { first: 0.05, rest: 0.10 },
  "Nova Scotia": { first: 0.05, rest: 0.10 },
  "Newfoundland and Labrador": { first: 0.05, rest: 0.10 },
  "Quebec": { first: 0.00, rest: 0.00 } // Placeholder – Quebec uses a different calculation
};

const provinces = Object.keys(provincialRates);

const TaxCreditCalculator: React.FC = () => {
  const [donation, setDonation] = useState<number>(0);
  const [province, setProvince] = useState<string>("Alberta");

  // Handle donation amount input
  const handleDonationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDonation(isNaN(value) ? 0 : value);
  };

  // Handle province selection change
  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProvince(e.target.value);
  };

  /**
   * Calculate federal credit:
   * - For the first $200: 15%
   * - For any amount above $200: 29%
   */
  const calculateFederalCredit = (donation: number): number => {
    if (donation <= 200) {
      return donation * 0.15;
    }
    return 200 * 0.15 + (donation - 200) * 0.29;
  };

  /**
   * Calculate provincial credit:
   * Uses province-specific rates.
   * If a province (like Quebec) uses a different method, this will simply return 0.
   */
  const calculateProvincialCredit = (donation: number, province: string): number => {
    const rates = provincialRates[province];
    if (!rates || (rates.first === 0 && rates.rest === 0)) {
      return 0;
    }
    if (donation <= 200) {
      return donation * rates.first;
    }
    return 200 * rates.first + (donation - 200) * rates.rest;
  };

  const federalCredit = calculateFederalCredit(donation);
  const provincialCredit = calculateProvincialCredit(donation, province);
  const totalCredit = federalCredit + provincialCredit;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Charitable Donation Tax Credit Calculator (2025)
      </h1>
      
      <div className="mb-4">
        <label htmlFor="donation" className="block text-gray-700 mb-2">
          Total Donation Amount ($)
        </label>
        <input
          id="donation"
          type="number"
          value={donation}
          onChange={handleDonationChange}
          placeholder="Enter total donations"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          min="0"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="province" className="block text-gray-700 mb-2">
          Province or Territory
        </label>
        <select
          id="province"
          value={province}
          onChange={handleProvinceChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        >
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>
      
      <div className="border-t pt-4">
        <p className="mb-2">
          <span className="font-semibold">Federal Credit:</span> ${federalCredit.toFixed(2)}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Provincial Credit:</span> ${provincialCredit.toFixed(2)}
        </p>
        <p className="text-lg font-semibold">
          <span>Total Estimated Tax Credit:</span> ${totalCredit.toFixed(2)}
        </p>
      </div>
      
      <div className="mt-6 text-xs text-gray-600">
        <p>
          Disclaimer: This calculator lets you estimate the amount of the non-refundable tax credit you may receive for monetary donations to registered Canadian charities claimed on your 2025 income tax return based on your province or territory of residence and the total donations in the 2025 tax year. It does not take into account all possible tax situations including the increased rate for those in the highest tax bracket. As a non-refundable tax credit, it can only be used to reduce tax owed; if you don&apos;t owe any tax, you don&apos;t get a refund. Other credits or restrictions may also apply.
        </p>
      </div>
    </div>
  );
};

export default TaxCreditCalculator;
