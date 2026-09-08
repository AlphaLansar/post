import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Fingerprint, KeyRound, Lock, ShieldCheck, UserRound } from 'lucide-react'
import { DEMO_PASSWORD, DG_NAME, useAuth } from '../auth'
import { PRODUCT } from '../config/weights'

const SECURITY = [
  { icon: Lock, label: 'Chiffrement en transit (TLS)' },
  { icon: ShieldCheck, label: 'Contrôle d’accès par rôle (RBAC)' },
  { icon: Fingerprint, label: 'MFA & SSO — prévus en Phase 2' },
  { icon: KeyRound, label: 'Journal d’audit des connexions' },
]

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation() as { state?: { from?: string } }
  const [pwd, setPwd] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState(false)
  const [busy, setBusy] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErr(false)
    setTimeout(() => {
      const ok = login(pwd)
      setBusy(false)
      if (ok) nav(loc.state?.from ?? '/', { replace: true })
      else setErr(true)
    }, 450)
  }

  return (
    <div className="min-h-full bg-navy-950 text-white grid lg:grid-cols-[1.1fr_1fr]">
      {/* Volet gauche — marque */}
      <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-navy-950 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#C9A227 1px, transparent 1px), linear-gradient(90deg, #C9A227 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="relative flex items-center gap-3">
          <span className="w-11 h-11 rounded-lg bg-gold grid place-items-center font-serif text-navy-950 text-xl font-bold">P</span>
          <div className="leading-tight">
            <div className="font-semibold tracking-wide text-[17px]">POSTE AI</div>
            <div className="text-[10px] text-white/50 uppercase tracking-[0.14em]">Intelligence Décisionnelle</div>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-[34px] xl:text-[40px] leading-[1.1] font-semibold tracking-tight">
            Accès sécurisé à la plateforme de pilotage
          </h1>
          <p className="mt-4 text-[14px] text-white/60 leading-relaxed max-w-md">
            {PRODUCT.org} — espace réservé à la Direction Générale et aux responsables habilités.
            Chaque profil dispose d’un périmètre de données défini par son rôle.
          </p>
          <ul className="mt-8 space-y-2.5">
            {SECURITY.map((s) => (
              <li key={s.label} className="flex items-center gap-3 text-[13px] text-white/75">
                <span className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 grid place-items-center text-gold">
                  <s.icon size={15} />
                </span>
                {s.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[11px] text-white/40">{PRODUCT.disclaimer}</p>
      </div>

      {/* Volet droit — formulaire */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-canvas text-ink">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <span className="w-10 h-10 rounded-lg bg-navy grid place-items-center font-serif text-gold text-lg font-bold">P</span>
            <div className="leading-tight">
              <div className="font-semibold text-navy text-[15px]">POSTE AI</div>
              <div className="text-[10px] text-ink-faint uppercase tracking-[0.12em]">Intelligence Décisionnelle</div>
            </div>
          </div>

          <h2 className="text-[20px] font-semibold text-navy">Connexion</h2>
          <p className="text-[13px] text-ink-muted mt-1">Saisissez le mot de passe pour accéder au tableau de bord exécutif.</p>

          {/* Identité — Direction Générale */}
          <div className="mt-5 flex items-center gap-3 border border-line rounded-lg px-3 py-3 bg-surface">
            <span className="w-10 h-10 rounded-full bg-navy text-gold grid place-items-center shrink-0">
              <UserRound size={18} />
            </span>
            <div className="leading-tight min-w-0">
              <div className="text-[14px] font-semibold text-navy truncate">{DG_NAME}</div>
              <div className="text-[11px] text-ink-muted">Direction Générale · {PRODUCT.org}</div>
            </div>
          </div>

          <form onSubmit={submit} className="mt-4 space-y-4">
            <div>
              <label className="stat-label">Mot de passe</label>
              <div className="mt-1.5 relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type={show ? 'text' : 'password'}
                  value={pwd}
                  onChange={(e) => {
                    setPwd(e.target.value)
                    setErr(false)
                  }}
                  autoFocus
                  placeholder="Mot de passe"
                  className={`w-full text-[13px] bg-surface border rounded-lg pl-9 pr-10 py-2.5 focus:outline-none focus:ring-2 ${
                    err ? 'border-neg focus:ring-neg/20' : 'border-line focus:ring-navy/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                  tabIndex={-1}
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {err && <p className="text-[12px] text-neg mt-1.5">Mot de passe incorrect.</p>}
            </div>

            <button type="submit" className="btn-primary w-full justify-center !py-2.5 !text-[14px]" disabled={busy}>
              {busy ? 'Vérification…' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2 text-[11.5px] text-ink-muted bg-warnbg border border-warn/30 rounded-lg px-3 py-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-warn mt-1.5 shrink-0" />
            <span>
              Prototype de démonstration — authentification simulée. Mot de passe d’accès :{' '}
              <span className="font-mono font-semibold text-ink">{DEMO_PASSWORD}</span>. En production :
              annuaire d’entreprise / SSO + MFA.
            </span>
          </div>

          <p className="text-[11px] text-ink-faint mt-6 text-center">
            {PRODUCT.name} · {PRODUCT.version}
          </p>
        </div>
      </div>
    </div>
  )
}
