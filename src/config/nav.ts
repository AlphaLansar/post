import type { ComponentType } from 'react'
import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  PackageSearch,
  Landmark,
  LineChart,
  ShieldAlert,
  BrainCircuit,
  SlidersHorizontal,
  FileText,
  Map,
  Route,
  Info,
} from 'lucide-react'

export interface NavItem {
  no?: string
  label: string
  to: string
  icon: ComponentType<{ size?: number | string; className?: string }>
}

export const PRIMARY_NAV: NavItem[] = [
  { no: '01', label: 'Vue générale', to: '/', icon: LayoutDashboard },
  { no: '02', label: 'Performance', to: '/performance', icon: TrendingUp },
  { no: '03', label: 'Agences', to: '/agences', icon: Building2 },
  { no: '04', label: 'Courrier & Colis', to: '/logistique', icon: PackageSearch },
  { no: '05', label: 'Finance', to: '/finance', icon: Landmark },
  { no: '06', label: 'Prévisions', to: '/previsions', icon: LineChart },
  { no: '07', label: 'Risques & Alertes', to: '/risques', icon: ShieldAlert },
  { no: '08', label: 'Intelligence IA', to: '/copilot', icon: BrainCircuit },
  { no: '09', label: 'Scénarios', to: '/scenarios', icon: SlidersHorizontal },
  { no: '10', label: 'Rapports', to: '/rapports', icon: FileText },
]

export const SECONDARY_NAV: NavItem[] = [
  { label: 'Réseau postal', to: '/reseau', icon: Map },
  { label: 'Vision de déploiement', to: '/roadmap', icon: Route },
  { label: 'À propos du prototype', to: '/a-propos', icon: Info },
]
