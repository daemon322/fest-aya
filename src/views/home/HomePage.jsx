import FestivalMid from "./ladingpage/FestivalMid";
import FestivalTop from "./ladingpage/FestivalTop";

const HomePage = () => {
  return (
    <>
      <div className="bg-black">
        <FestivalTop/>
        <FestivalMid/>
      </div>
    </>
  );
};

export default HomePage;
