// Générateur pseudo-aléatoire déterministe (mulberry32) — garantit un jeu de
// données stable entre deux chargements de la démonstration.

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeRng(seed = 20260908) {
  const r = mulberry32(seed)
  return {
    next: r,
    /** Uniforme [min, max]. */
    range: (min: number, max: number) => min + (max - min) * r(),
    /** Bruit gaussien approx. (somme de 3 uniformes), écart-type ~ sd. */
    gauss: (sd = 1) => ((r() + r() + r() - 1.5) / 1.5) * sd,
    pick: <T>(arr: T[]) => arr[Math.floor(r() * arr.length)],
  }
}
