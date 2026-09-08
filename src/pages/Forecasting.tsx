import { useState } from 'react'
import { PageHeader, Card, CardHeader, Segmented, DemoTag } from '../components/ui'
import { ForecastChart } from '../components/charts'
import { RecommendationCard } from '../components/cards'
import { FORECASTS } from '../services/forecasting'
import { fcfa, num, compact } from '../lib/format'
import { growthRate } from '../services/analytics'

function fmtVal(key: string, v: number) {
  if (key === 'revenue') return fcfa(v)
  return num(v)
}

export default function Forecasting() {
  const [sel, setSel] = useState(FORECASTS[0].key)
  const f = FORECASTS.find((x) => x.key === sel)!
  const lastHist = f.history[f.history.length - 1].value
  const g30 = growthRate(f.h30, lastHist)
  const g90 = growthRate(f.h90, lastHist)

  return (
    <>
      <PageHeader
        title="Forecasting & Predictive Intelligence"
        subtitle="Projections de l'activité à 30 et 90 jours, avec intervalle de confiance"
        right={<DemoTag />}
      />

      <div className="mb-4">
        <Segmented options={FORECASTS.map((x) => x.label) as any} value={f.label} onChange={(lbl) => setSel(FORECASTS.find((x) => x.label === lbl)!.key)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Card className="xl:col-span-2">
          <CardHeader
            title={`Prévision — ${f.label}`}
            sub={`Modèle : ${f.model} · MAPE ${f.mape} %`}
            right={<DemoTag>Model simulé</DemoTag>}
          />
          <div className="p-4">
            <ForecastChart history={f.history} forecast={f.forecast} unit={f.unit === 'FCFA' ? 'FCFA' : ''} height={320} />
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="p-4">
            <span className="stat-label">Prévision à 30 jours</span>
            <div className="kpi-value mt-2">{fmtVal(f.key, f.h30)}</div>
            <div className={`text-[12px] font-semibold mt-1 ${g30 >= 0 ? 'text-pos' : 'text-neg'}`}>{g30 >= 0 ? '+' : ''}{g30} % vs dernier mois</div>
            <div className="text-[11px] text-ink-faint mt-1">Intervalle 90 % : {fmtVal(f.key, f.forecast[0].lo)} – {fmtVal(f.key, f.forecast[0].hi)}</div>
          </Card>
          <Card className="p-4 ring-1 ring-gold/40">
            <span className="stat-label">Prévision à 90 jours</span>
            <div className="kpi-value mt-2">{fmtVal(f.key, f.h90)}</div>
            <div className={`text-[12px] font-semibold mt-1 ${g90 >= 0 ? 'text-pos' : 'text-neg'}`}>{g90 >= 0 ? '+' : ''}{g90} % vs dernier mois</div>
            <div className="text-[11px] text-ink-faint mt-1">Intervalle 90 % : {fmtVal(f.key, f.forecast[2].lo)} – {fmtVal(f.key, f.forecast[2].hi)}</div>
          </Card>
          <Card className="p-4">
            <span className="stat-label">Fiabilité du modèle</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[22px] font-semibold text-navy">{(100 - f.mape).toFixed(1)} %</span>
              <span className="text-[11px] text-ink-faint">précision estimée (1 − MAPE)</span>
            </div>
          </Card>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader title="Synthèse des prévisions — toutes métriques" sub="Horizon 30 j et 90 j · données de démonstration" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="th">Métrique</th>
                <th className="th">Modèle</th>
                <th className="th text-right">Dernier mois</th>
                <th className="th text-right">Prévision 30 j</th>
                <th className="th text-right">Prévision 90 j</th>
                <th className="th text-right">MAPE</th>
              </tr>
            </thead>
            <tbody>
              {FORECASTS.map((x) => (
                <tr key={x.key} className="tr-hover" onClick={() => setSel(x.key)}>
                  <td className="td font-medium text-navy">{x.label}</td>
                  <td className="td text-ink-muted text-[12px]">{x.model}</td>
                  <td className="td text-right tabular-nums">{fmtVal(x.key, x.history[x.history.length - 1].value)}</td>
                  <td className="td text-right tabular-nums">{fmtVal(x.key, x.h30)}</td>
                  <td className="td text-right tabular-nums font-semibold text-navy">{fmtVal(x.key, x.h90)}</td>
                  <td className="td text-right tabular-nums text-ink-muted">{x.mape} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <RecommendationCard
          title="Anticiper la capacité logistique"
          body={`Le volume de colis prévu dans 90 jours atteint ${num(FORECASTS[1].h90)}. Dimensionner dès maintenant les moyens de tri et de transport sur les corridors Bamako–Sikasso et Bamako–Ségou.`}
          confidence={82}
        />
        <RecommendationCard
          title="Compenser le repli du courrier"
          body={`La projection courrier reste orientée à la baisse (${num(FORECASTS[3].h90)} à 90 j). Accélérer la bascule commerciale vers les offres colis et services financiers.`}
          confidence={79}
        />
      </div>

      <p className="text-[11px] text-ink-faint mt-6">
        MODÈLE SIMULÉ — DONNÉES DE DÉMONSTRATION. Les prévisions sont produites par des modèles statistiques simplifiés
        exécutés dans le navigateur. En production, elles seraient recalculées quotidiennement sur les données réelles du
        Data Warehouse (Prophet / ARIMA / Gradient Boosting), avec suivi de la dérive et validation humaine.
      </p>
    </>
  )
}
