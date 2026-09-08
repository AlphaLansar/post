// Formatage FR / FCFA — utilitaires d'affichage.

const nf = new Intl.NumberFormat('fr-FR')
const nf1 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 })

export const num = (v: number) => nf.format(Math.round(v))
export const num1 = (v: number) => nf1.format(v)

/** Montant en FCFA, abrégé (Md / M / k) pour la lisibilité exécutive. */
export function fcfa(v: number, opts: { sign?: boolean } = {}): string {
  const s = opts.sign && v > 0 ? '+' : ''
  const a = Math.abs(v)
  if (a >= 1e9) return `${s}${nf1.format(v / 1e9)} Md FCFA`
  if (a >= 1e6) return `${s}${nf1.format(v / 1e6)} M FCFA`
  if (a >= 1e3) return `${s}${nf.format(Math.round(v / 1e3))} k FCFA`
  return `${s}${nf.format(Math.round(v))} FCFA`
}

/** Nombre abrégé sans devise. */
export function compact(v: number): string {
  const a = Math.abs(v)
  if (a >= 1e6) return `${nf1.format(v / 1e6)} M`
  if (a >= 1e3) return `${nf1.format(v / 1e3)} k`
  return nf.format(Math.round(v))
}

export const pct = (v: number, digits = 1) =>
  `${v > 0 ? '+' : ''}${v.toLocaleString('fr-FR', { maximumFractionDigits: digits })} %`

export const pctPlain = (v: number, digits = 1) =>
  `${v.toLocaleString('fr-FR', { maximumFractionDigits: digits })} %`

export function toneOf(v: number): 'pos' | 'neg' | 'flat' {
  if (v > 0.15) return 'pos'
  if (v < -0.15) return 'neg'
  return 'flat'
}
