//komponente
import Header from '../components/Header/Header.jsx';
import ScrollToTopButton from '../components/ScrollToTopButton/ScrollToTopButton.jsx';
//stranice
import Home from '../pages/Home.jsx';
import Contact from '../pages/Contact.jsx';
import Team from '../pages/Team.jsx';
import Login from "../pages/LoginPage.jsx";
import Registracija from "../pages/RegistracijaPage.jsx";
import Koordinator from "../pages/KoordinatorPage.jsx";
import Predavac from "../pages/PredavacPage.jsx";
import Participant from "../pages/ParticipantPage.jsx";
import Clan from "../pages/ClanPage.jsx";
//ostalo
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();

  const dashboardStrane = [
    "/koordinator",
    "/predavac",
    "/participant",
    "/clan"
  ];

  const prikaziHeader = !dashboardStrane.some(path =>
    location.pathname.startsWith(path)
  );

  const prikaziScrollButton = !dashboardStrane.some(path => 
    location.pathname.startsWith(path)  
  );

  return (
    <>
      {prikaziHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
        <Route path="/registracija" element={<Registracija />} />
        <Route path="/login" element={<Login />} />

        <Route path="/koordinator/*" element={<Koordinator />} />
        <Route path="/predavac/*" element={<Predavac />} />
        <Route path="/participant/*" element={<Participant />} />
        <Route path="/clan/*" element={<Clan />} />
      </Routes>

      {prikaziScrollButton && <ScrollToTopButton />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />

    </BrowserRouter>
  );
}

export default App;