"use client";
import { motion } from "framer-motion";
import Donate from "./components/Donate";
import HeroSectionTable from "./components/HeroSectionTable";
import IslamicRelief from "./components/IslamicRelief";
import IslamicSchool from "./components/IslamicSchool";
import PosterGallery from "./components/PosterGallery";
import { DollarSignIcon } from "lucide-react";
import Image from "next/image";
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
