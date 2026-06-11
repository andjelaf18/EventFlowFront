import Panel from '../components/Panel/Panel.jsx';
import TopPanel from '../components/topPanel/topPanel.jsx';
import DashboardSection from '../components/Dashboard/DashboardSection.jsx';
import AgendaPartSection from '../components/ParticipantSection/AgendaParticipantSection.jsx';
//import ZahteviPartSection from '../components/ParticipantSection/ZahteviParticipantSection.jsx';
import ProfilPartSection from '../components/ParticipantSection/ProfilParticipantSection.jsx';
import PomocOdKoordinatora from '../components/PomocOdKoordinatora/PomocOdKoordinatora.jsx';

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function Participant(){

    return(
        <>
        <Panel> </Panel>
        <TopPanel> </TopPanel>       
        
        <div style={{ display: 'flex', background: '#F6F8FB'}}>
            <Panel />

            <div style={{ flex: 1, marginLeft: '250px', position: 'relative' }}>
                <TopPanel />
                
                <div style={{ padding: '80px 40px 40px 40px' }}> 
                    <Routes>
                        <Route index element={<DashboardSection />} />
                        <Route path="agenda" element={<AgendaPartSection />} />
                        {/* <Route path="zahtevi" element={<ZahteviPartSection />}/> */}
                        <Route path="profil-podesavanja" element={<ProfilPartSection />}/> 
                        <Route path="pomoc-od-koordinatora" element={<PomocOdKoordinatora/> } />
                    </Routes>
                </div>
            </div>
        </div>
        
        
        </>
    )
}export default Participant