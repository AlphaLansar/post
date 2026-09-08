// ============================================================================
// POSTE AI — Types du domaine
// Prototype de démonstration — structures conçues pour être remplacées par des
// modèles issus de la base de données réelle en Phase 2 (voir /roadmap).
// ============================================================================

export type PerfBand = 'EXCELLENT' | 'BON' | 'STABLE' | 'A_SURVEILLER' | 'CRITIQUE'
export type RiskLevel = 'FAIBLE' | 'MODERE' | 'ELEVE' | 'CRITIQUE'
export type Trend = 'up' | 'down' | 'flat'
export type AlertSeverity = 'CRITIQUE' | 'ELEVE' | 'MOYEN' | 'FAIBLE'
export type AlertStatus = 'OUVERTE' | 'EN_COURS' | 'RESOLUE'
export type InsightLevel = 'positif' | 'attention' | 'risque' | 'information'

export type Role =
  | 'ADMIN'
  | 'DIRECTION_GENERALE'
  | 'DIRECTION_FINANCIERE'
  | 'DIRECTION_OPERATIONS'
  | 'RESPONSABLE_REGIONAL'
  | 'ANALYSTE'

export interface Region {
  id: string
  name: string
  /** Coordonnées stylisées (0–100) pour la carte schématique du Mali. */
  x: number
  y: number
  agencyCount: number
}

export interface MonthPoint {
  /** AAAA-MM */
  month: string
  label: string
  revenue: number
  parcels: number
  transactions: number
  mail: number
  expenses: number
  footfall: number
  agents: number
  serviceRate: number
}

export interface RegionStat {
  regionId: string
  region: string
  revenue: number
  transactions: number
  parcels: number
  mail: number
  expenses: number
  growth: number
  score: number
  band: PerfBand
  trend: Trend
  spark: number[]
}

export interface Agency {
  id: string
  name: string
  regionId: string
  region: string
  type: 'Bureau principal' | 'Agence urbaine' | 'Agence secondaire' | 'Point postal'
  agents: number
  revenue: number
  transactions: number
  parcels: number
  mail: number
  expenses: number
  growth: number
  profitability: number
  serviceRate: number
  satisfaction: number
  score: number
  band: PerfBand
  risk: RiskLevel
  riskScore: number
  trend: Trend
  spark: number[]
  history: AgencyMonth[]
}

export interface AgencyMonth {
  label: string
  revenue: number
  transactions: number
  parcels: number
  mail: number
  expenses: number
}

export interface Insight {
  id: string
  level: InsightLevel
  title: string
  detail: string
  metricHint?: string
}

export interface Alert {
  id: string
  date: string
  severity: AlertSeverity
  subject: string
  scope: string
  impact: string
  status: AlertStatus
  detail: string
}

export interface RiskItem {
  id: string
  label: string
  category: 'Opérationnel' | 'Financier' | 'Commercial' | 'Logistique' | 'Réseau'
  probability: number // 0–1
  impact: number // 0–1
  score: number // 0–100
  trend: Trend
  action: string
}

export interface Anomaly {
  id: string
  entity: string
  metric: string
  expected: number
  observed: number
  deviationPct: number
  severity: AlertSeverity
  date: string
  note: string
  series: { label: string; attendu: number; observe: number }[]
}

export interface ForecastSeries {
  key: string
  label: string
  unit: string
  history: { label: string; value: number }[]
  forecast: { label: string; value: number; lo: number; hi: number }[]
  h30: number
  h90: number
  mape: number
  model: string
}

export interface ReportCard {
  id: string
  kind: 'Quotidien' | 'Hebdomadaire' | 'Mensuel' | 'Trimestriel'
  title: string
  period: string
  generatedAt: string
  highlights: string[]
  pages: number
}

export interface AppNotification {
  id: string
  kind: 'alerte' | 'anomalie' | 'prevision' | 'rapport'
  text: string
  time: string
  unread: boolean
}

export interface ChatBlock {
  type: 'text' | 'kpis' | 'bars' | 'list' | 'note'
  text?: string
  kpis?: { label: string; value: string; delta?: string; tone?: 'pos' | 'neg' | 'flat' }[]
  bars?: { label: string; value: number; hint?: string }[]
  items?: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  blocks?: ChatBlock[]
}
