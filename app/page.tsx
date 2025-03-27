"use client";
import Donate from "./components/Donate";
import HeroSectionTable from "./components/HeroSectionTable2";
import IslamicRelief from "./components/IslamicRelief";
import IslamicSchool from "./components/IslamicSchool";
import PosterGallery from "./components/PosterGallery";
import TopBanner from "./components/TopBanner";

const iconSize = 18, iconCount = 100;


export default function Home() {
  return (
    <div>



    

   <TopBanner iconSize={iconSize} iconCount={iconCount} />
      
      <IslamicRelief />
      <HeroSectionTable />
      <div className="my-8">
        <PosterGallery />
      </div>
       
      <IslamicSchool />  
      <Donate />
     
    </div>
  );
}
