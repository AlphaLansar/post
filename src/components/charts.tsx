import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { compact, fcfa } from '../lib/format'

const AXIS = { fontSize: 11, fill: '#8A94A3' }
const GRID = '#EEF1F4'
const NAVY = '#0B1F3A'
const GOLD = '#C9A227'
const POS = '#1E7F53'
const NEG = '#C0392B'
const INFO = '#1F5FA8'

const tipStyle = {
  contentStyle: {
    border: '1px solid #E4E7EC',
    borderRadius: 8,
    fontSize: 12,
    boxShadow: '0 8px 24px rgba(11,31,58,0.12)',
  },
  labelStyle: { color: NAVY, fontWeight: 600, marginBottom: 2 },
}

function fmt(v: number, unit?: string) {
  if (unit === 'FCFA') return fcfa(v)
  return compact(v)
}

export function LineTrend({
  data,
  dataKey,
  unit,
  color = NAVY,
  height = 260,
  area = true,
}: {
  data: any[]
  dataKey: string
  unit?: string
  color?: string
  height?: number
  area?: boolean
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      {area ? (
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={54} tickFormatter={(v) => fmt(v, unit)} />
          <Tooltip {...tipStyle} formatter={((v: any) => fmt(v, unit)) as any} />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#g-${dataKey})`} isAnimationActive={false} />
        </AreaChart>
      ) : (
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={54} tickFormatter={(v) => fmt(v, unit)} />
          <Tooltip {...tipStyle} formatter={((v: any) => fmt(v, unit)) as any} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}

export function MultiLine({
  data,
  series,
  height = 280,
}: {
  data: any[]
  series: { key: string; label: string; color: string }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => compact(v)} />
        <Tooltip {...tipStyle} formatter={((v: any) => compact(v)) as any} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="plainline" />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function RevenueExpense({ data, height = 300 }: { data: any[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis yAxisId="cur" tick={AXIS} tickLine={false} axisLine={false} width={56} tickFormatter={(v) => fcfa(v)} />
        <YAxis yAxisId="pct" orientation="right" tick={AXIS} tickLine={false} axisLine={false} width={38} tickFormatter={(v) => `${v}%`} domain={[0, 'dataMax + 10']} />
        <Tooltip {...tipStyle} formatter={((v: any, n: any) => (n === 'Marge %' ? `${v} %` : fcfa(v))) as any} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar yAxisId="cur" dataKey="revenue" name="Revenus" fill={NAVY} radius={[3, 3, 0, 0]} barSize={14} isAnimationActive={false} />
        <Bar yAxisId="cur" dataKey="expenses" name="Dépenses" fill="#C9CDD6" radius={[3, 3, 0, 0]} barSize={14} isAnimationActive={false} />
        <Line yAxisId="pct" type="monotone" dataKey="margin" name="Marge %" stroke={GOLD} strokeWidth={2} dot={false} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function BudgetVsActual({ data, height = 280 }: { data: any[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={56} tickFormatter={(v) => fcfa(v)} />
        <Tooltip {...tipStyle} formatter={((v: any) => fcfa(v)) as any} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="budget" name="Budget" fill="#C9CDD6" radius={[3, 3, 0, 0]} barSize={16} isAnimationActive={false} />
        <Bar dataKey="expenses" name="Réalisé" fill={NAVY} radius={[3, 3, 0, 0]} barSize={16} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ForecastChart({
  history,
  forecast,
  unit,
  height = 300,
}: {
  history: { label: string; value: number }[]
  forecast: { label: string; value: number; lo: number; hi: number }[]
  unit?: string
  height?: number
}) {
  const merged = [
    ...history.map((h) => ({ label: h.label, hist: h.value })),
    ...forecast.map((f) => ({ label: f.label, fc: f.value, band: [f.lo, f.hi] as [number, number] })),
  ]
  // relier l'historique et la prévision
  const bridge = merged.findIndex((m) => 'fc' in m)
  if (bridge > 0) (merged[bridge] as any).hist = history[history.length - 1].value

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={merged} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={56} tickFormatter={(v) => fmt(v, unit)} />
        <Tooltip {...tipStyle} formatter={((v: any) => (Array.isArray(v) ? `${fmt(v[0], unit)} – ${fmt(v[1], unit)}` : fmt(v, unit))) as any} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="plainline" />
        <Area dataKey="band" name="Intervalle 90 %" stroke="none" fill={GOLD} fillOpacity={0.16} isAnimationActive={false} />
        <Line type="monotone" dataKey="hist" name="Historique" stroke={NAVY} strokeWidth={2} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="fc" name="Prévision" stroke={GOLD} strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
        {bridge > 0 && <ReferenceLine x={merged[bridge].label} stroke="#C9CDD6" strokeDasharray="3 3" />}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function HBars({
  data,
  color = NAVY,
  unit,
  height = 300,
  colorBySign = false,
}: {
  data: { label: string; value: number; hint?: string }[]
  color?: string
  unit?: string
  height?: number
  colorBySign?: boolean
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v, unit)} />
        <YAxis type="category" dataKey="label" tick={AXIS} tickLine={false} axisLine={false} width={128} />
        <Tooltip {...tipStyle} formatter={((v: any) => fmt(v, unit)) as any} />
        <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={16} isAnimationActive={false}>
          {data.map((d, i) => (
            <Cell key={i} fill={colorBySign ? (d.value >= 0 ? POS : NEG) : color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function RiskMatrix({
  points,
  onSelect,
}: {
  points: { id: string; label: string; probability: number; impact: number; score: number }[]
  onSelect?: (id: string) => void
}) {
  const W = 460
  const H = 320
  const pad = 40
  const px = (p: number) => pad + p * (W - pad - 12)
  const py = (i: number) => H - pad - i * (H - pad - 12)
  return (
    <div className="overflow-x-auto">
      <svg width={W} height={H} className="min-w-[460px]">
        <rect x={pad} y={12} width={W - pad - 12} height={H - pad - 12} fill="#FAFBFC" stroke={GRID} />
        {/* zones */}
        <rect x={px(0.5)} y={12} width={W - pad - 12 - (px(0.5) - pad)} height={py(0.5) - 12} fill={NEG} fillOpacity={0.06} />
        {[0.25, 0.5, 0.75].map((t) => (
          <g key={t}>
            <line x1={px(t)} y1={12} x2={px(t)} y2={H - pad} stroke={GRID} />
            <line x1={pad} y1={py(t)} x2={W - 12} y2={py(t)} stroke={GRID} />
          </g>
        ))}
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#8A94A3">
          Probabilité →
        </text>
        <text x={14} y={H / 2} textAnchor="middle" fontSize={11} fill="#8A94A3" transform={`rotate(-90 14 ${H / 2})`}>
          Impact →
        </text>
        {points.map((p) => {
          const color = p.score >= 70 ? NEG : p.score >= 50 ? GOLD : INFO
          return (
            <g key={p.id} className="cursor-pointer" onClick={() => onSelect?.(p.id)}>
              <circle cx={px(p.probability)} cy={py(p.impact)} r={9} fill={color} fillOpacity={0.85} stroke="#fff" strokeWidth={1.5} />
              <title>{`${p.label} — score ${p.score}`}</title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function DeviationBars({ data, height = 240 }: { data: { label: string; attendu: number; observe: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={52} tickFormatter={(v) => compact(v)} />
        <Tooltip {...tipStyle} formatter={((v: any) => compact(v)) as any} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="attendu" name="Attendu" fill="#C9CDD6" radius={[3, 3, 0, 0]} barSize={16} isAnimationActive={false} />
        <Bar dataKey="observe" name="Observé" fill={NEG} radius={[3, 3, 0, 0]} barSize={16} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export const CHART_COLORS = { NAVY, GOLD, POS, NEG, INFO }
