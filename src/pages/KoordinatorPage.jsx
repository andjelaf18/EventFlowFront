import Panel from '../components/Panel/Panel.jsx';
import TopPanel from '../components/TopPanel/TopPanel.jsx';
import DashboardSection from '../components/Dashboard/DashboardSection.jsx';
import ClanoviTimaSection from '../components/KoordinatorSection/ClanoviTimaSection.jsx';
import OstaliKorisnici from '../components/KoordinatorSection/OstaliKorisniciSection.jsx';
import AgendaSection from '../components/KoordinatorSection/AgendaSection.jsx';
import DogadjajSection from '../components/KoordinatorSection/DogadjajSection.jsx';
import ZahtevSection from '../components/KoordinatorSection/ZahtevSection.jsx';
import ProfilSection from '../components/KoordinatorSection/ProfilSection.jsx';

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function KoordinatorPage(){

    return(
        <>
        <div style={{ display: 'flex', background: '#F6F8FB'}}>
            <Panel />

            <div style={{ flex: 1, marginLeft: '250px', position: 'relative' }}>
                <TopPanel />
                
                
                <div style={{ padding: '80px 40px 40px 40px' }}> 
                    <Routes>
                        {/*<Route path="/" element={<div>Dobrodošli na Dashboard</div>} />
                        <Route index element={<div>Dobrodošli na Dashboard</div>} />*/}
                        <Route index element={<DashboardSection />} />
                        <Route path="clanovi" element={<ClanoviTimaSection />} />
                        <Route path="ostali-korisnici" element={<OstaliKorisnici/>} />
                        <Route path="agenda" element={<AgendaSection />} />
                        <Route path="novi-event" element={<DogadjajSection />} />
                        <Route path="zahtevi" element={<ZahtevSection />} />
                        <Route path="profil-podesavanja" element={<ProfilSection />} />
                    </Routes>
                </div>
            </div>
        </div>
        </>
    )
}export default KoordinatorPage