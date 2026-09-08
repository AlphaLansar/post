// ============================================================================
// POSTE AI — Prévision simulée (MODÈLE SIMULÉ — DONNÉES DE DÉMONSTRATION)
// Approche : taux de croissance mensuel moyen des 6 derniers mois projeté en
// composé, avec une légère modulation saisonnière et un intervalle de
// confiance qui s'élargit avec l'horizon (config/weights.ts).
// En Phase 2 : Prophet / ARIMA / Gradient Boosting sur données réelles.
// ============================================================================
import { FORECAST } from '../config/weights'
import { MONTHLY, CALENDAR } from '../data/dataset'
import type { ForecastSeries, MonthPoint } from '../types'

const MONTH_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

/** Modulation saisonnière cosmétique (pic déc., creux mi-année), amplitude faible. */
function seasonalNudge(monthNum: number, amp = 0.02) {
  return 1 + amp * Math.cos((2 * Math.PI * (monthNum - 12)) / 12)
}

function futureLabels(k: number): { label: string; monthNum: number }[] {
  let y = 2026
  let m = CALENDAR[11].mNum
  const out: { label: string; monthNum: number }[] = []
  for (let i = 0; i < k; i++) {
    m++
    if (m > 12) {
      m = 1
      y++
    }
    out.push({ label: `${MONTH_FR[m - 1]} ${String(y).slice(2)}`, monthNum: m })
  }
  return out
}

export function buildForecast(
  key: keyof Pick<MonthPoint, 'revenue' | 'parcels' | 'transactions' | 'mail'>,
  label: string,
  unit: string,
  model: string,
  mape: number,
): ForecastSeries {
  const values = MONTHLY.map((m) => m[key] as number)
  const lastValue = values[values.length - 1]

  // taux de croissance mensuel moyen sur les 6 derniers mois
  const recent = values.slice(-7)
  let g = 0
  for (let i = 1; i < recent.length; i++) g += recent[i] / recent[i - 1] - 1
  g /= recent.length - 1

  const history = MONTHLY.map((m) => ({ label: m.label, value: m[key] as number }))

  const HK = 4 // 4 mois ≈ horizon 90 j + marge
  const labels = futureLabels(HK)
  const seas0 = seasonalNudge(CALENDAR[11].mNum)
  const forecast = labels.map((lb, j) => {
    const k = j + 1
    const trend = lastValue * Math.pow(1 + g, k)
    const value = trend * (seasonalNudge(lb.monthNum) / seas0)
    const bandPct =
      FORECAST.bandPct30 + (j / (HK - 1)) * (FORECAST.bandPct90 - FORECAST.bandPct30)
    return {
      label: lb.label,
      value: Math.round(value),
      lo: Math.round(value * (1 - bandPct)),
      hi: Math.round(value * (1 + bandPct)),
    }
  })

  return {
    key,
    label,
    unit,
    history,
    forecast,
    h30: forecast[0].value,
    h90: forecast[2].value,
    mape,
    model,
  }
}

export const FORECASTS: ForecastSeries[] = [
  buildForecast('revenue', "Chiffre d'affaires", 'FCFA', 'Régression log-linéaire + saisonnalité', 4.1),
  buildForecast('parcels', 'Volume de colis', 'colis', 'Gradient Boosting simulé', 5.3),
  buildForecast('transactions', 'Transactions', 'opérations', 'Régression log-linéaire + saisonnalité', 3.6),
  buildForecast('mail', 'Volume courrier', 'plis', 'ARIMA simulé (tendance baissière)', 4.8),
]
