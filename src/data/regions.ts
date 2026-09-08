import type { Region } from '../types'

// 10 régions administratives (hypothèse de conception — répartition synthétique).
// x / y : position stylisée sur la carte schématique (repère 0–100).
// weight : poids relatif dans l'activité nationale (usage interne au générateur).
export interface RegionSeed extends Region {
  weight: number
  bias: number // inflexion de croissance propre à la région
}

export const REGIONS: RegionSeed[] = [
  { id: 'bko', name: 'Bamako', x: 33, y: 62, agencyCount: 7, weight: 0.29, bias: 0.9 },
  { id: 'kys', name: 'Kayes', x: 12, y: 47, agencyCount: 3, weight: 0.11, bias: 0.2 },
  { id: 'klk', name: 'Koulikoro', x: 31, y: 52, agencyCount: 4, weight: 0.13, bias: 0.5 },
  { id: 'sik', name: 'Sikasso', x: 40, y: 78, agencyCount: 4, weight: 0.14, bias: 1.1 },
  { id: 'seg', name: 'Ségou', x: 44, y: 55, agencyCount: 3, weight: 0.1, bias: 0.3 },
  { id: 'mop', name: 'Mopti', x: 52, y: 44, agencyCount: 3, weight: 0.08, bias: -0.4 },
  { id: 'tbk', name: 'Tombouctou', x: 46, y: 24, agencyCount: 2, weight: 0.05, bias: -0.6 },
  { id: 'gao', name: 'Gao', x: 72, y: 30, agencyCount: 2, weight: 0.045, bias: -0.5 },
  { id: 'kdl', name: 'Kidal', x: 78, y: 16, agencyCount: 1, weight: 0.02, bias: -0.8 },
  { id: 'tao', name: 'Taoudéni', x: 30, y: 10, agencyCount: 1, weight: 0.015, bias: -0.3 },
]

export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r]))
