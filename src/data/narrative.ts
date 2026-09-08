// ============================================================================
// POSTE AI — Contenus analytiques narratifs (insights, alertes, rapports,
// notifications). Rédigés à partir du jeu de données synthétique pour rester
// cohérents avec les chiffres affichés.
// ============================================================================
import type { Alert, AppNotification, Insight, ReportCard } from '../types'
import { AGENCIES, NATIONAL_KPIS, REGION_STATS } from './dataset'
import { pct, fcfa } from '../lib/format'

const topParcelRegions = [...REGION_STATS].sort((a, b) => b.parcels - a.parcels).slice(0, 2).map((r) => r.region)
const atRisk = AGENCIES.filter((a) => a.score < 55)
const worst = [...AGENCIES].sort((a, b) => a.score - b.score).slice(0, 3)

export const INSIGHTS: Insight[] = [
  {
    id: 'i1',
    level: 'positif',
    title: `Le volume de colis progresse de ${pct(NATIONAL_KPIS.parcelsDelta)} sur 30 jours`,
    detail: `La dynamique est principalement portée par ${topParcelRegions.join(' et ')}. Le e-commerce local et les envois interurbains expliquent l'essentiel de la hausse.`,
    metricHint: 'Colis · 30 j',
  },
  {
    id: 'i2',
    level: 'risque',
    title: `${atRisk.length} agences présentent un risque élevé de sous-performance`,
    detail: `Score de performance inférieur à 55/100, combinant recul de l'activité et progression des coûts. Les plus exposées : ${worst.map((a) => a.name).join(', ')}.`,
    metricHint: 'Réseau',
  },
  {
    id: 'i3',
    level: 'positif',
    title: `Le taux de service s'est amélioré de ${pct(NATIONAL_KPIS.serviceDelta)} points`,
    detail: `Il atteint ${NATIONAL_KPIS.serviceRate} % au niveau national, au-dessus de la cible interne de 92 %. La progression est régulière depuis six mois.`,
    metricHint: 'Qualité de service',
  },
  {
    id: 'i4',
    level: 'attention',
    title: 'Le volume courrier poursuit sa tendance baissière depuis 4 mois',
    detail: `Recul de ${pct(NATIONAL_KPIS.mailDelta)} sur la période. La bascule vers les services colis et financiers compense partiellement la perte de revenu associée.`,
    metricHint: 'Courrier',
  },
  {
    id: 'i5',
    level: 'information',
    title: `Chiffre d'affaires mensuel consolidé : ${fcfa(NATIONAL_KPIS.revenue)}`,
    detail: `En hausse de ${pct(NATIONAL_KPIS.revenueDelta)} par rapport à la période précédente, avec une marge opérationnelle estimée à ${NATIONAL_KPIS.margin} %.`,
    metricHint: "Chiffre d'affaires",
  },
]

export const ALERTS: Alert[] = [
  {
    id: 'a1',
    date: '2026-08-31',
    severity: 'CRITIQUE',
    subject: `${worst[0]?.name ?? 'Agence Mopti Centre'} — baisse inhabituelle des transactions`,
    scope: worst[0]?.region ?? 'Mopti',
    impact: `Score ${worst[0]?.score ?? 41}/100 · recul estimé de ${pct(worst[0]?.growth ?? -12.8)} sur l'activité`,
    status: 'OUVERTE',
    detail:
      "Le volume de transactions s'écarte fortement de la trajectoire attendue depuis deux mois. Une revue opérationnelle sur site est recommandée sous 5 jours ouvrés.",
  },
  {
    id: 'a2',
    date: '2026-08-28',
    severity: 'ELEVE',
    subject: 'Région Mopti — coûts opérationnels supérieurs à la moyenne',
    scope: 'Mopti',
    impact: "Écart de +18 % vs moyenne nationale sur les dépenses de fonctionnement",
    status: 'EN_COURS',
    detail:
      'Les postes transport et énergie expliquent la majeure partie de l’écart. Un audit ciblé est en cours avec la direction régionale.',
  },
  {
    id: 'a3',
    date: '2026-08-26',
    severity: 'ELEVE',
    subject: 'Corridor Mopti → Tombouctou — délais de livraison anormaux',
    scope: 'Logistique Nord',
    impact: 'Délai moyen 4,6 j vs 3,0 j attendus · +53 %',
    status: 'OUVERTE',
    detail:
      'Deux rotations consécutives retardées. Impact sur le taux de livraison à l’heure de la zone Nord. Prestataire de secours à activer.',
  },
  {
    id: 'a4',
    date: '2026-08-24',
    severity: 'MOYEN',
    subject: 'Baisse progressive du courrier dans 4 régions',
    scope: 'National',
    impact: 'Contribution courrier en repli de 3 à 6 % selon les régions',
    status: 'EN_COURS',
    detail:
      'Tendance structurelle. Plan de conversion vers les offres colis et services financiers en cours de déploiement.',
  },
  {
    id: 'a5',
    date: '2026-08-21',
    severity: 'MOYEN',
    subject: `${worst[1]?.name ?? 'Agence Tombouctou Grand Marché'} — rentabilité sous le seuil cible`,
    scope: worst[1]?.region ?? 'Tombouctou',
    impact: `Marge opérationnelle estimée ${worst[1]?.profitability ?? 6} % (cible ≥ 15 %)`,
    status: 'OUVERTE',
    detail:
      'Combinaison d’une fréquentation en baisse et de charges fixes élevées. Étudier une mutualisation des moyens avec l’agence la plus proche.',
  },
  {
    id: 'a6',
    date: '2026-08-18',
    severity: 'FAIBLE',
    subject: 'Écart budgétaire de fonctionnement à surveiller',
    scope: 'Direction financière',
    impact: `Dépenses ${pct((AGENCIES.length && 3.1) || 3.1)} au-dessus de l'enveloppe mensuelle`,
    status: 'RESOLUE',
    detail: 'Régularisé après réallocation interne. Alerte automatique de dépassement à 90 % désormais active.',
  },
]

export const REPORTS: ReportCard[] = [
  {
    id: 'rep-d',
    kind: 'Quotidien',
    title: 'Note quotidienne de la Direction Générale',
    period: '8 septembre 2026',
    generatedAt: '2026-09-08 07:00',
    highlights: [
      `Activité de la veille conforme aux attentes (+${1.2} % vs J-7)`,
      '2 anomalies détectées, 1 alerte critique ouverte',
      'Taux de service national à 94,7 %',
    ],
    pages: 3,
  },
  {
    id: 'rep-w',
    kind: 'Hebdomadaire',
    title: 'Revue hebdomadaire de performance du réseau',
    period: 'Semaine 36 · 1–7 sept. 2026',
    generatedAt: '2026-09-08 06:30',
    highlights: [
      `Colis +${NATIONAL_KPIS.parcelsDelta} % sur 30 j, tirés par Bamako et Sikasso`,
      `${AGENCIES.filter((a) => a.score < 55).length} agences sous le seuil de vigilance`,
      'Corridor Nord : délais à surveiller',
    ],
    pages: 8,
  },
  {
    id: 'rep-m',
    kind: 'Mensuel',
    title: 'Rapport exécutif mensuel — Août 2026',
    period: 'Août 2026',
    generatedAt: '2026-09-02 09:15',
    highlights: [
      `CA consolidé ${fcfa(NATIONAL_KPIS.revenue)} (${pct(NATIONAL_KPIS.revenueDelta)})`,
      `Marge opérationnelle ${NATIONAL_KPIS.margin} %`,
      'Recommandations IA : 6 actions prioritaires',
    ],
    pages: 18,
  },
  {
    id: 'rep-q',
    kind: 'Trimestriel',
    title: 'Synthèse trimestrielle stratégique — T2 2026',
    period: 'Avril – Juin 2026',
    generatedAt: '2026-07-10 10:00',
    highlights: [
      'Croissance colis à deux chiffres sur le trimestre',
      'Contraction confirmée du segment courrier',
      'Plan réseau : 7 agences en redressement',
    ],
    pages: 32,
  },
]

export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', kind: 'alerte', text: '3 nouvelles alertes prioritaires', time: 'il y a 12 min', unread: true },
  { id: 'n2', kind: 'anomalie', text: '2 anomalies détectées sur les transactions', time: 'il y a 41 min', unread: true },
  { id: 'n3', kind: 'prevision', text: 'Prévision colis 90 j mise à jour', time: 'il y a 2 h', unread: true },
  { id: 'n4', kind: 'rapport', text: 'Rapport hebdomadaire disponible', time: 'il y a 5 h', unread: false },
  { id: 'n5', kind: 'anomalie', text: 'Corridor Mopti → Tombouctou : délai anormal', time: 'hier', unread: false },
]
