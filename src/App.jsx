import "./App.css";
import HomePage from "./views/home/HomePage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TicketPage from "./views/tickets/TicketPage";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import ScrollToTop from "./components/layouts/ScrollToTop";
import About from "./views/about/AboutPage";
import Introduction from "./components/shared/Introduction";
import TerminoCondiciones from "./views/paginas/TerminoCondiciones/TerminoCondiciones";
import PoliticCookies from "./views/paginas/Politic_Cookies/PoliticCookies";
import ClaimsBook from "./views/paginas/LibroReclamaciones/LibroReclamaciones";
import PrivacPoli from "./views/paginas/PrivaPoly/PrivacPoli";


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
        <Route path="/paginas/TerminoCondiciones" element={<TerminoCondiciones/>} />
        <Route path="/paginas/PoliticCookies" element={<PoliticCookies/>} />
        <Route path="/paginas/LibroReclamaciones" element={<ClaimsBook/>} />
        <Route path="/paginas/PrivacPoli" element={<PrivacPoli/>} />
      </Routes>
      <Footer/>
    </Router>
    </>
  );
}

export default App;
