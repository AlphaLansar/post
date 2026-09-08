import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpDown, Search } from 'lucide-react'
import { PageHeader, Card, Select, PerfBadge, RiskBadge, TrendPct } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { AGENCIES, REGION_STATS } from '../data/dataset'
import { fcfa, num, compact } from '../lib/format'

type SortKey = 'name' | 'revenue' | 'transactions' | 'parcels' | 'growth' | 'expenses' | 'profitability' | 'score' | 'riskScore'

export default function Agencies() {
  const nav = useNavigate()
  const [region, setRegion] = useState('all')
  const [risk, setRisk] = useState('all')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('score')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  const rows = useMemo(() => {
    let r = AGENCIES.filter((a) => (region === 'all' || a.regionId === region))
    if (risk !== 'all') r = r.filter((a) => a.risk === risk)
    if (q.trim()) r = r.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()) || a.region.toLowerCase().includes(q.toLowerCase()))
    r = [...r].sort((a, b) => {
      const va = a[sort] as number | string
      const vb = b[sort] as number | string
      const cmp = typeof va === 'string' ? (va as string).localeCompare(vb as string) : (va as number) - (vb as number)
      return dir === 'asc' ? cmp : -cmp
    })
    return r
  }, [region, risk, q, sort, dir])

  const toggleSort = (k: SortKey) => {
    if (sort === k) setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSort(k)
      setDir('desc')
    }
  }

  const H = ({ k, label, align = 'left' }: { k: SortKey; label: string; align?: 'left' | 'right' }) => (
    <th className={`th ${align === 'right' ? 'text-right' : ''} cursor-pointer select-none`} onClick={() => toggleSort(k)}>
      <span className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        {label}
        <ArrowUpDown size={11} className={sort === k ? 'text-navy' : 'text-ink-faint/50'} />
      </span>
    </th>
  )

  const atRisk = AGENCIES.filter((a) => a.riskScore >= 55).length
  const avgScore = Math.round(AGENCIES.reduce((s, a) => s + a.score, 0) / AGENCIES.length)
  const topGrowth = [...AGENCIES].sort((a, b) => b.growth - a.growth)[0]

  return (
    <>
      <PageHeader title="Intelligence du réseau postal" subtitle={`${AGENCIES.length} agences synthétiques — score, rentabilité et niveau de risque`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Agences suivies" value={`${AGENCIES.length}`} delta={undefined} deltaSuffix="" />
        <KpiCard label="Score moyen réseau" value={`${avgScore}/100`} delta={2.4} />
        <KpiCard label="Agences à risque élevé" value={`${atRisk}`} delta={undefined} deltaSuffix="score < 55" />
        <KpiCard label="Plus forte croissance" value={topGrowth.name.replace('Agence ', '')} delta={topGrowth.growth} deltaSuffix="" />
      </div>

      <Card>
        <div className="p-3 flex flex-wrap items-center gap-2 border-b border-line">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher une agence…"
              className="text-[13px] border border-line rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy/20 w-56"
            />
          </div>
          <Select value={region} onChange={setRegion} options={[{ value: 'all', label: 'Toutes les régions' }, ...REGION_STATS.map((r) => ({ value: r.regionId, label: r.region }))]} />
          <Select value={risk} onChange={setRisk} options={[
            { value: 'all', label: 'Tous les risques' },
            { value: 'FAIBLE', label: 'Risque faible' },
            { value: 'MODERE', label: 'Risque modéré' },
            { value: 'ELEVE', label: 'Risque élevé' },
            { value: 'CRITIQUE', label: 'Risque critique' },
          ]} />
          <span className="ml-auto text-[12px] text-ink-muted">{rows.length} résultat{rows.length > 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px]">
            <thead>
              <tr>
                <H k="name" label="Agence" />
                <th className="th">Région</th>
                <H k="revenue" label="CA" align="right" />
                <H k="transactions" label="Transactions" align="right" />
                <H k="parcels" label="Colis" align="right" />
                <H k="growth" label="Croissance" align="right" />
                <H k="expenses" label="Coût" align="right" />
                <H k="profitability" label="Rentabilité" align="right" />
                <H k="score" label="Score" align="right" />
                <th className="th">Risque</th>
                <th className="th">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="tr-hover" onClick={() => nav(`/agences/${a.id}`)}>
                  <td className="td font-medium text-navy whitespace-nowrap">{a.name}<div className="text-[11px] text-ink-faint font-normal">{a.type}</div></td>
                  <td className="td text-ink-muted">{a.region}</td>
                  <td className="td text-right tabular-nums">{fcfa(a.revenue)}</td>
                  <td className="td text-right tabular-nums">{compact(a.transactions)}</td>
                  <td className="td text-right tabular-nums">{num(a.parcels)}</td>
                  <td className="td text-right"><TrendPct value={a.growth} /></td>
                  <td className="td text-right tabular-nums text-ink-muted">{fcfa(a.expenses)}</td>
                  <td className="td text-right tabular-nums">{a.profitability} %</td>
                  <td className="td text-right tabular-nums font-semibold text-navy">{a.score}</td>
                  <td className="td"><RiskBadge level={a.risk} /></td>
                  <td className="td"><PerfBadge band={a.band} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
