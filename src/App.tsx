import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Performance from './pages/Performance'
import Agencies from './pages/Agencies'
import AgencyDetail from './pages/AgencyDetail'
import Logistics from './pages/Logistics'
import Finance from './pages/Finance'
import Forecasting from './pages/Forecasting'
import Risks from './pages/Risks'
import Copilot from './pages/Copilot'
import Scenarios from './pages/Scenarios'
import Reports from './pages/Reports'
import NetworkMap from './pages/NetworkMap'
import Roadmap from './pages/Roadmap'
import About from './pages/About'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/accueil" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/agences" element={<Agencies />} />
          <Route path="/agences/:id" element={<AgencyDetail />} />
          <Route path="/logistique" element={<Logistics />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/previsions" element={<Forecasting />} />
          <Route path="/risques" element={<Risks />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/rapports" element={<Reports />} />
          <Route path="/reseau" element={<NetworkMap />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/a-propos" element={<About />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
