import Donate from "./components/Donate";
import HeroSectionTable from "./components/HeroSectionTable";
import IslamicRelief from "./components/IslamicRelief";
import PosterGallery from "./components/PosterGallery";


export default function Home() {
  return (
    <div>
      <IslamicRelief />
      <HeroSectionTable />
      <PosterGallery />      
      <Donate />
     
    </div>
  );
}
