import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Banknote,
  Building2,
  Gauge,
  Mail,
  Package,
  Repeat,
} from 'lucide-react'
import { PageHeader, Segmented, Select, SectionTitle, Card, CardHeader, PerfBadge, TrendPct, Sparkline } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { MultiLine, CHART_COLORS } from '../components/charts'
import { AIInsightCard, AlertCard, AiBadge } from '../components/cards'
import {
  MONTHLY,
  NATIONAL_KPIS,
  REGION_STATS,
  periodFactor,
} from '../data/dataset'
import { INSIGHTS, ALERTS } from '../data/narrative'
import { fcfa, num, compact } from '../lib/format'

const PERIODS = ["Aujourd'hui", '7 jours', '30 jours', 'Trimestre', 'Année'] as const
const METRICS = [
  { key: 'revenue', label: "Chiffre d'affaires", color: CHART_COLORS.NAVY },
  { key: 'parcels', label: 'Colis', color: CHART_COLORS.GOLD },
  { key: 'transactions', label: 'Transactions', color: CHART_COLORS.INFO },
  { key: 'mail', label: 'Courrier', color: CHART_COLORS.NEG },
] as const

export default function Dashboard() {
  const nav = useNavigate()
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('30 jours')
  const [region, setRegion] = useState('all')
  const [metrics, setMetrics] = useState<string[]>(['revenue'])

  const f = periodFactor(period)
  const regionRow = region === 'all' ? null : REGION_STATS.find((r) => r.regionId === region)

  const kpis = useMemo(() => {
    const base = regionRow
      ? {
          revenue: regionRow.revenue,
          parcels: regionRow.parcels,
          transactions: regionRow.transactions,
          mail: regionRow.mail,
        }
      : NATIONAL_KPIS
    return {
      revenue: base.revenue * f,
      parcels: base.parcels * f,
      transactions: base.transactions * f,
      mail: base.mail * f,
    }
  }, [regionRow, f])

  // Une seule métrique : valeurs réelles. Plusieurs métriques : indice base 100
  // (1er mois = 100) pour comparer des grandeurs d'échelles différentes.
  const multi = metrics.length > 1
  const chartData = useMemo(() => {
    if (!multi) return MONTHLY.map((m) => ({ ...m }))
    const base: Record<string, number> = {}
    METRICS.forEach((mt) => (base[mt.key] = (MONTHLY[0] as any)[mt.key]))
    return MONTHLY.map((m) => {
      const row: any = { label: m.label }
      METRICS.forEach((mt) => (row[mt.key] = Math.round(((m as any)[mt.key] / base[mt.key]) * 1000) / 10))
      return row
    })
  }, [multi])

  const toggleMetric = (k: string) =>
    setMetrics((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]))

  const rankedRegions = [...REGION_STATS].sort((a, b) => b.score - a.score)

  return (
    <>
      <PageHeader
        title="Tableau de bord exécutif"
        subtitle="Vue consolidée de la performance de La Poste du Mali — données synthétiques de démonstration"
        right={
          <>
            <Select
              value={region}
              onChange={setRegion}
              options={[{ value: 'all', label: 'Toutes les régions' }, ...REGION_STATS.map((r) => ({ value: r.regionId, label: r.region }))]}
            />
            <Segmented options={PERIODS} value={period} onChange={setPeriod} />
          </>
        }
      />

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <KpiCard label="Chiffre d'affaires" value={fcfa(kpis.revenue)} delta={NATIONAL_KPIS.revenueDelta} spark={MONTHLY.slice(5).map((m) => m.revenue)} icon={<Banknote size={15} />} accent delay={0} />
        <KpiCard label="Volume de colis" value={num(kpis.parcels)} delta={NATIONAL_KPIS.parcelsDelta} spark={MONTHLY.slice(5).map((m) => m.parcels)} sparkTone="pos" icon={<Package size={15} />} delay={40} />
        <KpiCard label="Transactions" value={compact(kpis.transactions)} delta={NATIONAL_KPIS.transactionsDelta} spark={MONTHLY.slice(5).map((m) => m.transactions)} icon={<Repeat size={15} />} delay={80} />
        <KpiCard label="Courrier" value={num(kpis.mail)} delta={NATIONAL_KPIS.mailDelta} spark={MONTHLY.slice(5).map((m) => m.mail)} sparkTone="neg" icon={<Mail size={15} />} delay={120} />
        <KpiCard label="Agences actives" value={`${NATIONAL_KPIS.agenciesActive}`} delta={undefined} deltaSuffix="" icon={<Building2 size={15} />} delay={160} />
        <KpiCard label="Taux de service" value={`${NATIONAL_KPIS.serviceRate} %`} delta={NATIONAL_KPIS.serviceDelta} deltaSuffix="pts vs préc." icon={<Gauge size={15} />} delay={200} />
      </div>

      {/* Performance chart + AI insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Évolution de l'activité"
            sub={multi ? '12 mois · indice base 100 (Sep 25 = 100) pour comparaison multi-échelles' : '12 derniers mois — sélectionnez une ou plusieurs métriques'}
            right={
              <div className="flex flex-wrap gap-1.5">
                {METRICS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => toggleMetric(m.key)}
                    className={`text-[11.5px] font-medium rounded-full px-2.5 py-1 border transition-colors ${
                      metrics.includes(m.key)
                        ? 'bg-navy text-white border-navy'
                        : 'text-ink-muted border-line hover:bg-navy-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            }
          />
          <div className="p-4">
            <MultiLine
              data={chartData}
              series={METRICS.filter((m) => metrics.includes(m.key)).map((m) => ({ key: m.key, label: m.label, color: m.color }))}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="AI Insights" right={<AiBadge />} />
          <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
            {INSIGHTS.slice(0, 4).map((i) => (
              <AIInsightCard key={i.id} insight={i} onAnalyze={() => nav('/copilot')} />
            ))}
          </div>
        </Card>
      </div>

      {/* Regional performance */}
      <div className="mb-6">
        <SectionTitle hint={`${REGION_STATS.length} régions · score = 30 % croissance · 25 % rentabilité · 20 % volume · 15 % service · 10 % satisfaction`}>
          Performance par région
        </SectionTitle>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr>
                  <th className="th">Région</th>
                  <th className="th text-right">Chiffre d'affaires</th>
                  <th className="th text-right">Transactions</th>
                  <th className="th text-right">Colis</th>
                  <th className="th text-right">Croissance</th>
                  <th className="th text-right">Score</th>
                  <th className="th">Tendance</th>
                  <th className="th">Statut</th>
                </tr>
              </thead>
              <tbody>
                {rankedRegions.map((r) => (
                  <tr key={r.regionId} className="tr-hover" onClick={() => setRegion(r.regionId)}>
                    <td className="td font-medium text-navy">{r.region}</td>
                    <td className="td text-right tabular-nums">{fcfa(r.revenue)}</td>
                    <td className="td text-right tabular-nums">{compact(r.transactions)}</td>
                    <td className="td text-right tabular-nums">{num(r.parcels)}</td>
                    <td className="td text-right"><TrendPct value={r.growth} /></td>
                    <td className="td text-right tabular-nums font-semibold text-navy">{r.score}</td>
                    <td className="td"><Sparkline data={r.spark} tone={r.growth >= 0 ? 'pos' : 'neg'} w={72} h={22} /></td>
                    <td className="td"><PerfBadge band={r.band} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Priority alerts */}
      <div>
        <SectionTitle hint="Détection automatique — moteur analytique">Alertes prioritaires</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {ALERTS.filter((a) => a.status !== 'RESOLUE').slice(0, 6).map((a) => (
            <AlertCard key={a.id} alert={a} onView={() => nav('/risques')} />
          ))}
        </div>
      </div>
    </>
  )
}
