import { Link } from 'react-router-dom'
import { ArrowRight, BrainCircuit, LineChart, ShieldAlert, Sparkles } from 'lucide-react'
import { PRODUCT } from '../config/weights'

const PILLARS = [
  { icon: LineChart, title: 'SEE / UNDERSTAND', text: 'Visualiser la performance nationale, régionale et par agence, et comprendre les causes.' },
  { icon: BrainCircuit, title: 'PREDICT', text: 'Anticiper l’évolution du chiffre d’affaires, des colis et des transactions.' },
  { icon: ShieldAlert, title: 'RECOMMEND / DECIDE', text: 'Détecter les risques, recevoir des recommandations et simuler les décisions.' },
]

export default function Landing() {
  return (
    <div className="min-h-full bg-navy-950 text-white flex flex-col">
      <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg bg-gold grid place-items-center font-serif text-navy-950 text-lg font-bold">P</span>
          <div className="leading-tight">
            <div className="font-semibold tracking-wide text-[15px]">POSTE AI</div>
            <div className="text-[10px] text-white/50 uppercase tracking-[0.12em]">Intelligence Décisionnelle</div>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gold/90 border border-gold/30 rounded px-2 py-1">
          Prototype de démonstration
        </span>
      </header>

      <main className="flex-1 grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 lg:px-16 py-16 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[12px] text-gold/90 font-medium mb-6">
            <Sparkles size={14} /> Système d’intelligence décisionnelle avec assistant IA intégré
          </span>
          <h1 className="text-[38px] lg:text-[46px] leading-[1.08] font-semibold tracking-tight">
            L’intelligence des données au service de la décision
          </h1>
          <p className="mt-5 text-[15px] text-white/65 leading-relaxed">
            Une plateforme destinée à transformer les données opérationnelles, financières, commerciales et
            territoriales de {PRODUCT.org} en informations exploitables, prévisions et recommandations —
            pour la Direction Générale et les responsables habilités.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/" className="btn-gold !px-5 !py-2.5 !text-[14px]">
              Accéder au dashboard <ArrowRight size={16} />
            </Link>
            <Link to="/a-propos" className="btn-ghost !border-white/20 !text-white/80 hover:!bg-white/10 !px-5 !py-2.5 !text-[14px]">
              À propos du prototype
            </Link>
          </div>
          <p className="mt-10 text-[11px] text-white/40">{PRODUCT.disclaimer}</p>
        </div>

        <div className="hidden lg:flex flex-col justify-center gap-4 px-16 py-16 bg-navy-900/60 border-l border-white/10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 mb-2">
            Data → Analyse → IA → Prévision → Risques → Recommandation → Décision
          </div>
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-xl bg-white/[0.04] border border-white/10 p-5">
              <div className="flex items-center gap-2.5 text-gold">
                <p.icon size={18} />
                <span className="text-[12px] font-semibold tracking-wide text-white">{p.title}</span>
              </div>
              <p className="mt-2 text-[13px] text-white/60 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
