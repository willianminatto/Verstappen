"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Mobile browser chrome showing/hiding must not re-measure every trigger.
if (typeof window !== "undefined") ScrollTrigger.config({ ignoreMobileResize: true });

const MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * Media queries shared by every animation. `cine` and `reveal` mirror the
 * Tailwind variants of the same name in globals.css, so pinned layouts and
 * their timelines always switch on together.
 */
export const MQ = {
  motion: MOTION,
  reduce: "(prefers-reduced-motion: reduce)",
  /** Desktop with motion: pinned / horizontal sections. */
  cine: `(min-width: 1024px) and ${MOTION}`,
  /** Everything `cine` is not: native layouts. */
  native: "(max-width: 1023.98px), (prefers-reduced-motion: reduce)",
  /** Small screens with motion. */
  compact: `(max-width: 1023.98px) and ${MOTION}`,
  /** Footer uncover effect. */
  reveal: `(min-width: 1024px) and (min-height: 640px) and ${MOTION}`,
  /** Motion allowed, but the viewport cannot hold the uncover effect. */
  noReveal: `${MOTION} and (not ((min-width: 1024px) and (min-height: 640px)))`,
  /** Mouse-driven extras: pointer parallax, cursor follower. */
  fine: `(hover: hover) and (pointer: fine) and ${MOTION}`,
} as const;

export { gsap, ScrollTrigger, useGSAP };
