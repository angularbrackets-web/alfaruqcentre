import { BadgeDollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EnhancedProgressBar from "./EnhancedProgressBar";
export default function IslamicRelief() {
    return (
      <div className="card p-4 mb-4 mt-32 mx-4 bg-gray-300 rounded-md shadow-md">
        <div className="card-body">
            <div className="container mx-auto flex flex-wrap gap-16">
                <div>
                    <Image
                        src="/IslamicReliefLogo.png"
                        alt="Islamic Relief"
                        width={200}
                        height={200}
                    />
                </div>
                <div className="">
                    <h4 className="text-blue-500 my-1">Fundraising With Islamic Relief</h4>
                    <h1 className="font-bold text-3xl my-1">Support Sahaba and Al-Faruq Mosque</h1>
                    <p className="font-bold text-blue-500">This Ramadan, For every $2 donated, Islamic Relief Canada will match $1</p>
                    <p>Donate today and be part of this legacy!</p>
                    <div className="mt-4">
                        <Link href="https://fundraise.islamicreliefcanada.org/campaign/support-sahaba-and-al-faruq-mosque-2398" target="_blank" className="flex items-center justify-center gap-4 rounded-lg bg-blue-500 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-semibold text-white shadow-sm hover:bg-blue-700">
                        <BadgeDollarSign className="h-4 w-4 lg:h-6 lg:w-6" />
                        <span>Donate with Islamic Relief Canada</span>
                        </Link>    
                    </div>
                </div>
                <div>
                    {/* <h3 className="font-bold text-blue-500">CAMPAIGN PROGRESS</h3>
                    <p className="text-3xl font-bold mt-4 leading-loose md:leading-normal whitespace-normal py-2"><span className="bg-blue-800 text-white p-2 rounded break-keep whitespace-nowrap">$ 8,588.00</span> raised <span className="text-blue-800 break-keep whitespace-nowrap">of $ 200,000.00</span></p> */}
                    <div>
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
        
      </div>
    );
}