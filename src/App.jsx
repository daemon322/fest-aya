import "./App.css";
import HomePage from "./views/home/HomePage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TicketPage from "./views/tickets/TicketPage";


function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tickets" element={<TicketPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
