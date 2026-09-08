import { PageHeader, Card, CardHeader } from '../components/ui'
import { PRODUCT } from '../config/weights'
import { AGENCIES, REGION_STATS, MONTHLY } from '../data/dataset'

const SECTIONS = [
  {
    title: 'Objectif',
    body: "Démontrer ce que pourrait devenir un système d'intelligence décisionnelle pour La Poste du Mali : voir la performance, comprendre les causes, anticiper les tendances, détecter les risques, recevoir des recommandations et simuler des décisions.",
  },
  {
    title: 'Périmètre',
    body: `Prototype navigable couvrant 12 modules : tableau de bord exécutif, performance, réseau d'agences, logistique, finance, prévisions, risques & anomalies, copilote IA, simulateur de décision, rapports, carte du réseau et vision de déploiement.`,
  },
  {
    title: 'Données',
    body: `Toutes les données sont synthétiques et générées de manière déterministe : ${REGION_STATS.length} régions, ${AGENCIES.length} agences, ${MONTHLY.length} mois d'historique, avec tendances, saisonnalité, écarts régionaux et anomalies volontaires. Aucune donnée réelle de La Poste du Mali n'est utilisée.`,
  },
  {
    title: 'Hypothèses de conception',
    body: "Le nombre d'agences, la structure régionale, les indicateurs et leurs pondérations sont des hypothèses de travail, à valider et à remplacer par les référentiels officiels lors de la phase pilote.",
  },
  {
    title: 'Limites',
    body: "Les prévisions et scores sont produits par des modèles statistiques simplifiés exécutés dans le navigateur. Le copilote n'est pas connecté à un LLM : ses réponses sont générées par un moteur d'intentions. L'export PDF et l'authentification sont simulés.",
  },
  {
    title: 'Vision future',
    body: "Connexion progressive aux données réelles via un Data Warehouse, modèles ML entraînés, couche LLM + RAG, moteur de recommandations et de scénarios, sécurité RBAC et IA responsable. Voir la page « Vision de déploiement ».",
  },
]

const ROLES = ['ADMIN', 'DIRECTION_GÉNÉRALE', 'DIRECTION_FINANCIÈRE', 'DIRECTION_OPÉRATIONS', 'RESPONSABLE_RÉGIONAL', 'ANALYSTE']

export default function About() {
  return (
    <>
      <PageHeader title="À propos du prototype" subtitle={`${PRODUCT.name} · ${PRODUCT.tagline} · ${PRODUCT.org} · ${PRODUCT.version}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {SECTIONS.map((s) => (
          <Card key={s.title} className="p-5">
            <h3 className="text-[13px] font-semibold text-navy">{s.title}</h3>
            <p className="text-[12.5px] text-ink-muted mt-1.5 leading-relaxed">{s.body}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Système de rôles (extensible)" sub="Interface conçue pour un contrôle d'accès basé sur les rôles" />
          <div className="p-4 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <span key={r} className="chip bg-navy-50 text-navy border-line">{r}</span>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Sécurité & IA responsable" sub="Concepts prévus dès la conception" />
          <div className="p-4 flex flex-wrap gap-2">
            {['RBAC', 'Audit logs', 'Chiffrement', 'Authentification API', 'Gouvernance des données', 'Moindre privilège', 'Traçabilité des recommandations', 'Explication des prédictions', 'Niveau de confiance', 'Validation humaine'].map((t) => (
              <span key={t} className="chip bg-surface text-ink-muted border-line">{t}</span>
            ))}
          </div>
        </Card>
      </div>

      <p className="text-[11px] text-ink-faint mt-6">{PRODUCT.disclaimer}</p>
    </>
  )
}
