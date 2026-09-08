import { useState } from 'react'
import { PageHeader, Card, CardHeader, Segmented, SectionTitle, TrendPct } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { RiskMatrix, DeviationBars } from '../components/charts'
import { AlertCard, RecommendationCard } from '../components/cards'
import { RISK_REGISTER } from '../services/risk'
import { ANOMALIES } from '../services/anomaly'
import { ALERTS } from '../data/narrative'
import { compact } from '../lib/format'

const TABS = ['Matrice de risques', 'Anomalies', 'Alertes'] as const
const SEV_DOT: Record<string, string> = { CRITIQUE: 'bg-neg', ELEVE: 'bg-warn', MOYEN: 'bg-info', FAIBLE: 'bg-ink-faint' }

export default function Risks() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Matrice de risques')
  const [sel, setSel] = useState<string | null>(null)
  const [an, setAn] = useState(ANOMALIES[0]?.id ?? null)

  const openAlerts = ALERTS.filter((a) => a.status !== 'RESOLUE')
  const crit = RISK_REGISTER.filter((r) => r.score >= 70).length
  const selRisk = RISK_REGISTER.find((r) => r.id === sel)
  const selAnomaly = ANOMALIES.find((a) => a.id === an)

  return (
    <>
      <PageHeader
        title="Risk Intelligence"
        subtitle="Matrice de risques, détection d'anomalies et alertes prioritaires — moteur analytique simulé"
        right={<Segmented options={TABS} value={tab} onChange={setTab} />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Risques suivis" value={`${RISK_REGISTER.length}`} delta={undefined} deltaSuffix="" />
        <KpiCard label="Risques critiques" value={`${crit}`} delta={undefined} deltaSuffix="score ≥ 70" />
        <KpiCard label="Anomalies détectées" value={`${ANOMALIES.length}`} delta={undefined} deltaSuffix="30 derniers jours" />
        <KpiCard label="Alertes ouvertes" value={`${openAlerts.length}`} delta={undefined} deltaSuffix="" />
      </div>

      {tab === 'Matrice de risques' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-1">
            <CardHeader title="Matrice probabilité × impact" sub="Cliquez un risque pour le détail" />
            <div className="p-4">
              <RiskMatrix points={RISK_REGISTER} onSelect={setSel} />
              <div className="flex gap-4 mt-2 text-[11px] text-ink-muted">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-neg" /> Critique</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gold" /> Élevé</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-info" /> Modéré</span>
              </div>
            </div>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader title="Registre des risques" sub="Catégories : opérationnel · financier · commercial · logistique · réseau" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr>
                    <th className="th">Risque</th>
                    <th className="th">Catégorie</th>
                    <th className="th text-right">Prob.</th>
                    <th className="th text-right">Impact</th>
                    <th className="th text-right">Score</th>
                    <th className="th">Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {[...RISK_REGISTER].sort((a, b) => b.score - a.score).map((r) => (
                    <tr key={r.id} className={`tr-hover ${sel === r.id ? 'bg-navy-50' : ''}`} onClick={() => setSel(r.id)}>
                      <td className="td font-medium text-navy max-w-[320px]">{r.label}</td>
                      <td className="td text-ink-muted">{r.category}</td>
                      <td className="td text-right tabular-nums">{Math.round(r.probability * 100)} %</td>
                      <td className="td text-right tabular-nums">{Math.round(r.impact * 100)} %</td>
                      <td className="td text-right"><span className={`chip ${r.score >= 70 ? 'bg-negbg text-neg border-neg/30' : r.score >= 50 ? 'bg-warnbg text-warn border-warn/30' : 'bg-infobg text-info border-info/25'}`}>{r.score}</span></td>
                      <td className="td"><TrendPct value={r.trend === 'up' ? 4 : r.trend === 'down' ? -4 : 0} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selRisk && (
              <div className="p-4 border-t border-line bg-navy-50/40">
                <div className="text-[12px] font-semibold text-navy">{selRisk.label}</div>
                <div className="text-[12px] text-ink-muted mt-1"><span className="font-medium text-ink">Action recommandée :</span> {selRisk.action}</div>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === 'Anomalies' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-1">
            <CardHeader title="Anomaly Detection" sub={`Écart > ${'2'}σ vs trajectoire attendue`} />
            <ul className="divide-y divide-line max-h-[520px] overflow-y-auto">
              {ANOMALIES.map((a) => (
                <li key={a.id} className={`px-4 py-3 cursor-pointer hover:bg-navy-50/60 ${an === a.id ? 'bg-navy-50' : ''}`} onClick={() => setAn(a.id)}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${SEV_DOT[a.severity]}`} />
                    <span className="text-[12.5px] font-medium text-navy truncate">{a.entity}</span>
                  </div>
                  <div className="text-[11.5px] text-ink-muted mt-0.5">{a.metric} · <span className={a.deviationPct < 0 ? 'text-neg' : 'text-warn'}>{a.deviationPct > 0 ? '+' : ''}{a.deviationPct} %</span></div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="xl:col-span-2">
            {selAnomaly && (
              <>
                <CardHeader
                  title={`${selAnomaly.entity} — ${selAnomaly.metric}`}
                  sub={selAnomaly.note}
                  right={<span className={`chip ${selAnomaly.severity === 'CRITIQUE' ? 'bg-negbg text-neg border-neg/30' : 'bg-warnbg text-warn border-warn/30'}`}>{selAnomaly.severity === 'ELEVE' ? 'Élevé' : selAnomaly.severity[0] + selAnomaly.severity.slice(1).toLowerCase()}</span>}
                />
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="border border-line rounded-lg p-3"><div className="stat-label !text-[10px]">Valeur attendue</div><div className="text-[16px] font-semibold text-navy mt-1 tabular-nums">{compact(selAnomaly.expected)}</div></div>
                    <div className="border border-line rounded-lg p-3"><div className="stat-label !text-[10px]">Valeur observée</div><div className="text-[16px] font-semibold text-neg mt-1 tabular-nums">{compact(selAnomaly.observed)}</div></div>
                    <div className="border border-line rounded-lg p-3"><div className="stat-label !text-[10px]">Écart</div><div className={`text-[16px] font-semibold mt-1 tabular-nums ${selAnomaly.deviationPct < 0 ? 'text-neg' : 'text-warn'}`}>{selAnomaly.deviationPct > 0 ? '+' : ''}{selAnomaly.deviationPct} %</div></div>
                  </div>
                  <DeviationBars data={selAnomaly.series} height={240} />
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {tab === 'Alertes' && (
        <>
          <SectionTitle hint="Chaque alerte : date · niveau · objet · impact · statut">Alertes prioritaires</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
            {ALERTS.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <RecommendationCard title="Prioriser le plan de redressement réseau" body="Concentrer les moyens sur les agences sous le seuil de score 55 et instaurer une revue opérationnelle mensuelle pilotée par la Direction des opérations." confidence={81} />
            <RecommendationCard title="Sécuriser le corridor Nord" body="Contractualiser un prestataire de transport de secours pour Mopti–Tombouctou afin de ramener le délai moyen à la cible de 3 jours." confidence={76} />
          </div>
        </>
      )}
    </>
  )
}
