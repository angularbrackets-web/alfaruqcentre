"use client";
import Donate3 from "./components/Donate3";
import DynamicHeroSection from "./components/DynamicHeroSection";
import IslamicSchool from "./components/IslamicSchool";
import PosterGallery from "./components/PosterGallery";
import TopBanner from "./components/TopBanner";

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
