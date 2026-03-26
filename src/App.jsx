import "./App.css";
import HomePage from "./views/home/HomePage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TicketPage from "./views/tickets/TicketPage";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import ScrollToTop from "./components/layouts/ScrollToTop";
import About from "./views/about/AboutPage";
import TerminoCondiciones from "./views/paginas/TerminoCondiciones/TerminoCondiciones";
import PoliticCookies from "./views/paginas/Politic_Cookies/PoliticCookies";
import ClaimsBook from "./views/paginas/LibroReclamaciones/LibroReclamaciones";
import PrivacPoli from "./views/paginas/PrivaPoly/PrivacPoli";
import CondicionesVenta from "./views/paginas/CondicionesVenta/CondicionesVenta";
import CartPage from "./views/tickets/CartPage";
import Location from "./views/location/Location";
import PointSale from "./views/location/PointSale";
import VoleyaLimite from "./views/landing/VoleyaLimite";


function App() {

  return (
    <>
    <Router>
      <ScrollToTop/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/voley-al-limite/tickets" element={<TicketPage />} />
        <Route path="/voley-al-limite" element={<VoleyaLimite/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/Shopp-cart" element={<CartPage/>} />
        <Route path="/paginas/Terms-conditions" element={<TerminoCondiciones/>} />
        <Route path="/paginas/Policy-cookie" element={<PoliticCookies/>} />
        <Route path="/paginas/Complaints-book" element={<ClaimsBook/>} />
        <Route path="/paginas/Privacy-Policy" element={<PrivacPoli/>} />
        <Route path="/paginas/Terms-of-sale" element={<CondicionesVenta/>} />
        <Route path="/location" element={<Location/>} />
        <Route path="/PointSale" element={<PointSale/>} />
      </Routes>
      <Footer/>
    </Router>
    </>
  );
}

export default App;
