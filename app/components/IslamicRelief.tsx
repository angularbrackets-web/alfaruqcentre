import { BadgeDollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EnhancedProgressBar from "./EnhancedProgressBar";

export default function IslamicRelief() {
  return (
    <div className="card p-4 mb-4 mt-8 lg:mt-32 mx-4 bg-gray-300 rounded-md shadow-md">
      <div className="card-body">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Logo Section */}
          <div className="flex justify-center items-center">
            <Image
              src="/IslamicReliefLogo.png"
              alt="Islamic Relief"
              className="w-48 h-48 lg:w-72 lg:h-72 object-contain"
              width={200}
              height={200}
            />
          </div>
          {/* Text Section */}
          <div className="items-center justify-center text-center lg:text-left space-y-2 w-full">
            <h4 className="text-blue-500">Fundraising With Islamic Relief</h4>
            <h1 className="font-bold text-3xl text-blue-950">
              Support Sahaba and Al-Faruq Mosque
            </h1>
            <p className="font-bold text-blue-500">
              This Ramadan, For every $2 donated, Islamic Relief Canada will match $1
            </p>
            <p>Donate today and be part of this legacy!</p>
            <div className="mt-4">
              <Link
                href="https://fundraise.islamicreliefcanada.org/campaign/support-sahaba-and-al-faruq-mosque-2398"
                target="_blank"
                className="flex items-center justify-center text-center gap-4 rounded-lg bg-blue-500 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-semibold text-white shadow-sm hover:bg-blue-700 w-96 mx-auto lg:mx-0"
              >
                <BadgeDollarSign className="h-4 w-4 lg:h-6 lg:w-6" />
                <span>Donate with Islamic Relief Canada</span>
              </Link>
            </div>
          </div>
          {/* Progress Bar Section */}
          <div className="w-full">
            <EnhancedProgressBar 
              theme="rainbow"
              variant="modern"
              height="large"
              showMilestones={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
