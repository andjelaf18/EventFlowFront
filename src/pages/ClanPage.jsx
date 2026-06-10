import Panel from '../components/Panel/Panel.jsx';
import TopPanel from '../components/topPanel/topPanel.jsx';
import DashboardSection from '../components/Dashboard/DashboardSection.jsx';
import ProfilClanSection from '../components/ClanSection/ProfilClanSection.jsx';
import DostupnostClanovaSection from '../components/ClanSection/DostupnostClanovaSection.jsx';
import TaskoviSection from '../components/ClanSection/TaskoviZaClanoveSection.jsx';

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function ClanPage() {

  return (
    <>
      <div style={{ display: 'flex', background: '#F6F8FB' }}>
        <Panel />

        <div style={{ flex: 1, marginLeft: '250px', position: 'relative' }}>
          <TopPanel />


          <div style={{ padding: '80px 40px 40px 40px' }}>
            <Routes>
              <Route index element={<DashboardSection />} />
              <Route path="taskovi" element={<TaskoviSection />} />
              <Route path="dostupnost" element={<DostupnostClanovaSection />} />
              <Route path="profil-podesavanja" element={<ProfilClanSection />} />
            </Routes>
          </div>
        </div>
      </div>



    </>
  )
} export default ClanPage