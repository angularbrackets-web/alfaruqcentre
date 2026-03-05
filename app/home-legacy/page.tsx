"use client";
import Donate3 from "@/app/components/Donate3";
import DynamicHeroSection from "@/app/components/DynamicHeroSection";
import IslamicSchool from "@/app/components/IslamicSchool";
import PosterGallery from "@/app/components/PosterGallery";
import TopBanner from "@/app/components/TopBanner";

const iconSize = 18, iconCount = 100;


export default function Home() {
  return (
    <div>



    

   <TopBanner iconSize={iconSize} iconCount={iconCount} />
      
      <DynamicHeroSection />
      <div className="my-8">
        <PosterGallery />
      </div>
       
      <IslamicSchool />  
      <Donate3 />
    </div>
  );
}
