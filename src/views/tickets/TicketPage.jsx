import CompraEntrada from "../../components/tickets/CompraEntrada";
import Guide from "../../components/tickets/Guide";
import Tribuna from "../../components/tickets/Tribuna";
import "../../styles/tickets/TicketStyle.css";
const TicketPage = () => {
  const eventoId = import.meta.env.VITE_EVENTO_ID || null;
  return (
    <>
      <div className="">
        <Tribuna/>
        <CompraEntrada eventoId={eventoId} />
        <Guide/>
      </div>
    </>
  );
};

export default TicketPage;
