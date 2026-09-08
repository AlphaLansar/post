import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Card, CardHeader, Segmented } from '../components/ui'
import { AGENCIES, REGION_STATS } from '../data/dataset'
import { REGIONS } from '../data/regions'
import { fcfa, num } from '../lib/format'

const MODES = ['Performance', 'Risque', 'Volume', 'Rentabilité'] as const

// Contour très schématique du Mali (repère 0–100) — représentation stylisée, non géographique.
const MALI_PATH =
  'M8,46 L20,40 L24,32 L20,22 L28,12 L44,8 L44,20 L56,20 L60,10 L82,10 L92,20 L86,30 L74,30 L70,40 L58,44 L56,54 L48,56 L46,66 L40,64 L36,74 L44,84 L36,90 L28,84 L26,72 L18,66 L14,56 Z'

function colorFor(mode: (typeof MODES)[number], a: (typeof AGENCIES)[number]) {
  if (mode === 'Performance') return a.score >= 70 ? '#1E7F53' : a.score >= 55 ? '#C9A227' : '#C0392B'
  if (mode === 'Risque') return a.risk === 'FAIBLE' ? '#1E7F53' : a.risk === 'MODERE' ? '#1F5FA8' : a.risk === 'ELEVE' ? '#C9A227' : '#C0392B'
  if (mode === 'Volume') return a.parcels > 9000 ? '#0B1F3A' : a.parcels > 4500 ? '#1F5FA8' : '#8A94A3'
  return a.profitability >= 20 ? '#1E7F53' : a.profitability >= 12 ? '#C9A227' : '#C0392B'
}

export default function NetworkMap() {
  const nav = useNavigate()
  const [mode, setMode] = useState<(typeof MODES)[number]>('Performance')
  const [hover, setHover] = useState<string | null>(null)

  const dots = useMemo(() => {
    return REGIONS.flatMap((r) => {
      const list = AGENCIES.filter((a) => a.regionId === r.id)
      return list.map((a, i) => {
        const ang = (i / Math.max(1, list.length)) * Math.PI * 2
        const rad = list.length > 1 ? 3.4 : 0
        return { a, x: r.x + Math.cos(ang) * rad, y: r.y + Math.sin(ang) * rad }
      })
    })
  }, [])

  const hoveredAgency = AGENCIES.find((a) => a.id === hover)

  return (
    <>
      <PageHeader
        title="Postal Network Map"
        subtitle="Carte schématique du réseau — représentation stylisée, non géographique"
        right={<Segmented options={MODES} value={mode} onChange={setMode} />}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title={`Réseau — coloration par ${mode.toLowerCase()}`} sub={`${AGENCIES.length} agences · ${REGIONS.length} régions`} />
          <div className="p-4">
            <div className="relative w-full" style={{ aspectRatio: '1 / 0.9' }}>
              <svg viewBox="0 0 100 95" className="w-full h-full">
                <path d={MALI_PATH} fill="#F0F3F7" stroke="#C9CDD6" strokeWidth={0.6} />
                {REGIONS.map((r) => (
                  <text key={r.id} x={r.x} y={r.y - 5} textAnchor="middle" fontSize={2.4} fill="#8A94A3" fontWeight={600}>
                    {r.name}
                  </text>
                ))}
                {dots.map(({ a, x, y }) => (
                  <circle
                    key={a.id}
                    cx={x}
                    cy={y}
                    r={hover === a.id ? 2.6 : 1.8}
                    fill={colorFor(mode, a)}
                    stroke="#fff"
                    strokeWidth={0.5}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHover(a.id)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => nav(`/agences/${a.id}`)}
                  />
                ))}
              </svg>
              {hoveredAgency && (
                <div className="absolute top-2 left-2 card shadow-pop px-3 py-2 text-[12px] pointer-events-none">
                  <div className="font-semibold text-navy">{hoveredAgency.name}</div>
                  <div className="text-ink-muted">{hoveredAgency.region} · score {hoveredAgency.score} · {hoveredAgency.profitability} % marge</div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-ink-muted">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-pos" /> Favorable</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gold" /> À surveiller</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-neg" /> Critique</span>
              <span className="ml-auto text-ink-faint">Cliquez un point pour ouvrir la fiche agence</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Synthèse régionale" />
          <div className="overflow-y-auto max-h-[520px]">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">Région</th>
                  <th className="th text-right">Agences</th>
                  <th className="th text-right">CA</th>
                  <th className="th text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {[...REGION_STATS].sort((a, b) => b.revenue - a.revenue).map((r) => {
                  const seed = REGIONS.find((x) => x.id === r.regionId)!
                  return (
                    <tr key={r.regionId} className="tr-hover">
                      <td className="td font-medium text-navy">{r.region}</td>
                      <td className="td text-right tabular-nums">{seed.agencyCount}</td>
                      <td className="td text-right tabular-nums">{fcfa(r.revenue)}</td>
                      <td className="td text-right tabular-nums font-semibold">{r.score}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}
