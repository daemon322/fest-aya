import FondoV from "../../assets/flyer.png";

export const Flyers = () => {
  return (
    <div className="relative inset-0 select-none w-full h-full z-10">
      <img
        src={FondoV}
        className="relative w-full h-screen sm:h-full object-cover transition-all duration-700 select-none pointer-events-none"
        alt="Voley Masculino"
      />
      {/* Gradient that fades only in the bottom ~5% */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[15%] bg-gradient-to-t from-transparent via-transparent to-black" />
    </div>
  );
};
