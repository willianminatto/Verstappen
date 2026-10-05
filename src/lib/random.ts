/** Deterministic PRNG (mulberry32) so generated art is identical on server and client. */
export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rounds to 2 decimals to keep SVG markup compact and stable. */
export const r2 = (value: number) => Math.round(value * 100) / 100;
