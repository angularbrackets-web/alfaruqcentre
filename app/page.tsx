import Donate from "./components/Donate";
import HeroSectionTable from "./components/HeroSectionTable";
import IslamicRelief from "./components/IslamicRelief";
import IslamicSchool from "./components/IslamicSchool";
import PosterGallery from "./components/PosterGallery";


export default function Home() {
  return (
    <div>
      <IslamicRelief />
      <HeroSectionTable />
      <PosterGallery /> 
      <IslamicSchool />  
      <Donate />
     
    </div>
  );
}
