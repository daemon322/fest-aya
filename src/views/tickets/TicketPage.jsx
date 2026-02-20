import Boyde from "../../components/body/Boyde";
import CompraEntrada from "../../components/tickets/CompraEntrada";
import "../../styles/tickets/TicketStyle.css";
const TicketPage = () => {
  const eventoId = import.meta.env.VITE_EVENTO_ID || null;
  return (
    <>
      <div className="">
        <Boyde/>
        <CompraEntrada eventoId={eventoId} />
      </div>
    </>
  );
};

export default TicketPage;
