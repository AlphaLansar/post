import { BrainCircuit, Database, GitBranch, ShieldCheck } from 'lucide-react'
import { PageHeader, Card, CardHeader } from '../components/ui'
import { AIChat } from '../components/AIChat'

const CAPS = [
  { icon: Database, title: 'Interrogation des données', text: 'Performance, finance, logistique, réseau et territoire — en langage naturel.' },
  { icon: BrainCircuit, title: 'Analyse décisionnelle', text: 'Le copilote explique les causes, l’impact et propose des actions (WHAT · WHY · SO WHAT · NOW WHAT).' },
  { icon: GitBranch, title: 'Prévision & scénarios', text: 'Projections d’activité et lien direct vers le simulateur de décision.' },
  { icon: ShieldCheck, title: 'IA responsable', text: 'Aide à la décision, pas de décision automatique. Recommandations traçables, à valider par les directions métier.' },
]

export default function Copilot() {
  return (
    <>
      <PageHeader
        title="POSTE AI Copilot"
        subtitle="Interrogez les données et obtenez des analyses décisionnelles"
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <AIChat />
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader title="Ce que le copilote peut faire" />
            <div className="p-4 space-y-3">
              {CAPS.map((c) => (
                <div key={c.title} className="flex gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-lg grid place-items-center bg-navy-50 text-navy"><c.icon size={15} /></span>
                  <div>
                    <div className="text-[12.5px] font-semibold text-navy">{c.title}</div>
                    <div className="text-[12px] text-ink-muted leading-relaxed mt-0.5">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.07em] text-warn bg-warnbg border border-warn/30 rounded px-2 py-1 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-warn" /> Prototype
            </div>
            <p className="text-[12px] text-ink-muted leading-relaxed mt-2.5">
              Ce copilote fonctionne sans connexion LLM : les réponses sont générées par un moteur d’intentions qui
              interroge le jeu de données synthétique. En Phase 2, une couche LLM + RAG branchée sur le Data Warehouse
              produira des réponses sur les données réelles, avec citations des sources et niveau de confiance.
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
