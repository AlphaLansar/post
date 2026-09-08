import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Info,
  Lightbulb,
  Sparkles,
  TrendingDown,
} from 'lucide-react'
import type { Alert, Insight, InsightLevel } from '../types'
import { SeverityBadge } from './ui'

const INSIGHT_META: Record<InsightLevel, { icon: typeof Info; ring: string; chip: string; label: string }> = {
  positif: { icon: CheckCircle2, ring: 'border-l-pos', chip: 'text-pos bg-posbg', label: 'Signal positif' },
  attention: { icon: TrendingDown, ring: 'border-l-warn', chip: 'text-warn bg-warnbg', label: 'Point de vigilance' },
  risque: { icon: AlertTriangle, ring: 'border-l-neg', chip: 'text-neg bg-negbg', label: 'Risque identifié' },
  information: { icon: Info, ring: 'border-l-info', chip: 'text-info bg-infobg', label: 'Information' },
}

export function AIInsightCard({ insight, onAnalyze }: { insight: Insight; onAnalyze?: (i: Insight) => void }) {
  const m = INSIGHT_META[insight.level]
  const Icon = m.icon
  return (
    <div className={`card p-4 border-l-[3px] ${m.ring} fade-up`}>
      <div className="flex items-start gap-3">
        <span className={`shrink-0 w-8 h-8 rounded-lg grid place-items-center ${m.chip}`}>
          <Icon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-semibold uppercase tracking-[0.07em] rounded px-1.5 py-0.5 ${m.chip}`}>{m.label}</span>
            {insight.metricHint && <span className="text-[11px] text-ink-faint">· {insight.metricHint}</span>}
          </div>
          <p className="text-[13px] font-semibold text-navy mt-1.5 leading-snug">{insight.title}</p>
          <p className="text-[12.5px] text-ink-muted mt-1 leading-relaxed">{insight.detail}</p>
          <button className="btn-ghost mt-3 !text-[12px] !py-1" onClick={() => onAnalyze?.(insight)}>
            Analyser <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function AlertCard({ alert, onView }: { alert: Alert; onView?: (a: Alert) => void }) {
  const [open, setOpen] = useState(false)
  const statusLabel =
    alert.status === 'OUVERTE' ? 'Ouverte' : alert.status === 'EN_COURS' ? 'En cours' : 'Résolue'
  const statusStyle =
    alert.status === 'OUVERTE'
      ? 'text-neg bg-negbg'
      : alert.status === 'EN_COURS'
        ? 'text-warn bg-warnbg'
        : 'text-pos bg-posbg'
  return (
    <div className="card p-4 fade-up">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge level={alert.severity} />
            <span className={`text-[10px] font-semibold uppercase tracking-[0.06em] rounded px-1.5 py-0.5 ${statusStyle}`}>{statusLabel}</span>
            <span className="text-[11px] text-ink-faint tabular-nums">{alert.date}</span>
          </div>
          <p className="text-[13px] font-semibold text-navy mt-2 leading-snug">{alert.subject}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[12px] text-ink-muted">
            <span>Périmètre : <span className="text-ink">{alert.scope}</span></span>
            <span>Impact : <span className="text-ink">{alert.impact}</span></span>
          </div>
          {open && <p className="text-[12.5px] text-ink-muted mt-2 leading-relaxed border-t border-line pt-2">{alert.detail}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button className="btn-ghost !text-[12px] !py-1" onClick={() => setOpen((v) => !v)}>
          <ChevronDown size={13} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
          {open ? 'Réduire' : 'Détail'}
        </button>
        <button className="btn-primary !text-[12px] !py-1" onClick={() => onView?.(alert)}>
          Voir <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

export function RecommendationCard({
  title,
  body,
  tag = 'Recommandation IA',
  confidence,
}: {
  title: string
  body: string
  tag?: string
  confidence?: number
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg grid place-items-center bg-gold/15 text-gold-dark">
          <Lightbulb size={15} />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.07em] text-gold-dark">{tag}</span>
        {confidence !== undefined && (
          <span className="ml-auto text-[11px] text-ink-faint">Confiance {confidence} %</span>
        )}
      </div>
      <p className="text-[13px] font-semibold text-navy mt-2.5 leading-snug">{title}</p>
      <p className="text-[12.5px] text-ink-muted mt-1 leading-relaxed">{body}</p>
    </div>
  )
}

export function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy bg-gold/15 border border-gold/30 rounded-full px-2.5 py-1">
      <Sparkles size={12} className="text-gold-dark" />
      Généré par POSTE AI
    </span>
  )
}
