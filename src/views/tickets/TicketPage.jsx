import CompraEntrada from "../../components/tickets/CompraEntrada";
import Guide from "../../components/tickets/Guide";
import Tribuna from "../../components/tickets/Tribuna";
import "../../styles/tickets/TicketStyle.css";
const TicketPage = () => {
  return (
    <>
      <div className="">
        <Tribuna/>
        <CompraEntrada/>
        <Guide/>
      </div>
    </>
  );
};

export default TicketPage;
