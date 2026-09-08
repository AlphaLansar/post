import { useState } from 'react'
import { Calendar, Check, Download, FileText, Loader2 } from 'lucide-react'
import { PageHeader, Card, Segmented, SectionTitle } from '../components/ui'
import { REPORTS } from '../data/narrative'
import type { ReportCard } from '../types'

const KINDS = ['Tous', 'Quotidien', 'Hebdomadaire', 'Mensuel', 'Trimestriel'] as const

export default function Reports() {
  const [kind, setKind] = useState<(typeof KINDS)[number]>('Tous')
  const [busy, setBusy] = useState<string | null>(null)
  const [done, setDone] = useState<Record<string, string>>({})

  const list = REPORTS.filter((r) => kind === 'Tous' || r.kind === kind)

  function run(id: string, action: 'Génération' | 'Export PDF') {
    setBusy(id + action)
    setTimeout(() => {
      setBusy(null)
      setDone((d) => ({ ...d, [id + action]: action === 'Export PDF' ? 'PDF prêt (simulé)' : 'Rapport actualisé' }))
    }, 1100)
  }

  return (
    <>
      <PageHeader
        title="Executive Reports"
        subtitle="Rapports exécutifs consolidés — génération et export simulés dans le prototype"
        right={<Segmented options={KINDS} value={kind} onChange={setKind} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((r: ReportCard) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-navy text-gold grid place-items-center"><FileText size={18} /></span>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-faint">{r.kind}</span>
                  <div className="text-[14px] font-semibold text-navy leading-snug">{r.title}</div>
                </div>
              </div>
              <span className="text-[11px] text-ink-faint">{r.pages} p.</span>
            </div>

            <div className="flex items-center gap-1.5 text-[12px] text-ink-muted mt-3">
              <Calendar size={13} /> {r.period}
              <span className="text-ink-faint">· généré {r.generatedAt}</span>
            </div>

            <ul className="mt-3 space-y-1.5">
              {r.highlights.map((h, i) => (
                <li key={i} className="text-[12.5px] text-ink-muted flex gap-2 leading-relaxed">
                  <span className="text-gold-dark mt-0.5">▸</span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-line">
              <button className="btn-ghost !text-[12px] !py-1">Voir</button>
              <button className="btn-ghost !text-[12px] !py-1" onClick={() => run(r.id, 'Génération')} disabled={busy === r.id + 'Génération'}>
                {busy === r.id + 'Génération' ? <Loader2 size={13} className="animate-spin" /> : done[r.id + 'Génération'] ? <Check size={13} className="text-pos" /> : null}
                {done[r.id + 'Génération'] ?? 'Générer'}
              </button>
              <button className="btn-primary !text-[12px] !py-1 ml-auto" onClick={() => run(r.id, 'Export PDF')} disabled={busy === r.id + 'Export PDF'}>
                {busy === r.id + 'Export PDF' ? <Loader2 size={13} className="animate-spin" /> : done[r.id + 'Export PDF'] ? <Check size={13} /> : <Download size={13} />}
                {done[r.id + 'Export PDF'] ?? 'Exporter PDF'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      <SectionTitle hint="Prototype">Note</SectionTitle>
      <Card className="p-4">
        <p className="text-[12.5px] text-ink-muted leading-relaxed">
          Dans le prototype, la génération et l'export PDF sont simulés. En Phase 2, chaque rapport sera produit à partir
          du Data Warehouse, versionné, signé et distribué automatiquement selon le rôle du destinataire (voir la page
          « Vision de déploiement »).
        </p>
      </Card>
    </>
  )
}
