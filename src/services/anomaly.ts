// ============================================================================
// POSTE AI — Détection d'anomalies simulée
// Méthode : comparaison de la valeur observée à la valeur attendue (moyenne
// mobile + tendance) ; alerte si l'écart dépasse ANOMALY_SIGMA écarts-types.
// En Phase 2 : Isolation Forest / séries temporelles robustes sur données réelles.
// ============================================================================
import { ANOMALY_SIGMA } from '../config/weights'
import { AGENCIES } from '../data/dataset'
import type { Anomaly, AlertSeverity } from '../types'

function severityOf(devPct: number): AlertSeverity {
  const a = Math.abs(devPct)
  if (a >= 30) return 'CRITIQUE'
  if (a >= 18) return 'ELEVE'
  if (a >= 10) return 'MOYEN'
  return 'FAIBLE'
}

/** Détecte une anomalie sur la dernière valeur d'une série par rapport à sa tendance. */
export function detectLast(series: number[]): { expected: number; observed: number; devPct: number; sigma: number } {
  const hist = series.slice(0, -1)
  const observed = series[series.length - 1]
  const n = hist.length
  const mx = (n - 1) / 2
  const my = hist.reduce((s, v) => s + v, 0) / n
  let sn = 0
  let sd = 0
  for (let i = 0; i < n; i++) {
    sn += (i - mx) * (hist[i] - my)
    sd += (i - mx) ** 2
  }
  const slope = sn / sd
  const intercept = my - slope * mx
  const expected = intercept + slope * n
  const resid = hist.map((v, i) => v - (intercept + slope * i))
  const rsd = Math.sqrt(resid.reduce((s, v) => s + v * v, 0) / n) || 1
  const devPct = ((observed - expected) / expected) * 100
  return { expected, observed, devPct, sigma: (observed - expected) / rsd }
}

const built: Anomaly[] = []
for (const a of AGENCIES) {
  const tx = a.history.map((h) => h.transactions)
  const d = detectLast(tx)
  if ((Math.abs(d.sigma) >= ANOMALY_SIGMA || d.devPct <= -8) && d.devPct < -3) {
    built.push({
      id: `an-${a.id}-tx`,
      entity: a.name,
      metric: 'Transactions',
      expected: Math.round(d.expected),
      observed: Math.round(d.observed),
      deviationPct: Math.round(d.devPct * 10) / 10,
      severity: severityOf(d.devPct),
      date: '2026-08-31',
      note: `Recul marqué des transactions par rapport à la trajectoire attendue à ${a.name}.`,
      series: a.history.slice(-6).map((h, i, arr) => ({
        label: h.label,
        attendu: Math.round(d.expected * (0.92 + i * 0.016)),
        observe: h.transactions,
      })),
    })
  }
  const ex = a.history.map((h) => h.expenses)
  const de = detectLast(ex)
  if (de.devPct >= 9) {
    built.push({
      id: `an-${a.id}-ex`,
      entity: a.name,
      metric: 'Dépenses',
      expected: Math.round(de.expected),
      observed: Math.round(de.observed),
      deviationPct: Math.round(de.devPct * 10) / 10,
      severity: severityOf(de.devPct),
      date: '2026-08-31',
      note: `Dépenses supérieures à la tendance attendue à ${a.name} — poste transport/énergie à contrôler.`,
      series: a.history.slice(-6).map((h) => ({
        label: h.label,
        attendu: Math.round(de.expected * 0.95),
        observe: h.expenses,
      })),
    })
  }
}

// Anomalies de démonstration (garantissent un contenu représentatif)
built.push({
  id: 'an-fin-1',
  entity: 'Agence Ségou Grand Marché',
  metric: 'Dépenses',
  expected: 34_800_000,
  observed: 43_100_000,
  deviationPct: 23.9,
  severity: 'ELEVE',
  date: '2026-08-31',
  note: 'Dépenses de fonctionnement +24 % vs tendance attendue — concentration sur les postes transport et énergie.',
  series: [
    { label: 'Mar 26', attendu: 33_900_000, observe: 34_100_000 },
    { label: 'Avr 26', attendu: 34_100_000, observe: 33_800_000 },
    { label: 'Mai 26', attendu: 34_300_000, observe: 35_600_000 },
    { label: 'Juin 26', attendu: 34_500_000, observe: 38_200_000 },
    { label: 'Juil 26', attendu: 34_700_000, observe: 41_000_000 },
    { label: 'Août 26', attendu: 34_800_000, observe: 43_100_000 },
  ],
})
built.push({
  id: 'an-log-1',
  entity: 'Corridor Mopti → Tombouctou',
  metric: 'Délai moyen de livraison',
  expected: 3,
  observed: 4.6,
  deviationPct: 53.3,
  severity: 'CRITIQUE',
  date: '2026-08-29',
  note: "Délai moyen inhabituellement élevé sur le corridor Nord — rotation retardée sur deux semaines consécutives.",
  series: [
    { label: 'Mar 26', attendu: 3.0, observe: 3.1 },
    { label: 'Avr 26', attendu: 3.0, observe: 2.9 },
    { label: 'Mai 26', attendu: 3.0, observe: 3.2 },
    { label: 'Juin 26', attendu: 3.0, observe: 3.4 },
    { label: 'Juil 26', attendu: 3.0, observe: 4.1 },
    { label: 'Août 26', attendu: 3.0, observe: 4.6 },
  ],
})

export const ANOMALIES: Anomaly[] = built
  .sort((a, b) => Math.abs(b.deviationPct) - Math.abs(a.deviationPct))
  .slice(0, 9)
