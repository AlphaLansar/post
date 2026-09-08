import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Users } from 'lucide-react'
import { PageHeader, Card, CardHeader, PerfBadge, RiskBadge, TrendPct, SectionTitle } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { MultiLine, LineTrend, CHART_COLORS } from '../components/charts'
import { RecommendationCard, AiBadge } from '../components/cards'
import { AGENCY_BY_ID, AGENCIES } from '../data/dataset'
import { fcfa, num, compact, pct } from '../lib/format'

export default function AgencyDetail() {
  const { id } = useParams()
  const a = id ? AGENCY_BY_ID[id] : undefined

  if (!a) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-muted">Agence introuvable.</p>
        <Link to="/agences" className="btn-ghost mt-4 inline-flex">Retour au réseau</Link>
      </div>
    )
  }

  const natAvg = Math.round(AGENCIES.reduce((s, x) => s + x.score, 0) / AGENCIES.length)
  const vsNat = a.score - natAvg
  const scoreColor = a.score >= 70 ? CHART_COLORS.POS : a.score >= 55 ? CHART_COLORS.GOLD : CHART_COLORS.NEG

  const diag =
    a.score >= 70
      ? `L'agence affiche une performance supérieure à la moyenne nationale (${a.score}/100 contre ${natAvg}/100). La dynamique est principalement portée par la croissance du volume de colis (${pct(a.growth)}) et une rentabilité maîtrisée (${a.profitability} %). Le taux de service (${a.serviceRate} %) est conforme à la cible interne.`
      : a.score >= 55
        ? `L'agence se situe dans la moyenne du réseau (${a.score}/100). L'activité est stable mais la marge de progression est limitée par des coûts opérationnels proches du plafond et une croissance modérée (${pct(a.growth)}).`
        : `L'agence est en situation de sous-performance (${a.score}/100, soit ${vsNat} points sous la moyenne nationale). Le diagnostic combine un recul de l'activité (${pct(a.growth)}), une pression sur les coûts (ratio charges/produits ${Math.round((a.expenses / a.revenue) * 100)} %) et un taux de service en retrait (${a.serviceRate} %).`

  const recos =
    a.score >= 70
      ? [
          { title: 'Sécuriser la capacité opérationnelle', body: 'Maintenir le niveau de personnel et de capacité de tri afin d’absorber la croissance de colis prévue sur les 90 prochains jours.' },
          { title: 'Documenter les bonnes pratiques', body: 'Formaliser l’organisation de cette agence comme référence pour le plan de redressement des agences en difficulté de la région.' },
        ]
      : a.score >= 55
        ? [
            { title: 'Optimiser la structure de coûts', body: 'Analyser les postes transport et énergie ; viser une réduction de 3 à 5 points du ratio charges/produits sur deux trimestres.' },
            { title: 'Relancer la fréquentation', body: 'Déployer les offres services financiers et colis suivi pour élargir le panier moyen par visite.' },
          ]
        : [
            { title: 'Revue opérationnelle sur site sous 5 jours', body: 'Diagnostiquer les causes du recul des transactions (horaires, effectifs, disponibilité des services) et définir un plan d’action à 60 jours.' },
            { title: 'Plan de maîtrise des coûts', body: 'Geler les dépenses non essentielles et auditer les contrats de sous-traitance ; objectif : retour à l’équilibre opérationnel.' },
            { title: 'Étudier une mutualisation', body: 'Évaluer le partage de moyens (transport, back-office) avec l’agence performante la plus proche de la région.' },
          ]

  return (
    <>
      <Link to="/agences" className="inline-flex items-center gap-1.5 text-[12px] text-ink-muted hover:text-navy mb-3">
        <ArrowLeft size={14} /> Réseau postal
      </Link>
      <PageHeader
        title={a.name}
        subtitle={`${a.type} · Région ${a.region}`}
        right={
          <div className="flex items-center gap-2">
            <RiskBadge level={a.risk} />
            <PerfBadge band={a.band} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-1">
          <div className="p-5 flex flex-col items-center text-center">
            <span className="stat-label">Score de performance</span>
            <div className="relative mt-3 mb-1">
              <svg width={128} height={128} className="-rotate-90">
                <circle cx={64} cy={64} r={54} fill="none" stroke="#EEF1F4" strokeWidth={12} />
                <circle cx={64} cy={64} r={54} fill="none" stroke={scoreColor} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${(a.score / 100) * 339} 339`} />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div>
                  <div className="text-[30px] font-semibold text-navy leading-none tabular-nums">{a.score}</div>
                  <div className="text-[11px] text-ink-faint">/ 100</div>
                </div>
              </div>
            </div>
            <TrendPct value={vsNat} className="!text-[12px]" />
            <span className="text-[11px] text-ink-faint">vs moyenne nationale ({natAvg})</span>
            <div className="mt-4 pt-4 border-t border-line w-full grid grid-cols-2 gap-3 text-left">
              <div><div className="stat-label !text-[10px]">Agents</div><div className="text-[14px] font-semibold text-navy flex items-center gap-1 mt-0.5"><Users size={13} className="text-ink-faint" />{a.agents}</div></div>
              <div><div className="stat-label !text-[10px]">Satisfaction</div><div className="text-[14px] font-semibold text-navy mt-0.5">{a.satisfaction}/100</div></div>
              <div><div className="stat-label !text-[10px]">Taux de service</div><div className="text-[14px] font-semibold text-navy mt-0.5">{a.serviceRate} %</div></div>
              <div><div className="stat-label !text-[10px]">Localisation</div><div className="text-[13px] font-medium text-navy flex items-center gap-1 mt-0.5"><MapPin size={12} className="text-ink-faint" />{a.region}</div></div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start">
          <KpiCard label="Chiffre d'affaires" value={fcfa(a.revenue)} delta={a.growth} />
          <KpiCard label="Transactions" value={compact(a.transactions)} delta={a.growth * 0.7} />
          <KpiCard label="Colis" value={num(a.parcels)} delta={a.growth * 1.3} />
          <KpiCard label="Courrier" value={num(a.mail)} delta={-3.1} />
          <KpiCard label="Coûts" value={fcfa(a.expenses)} delta={a.risk === 'CRITIQUE' || a.risk === 'ELEVE' ? 6.4 : 2.2} />
          <KpiCard label="Rentabilité" value={`${a.profitability} %`} delta={a.profitability > 15 ? 1.8 : -2.4} deltaSuffix="pts" />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader title="Historique — 12 mois" sub="Chiffre d'affaires, transactions et colis" />
        <div className="p-4">
          <MultiLine
            data={a.history.map((h) => ({ label: h.label, CA: h.revenue, Transactions: h.transactions, Colis: h.parcels }))}
            series={[
              { key: 'CA', label: 'CA', color: CHART_COLORS.NAVY },
              { key: 'Transactions', label: 'Transactions', color: CHART_COLORS.INFO },
              { key: 'Colis', label: 'Colis', color: CHART_COLORS.GOLD },
            ]}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Diagnostic IA" right={<AiBadge />} />
          <div className="p-4">
            <p className="text-[13px] text-ink leading-relaxed">{diag}</p>
            <div className="mt-4 pt-3 border-t border-line">
              <LineTrend data={a.history.map((h) => ({ label: h.label, value: h.revenue }))} dataKey="value" unit="FCFA" color={scoreColor} height={160} />
            </div>
          </div>
        </Card>

        <div>
          <SectionTitle hint="À valider par les directions métier">Recommandations</SectionTitle>
          <div className="space-y-3">
            {recos.map((r, i) => (
              <RecommendationCard key={i} title={r.title} body={r.body} confidence={a.score >= 70 ? 88 : 74} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
