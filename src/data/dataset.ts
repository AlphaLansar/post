// ============================================================================
// POSTE AI — Générateur de données synthétiques cohérentes
// ----------------------------------------------------------------------------
// PROTOTYPE / DÉMONSTRATION UNIQUEMENT.
// Aucune donnée réelle de La Poste du Mali. Les séries reproduisent des
// dynamiques plausibles : tendance, saisonnalité, croissance, écarts
// régionaux et quelques anomalies volontaires pour la démonstration.
// En Phase 2, cette couche est remplacée par des requêtes Data Warehouse.
// ============================================================================
import { makeRng } from './rng'
import { REGIONS } from './regions'
import type {
  Agency,
  AgencyMonth,
  MonthPoint,
  PerfBand,
  RegionStat,
} from '../types'
import {
  bandOf,
  growthRate,
  performanceScore,
  profitability,
  riskLevelOf,
  riskScore,
  trendOf,
  volatilityPct,
} from '../services/analytics'

const rng = makeRng(20260908)

// ----------------------------------------------------------------------------
// 1. Calendrier — 12 mois clos, se terminant en août 2026
// ----------------------------------------------------------------------------
const MONTH_FR = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc',
]

function buildCalendar(): { month: string; label: string; mNum: number }[] {
  const out: { month: string; label: string; mNum: number }[] = []
  // dernier mois = 2026-08
  let y = 2025
  let m = 9 // septembre 2025
  for (let i = 0; i < 12; i++) {
    out.push({ month: `${y}-${String(m).padStart(2, '0')}`, label: `${MONTH_FR[m - 1]} ${String(y).slice(2)}`, mNum: m })
    m++
    if (m > 12) {
      m = 1
      y++
    }
  }
  return out
}
export const CALENDAR = buildCalendar()

// ----------------------------------------------------------------------------
// 2. Série nationale mensuelle
// ----------------------------------------------------------------------------
const TARGET = {
  revenue: 2.481e9,
  parcels: 128_420,
  transactions: 1_842_000,
  mail: 342_800,
  expenses: 1.933e9,
  footfall: 214_500,
  agents: 2_140,
}
const MONTHLY_GROWTH = {
  revenue: 0.0069,
  parcels: 0.0104,
  transactions: 0.0056,
  mail: -0.0028,
  expenses: 0.008,
  footfall: 0.004,
}
const SEASON_AMP = { revenue: 0.06, parcels: 0.115, transactions: 0.05, mail: 0.038, expenses: 0.03, footfall: 0.05 }

function seasonal(mNum: number, amp: number) {
  // pic en décembre (mNum 12), creux au milieu d'année (saison des pluies)
  return 1 + amp * Math.cos((2 * Math.PI * (mNum - 12)) / 12)
}

function buildMonthly(): MonthPoint[] {
  const rows: MonthPoint[] = []
  const s11 = {
    revenue: seasonal(CALENDAR[11].mNum, SEASON_AMP.revenue),
    parcels: seasonal(CALENDAR[11].mNum, SEASON_AMP.parcels),
    transactions: seasonal(CALENDAR[11].mNum, SEASON_AMP.transactions),
    mail: seasonal(CALENDAR[11].mNum, SEASON_AMP.mail),
    expenses: seasonal(CALENDAR[11].mNum, SEASON_AMP.expenses),
    footfall: seasonal(CALENDAR[11].mNum, SEASON_AMP.footfall),
  }
  for (let i = 0; i < 12; i++) {
    const c = CALENDAR[i]
    const back = 11 - i
    const f = (key: keyof typeof TARGET, g: number, amp: number, sLast: number, noise: number) => {
      const seas = seasonal(c.mNum, amp)
      const base = (TARGET[key] / Math.pow(1 + g, back)) * (seas / sLast)
      return base * (1 + rng.gauss(noise))
    }
    const revenue = f('revenue', MONTHLY_GROWTH.revenue, SEASON_AMP.revenue, s11.revenue, 0.018)
    const parcels = f('parcels', MONTHLY_GROWTH.parcels, SEASON_AMP.parcels, s11.parcels, 0.03)
    const transactions = f('transactions', MONTHLY_GROWTH.transactions, SEASON_AMP.transactions, s11.transactions, 0.02)
    const mail = f('mail', MONTHLY_GROWTH.mail, SEASON_AMP.mail, s11.mail, 0.022)
    const expenses = f('expenses', MONTHLY_GROWTH.expenses, SEASON_AMP.expenses, s11.expenses, 0.016)
    const footfall = f('footfall', MONTHLY_GROWTH.footfall, SEASON_AMP.footfall, s11.footfall, 0.025)
    const serviceRate = Math.min(96.4, 91.3 + i * 0.31 + rng.gauss(0.4))
    const agents = Math.round(2096 + i * 4 + rng.gauss(6))
    rows.push({
      month: c.month,
      label: c.label,
      revenue: Math.round(revenue),
      parcels: Math.round(parcels),
      transactions: Math.round(transactions),
      mail: Math.round(mail),
      expenses: Math.round(expenses),
      footfall: Math.round(footfall),
      agents,
      serviceRate: Math.round(serviceRate * 10) / 10,
    })
  }
  return rows
}
export const MONTHLY: MonthPoint[] = buildMonthly()

const last = MONTHLY[11]
const prev = MONTHLY[10]

// Variations « vs période précédente » des cartes exécutives : ces écarts
// comparent la période courante (30 j) à la période équivalente précédente et
// sont calés sur les valeurs cibles de la démonstration (le détail mois par
// mois reste visible dans le graphique d'évolution).
export const NATIONAL_KPIS = {
  revenue: last.revenue,
  revenueDelta: 8.4,
  parcels: last.parcels,
  parcelsDelta: 12.7,
  transactions: last.transactions,
  transactionsDelta: 6.8,
  mail: last.mail,
  mailDelta: -3.2,
  agenciesActive: 142,
  agenciesDelta: 2,
  serviceRate: last.serviceRate,
  serviceDelta: 3.1,
  expenses: last.expenses,
  margin: profitability(last.revenue, last.expenses),
}

// ----------------------------------------------------------------------------
// 3. Statistiques régionales
// ----------------------------------------------------------------------------
function regionSpark(weight: number, wobble: number): number[] {
  return MONTHLY.slice(4).map((m) => Math.round(m.revenue * weight * (1 + wobble + rng.gauss(0.02))))
}

export const REGION_STATS: RegionStat[] = REGIONS.map((r) => {
  const wobble = rng.gauss(0.03)
  const revenue = Math.round(last.revenue * r.weight * (1 + wobble))
  const revenuePrev = Math.round(prev.revenue * r.weight * (1 + wobble + rng.gauss(0.02)))
  const transactions = Math.round(last.transactions * r.weight * (1 + rng.gauss(0.04)))
  const parcels = Math.round(last.parcels * r.weight * (1 + r.bias * 0.03 + rng.gauss(0.05)))
  const mail = Math.round(last.mail * r.weight * (1 + rng.gauss(0.03)))
  const expenses = Math.round(revenue * (0.74 + rng.range(-0.05, 0.09) - r.bias * 0.015))
  const growth = Math.round((MONTHLY_GROWTH.revenue * 100 * 3 + r.bias * 2.1 + rng.gauss(1.4)) * 10) / 10
  const spark = regionSpark(r.weight, wobble)
  const vol = volatilityPct(spark)
  const prof = profitability(revenue, expenses)
  const volumeN = Math.min(100, (parcels / (last.parcels * 0.3)) * 100)
  const serviceRate = Math.min(97, 90 + r.bias * 1.6 + rng.gauss(1.1))
  const satisfaction = Math.min(95, 68 + r.bias * 3 + rng.gauss(4))
  const score = performanceScore({ growth, profitability: prof, volume: volumeN, serviceRate, satisfaction })
  return {
    regionId: r.id,
    region: r.name,
    revenue,
    transactions,
    parcels,
    mail,
    expenses,
    growth,
    score,
    band: bandOf(score) as PerfBand,
    trend: trendOf(growth),
    spark,
  }
})

// ----------------------------------------------------------------------------
// 4. Agences (30) avec historique 12 mois
// ----------------------------------------------------------------------------
const SUFFIXES = ['Centre', 'Grand Marché', 'Gare routière', 'Aéroport', 'Nord', 'Sud', 'Universitaire']
const TYPES: Agency['type'][] = ['Bureau principal', 'Agence urbaine', 'Agence urbaine', 'Agence secondaire', 'Agence secondaire', 'Point postal', 'Point postal']

// Agences volontairement en difficulté / en pointe pour le fil narratif de la démo
const FORCED: Record<string, Partial<{ growth: number; costMul: number; service: number }>> = {
  'mop-1': { growth: -12.8, costMul: 1.19, service: 86.4 },
  'tbk-2': { growth: -9.4, costMul: 1.12, service: 88.1 },
  'seg-2': { growth: -6.7, costMul: 1.15, service: 89.3 },
  'gao-1': { growth: -4.9, costMul: 1.1, service: 90.1 },
  'bko-1': { growth: 14.2, costMul: 0.93, service: 96.1 },
  'sik-1': { growth: 12.6, costMul: 0.95, service: 95.2 },
}

function agencyHistory(shareRevenue: number, shareOther: number, wobble: number): AgencyMonth[] {
  return MONTHLY.map((m) => ({
    label: m.label,
    revenue: Math.round(m.revenue * shareRevenue * (1 + wobble + rng.gauss(0.03))),
    transactions: Math.round(m.transactions * shareOther * (1 + rng.gauss(0.04))),
    parcels: Math.round(m.parcels * shareOther * (1 + rng.gauss(0.06))),
    mail: Math.round(m.mail * shareOther * (1 + rng.gauss(0.05))),
    expenses: Math.round(m.expenses * shareRevenue * (1 + wobble + rng.gauss(0.03))),
  }))
}

export const AGENCIES: Agency[] = REGIONS.flatMap((r) => {
  const rs = REGION_STATS.find((x) => x.regionId === r.id)!
  const n = r.agencyCount
  // parts décroissantes (type Zipf) normalisées
  const raw = Array.from({ length: n }, (_, i) => 1 / Math.pow(i + 1, 0.72))
  const sum = raw.reduce((s, v) => s + v, 0)
  const shares = raw.map((v) => v / sum)

  return shares.map((sh, i): Agency => {
    const id = `${r.id}-${i + 1}`
    const forced = FORCED[id] ?? {}
    const name =
      i === 0
        ? `${r.name} Centre`
        : `${r.name} ${SUFFIXES[i] ?? `Antenne ${i + 1}`}`
    const type = TYPES[Math.min(i, TYPES.length - 1)]
    const wobble = rng.gauss(0.04)

    const revenue = Math.round(rs.revenue * sh * (1 + rng.gauss(0.03)))
    const shareOther = sh * (rs.regionId === r.id ? 1 : 1)
    const transactions = Math.round(rs.transactions * shareOther * (1 + rng.gauss(0.05)))
    const parcels = Math.round(rs.parcels * shareOther * (1 + rng.gauss(0.07)))
    const mail = Math.round(rs.mail * shareOther * (1 + rng.gauss(0.05)))
    const costMul = forced.costMul ?? 0.74 + rng.range(-0.04, 0.12)
    const expenses = Math.round(revenue * costMul)
    const agents = Math.max(3, Math.round((revenue / rs.revenue) * (r.agencyCount * 14) + rng.gauss(2)))
    const growth =
      forced.growth ?? Math.round((rs.growth + rng.gauss(3.2)) * 10) / 10
    const prof = profitability(revenue, expenses)
    const serviceRate = Math.round((forced.service ?? Math.min(97, 89 + r.bias * 1.4 + rng.gauss(2.2))) * 10) / 10
    const satisfaction = Math.round(Math.min(96, 66 + r.bias * 3 + growth * 0.4 + rng.gauss(5)))
    const history = agencyHistory(revenue / last.revenue, shareOther, wobble)
    const spark = history.slice(4).map((h) => h.revenue)
    const vol = volatilityPct(spark)
    const volumeN = Math.min(100, ((parcels + transactions / 20) / (rs.parcels * 0.4 + rs.transactions / 40 + 1)) * 100)
    const score = performanceScore({ growth, profitability: prof, volume: volumeN, serviceRate, satisfaction })
    const costPressure = ((costMul - 0.78) * 100) / 4 + Math.max(0, -growth) * 0.3
    const rScore = riskScore({ growth, costPressure, serviceRate, volatility: vol })

    return {
      id,
      name,
      regionId: r.id,
      region: r.name,
      type,
      agents,
      revenue,
      transactions,
      parcels,
      mail,
      expenses,
      growth,
      profitability: prof,
      serviceRate,
      satisfaction,
      score,
      band: bandOf(score),
      risk: riskLevelOf(rScore),
      riskScore: rScore,
      trend: trendOf(growth),
      spark,
      history,
    }
  })
})

export const AGENCY_BY_ID = Object.fromEntries(AGENCIES.map((a) => [a.id, a]))

// ----------------------------------------------------------------------------
// 5. Finance mensuelle & rentabilité par agence
// ----------------------------------------------------------------------------
export const FINANCE_MONTHLY = MONTHLY.map((m) => {
  const budget = Math.round(m.expenses * (1.02 + rng.gauss(0.015)))
  return {
    label: m.label,
    month: m.month,
    revenue: m.revenue,
    expenses: m.expenses,
    margin: profitability(m.revenue, m.expenses),
    opex: Math.round(m.expenses * 0.63),
    budget,
    variance: Math.round(((m.expenses - budget) / budget) * 1000) / 10,
  }
})

export const FINANCE_KPIS = {
  revenue: last.revenue,
  expenses: last.expenses,
  margin: profitability(last.revenue, last.expenses),
  opex: Math.round(last.expenses * 0.63),
  budget: FINANCE_MONTHLY[11].budget,
  variance: FINANCE_MONTHLY[11].variance,
  revenueDelta: growthRate(last.revenue, prev.revenue),
  expensesDelta: growthRate(last.expenses, prev.expenses),
}

// ----------------------------------------------------------------------------
// 6. Logistique — corridors, délais, livraisons
// ----------------------------------------------------------------------------
const CORRIDOR_PAIRS: [string, string][] = [
  ['Bamako', 'Sikasso'], ['Bamako', 'Kayes'], ['Bamako', 'Ségou'], ['Bamako', 'Koulikoro'],
  ['Bamako', 'Mopti'], ['Ségou', 'Mopti'], ['Sikasso', 'Koutiala'], ['Bamako', 'Gao'],
  ['Mopti', 'Tombouctou'], ['Kayes', 'Bamako'], ['Bamako', 'Kati'], ['Ségou', 'Bla'],
]
export const CORRIDORS = CORRIDOR_PAIRS.map(([a, b], i) => {
  const base = 16800 / Math.pow(i + 1, 0.55)
  const volume = Math.round(base * (1 + rng.gauss(0.08)))
  const delay = Math.round((1.6 + i * 0.12 + rng.gauss(0.25)) * 10) / 10
  const onTime = Math.round((97 - i * 0.9 - Math.max(0, rng.gauss(2))) * 10) / 10
  return { id: `c${i + 1}`, route: `${a} → ${b}`, volume, delayDays: Math.max(0.8, delay), onTimePct: Math.min(99, onTime) }
}).sort((a, b) => b.volume - a.volume)

export const LOGISTICS_KPIS = (() => {
  const inbound = Math.round(last.parcels * 0.52)
  const outbound = last.parcels - inbound
  const delivered = Math.round(last.parcels * 0.947)
  const late = Math.round(last.parcels * 0.061)
  return {
    inbound,
    outbound,
    delivered,
    late,
    deliveryRate: 94.7,
    avgDelayDays: 2.4,
    inboundDelta: 9.8,
    outboundDelta: 14.1,
    lateDelta: -6.2,
    delayDelta: -0.3,
  }
})()

export const LOGISTICS_MONTHLY = MONTHLY.map((m, i) => ({
  label: m.label,
  entrants: Math.round(m.parcels * 0.52),
  sortants: Math.round(m.parcels * 0.48),
  retards: Math.round(m.parcels * (0.085 - i * 0.0018 + rng.gauss(0.004))),
  delaiMoyen: Math.round((2.9 - i * 0.045 + rng.gauss(0.08)) * 100) / 100,
  tauxLivraison: Math.round((91.5 + i * 0.28 + rng.gauss(0.3)) * 10) / 10,
}))

export const LOGISTICS_BY_REGION = REGION_STATS.map((r) => ({
  region: r.region,
  colis: r.parcels,
  retardsPct: Math.round((4 + Math.max(0, -r.growth) * 0.4 + Math.abs(rng.gauss(1.4))) * 10) / 10,
  delai: Math.round((1.8 + Math.max(0, -r.growth) * 0.12 + Math.abs(rng.gauss(0.5))) * 10) / 10,
})).sort((a, b) => b.colis - a.colis)

// Derived helpers
export function periodFactor(period: string): number {
  switch (period) {
    case "Aujourd'hui":
      return 1 / 30
    case '7 jours':
      return 7 / 30
    case '30 jours':
      return 1
    case 'Trimestre':
      return 3
    case 'Année':
      return 11.6
    default:
      return 1
  }
}
