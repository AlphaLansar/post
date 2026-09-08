// ============================================================================
// POSTE AI — Moteur analytique simulé
// Fonctions pures et déterministes. En Phase 2, elles seront alimentées par le
// Data Warehouse et complétées par des modèles ML (voir /roadmap).
// ============================================================================
import {
  PERFORMANCE_WEIGHTS,
  PERFORMANCE_BANDS,
  RISK_WEIGHTS,
  RISK_BANDS,
} from '../config/weights'
import type { PerfBand, RiskLevel, Trend } from '../types'

export const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v))
export const round1 = (v: number) => Math.round(v * 10) / 10

/** Taux de croissance (%) entre deux valeurs. */
export function growthRate(current: number, previous: number): number {
  if (!previous) return 0
  return round1(((current - previous) / previous) * 100)
}

/** Rentabilité = marge opérationnelle (%). */
export function profitability(revenue: number, expenses: number): number {
  if (!revenue) return 0
  return round1(((revenue - expenses) / revenue) * 100)
}

interface PerfInput {
  growth: number // %
  profitability: number // %
  volume: number // 0–100 normalisé
  serviceRate: number // %
  satisfaction: number // 0–100
}

/**
 * Score de performance /100 = combinaison pondérée (config/weights.ts) :
 * 30% croissance · 25% rentabilité · 20% volume · 15% service · 10% satisfaction
 */
export function performanceScore(i: PerfInput): number {
  const w = PERFORMANCE_WEIGHTS
  const growthN = clamp(50 + i.growth * 3) // -16%→~0, 0%→50, +16%→~100
  const profN = clamp(i.profitability * 2.6) // 38%→~100
  const volN = clamp(i.volume)
  const svcN = clamp((i.serviceRate - 70) * (100 / 30)) // 70%→0, 100%→100
  const satN = clamp(i.satisfaction)
  return Math.round(
    growthN * w.growth +
      profN * w.profitability +
      volN * w.volume +
      svcN * w.serviceRate +
      satN * w.satisfaction,
  )
}

export function bandOf(score: number): PerfBand {
  return (PERFORMANCE_BANDS.find((b) => score >= b.min)?.band ?? 'CRITIQUE') as PerfBand
}

interface RiskInput {
  growth: number // %
  costPressure: number // (Δcoûts - Δrevenus) en points
  serviceRate: number // %
  volatility: number // écart-type relatif des volumes, %
}

/** Score de risque /100 (config/weights.ts). Plus haut = plus risqué. */
export function riskScore(i: RiskInput): number {
  const w = RISK_WEIGHTS
  const negG = clamp(-i.growth * 6) // -8%→~48, -16%→~96
  const cost = clamp(i.costPressure * 7)
  const svc = clamp((93 - i.serviceRate) * 6)
  const vol = clamp(i.volatility * 4)
  return Math.round(
    negG * w.negativeGrowth + cost * w.costPressure + svc * w.lowService + vol * w.volatility,
  )
}

export function riskLevelOf(score: number): RiskLevel {
  return (RISK_BANDS.find((b) => score >= b.min)?.level ?? 'FAIBLE') as RiskLevel
}

export function trendOf(growth: number): Trend {
  if (growth > 1.5) return 'up'
  if (growth < -1.5) return 'down'
  return 'flat'
}

/** Classement décroissant sur une clé numérique. */
export function rankBy<T>(rows: T[], key: (r: T) => number): (T & { rank: number })[] {
  return [...rows]
    .sort((a, b) => key(b) - key(a))
    .map((r, i) => ({ ...r, rank: i + 1 }))
}

/** Coefficient de variation (%) d'une série. */
export function volatilityPct(series: number[]): number {
  if (series.length < 2) return 0
  const m = series.reduce((s, v) => s + v, 0) / series.length
  const varc = series.reduce((s, v) => s + (v - m) ** 2, 0) / series.length
  return m ? round1((Math.sqrt(varc) / m) * 100) : 0
}
