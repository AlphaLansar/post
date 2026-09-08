import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { PageHeader, Card, CardHeader, DemoTag, TrendPct } from '../components/ui'
import { HBars, CHART_COLORS } from '../components/charts'
import { RecommendationCard } from '../components/cards'
import { NATIONAL_KPIS } from '../data/dataset'
import { fcfa, num, compact } from '../lib/format'

// Coefficients de sensibilité (élasticités simulées) — centralisés pour ajustement.
const LEVERS = [
  { key: 'invest', label: 'Investissement agences', unit: '%', min: -10, max: 30, step: 1, eff: { revenue: 0.9, transactions: 0.6, parcels: 1.1, expenses: 1.0, } },
  { key: 'staff', label: 'Personnel', unit: '%', min: -15, max: 25, step: 1, eff: { revenue: 0.5, transactions: 0.8, parcels: 0.7, expenses: 1.3 } },
  { key: 'hours', label: 'Amplitude horaire', unit: '%', min: 0, max: 30, step: 1, eff: { revenue: 0.35, transactions: 0.9, parcels: 0.4, expenses: 0.6 } },
  { key: 'logistics', label: 'Capacité logistique', unit: '%', min: -5, max: 35, step: 1, eff: { revenue: 0.6, transactions: 0.2, parcels: 1.6, expenses: 0.8 } },
  { key: 'digital', label: 'Digitalisation', unit: '%', min: 0, max: 40, step: 1, eff: { revenue: 0.45, transactions: 1.0, parcels: 0.5, expenses: -0.5 } },
] as const

const DECAY = 0.35 // rendements décroissants

function apply(base: number, pctChange: number, elasticity: number) {
  const x = pctChange / 100
  const damped = Math.sign(x) * (1 - Math.exp(-Math.abs(x) / DECAY)) * DECAY
  return base * (1 + damped * elasticity)
}

export default function Scenarios() {
  const [v, setV] = useState<Record<string, number>>({ invest: 10, staff: 0, hours: 0, logistics: 5, digital: 0 })

  const result = useMemo(() => {
    let revenue = NATIONAL_KPIS.revenue
    let transactions = NATIONAL_KPIS.transactions
    let parcels = NATIONAL_KPIS.parcels
    let expenses = NATIONAL_KPIS.expenses
    for (const l of LEVERS) {
      const p = v[l.key] ?? 0
      const x = p / 100
      const damped = Math.sign(x) * (1 - Math.exp(-Math.abs(x) / DECAY)) * DECAY
      revenue *= 1 + damped * l.eff.revenue * 0.5
      transactions *= 1 + damped * l.eff.transactions * 0.5
      parcels *= 1 + damped * l.eff.parcels * 0.5
      expenses *= 1 + damped * l.eff.expenses * 0.5
    }
    const marginBase = ((NATIONAL_KPIS.revenue - NATIONAL_KPIS.expenses) / NATIONAL_KPIS.revenue) * 100
    const margin = ((revenue - expenses) / revenue) * 100
    return { revenue, transactions, parcels, expenses, margin, marginBase }
  }, [v])

  const rows = [
    { label: "Chiffre d'affaires", base: NATIONAL_KPIS.revenue, val: result.revenue, fmt: fcfa },
    { label: 'Transactions', base: NATIONAL_KPIS.transactions, val: result.transactions, fmt: compact },
    { label: 'Colis', base: NATIONAL_KPIS.parcels, val: result.parcels, fmt: num },
    { label: 'Coûts', base: NATIONAL_KPIS.expenses, val: result.expenses, fmt: fcfa },
  ]

  return (
    <>
      <PageHeader
        title="Decision Simulator"
        subtitle="Simuler l'effet de décisions de pilotage avant de les prendre"
        right={<DemoTag>Simulation indicative</DemoTag>}
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Leviers de décision"
            right={
              <button className="btn-ghost !text-[12px] !py-1" onClick={() => setV({ invest: 0, staff: 0, hours: 0, logistics: 0, digital: 0 })}>
                <RotateCcw size={13} /> Réinitialiser
              </button>
            }
          />
          <div className="p-4 space-y-5">
            {LEVERS.map((l) => (
              <div key={l.key}>
                <div className="flex justify-between text-[12.5px] mb-1.5">
                  <span className="font-medium text-ink">{l.label}</span>
                  <span className="tabular-nums font-semibold text-navy">{v[l.key] > 0 ? '+' : ''}{v[l.key]} {l.unit}</span>
                </div>
                <input
                  type="range"
                  min={l.min}
                  max={l.max}
                  step={l.step}
                  value={v[l.key]}
                  onChange={(e) => setV((s) => ({ ...s, [l.key]: +e.target.value }))}
                  className="w-full accent-navy"
                />
                <div className="flex justify-between text-[10px] text-ink-faint mt-0.5">
                  <span>{l.min} {l.unit}</span>
                  <span>{l.max} {l.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="xl:col-span-3 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {rows.map((r) => {
              const delta = ((r.val - r.base) / r.base) * 100
              return (
                <Card key={r.label} className="p-4">
                  <span className="stat-label">{r.label}</span>
                  <div className="kpi-value mt-2 !text-[20px]">{r.fmt(r.val)}</div>
                  <div className="mt-1"><TrendPct value={Math.round(delta * 10) / 10} /></div>
                </Card>
              )
            })}
            <Card className="p-4 ring-1 ring-gold/40">
              <span className="stat-label">Rentabilité</span>
              <div className="kpi-value mt-2 !text-[20px]">{result.margin.toFixed(1)} %</div>
              <div className="mt-1"><TrendPct value={Math.round((result.margin - result.marginBase) * 10) / 10} /></div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Impact estimé vs situation actuelle" sub="Variation en % des indicateurs clés" />
            <div className="p-4">
              <HBars
                data={rows.map((r) => ({ label: r.label, value: Math.round(((r.val - r.base) / r.base) * 1000) / 10 }))}
                unit=""
                colorBySign
                height={220}
              />
            </div>
          </Card>

          <RecommendationCard
            title="Lecture du scénario"
            body={
              result.margin >= result.marginBase
                ? `Cette combinaison de leviers améliore la rentabilité de ${(result.margin - result.marginBase).toFixed(1)} point(s) tout en soutenant l'activité. Elle peut être testée en pilote sur un panel d'agences performantes.`
                : `Cette combinaison dégrade la rentabilité de ${(result.marginBase - result.margin).toFixed(1)} point(s) : la hausse des coûts n'est pas compensée par les gains d'activité. Revoir le dosage personnel / investissement.`
            }
            tag="Analyse du simulateur"
          />
        </div>
      </div>

      <p className="text-[11px] text-ink-faint mt-6">
        Simulation indicative basée sur des données synthétiques et des élasticités paramétrées (config du simulateur).
        Elle n'a pas valeur de prévision et doit être confrontée à l'expertise des directions métier avant toute décision.
      </p>
    </>
  )
}
