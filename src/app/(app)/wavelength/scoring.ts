// The target zone is five bands of BAND units each on a 0 to 100 scale.
export const BAND = 5;
export const BAND_POINTS = [2, 3, 4, 3, 2] as const;
export const MAX_POINTS = 4;

const HALF_ZONE = (BAND * BAND_POINTS.length) / 2;

export function randomTarget() {
  return HALF_ZONE + Math.random() * (100 - 2 * HALF_ZONE);
}

export function bandStart(target: number, band: number) {
  return target - HALF_ZONE + band * BAND;
}

export function scoreFor(needle: number, target: number) {
  const band = Math.floor((needle - (target - HALF_ZONE)) / BAND);
  return BAND_POINTS[band] ?? 0;
}
