import { useMemo, useState } from 'react'
import { PageHeader, Segmented, Select, Card, CardHeader, SectionTitle } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { LineTrend, MultiLine, RevenueExpense, HBars, CHART_COLORS } from '../components/charts'
import { MONTHLY, REGION_STATS, AGENCIES, periodFactor } from '../data/dataset'
import { fcfa, num, compact } from '../lib/format'
import { growthRate } from '../services/analytics'

const PERIODS = ["Aujourd'hui", '7 jours', '30 jours', 'Trimestre', 'Année'] as const
const SERVICES = ['Tous les services', 'Colis', 'Courrier', 'Services financiers', 'Guichet']

const METRICS = [
  { key: 'revenue', label: "Chiffre d'affaires", unit: 'FCFA', color: CHART_COLORS.NAVY },
  { key: 'transactions', label: 'Transactions', unit: '', color: CHART_COLORS.INFO },
  { key: 'parcels', label: 'Colis', unit: '', color: CHART_COLORS.GOLD },
  { key: 'mail', label: 'Courrier', unit: '', color: CHART_COLORS.NEG },
  { key: 'expenses', label: 'Dépenses', unit: 'FCFA', color: '#7A8698' },
  { key: 'footfall', label: 'Fréquentation', unit: '', color: '#2E7D45' },
] as const

export default function Performance() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('30 jours')
  const [region, setRegion] = useState('all')
  const [agency, setAgency] = useState('all')
  const [service, setService] = useState(SERVICES[0])
  const [metric, setMetric] = useState<string>('revenue')

  const f = periodFactor(period)
  const agencyOpts = AGENCIES.filter((a) => region === 'all' || a.regionId === region)

  const last = MONTHLY[11]
  const prev = MONTHLY[10]
  const scope = region === 'all' ? 1 : (REGION_STATS.find((r) => r.regionId === region)?.revenue ?? last.revenue) / last.revenue
  const serviceMul = service === 'Colis' ? 0.34 : service === 'Courrier' ? 0.12 : service === 'Services financiers' ? 0.31 : service === 'Guichet' ? 0.23 : 1

  const kpi = (k: keyof typeof last) => (last[k] as number) * scope * serviceMul * f
  const delta = (k: keyof typeof last) => growthRate(last[k] as number, prev[k] as number)

  const chartData = useMemo(
    () => MONTHLY.map((m) => ({ ...m, revenue: m.revenue * scope, transactions: m.transactions * scope, parcels: m.parcels * scope, mail: m.mail * scope, expenses: m.expenses * scope })),
    [scope],
  )

  const activeMetric = METRICS.find((m) => m.key === metric)!
  const contribution = [...REGION_STATS]
    .sort((a, b) => (b as any)[metric === 'footfall' ? 'transactions' : metric] - (a as any)[metric === 'footfall' ? 'transactions' : metric])
    .map((r) => ({ label: r.region, value: (r as any)[metric === 'footfall' ? 'transactions' : metric] as number }))

  return (
    <>
      <PageHeader
        title="Analyse de la performance"
        subtitle="CA · transactions · colis · courrier · dépenses · agents · fréquentation"
        right={<Segmented options={PERIODS} value={period} onChange={setPeriod} />}
      />

      <Card className="mb-6">
        <div className="p-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint mr-1">Filtres</span>
          <Select value={region} onChange={(v) => { setRegion(v); setAgency('all') }} options={[{ value: 'all', label: 'Toutes les régions' }, ...REGION_STATS.map((r) => ({ value: r.regionId, label: r.region }))]} />
          <Select value={agency} onChange={setAgency} options={[{ value: 'all', label: 'Toutes les agences' }, ...agencyOpts.map((a) => ({ value: a.id, label: a.name }))]} />
          <Select value={service} onChange={setService} options={SERVICES.map((s) => ({ value: s, label: s }))} />
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Chiffre d'affaires" value={fcfa(kpi('revenue'))} delta={delta('revenue')} />
        <KpiCard label="Transactions" value={compact(kpi('transactions'))} delta={delta('transactions')} />
        <KpiCard label="Colis" value={num(kpi('parcels'))} delta={delta('parcels')} />
        <KpiCard label="Courrier" value={num(kpi('mail'))} delta={delta('mail')} />
        <KpiCard label="Dépenses" value={fcfa(kpi('expenses'))} delta={delta('expenses')} />
        <KpiCard label="Agents" value={num(last.agents * (region === 'all' ? 1 : scope))} delta={2.1} />
        <KpiCard label="Fréquentation" value={compact(kpi('footfall'))} delta={delta('footfall')} />
      </div>

      <Card className="mb-4">
        <CardHeader
          title="Série temporelle"
          sub={`${activeMetric.label} · 12 mois${region !== 'all' ? ` · ${REGION_STATS.find((r) => r.regionId === region)?.region}` : ''}`}
          right={
            <div className="flex flex-wrap gap-1.5">
              {METRICS.map((m) => (
                <button key={m.key} onClick={() => setMetric(m.key)} className={`text-[11.5px] font-medium rounded-full px-2.5 py-1 border transition-colors ${metric === m.key ? 'bg-navy text-white border-navy' : 'text-ink-muted border-line hover:bg-navy-50'}`}>
                  {m.label}
                </button>
              ))}
            </div>
          }
        />
        <div className="p-4">
          <LineTrend data={chartData} dataKey={metric} unit={activeMetric.unit} color={activeMetric.color} height={280} />
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader title="Revenus vs dépenses" sub="Consolidé mensuel + marge opérationnelle" />
          <div className="p-4">
            <RevenueExpense data={MONTHLY.map((m) => ({ label: m.label, revenue: m.revenue * scope, expenses: m.expenses * scope, margin: Math.round(((m.revenue - m.expenses) / m.revenue) * 1000) / 10 }))} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Transactions & fréquentation" sub="Corrélation activité / flux en agence" />
          <div className="p-4">
            <MultiLine
              data={MONTHLY.map((m) => ({ label: m.label, Transactions: m.transactions * scope, Fréquentation: m.footfall * scope }))}
              series={[
                { key: 'Transactions', label: 'Transactions', color: CHART_COLORS.INFO },
                { key: 'Fréquentation', label: 'Fréquentation', color: '#2E7D45' },
              ]}
            />
          </div>
        </Card>
      </div>

      <SectionTitle hint={`Contribution par région — ${activeMetric.label}`}>Répartition territoriale</SectionTitle>
      <Card>
        <div className="p-4">
          <HBars data={contribution} unit={activeMetric.unit} color={activeMetric.color} height={320} />
        </div>
      </Card>
    </>
  )
}
