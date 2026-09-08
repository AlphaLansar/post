// POSTE AI — Registre de risques simulé (matrice probabilité × impact).
import type { RiskItem } from '../types'
import { AGENCIES, REGION_STATS } from '../data/dataset'
import { trendOf } from './analytics'

const atRisk = AGENCIES.filter((a) => a.score < 55).length
const costHeavyRegions = Math.max(
  3,
  REGION_STATS.filter((r) => r.expenses / r.revenue > 0.8).length,
)

export const RISK_REGISTER: RiskItem[] = [
  {
    id: 'r1',
    label: `Sous-performance simultanée de ${atRisk} agences du réseau`,
    category: 'Réseau',
    probability: 0.62,
    impact: 0.74,
    score: 78,
    trend: trendOf(3),
    action: "Plan de redressement ciblé + revue opérationnelle mensuelle des agences sous le seuil de score 55.",
  },
  {
    id: 'r2',
    label: `Coûts opérationnels supérieurs à la moyenne dans ${costHeavyRegions} régions`,
    category: 'Financier',
    probability: 0.55,
    impact: 0.68,
    score: 66,
    trend: trendOf(2),
    action: 'Audit des postes de dépense (transport, énergie, sous-traitance) et cadrage budgétaire trimestriel.',
  },
  {
    id: 'r3',
    label: 'Érosion structurelle du volume courrier (-3 % / mois)',
    category: 'Commercial',
    probability: 0.81,
    impact: 0.52,
    score: 63,
    trend: trendOf(3),
    action: 'Accélérer la bascule vers les services colis, numériques et financiers pour compenser la perte de marge.',
  },
  {
    id: 'r4',
    label: 'Allongement des délais sur les corridors Nord (Mopti, Tombouctou, Gao)',
    category: 'Logistique',
    probability: 0.58,
    impact: 0.6,
    score: 58,
    trend: trendOf(1),
    action: 'Réviser la fréquence des rotations et sécuriser un prestataire de transport de secours.',
  },
  {
    id: 'r5',
    label: 'Concentration du chiffre d’affaires sur la région de Bamako (~30 %)',
    category: 'Commercial',
    probability: 0.7,
    impact: 0.45,
    score: 49,
    trend: trendOf(0),
    action: 'Diversifier la contribution régionale via des offres adaptées aux zones secondaires.',
  },
  {
    id: 'r6',
    label: 'Dépendance à des saisies manuelles pour la consolidation des indicateurs',
    category: 'Opérationnel',
    probability: 0.66,
    impact: 0.4,
    score: 44,
    trend: trendOf(-2),
    action: 'Prioriser l’intégration Data Warehouse (Phase 2) pour fiabiliser et automatiser le reporting.',
  },
  {
    id: 'r7',
    label: 'Écart budgétaire cumulé sur les dépenses de fonctionnement',
    category: 'Financier',
    probability: 0.48,
    impact: 0.55,
    score: 42,
    trend: trendOf(1),
    action: 'Mettre en place des alertes automatiques de dépassement à 90 % de l’enveloppe.',
  },
  {
    id: 'r8',
    label: 'Rotation des agents supérieure à la cible dans les agences secondaires',
    category: 'Opérationnel',
    probability: 0.4,
    impact: 0.38,
    score: 32,
    trend: trendOf(0),
    action: 'Programme de fidélisation et parcours de mobilité interne.',
  },
]
