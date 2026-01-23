import CompraEntrada from "../../components/CompraEntrada";
import "../../styles/tickets/TicketStyle.css";
const TicketPage = () => {
  const eventoId = import.meta.env.VITE_EVENTO_ID || null;
  return (
    <>
      <div className="bg-gradient-to-t from-[#0a0a0f] via-black/40 to-transparent">
        <div className="w-full">
          <div className="w-full sm:h-[400px] object-cover"></div>
        </div>
        <CompraEntrada eventoId={eventoId} />
      </div>
    </>
  );
};

export default TicketPage;
