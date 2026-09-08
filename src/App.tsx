import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './auth'
import { Layout } from './components/Layout'
import Login from './pages/Login'
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

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/accueil" element={<Landing />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
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
    </AuthProvider>
  )
}
