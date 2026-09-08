import { PageHeader, Card, CardHeader, SectionTitle } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { MultiLine, LineTrend, HBars, CHART_COLORS } from '../components/charts'
import { AlertCard } from '../components/cards'
import { LOGISTICS_KPIS, LOGISTICS_MONTHLY, LOGISTICS_BY_REGION, CORRIDORS } from '../data/dataset'
import { ALERTS } from '../data/narrative'
import { num, compact } from '../lib/format'

export default function Logistics() {
  const k = LOGISTICS_KPIS
  return (
    <>
      <PageHeader title="Intelligence logistique" subtitle="Flux colis, délais de livraison et performance des corridors — données synthétiques" />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <KpiCard label="Colis entrants" value={num(k.inbound)} delta={k.inboundDelta} />
        <KpiCard label="Colis sortants" value={num(k.outbound)} delta={k.outboundDelta} />
        <KpiCard label="Livraisons" value={num(k.delivered)} delta={11.3} />
        <KpiCard label="Retards" value={num(k.late)} delta={k.lateDelta} sparkTone="pos" />
        <KpiCard label="Taux de livraison" value={`${k.deliveryRate} %`} delta={2.6} deltaSuffix="pts" />
        <KpiCard label="Délai moyen" value={`${k.avgDelayDays} j`} delta={k.delayDelta} deltaSuffix="j vs préc." />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader title="Volumes de colis" sub="Entrants / sortants — 12 mois" />
          <div className="p-4">
            <MultiLine
              data={LOGISTICS_MONTHLY.map((m) => ({ label: m.label, Entrants: m.entrants, Sortants: m.sortants }))}
              series={[
                { key: 'Entrants', label: 'Entrants', color: CHART_COLORS.NAVY },
                { key: 'Sortants', label: 'Sortants', color: CHART_COLORS.GOLD },
              ]}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Délais & taux de livraison" sub="Délai moyen (jours) et % livré à l'heure" />
          <div className="p-4">
            <MultiLine
              data={LOGISTICS_MONTHLY.map((m) => ({ label: m.label, 'Délai (j)': m.delaiMoyen, 'Taux livraison %': m.tauxLivraison }))}
              series={[
                { key: 'Délai (j)', label: 'Délai (j)', color: CHART_COLORS.NEG },
                { key: 'Taux livraison %', label: 'Taux livraison %', color: CHART_COLORS.POS },
              ]}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader title="Répartition des colis par région" sub="Volume mensuel" />
          <div className="p-4">
            <HBars data={LOGISTICS_BY_REGION.map((r) => ({ label: r.region, value: r.colis, hint: `${r.retardsPct} % retards` }))} color={CHART_COLORS.NAVY} height={300} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Top 10 des corridors — plus forts volumes" sub="Flux mensuel et délai moyen" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px]">
              <thead>
                <tr>
                  <th className="th">Corridor</th>
                  <th className="th text-right">Volume</th>
                  <th className="th text-right">Délai</th>
                  <th className="th text-right">À l'heure</th>
                </tr>
              </thead>
              <tbody>
                {CORRIDORS.slice(0, 10).map((c) => (
                  <tr key={c.id}>
                    <td className="td font-medium text-navy">{c.route}</td>
                    <td className="td text-right tabular-nums">{compact(c.volume)}</td>
                    <td className="td text-right tabular-nums">{c.delayDays} j</td>
                    <td className={`td text-right tabular-nums ${c.onTimePct < 92 ? 'text-neg font-semibold' : ''}`}>{c.onTimePct} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <SectionTitle>Alertes logistiques</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ALERTS.filter((a) => a.scope.toLowerCase().includes('logist') || a.subject.toLowerCase().includes('corridor') || a.subject.toLowerCase().includes('livraison')).map((a) => (
          <AlertCard key={a.id} alert={a} />
        ))}
        <AlertCard
          alert={{
            id: 'lg-x',
            date: '2026-08-27',
            severity: 'MOYEN',
            subject: 'Saturation du centre de tri de Bamako aux heures de pointe',
            scope: 'Logistique Bamako',
            impact: 'Délai +0,4 j sur les colis sortants les lundis et mardis',
            status: 'EN_COURS',
            detail: 'La croissance du volume dépasse la capacité nominale du centre en début de semaine. Étudier un deuxième créneau de tri ou un renfort temporaire.',
          }}
        />
      </div>
    </>
  )
}
