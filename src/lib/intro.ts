/**
 * Tiny hand-off between the preloader and the hero: the hero entrance starts
 * the moment the preloader curtain begins to lift.
 */

let ready = false;
const listeners = new Set<() => void>();

export function markIntroReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/** Runs `callback` once the intro is ready. Returns an unsubscribe function. */
export function onIntroReady(callback: () => void) {
  if (ready) {
    callback();
    return () => {};
  }
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
