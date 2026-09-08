import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { AlertSeverity, PerfBand, RiskLevel } from '../types'
import { PRODUCT } from '../config/weights'

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`card ${className}`}>{children}</div>
}

export function CardHeader({
  title,
  sub,
  right,
}: {
  title: ReactNode
  sub?: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="card-h">
      <div>
        <div className="text-[13px] font-semibold text-navy">{title}</div>
        {sub && <div className="text-[12px] text-ink-muted mt-0.5">{sub}</div>}
      </div>
      {right}
    </div>
  )
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <h2 className="text-[15px] font-semibold text-navy tracking-tight">{children}</h2>
      {hint && <span className="text-[12px] text-ink-muted">{hint}</span>}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[22px] font-semibold text-navy tracking-tight">{title}</h1>
        {subtitle && <p className="text-[13px] text-ink-muted mt-1">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-navy-50 rounded-lg border border-line">
      {options.map((o) => (
        <button key={o} className={`seg ${o === value ? 'seg-on' : 'seg-off'}`} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  )
}

export function Select({
  value,
  onChange,
  options,
  className = '',
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  className?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-[13px] bg-surface border border-line rounded-md px-3 py-1.5 text-ink focus:outline-none focus:ring-2 focus:ring-navy/20 ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

const BAND_STYLE: Record<PerfBand, string> = {
  EXCELLENT: 'bg-posbg text-pos border-pos/30',
  BON: 'bg-[#EAF3EC] text-[#2E7D45] border-[#2E7D45]/25',
  STABLE: 'bg-infobg text-info border-info/25',
  A_SURVEILLER: 'bg-warnbg text-warn border-warn/30',
  CRITIQUE: 'bg-negbg text-neg border-neg/30',
}
const BAND_LABEL: Record<PerfBand, string> = {
  EXCELLENT: 'Excellent',
  BON: 'Bon',
  STABLE: 'Stable',
  A_SURVEILLER: 'À surveiller',
  CRITIQUE: 'Critique',
}
export function PerfBadge({ band }: { band: PerfBand }) {
  return <span className={`chip ${BAND_STYLE[band]}`}>{BAND_LABEL[band]}</span>
}

const RISK_STYLE: Record<RiskLevel, string> = {
  FAIBLE: 'bg-posbg text-pos border-pos/30',
  MODERE: 'bg-infobg text-info border-info/25',
  ELEVE: 'bg-warnbg text-warn border-warn/30',
  CRITIQUE: 'bg-negbg text-neg border-neg/30',
}
const RISK_LABEL: Record<RiskLevel, string> = {
  FAIBLE: 'Faible',
  MODERE: 'Modéré',
  ELEVE: 'Élevé',
  CRITIQUE: 'Critique',
}
export function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`chip ${RISK_STYLE[level]}`}>{RISK_LABEL[level]}</span>
}

const SEV_STYLE: Record<AlertSeverity, string> = {
  CRITIQUE: 'bg-negbg text-neg border-neg/30',
  ELEVE: 'bg-warnbg text-warn border-warn/30',
  MOYEN: 'bg-infobg text-info border-info/25',
  FAIBLE: 'bg-navy-50 text-ink-muted border-line',
}
export function SeverityBadge({ level }: { level: AlertSeverity }) {
  const label = level === 'ELEVE' ? 'Élevé' : level.charAt(0) + level.slice(1).toLowerCase()
  return <span className={`chip ${SEV_STYLE[level]}`}>{label}</span>
}

export function TrendPct({ value, className = '' }: { value: number; className?: string }) {
  const pos = value > 0.05
  const neg = value < -0.05
  const Icon = pos ? ArrowUpRight : neg ? ArrowDownRight : Minus
  const color = pos ? 'text-pos' : neg ? 'text-neg' : 'text-ink-faint'
  return (
    <span className={`inline-flex items-center gap-0.5 text-[12px] font-semibold tabular-nums ${color} ${className}`}>
      <Icon size={13} />
      {value > 0 ? '+' : ''}
      {value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %
    </span>
  )
}

export function Sparkline({ data, tone = 'navy', w = 96, h = 28 }: { data: number[]; tone?: 'navy' | 'pos' | 'neg'; w?: number; h?: number }) {
  if (!data.length) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / span) * (h - 4) - 2}`)
    .join(' ')
  const stroke = tone === 'pos' ? '#1E7F53' : tone === 'neg' ? '#C0392B' : '#0B1F3A'
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / span) * (h - 4) - 2} r={2} fill={stroke} />
    </svg>
  )
}

export function DemoDisclaimer({ className = '' }: { className?: string }) {
  return (
    <p className={`text-[11px] text-ink-faint ${className}`}>
      {PRODUCT.disclaimer}
    </p>
  )
}

export function DemoTag({ children = 'MODÈLE SIMULÉ — DONNÉES DE DÉMONSTRATION' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-warn bg-warnbg border border-warn/30 rounded px-2 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-warn" />
      {children}
    </span>
  )
}

export function Bar({ value, max, tone = 'navy' }: { value: number; max: number; tone?: string }) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100))
  const bg = tone === 'gold' ? 'bg-gold' : tone === 'pos' ? 'bg-pos' : tone === 'neg' ? 'bg-neg' : 'bg-navy'
  return (
    <div className="h-2 rounded-full bg-navy-50 overflow-hidden">
      <div className={`h-full rounded-full ${bg}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
