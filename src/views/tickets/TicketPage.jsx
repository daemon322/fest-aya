import CompraEntrada from "../../components/CompraEntrada";
import "../../styles/tickets/TicketStyle.css";
const TicketPage = () => {
  const eventoId = import.meta.env.VITE_EVENTO_ID || null;
  return (
    <>
      <div className="">
        <div className="w-full">
          <div className="w-full sm:h-[400px] ticket-heros relative overflow-hidden"></div>
        </div>
        <CompraEntrada eventoId={eventoId} />
      </div>
    </>
  );
};

export default TicketPage;
