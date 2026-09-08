// ============================================================================
// POSTE AI — Configuration du moteur analytique
// Toutes les pondérations sont centralisées ici pour être ajustées facilement
// par la Direction / les analystes sans toucher au code métier.
// ============================================================================

/** Pondérations du score de performance (somme = 1). */
export const PERFORMANCE_WEIGHTS = {
  growth: 0.3, // croissance de l'activité
  profitability: 0.25, // rentabilité (marge)
  volume: 0.2, // volume traité (colis + transactions)
  serviceRate: 0.15, // qualité de service
  satisfaction: 0.1, // satisfaction client
} as const

/** Pondérations du score de risque (somme = 1). */
export const RISK_WEIGHTS = {
  negativeGrowth: 0.35, // recul de l'activité
  costPressure: 0.3, // coûts qui progressent plus vite que les revenus
  lowService: 0.2, // dégradation du service
  volatility: 0.15, // instabilité des volumes
} as const

/** Seuils de classification des bandes de performance. */
export const PERFORMANCE_BANDS: { band: import('../types').PerfBand; min: number }[] = [
  { band: 'EXCELLENT', min: 85 },
  { band: 'BON', min: 70 },
  { band: 'STABLE', min: 55 },
  { band: 'A_SURVEILLER', min: 40 },
  { band: 'CRITIQUE', min: 0 },
]

/** Seuils de niveau de risque (sur 100). */
export const RISK_BANDS: { level: import('../types').RiskLevel; min: number }[] = [
  { level: 'CRITIQUE', min: 75 },
  { level: 'ELEVE', min: 55 },
  { level: 'MODERE', min: 35 },
  { level: 'FAIBLE', min: 0 },
]

/** Détection d'anomalie : écart (en nombre d'écarts-types) au-delà duquel on alerte. */
export const ANOMALY_SIGMA = 2.0

/** Horizon et niveau de confiance des prévisions. */
export const FORECAST = {
  horizonsDays: [30, 90] as const,
  confidence: 0.9,
  /** Largeur de l'intervalle relatif à 90 jours (bande ± en % de la valeur). */
  bandPct90: 0.09,
  bandPct30: 0.04,
} as const

/** Métadonnées produit. */
export const PRODUCT = {
  name: 'POSTE AI',
  tagline: "Plateforme d'Intelligence Décisionnelle",
  org: 'La Poste du Mali',
  disclaimer: 'Prototype de démonstration — Données synthétiques — Version conceptuelle',
  version: 'v0.9.0-preview',
} as const
