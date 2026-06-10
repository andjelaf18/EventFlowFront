import Panel from '../components/Panel/Panel.jsx';
import TopPanel from '../components/TopPanel/TopPanel.jsx';
import DashboardSection from '../components/Dashboard/DashboardSection.jsx';
import SesijeSection from '../components/PredavacSection/SesijeSection.jsx';
import PomocOdKoordSection from '../components/PredavacSection/PomocOdKoordSection.jsx';
import ProfilPredavacSection from '../components/PredavacSection/ProfilPredavacSection.jsx';

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function Predavac(){

    return(
        <>
        {/*<Panel> </Panel>
        <Toppanel> </Toppanel>   */}        
        
        <div style={{ display: 'flex', background: '#F6F8FB'}}>
            <Panel />

            <div style={{ flex: 1, marginLeft: '250px', position: 'relative' }}>
                <TopPanel />
                
                <div style={{ padding: '80px 40px 40px 40px' }}> 
                    <Routes>
                        <Route index element={<DashboardSection />} />
                        <Route path="sesije" element={<SesijeSection />} />
                        <Route path="pomoc-od-koordinatora" element={<PomocOdKoordSection/>} />
                        <Route path="profil-podesavanja" element={<ProfilPredavacSection/>} />
                    </Routes>
                </div>
            </div>
        </div>
        </>
    )
}export default Predavac