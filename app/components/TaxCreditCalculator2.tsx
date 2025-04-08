"use client";
import { useState } from 'react';

export default function TaxCreditCalculator2() {
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [province, setProvince] = useState<string>('AB');
  const [results, setResults] = useState<null | {
    federal: number;
    provincial: number;
    total: number;
    effectiveRate: number;
  }>(null);

  // 2025 Tax Credit Rates (as of cutoff date)
  const taxCreditRates: Record<string, { firstBracket: number; remainingBracket: number }> = {
    // Federal rates are the same for all provinces
    federal: { firstBracket: 0.15, remainingBracket: 0.29 },
    // Provincial rates
    AB: { firstBracket: 0.10, remainingBracket: 0.21 },
    BC: { firstBracket: 0.0506, remainingBracket: 0.168 },
    MB: { firstBracket: 0.108, remainingBracket: 0.174 },
    NB: { firstBracket: 0.094, remainingBracket: 0.198 },
    NL: { firstBracket: 0.087, remainingBracket: 0.187 },
    NS: { firstBracket: 0.0879, remainingBracket: 0.21 },
    NT: { firstBracket: 0.059, remainingBracket: 0.141 },
    NU: { firstBracket: 0.04, remainingBracket: 0.115 },
    ON: { firstBracket: 0.0505, remainingBracket: 0.1116 },
    PE: { firstBracket: 0.098, remainingBracket: 0.167 },
    QC: { firstBracket: 0.15, remainingBracket: 0.24 },
    SK: { firstBracket: 0.105, remainingBracket: 0.145 },
    YT: { firstBracket: 0.064, remainingBracket: 0.128 },
  };

  const provinceNames: Record<string, string> = {
    AB: 'Alberta',
    BC: 'British Columbia',
    MB: 'Manitoba',
    NB: 'New Brunswick',
    NL: 'Newfoundland and Labrador',
    NS: 'Nova Scotia',
    NT: 'Northwest Territories',
    NU: 'Nunavut',
    ON: 'Ontario',
    PE: 'Prince Edward Island',
    QC: 'Quebec',
    SK: 'Saskatchewan',
    YT: 'Yukon',
  };

  const DONATION_THRESHOLD = 200;

  const calculateTaxCredit = () => {
    const amount = parseFloat(donationAmount);
    
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    // Federal calculation
    let federalCredit = 0;
    if (amount <= DONATION_THRESHOLD) {
      federalCredit = amount * taxCreditRates.federal.firstBracket;
    } else {
      federalCredit = 
        DONATION_THRESHOLD * taxCreditRates.federal.firstBracket + 
        (amount - DONATION_THRESHOLD) * taxCreditRates.federal.remainingBracket;
    }

    // Provincial calculation
    let provincialCredit = 0;
    if (amount <= DONATION_THRESHOLD) {
      provincialCredit = amount * taxCreditRates[province].firstBracket;
    } else {
      provincialCredit = 
        DONATION_THRESHOLD * taxCreditRates[province].firstBracket + 
        (amount - DONATION_THRESHOLD) * taxCreditRates[province].remainingBracket;
    }

    const totalCredit = federalCredit + provincialCredit;
    const effectiveRate = (totalCredit / amount) * 100;

    setResults({
      federal: federalCredit,
      provincial: provincialCredit,
      total: totalCredit,
      effectiveRate: effectiveRate
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateTaxCredit();
  };

  const handleDonationAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters except decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Handle the case where user inputs a decimal point
    if (value === '.') {
      setDonationAmount('0.');
      return;
    }
    
    // Remove leading zeros (unless it's "0." for decimal)
    if (value.startsWith('0') && value.length > 1 && value[1] !== '.') {
      setDonationAmount(value.replace(/^0+/, ''));
    } else {
      setDonationAmount(value);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">2025 Donation Tax Credit Calculator</h2>
        <p className="text-gray-600 text-sm">
          Estimate your tax credits for charitable donations in Canada
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="donation-amount" className="block text-gray-700 font-medium">
            Total Donation Amount for 2025
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              id="donation-amount"
              type="text"
              value={donationAmount}
              onChange={handleDonationAmountChange}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Donation amount in Canadian dollars"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="province" className="block text-gray-700 font-medium">
            Province/Territory of Residence
          </label>
          <select
            id="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            aria-label="Select your province or territory"
          >
            {Object.entries(provinceNames).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Calculate Tax Credit
        </button>
      </form>

      {results && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Estimated Tax Credits</h3>
          
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-gray-600">Federal Credit:</div>
            <div className="text-gray-800 font-medium text-right">{formatCurrency(results.federal)}</div>
            
            <div className="text-gray-600">Provincial Credit:</div>
            <div className="text-gray-800 font-medium text-right">{formatCurrency(results.provincial)}</div>
            
            <div className="text-gray-600 font-semibold border-t border-gray-300 pt-2 mt-1">Total Tax Credit:</div>
            <div className="text-gray-800 font-bold text-right border-t border-gray-300 pt-2 mt-1">{formatCurrency(results.total)}</div>
            
            <div className="text-gray-600">Effective Rate:</div>
            <div className="text-gray-800 font-medium text-right">{results.effectiveRate.toFixed(1)}%</div>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 p-3 bg-gray-50 rounded-md">
        <p className="font-semibold mb-1">Disclaimer:</p>
        <p>
          This calculator estimates the non-refundable tax credit for monetary donations to registered Canadian 
          charities claimed on your 2025 income tax return based on your province and donation amount. It does not 
          account for all possible tax situations including increased rates for those in the highest tax bracket. 
          As a non-refundable credit, it can only reduce tax owed. Other credits or restrictions may apply, especially 
          for residents of Quebec and Alberta.
        </p>
      </div>
    </div>
  );
}