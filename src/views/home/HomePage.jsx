import FestivalHero from "./ladingpage/FestivalHero";
import FestivalTop from "./ladingpage/FestivalTop";

const HomePage = () => {
  return (
    <>
      <div className="bg-black">
        <FestivalTop/>
        <FestivalHero />
      </div>
    </>
  );
};

export default HomePage;
