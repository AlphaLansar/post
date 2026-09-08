// ============================================================================
// POSTE AI — Copilot (moteur de réponses simulées)
// ----------------------------------------------------------------------------
// PROTOTYPE : aucune connexion LLM. Les réponses sont générées par un moteur
// d'intentions qui interroge le jeu de données synthétique et met en forme des
// analyses décisionnelles crédibles (texte + KPI + graphiques).
// Phase 2 : remplacement par une couche LLM + RAG branchée sur le Data
// Warehouse et le moteur analytique (voir /roadmap).
// ============================================================================
import type { ChatBlock, ChatMessage } from '../../types'
import {
  AGENCIES,
  NATIONAL_KPIS,
  REGION_STATS,
  FINANCE_KPIS,
} from '../../data/dataset'
import { FORECASTS } from '../forecasting'
import { fcfa, pct, compact, num } from '../../lib/format'

let seq = 0
const id = () => `m${Date.now()}-${seq++}`

export const SUGGESTED_QUESTIONS = [
  'Quelle est la performance globale ce mois-ci ?',
  'Quelles agences présentent les plus grands risques ?',
  'Pourquoi le volume de colis augmente-t-il ?',
  'Quelles régions sont les plus performantes ?',
  'Prévois-moi le chiffre d’affaires des trois prochains mois.',
  'Quelles actions devraient être prioritaires pour la Direction ?',
]

interface Intent {
  test: RegExp
  build: () => { content: string; blocks: ChatBlock[] }
}

const worst3 = [...AGENCIES].sort((a, b) => a.score - b.score).slice(0, 3)
const atRisk = AGENCIES.filter((a) => a.score < 55)
const topRegions = [...REGION_STATS].sort((a, b) => b.score - a.score)
const topParcels = [...REGION_STATS].sort((a, b) => b.parcels - a.parcels)

const INTENTS: Intent[] = [
  {
    test: /(performance|situation|résultat).*(glob|mois|glbal|général|glo)|comment (va|se porte)|vue d.ensemble/i,
    build: () => ({
      content:
        `Sur les 30 derniers jours, l'activité de La Poste du Mali est **globalement bien orientée**. ` +
        `Le chiffre d'affaires consolidé atteint ${fcfa(NATIONAL_KPIS.revenue)} (${pct(NATIONAL_KPIS.revenueDelta)}), ` +
        `porté par les colis (${pct(NATIONAL_KPIS.parcelsDelta)}) et les transactions (${pct(NATIONAL_KPIS.transactionsDelta)}). ` +
        `Le segment courrier reste en repli (${pct(NATIONAL_KPIS.mailDelta)}). La marge opérationnelle est estimée à ${NATIONAL_KPIS.margin} %.`,
      blocks: [
        {
          type: 'kpis',
          kpis: [
            { label: "Chiffre d'affaires", value: fcfa(NATIONAL_KPIS.revenue), delta: pct(NATIONAL_KPIS.revenueDelta), tone: 'pos' },
            { label: 'Colis', value: num(NATIONAL_KPIS.parcels), delta: pct(NATIONAL_KPIS.parcelsDelta), tone: 'pos' },
            { label: 'Transactions', value: compact(NATIONAL_KPIS.transactions), delta: pct(NATIONAL_KPIS.transactionsDelta), tone: 'pos' },
            { label: 'Courrier', value: num(NATIONAL_KPIS.mail), delta: pct(NATIONAL_KPIS.mailDelta), tone: 'neg' },
            { label: 'Taux de service', value: `${NATIONAL_KPIS.serviceRate} %`, delta: pct(NATIONAL_KPIS.serviceDelta), tone: 'pos' },
            { label: 'Agences actives', value: `${NATIONAL_KPIS.agenciesActive}`, delta: `+${NATIONAL_KPIS.agenciesDelta}`, tone: 'pos' },
          ],
        },
        {
          type: 'note',
          text: 'Lecture décisionnelle : la croissance repose sur la logistique colis et les services financiers. La priorité est de sécuriser cette dynamique et de traiter la poche de sous-performance du réseau.',
        },
      ],
    }),
  },
  {
    test: /(agence|bureau).*(risqu|sous.perform|difficult|fragil|faible)|quelles agences|agences (à|a) surveiller/i,
    build: () => ({
      content:
        `J'ai identifié **${atRisk.length} agences** présentant un niveau de risque supérieur au seuil défini ` +
        `(score de performance < 55/100). Les trois principales :\n\n` +
        worst3
          .map((a, i) => `${i + 1}. ${a.name} (${a.region}) — score ${a.score}/100, croissance ${pct(a.growth)}, marge ${a.profitability} %`)
          .join('\n') +
        `\n\nLa cause dominante est la **baisse des transactions combinée à une hausse des coûts opérationnels**. ` +
        `Je recommande de prioriser ces agences pour une revue opérationnelle sur site.`,
      blocks: [
        {
          type: 'bars',
          bars: worst3.map((a) => ({ label: a.name, value: a.score, hint: `${a.region} · ${pct(a.growth)}` })),
        },
        {
          type: 'list',
          items: [
            'Diligenter une revue opérationnelle sous 5 jours ouvrés sur les 3 agences critiques.',
            'Auditer les postes transport / énergie dans la région de Mopti.',
            'Étudier une mutualisation des moyens pour les agences secondaires à faible fréquentation.',
          ],
        },
      ],
    }),
  },
  {
    test: /pourquoi.*(colis|paquet)|colis.*(augment|hausse|progress|croiss)/i,
    build: () => ({
      content:
        `Le volume de colis progresse de ${pct(NATIONAL_KPIS.parcelsDelta)} sur 30 jours. ` +
        `Trois facteurs principaux, d'après le moteur analytique :\n\n` +
        `• **Concentration géographique** : ${topParcels[0].region} et ${topParcels[1].region} concentrent l'essentiel de la hausse.\n` +
        `• **Effet e-commerce local** : montée des envois interurbains de petits colis.\n` +
        `• **Report du courrier** : une partie des flux documentaires bascule vers l'envoi suivi.`,
      blocks: [
        {
          type: 'bars',
          bars: topParcels.slice(0, 5).map((r) => ({ label: r.region, value: r.parcels, hint: pct(r.growth) })),
        },
        { type: 'note', text: 'Impact : la croissance colis soutient le chiffre d’affaires mais accroît la charge logistique. Anticiper la capacité de tri et de transport sur les corridors concernés.' },
      ],
    }),
  },
  {
    test: /(région|region).*(perform|meilleure|top|classement)|quelles régions/i,
    build: () => ({
      content:
        `Classement des régions par score de performance consolidé :\n\n` +
        topRegions
          .slice(0, 5)
          .map((r, i) => `${i + 1}. ${r.region} — ${r.score}/100 (${pct(r.growth)}, CA ${fcfa(r.revenue)})`)
          .join('\n') +
        `\n\n${topRegions[0].region} et ${topRegions[1].region} tirent la performance nationale. ` +
        `${topRegions[topRegions.length - 1].region} et ${topRegions[topRegions.length - 2].region} nécessitent une attention rapprochée.`,
      blocks: [
        {
          type: 'bars',
          bars: topRegions.slice(0, 8).map((r) => ({ label: r.region, value: r.score, hint: pct(r.growth) })),
        },
      ],
    }),
  },
  {
    test: /(prévois|prevois|prévision|prevision|forecast|prochains? mois|projet).*(ca|chiffre|revenu|affaires)|chiffre d.affaires.*(mois|prévi)/i,
    build: () => {
      const f = FORECASTS[0]
      return {
        content:
          `Projection du chiffre d'affaires (modèle simulé, MAPE ${f.mape} %) :\n\n` +
          `• Horizon 30 jours : **${fcfa(f.h30)}**\n` +
          `• Horizon 90 jours : **${fcfa(f.h90)}**\n` +
          `• Intervalle de confiance à 90 % : ${fcfa(f.forecast[2].lo)} – ${fcfa(f.forecast[2].hi)}\n\n` +
          `La trajectoire reste haussière, portée par la saisonnalité de fin d'année et la croissance colis.`,
        blocks: [
          {
            type: 'bars',
            bars: f.forecast.slice(0, 3).map((p) => ({ label: p.label, value: p.value, hint: `${fcfa(p.lo)} – ${fcfa(p.hi)}` })),
          },
          { type: 'note', text: 'MODÈLE SIMULÉ — DONNÉES DE DÉMONSTRATION. En production, la prévision serait recalée quotidiennement sur les données réelles du Data Warehouse.' },
        ],
      }
    },
  },
  {
    test: /(action|priorit|recommand|décision|decision|faire|devrait).*(priorit|direction|urgent)|que (faut|recommande|conseille)/i,
    build: () => ({
      content:
        `D'après l'état actuel des indicateurs, voici les **priorités pour la Direction Générale** :`,
      blocks: [
        {
          type: 'list',
          items: [
            `Redressement du réseau : plan ciblé sur les ${atRisk.length} agences sous le seuil de score 55, avec revue mensuelle.`,
            `Maîtrise des coûts : audit des dépenses de fonctionnement dans les régions où les coûts progressent plus vite que les revenus.`,
            `Sécuriser la croissance colis : renforcer la capacité de tri et de transport sur les corridors Bamako–Sikasso et Bamako–Ségou.`,
            `Corridor Nord : activer un prestataire de transport de secours pour ramener les délais Mopti–Tombouctou à la cible.`,
            `Transition courrier : accélérer la conversion vers les offres colis, numériques et financières.`,
            `Gouvernance de la donnée : lancer la Phase 2 (Data Warehouse) pour fiabiliser et automatiser le pilotage.`,
          ],
        },
        { type: 'note', text: 'POSTE AI est un outil d’aide à la décision : ces recommandations sont à valider par les directions métier concernées.' },
      ],
    }),
  },
  {
    test: /courrier|pli|lettre/i,
    build: () => ({
      content:
        `Le volume courrier recule de ${pct(NATIONAL_KPIS.mailDelta)} sur 30 jours et poursuit une tendance baissière depuis 4 mois. ` +
        `C'est un phénomène structurel (dématérialisation). L'enjeu est de compenser la perte de marge par les segments en croissance.`,
      blocks: [
        {
          type: 'kpis',
          kpis: [
            { label: 'Courrier (30 j)', value: num(NATIONAL_KPIS.mail), delta: pct(NATIONAL_KPIS.mailDelta), tone: 'neg' },
            { label: 'Colis (30 j)', value: num(NATIONAL_KPIS.parcels), delta: pct(NATIONAL_KPIS.parcelsDelta), tone: 'pos' },
          ],
        },
      ],
    }),
  },
  {
    test: /(finance|marge|dépense|depense|coût|cout|budget|rentab)/i,
    build: () => ({
      content:
        `Vue financière consolidée (30 j) : revenus ${fcfa(FINANCE_KPIS.revenue)} (${pct(FINANCE_KPIS.revenueDelta)}), ` +
        `dépenses ${fcfa(FINANCE_KPIS.expenses)} (${pct(FINANCE_KPIS.expensesDelta)}), marge ${FINANCE_KPIS.margin} %. ` +
        `Écart budgétaire du mois : ${pct(FINANCE_KPIS.variance)}. ` +
        `Point de vigilance : dans certaines agences, les coûts opérationnels augmentent plus vite que les revenus.`,
      blocks: [
        {
          type: 'kpis',
          kpis: [
            { label: 'Revenus', value: fcfa(FINANCE_KPIS.revenue), delta: pct(FINANCE_KPIS.revenueDelta), tone: 'pos' },
            { label: 'Dépenses', value: fcfa(FINANCE_KPIS.expenses), delta: pct(FINANCE_KPIS.expensesDelta), tone: 'neg' },
            { label: 'Marge op.', value: `${FINANCE_KPIS.margin} %`, tone: 'flat' },
            { label: 'Écart budgétaire', value: pct(FINANCE_KPIS.variance), tone: FINANCE_KPIS.variance > 0 ? 'neg' : 'pos' },
          ],
        },
      ],
    }),
  },
]

const FALLBACK = (q: string): { content: string; blocks: ChatBlock[] } => ({
  content:
    `Je peux analyser la performance, les risques, les prévisions, la finance et le réseau à partir du jeu de données de démonstration. ` +
    `Reformulez votre question ou choisissez une piste ci-dessous.`,
  blocks: [
    { type: 'list', items: SUGGESTED_QUESTIONS },
    { type: 'note', text: `Question reçue : « ${q} ». Prototype — moteur de réponses simulées, sans connexion LLM.` },
  ],
})

export function askCopilot(question: string): ChatMessage {
  const hit = INTENTS.find((i) => i.test.test(question))
  const { content, blocks } = hit ? hit.build() : FALLBACK(question)
  return { id: id(), role: 'assistant', content, blocks }
}

export function userMessage(text: string): ChatMessage {
  return { id: id(), role: 'user', content: text }
}
