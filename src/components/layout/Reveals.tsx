"use client";

import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

const delayOf = (el: HTMLElement) => Number(el.dataset.delay ?? 0) || 0;

/**
 * One place for the generic, declarative motion used across sections:
 *
 *   data-reveal="mask"   first child rises from behind its parent
 *   data-reveal="up"     fades and lifts into place
 *   data-reveal="clip"   frame wipes open from the bottom
 *   data-parallax        first child drifts inside its (overflow-hidden) frame
 *   data-drift="12"      element drifts ±12% of its height while crossing the viewport
 *   data-expand          frame opens from an inset to full size as it arrives
 *
 * Mounted after every section so its triggers are created last (below any
 * pinned section) and measure correctly. Renders nothing.
 */
export function Reveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const all = (selector: string) => gsap.utils.toArray<HTMLElement>(selector);
      const once = (el: HTMLElement, start = "top 90%") => ({ trigger: el, start, once: true });
      const through = (el: HTMLElement) => ({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      });

      all('[data-reveal="mask"]').forEach((el) => {
        gsap.from(el.firstElementChild, {
          yPercent: 112,
          duration: 1.25,
          ease: "expo.out",
          delay: delayOf(el),
          scrollTrigger: once(el),
        });
      });

      all('[data-reveal="up"]').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          delay: delayOf(el),
          scrollTrigger: once(el, "top 92%"),
        });
      });

      all('[data-reveal="clip"]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: "expo.inOut",
            scrollTrigger: once(el, "top 85%"),
          },
        );
      });

      all("[data-parallax]").forEach((frame) => {
        gsap.fromTo(
          frame.firstElementChild,
          { yPercent: -7, scale: 1.16 },
          { yPercent: 7, scale: 1.16, ease: "none", scrollTrigger: through(frame) },
        );
      });

      all("[data-drift]").forEach((el) => {
        const amount = Number(el.dataset.drift) || 10;
        gsap.fromTo(
          el,
          { yPercent: amount },
          { yPercent: -amount, ease: "none", scrollTrigger: through(el) },
        );
      });

      all("[data-expand]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 7% 0% 7%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "top 30%", scrub: true },
          },
        );
      });
    });

    // Web fonts change line heights; re-measure once they are in.
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  });

  return null;
}
