import { PageHeader, Card, CardHeader } from '../components/ui'
import { Check, Database, LayoutGrid, Rocket, ServerCog, Sparkles } from 'lucide-react'

const PHASES = [
  { n: 'Phase 1', icon: LayoutGrid, title: 'Prototype', status: 'En cours', text: "Maquette fonctionnelle sur données synthétiques. Validation de la valeur métier et de l'expérience utilisateur avec la Direction Générale.", items: ['Design system institutionnel', 'Dashboard exécutif + 10 modules', 'Moteur analytique & copilote simulés'] },
  { n: 'Phase 2', icon: Database, title: 'Pilote avec données réelles', status: 'À venir', text: 'Connexion à un premier périmètre de données réelles (une direction ou une région pilote). Mise en place du Data Warehouse et des premiers modèles ML.', items: ['ETL / intégration des sources pilotes', 'Data Warehouse (PostgreSQL)', 'Modèles de prévision entraînés'] },
  { n: 'Phase 3', icon: ServerCog, title: 'Connexion aux systèmes existants', status: 'À venir', text: 'Industrialisation des flux : intégration des applications métier, finance, logistique et réseau. Gouvernance de la donnée et sécurité renforcées.', items: ['API sécurisées vers les SI métier', 'RBAC, audit logs, chiffrement', 'Qualité & catalogue de données'] },
  { n: 'Phase 4', icon: Rocket, title: 'Déploiement institutionnel', status: 'À venir', text: "Généralisation à l'ensemble des directions et des régions. Formation des utilisateurs, conduite du changement, exploitation en continu.", items: ['Déploiement national', 'Formation & adoption', 'Exploitation 24/7 & support'] },
  { n: 'Phase 5', icon: Sparkles, title: 'Intelligence prédictive avancée', status: 'Vision', text: 'Optimisation par IA : recommandations proactives, détection fine des anomalies, simulation avancée, LLM + RAG sur le patrimoine de données.', items: ['Copilote LLM + RAG sur données réelles', 'Optimisation réseau & tournées', 'Aide à la décision temps réel'] },
]

const ARCH = [
  'Sources de données (métier, finance, logistique, réseau, territoire)',
  'Data Integration Layer (ETL / CDC)',
  'Data Lake / Data Warehouse (PostgreSQL)',
  'Analytics Engine (KPI, scores, classements)',
  'ML Engine (prévision, anomalies, risques)',
  'AI / LLM Layer (copilote, RAG, explications)',
  'Decision Engine (recommandations, scénarios)',
  'Dashboard · Copilot · Reports',
]

export default function Roadmap() {
  return (
    <>
      <PageHeader title="Vision de déploiement" subtitle="Trajectoire du prototype vers le système d'intelligence décisionnelle institutionnel" />

      <div className="space-y-3 mb-8">
        {PHASES.map((p, i) => (
          <Card key={p.n} className="p-5">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className={`w-10 h-10 rounded-lg grid place-items-center ${i === 0 ? 'bg-navy text-gold' : 'bg-navy-50 text-navy'}`}>
                  <p.icon size={18} />
                </span>
                {i < PHASES.length - 1 && <span className="w-px flex-1 bg-line mt-2" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">{p.n}</span>
                  <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${i === 0 ? 'bg-posbg text-pos' : 'bg-navy-50 text-ink-muted'}`}>{p.status}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-navy mt-1">{p.title}</h3>
                <p className="text-[12.5px] text-ink-muted mt-1 leading-relaxed">{p.text}</p>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {p.items.map((it) => (
                    <li key={it} className="text-[12px] text-ink flex items-center gap-1.5">
                      <Check size={12} className="text-pos" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Modèle d'architecture cible" sub="Chaîne de traitement de la donnée à la décision" />
        <div className="p-5">
          <div className="flex flex-col gap-2">
            {ARCH.map((a, i) => (
              <div key={a} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-navy-50 text-navy text-[11px] font-semibold grid place-items-center shrink-0">{i + 1}</span>
                <div className="flex-1 border border-line rounded-lg px-3 py-2 text-[12.5px] text-ink bg-surface">{a}</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-ink-faint mt-4">
            Sécurité transverse : RBAC, moindre privilège, journaux d'audit, chiffrement des données, authentification des API,
            gouvernance et déploiement sécurisé. IA responsable : traçabilité des recommandations, explication des prédictions,
            niveau de confiance affiché, validation humaine — aucune décision critique automatisée sans contrôle.
          </p>
        </div>
      </Card>
    </>
  )
}
