import { PageHeader, Card, CardHeader, SectionTitle } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { RevenueExpense, BudgetVsActual, HBars, LineTrend, CHART_COLORS } from '../components/charts'
import { AIInsightCard, AiBadge } from '../components/cards'
import { FINANCE_KPIS, FINANCE_MONTHLY, AGENCIES } from '../data/dataset'
import { fcfa } from '../lib/format'

export default function Finance() {
  const k = FINANCE_KPIS
  const byAgency = [...AGENCIES]
    .sort((a, b) => b.profitability - a.profitability)
    .map((a) => ({ label: a.name.replace('Agence ', ''), value: a.profitability }))

  return (
    <>
      <PageHeader title="Intelligence financière" subtitle="Revenus, dépenses, marge et écart budgétaire — données synthétiques de démonstration" />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <KpiCard label="Revenus" value={fcfa(k.revenue)} delta={k.revenueDelta} accent />
        <KpiCard label="Dépenses" value={fcfa(k.expenses)} delta={k.expensesDelta} sparkTone="neg" />
        <KpiCard label="Marge opérationnelle" value={`${k.margin} %`} delta={1.4} deltaSuffix="pts" />
        <KpiCard label="Coûts opérationnels" value={fcfa(k.opex)} delta={4.1} />
        <KpiCard label="Budget mensuel" value={fcfa(k.budget)} delta={undefined} deltaSuffix="" />
        <KpiCard label="Écart budgétaire" value={`${k.variance > 0 ? '+' : ''}${k.variance} %`} delta={k.variance} deltaSuffix="vs enveloppe" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader title="Revenus vs dépenses" sub="Consolidé mensuel + marge opérationnelle (%)" />
          <div className="p-4">
            <RevenueExpense data={FINANCE_MONTHLY} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Budget vs réalisé" sub="Dépenses de fonctionnement — 12 mois" />
          <div className="p-4">
            <BudgetVsActual data={FINANCE_MONTHLY} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-1">
          <CardHeader title="Évolution de la marge" sub="Marge opérationnelle mensuelle (%)" />
          <div className="p-4">
            <LineTrend data={FINANCE_MONTHLY.map((m) => ({ label: m.label, value: m.margin }))} dataKey="value" color={CHART_COLORS.GOLD} height={220} />
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader title="Rentabilité par agence" sub="Marge opérationnelle (%) — 30 agences" />
          <div className="p-4">
            <HBars data={byAgency} height={520} colorBySign color={CHART_COLORS.NAVY} />
          </div>
        </Card>
      </div>

      <SectionTitle>AI Financial Insights</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AIInsightCard
          insight={{
            id: 'f1',
            level: 'attention',
            title: 'Les coûts opérationnels progressent plus vite que les revenus dans certaines agences',
            detail: `Sur le dernier mois, les dépenses augmentent de ${k.expensesDelta} % contre ${k.revenueDelta} % pour les revenus. L'écart se concentre sur 6 agences (transport et énergie). Une analyse détaillée est recommandée.`,
            metricHint: 'Coûts',
          }}
        />
        <AIInsightCard
          insight={{
            id: 'f2',
            level: 'positif',
            title: `Marge opérationnelle consolidée à ${k.margin} %`,
            detail: 'La marge reste au-dessus de la cible interne de 20 %, soutenue par la croissance des services colis et financiers à plus forte valeur ajoutée.',
            metricHint: 'Marge',
          }}
        />
        <AIInsightCard
          insight={{
            id: 'f3',
            level: 'information',
            title: `Écart budgétaire du mois : ${k.variance > 0 ? '+' : ''}${k.variance} %`,
            detail: 'Léger dépassement de l’enveloppe de fonctionnement. Une alerte automatique de dépassement à 90 % de l’enveloppe est active depuis ce mois.',
            metricHint: 'Budget',
          }}
        />
        <AIInsightCard
          insight={{
            id: 'f4',
            level: 'risque',
            title: 'Concentration du chiffre d’affaires sur la région de Bamako',
            detail: 'Environ 30 % des revenus proviennent d’une seule région. Une diversification de la contribution régionale réduirait l’exposition à un choc local.',
            metricHint: 'Structure',
          }}
        />
      </div>
      <div className="mt-3"><AiBadge /></div>
    </>
  )
}
