import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Bell,
  ChevronRight,
  FileText,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react'
import { PRIMARY_NAV, SECONDARY_NAV } from '../config/nav'
import { PRODUCT } from '../config/weights'
import { NOTIFICATIONS } from '../data/narrative'

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-9 h-9 rounded-lg bg-gold grid place-items-center font-serif text-navy-950 text-lg font-bold shrink-0">
        P
      </span>
      {!compact && (
        <div className="leading-tight">
          <div className="text-white font-semibold tracking-wide text-[15px]">POSTE AI</div>
          <div className="text-[10px] text-white/50 uppercase tracking-[0.12em]">Intelligence Décisionnelle</div>
        </div>
      )}
    </div>
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35 mb-2">Pilotage</p>
      <ul className="space-y-0.5">
        {PRIMARY_NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-[10px] font-mono tabular-nums ${isActive ? 'text-gold' : 'text-white/30'}`}>{item.no}</span>
                  <item.icon size={16} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {isActive && <span className="ml-auto w-1 h-4 rounded-full bg-gold" />}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35 mt-6 mb-2">Contexte</p>
      <ul className="space-y-0.5">
        {SECONDARY_NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
                }`
              }
            >
              <item.icon size={16} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function SidebarFooter() {
  return (
    <div className="border-t border-white/10 p-3 space-y-1">
      <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-white/55 hover:text-white hover:bg-white/[0.06] transition-colors">
        <Settings size={16} /> Paramètres
      </button>
      <div className="flex items-center gap-3 rounded-lg px-3 py-2">
        <span className="w-8 h-8 rounded-full bg-white/10 grid place-items-center text-white text-[12px] font-semibold">DG</span>
        <div className="leading-tight min-w-0 flex-1">
          <div className="text-[12.5px] text-white font-medium truncate">A. Traoré</div>
          <div className="text-[10px] text-white/40 truncate">Direction Générale</div>
        </div>
        <LogOut size={14} className="text-white/40" />
      </div>
    </div>
  )
}

function NotificationCenter({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-[340px] card shadow-pop overflow-hidden">
        <div className="card-h">
          <span className="text-[13px] font-semibold text-navy">Centre de notifications</span>
          <button onClick={onClose}><X size={15} className="text-ink-muted" /></button>
        </div>
        <ul className="max-h-[380px] overflow-y-auto divide-y divide-line">
          {NOTIFICATIONS.map((n) => {
            const Icon = n.kind === 'rapport' ? FileText : n.kind === 'alerte' ? Bell : ShieldCheck
            return (
              <li key={n.id} className={`flex gap-3 px-4 py-3 ${n.unread ? 'bg-navy-50/50' : ''}`}>
                <span className="w-7 h-7 rounded-lg bg-navy-50 grid place-items-center text-navy shrink-0">
                  <Icon size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] text-ink leading-snug">{n.text}</p>
                  <p className="text-[10.5px] text-ink-faint mt-0.5">{n.time}</p>
                </div>
                {n.unread && <span className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />}
              </li>
            )
          })}
        </ul>
        <div className="px-4 py-2.5 border-t border-line text-center">
          <button className="text-[12px] text-info font-medium">Tout marquer comme lu</button>
        </div>
      </div>
    </>
  )
}

const TITLES: Record<string, string> = {
  '/': 'Vue générale',
  '/performance': 'Performance',
  '/agences': 'Agences',
  '/logistique': 'Courrier & Colis',
  '/finance': 'Finance',
  '/previsions': 'Prévisions',
  '/risques': 'Risques & Alertes',
  '/copilot': 'Intelligence IA',
  '/scenarios': 'Scénarios',
  '/rapports': 'Rapports',
  '/reseau': 'Réseau postal',
  '/roadmap': 'Vision de déploiement',
  '/a-propos': 'À propos du prototype',
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const loc = useLocation()
  const crumb = TITLES[loc.pathname] ?? (loc.pathname.startsWith('/agences/') ? 'Fiche agence' : 'Détail')
  const unread = NOTIFICATIONS.filter((n) => n.unread).length

  return (
    <div className="flex h-full bg-canvas">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-[248px] shrink-0 flex-col bg-navy-950">
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <Logo />
        </div>
        <SidebarNav />
        <SidebarFooter />
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-navy-950/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-[248px] z-50 flex flex-col bg-navy-950 lg:hidden">
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
              <Logo />
              <button onClick={() => setMobileOpen(false)}><X size={18} className="text-white/60" /></button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
            <SidebarFooter />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 bg-surface border-b border-line flex items-center justify-between px-4 lg:px-6 relative">
          <div className="flex items-center gap-3 min-w-0">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} className="text-ink" /></button>
            <div className="flex items-center gap-1.5 text-[13px] text-ink-muted min-w-0">
              <span className="hidden sm:inline">POSTE AI</span>
              <ChevronRight size={14} className="hidden sm:inline text-ink-faint" />
              <span className="text-navy font-semibold truncate">{crumb}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-warn bg-warnbg border border-warn/30 rounded px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-warn" /> Prototype · Données synthétiques
            </span>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative w-9 h-9 rounded-lg border border-line grid place-items-center hover:bg-navy-50 transition-colors"
            >
              <Bell size={16} className="text-ink" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-neg text-white text-[10px] font-semibold grid place-items-center">
                  {unread}
                </span>
              )}
            </button>
          </div>
          <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6">
            <Outlet />
            <footer className="mt-10 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-faint">
              <span>
                {PRODUCT.name} · {PRODUCT.tagline} · {PRODUCT.org}
              </span>
              <span>{PRODUCT.disclaimer} · {PRODUCT.version}</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
