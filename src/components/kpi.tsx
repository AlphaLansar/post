import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Sparkline } from './ui'

export function TrendIndicator({ value, suffix = 'vs période préc.' }: { value: number; suffix?: string }) {
  const pos = value > 0.05
  const neg = value < -0.05
  const Icon = pos ? ArrowUpRight : neg ? ArrowDownRight : Minus
  const color = pos ? 'text-pos bg-posbg' : neg ? 'text-neg bg-negbg' : 'text-ink-faint bg-navy-50'
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-0.5 text-[12px] font-semibold rounded px-1.5 py-0.5 tabular-nums ${color}`}>
        <Icon size={13} />
        {value > 0 ? '+' : ''}
        {value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %
      </span>
      <span className="text-[11px] text-ink-faint">{suffix}</span>
    </div>
  )
}

export function KpiCard({
  label,
  value,
  delta,
  deltaSuffix,
  spark,
  sparkTone,
  icon,
  accent,
  delay = 0,
}: {
  label: string
  value: string
  delta?: number
  deltaSuffix?: string
  spark?: number[]
  sparkTone?: 'navy' | 'pos' | 'neg'
  icon?: ReactNode
  accent?: boolean
  delay?: number
}) {
  return (
    <div
      className={`card p-4 fade-up ${accent ? 'ring-1 ring-gold/40' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="stat-label">{label}</span>
        {icon && <span className="text-ink-faint">{icon}</span>}
      </div>
      <div className="mt-2 kpi-value">{value}</div>
      <div className="mt-2 flex items-end justify-between gap-2">
        {delta !== undefined ? (
          <TrendIndicator value={delta} suffix={deltaSuffix ?? 'vs période préc.'} />
        ) : (
          <span />
        )}
        {spark && <Sparkline data={spark} tone={sparkTone} />}
      </div>
    </div>
  )
}
