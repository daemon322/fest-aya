import "./App.css";
import HomePage from "./views/home/HomePage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TicketPage from "./views/tickets/TicketPage";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import ScrollToTop from "./components/layouts/ScrollToTop";
import About from "./views/about/AboutPage";
import Terms from "./components/shared/Terms";
import Introduction from "./components/shared/Introduction";


function App() {

  return (
    <>
    <Router>
      <ScrollToTop/>
      <Navbar/>
      <Introduction/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tickets" element={<TicketPage />} />
        <Route path="/about" element={<About/>} />
        <Route path="/terms" element={<Terms/>} />
      </Routes>
      <Footer/>
    </Router>
    </>
  );
}

export default App;
