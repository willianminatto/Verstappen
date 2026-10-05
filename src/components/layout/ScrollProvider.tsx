"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";

type ScrollApi = {
  /** Scrolls to a selector or a pixel offset, smoothly when motion is allowed. */
  scrollTo: (target: string | number) => void;
  /** Freezes page scroll (preloader, fullscreen menu). Calls are counted. */
  lock: () => void;
  unlock: () => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

export function useScroll() {
  const api = useContext(ScrollContext);
  if (!api) throw new Error("useScroll must be used inside <ScrollProvider>");
  return api;
}

/**
 * Owns the single Lenis instance and keeps it in step with GSAP: Lenis is
 * driven by gsap.ticker and reports every scroll to ScrollTrigger. With
 * reduced motion Lenis is never created and the page scrolls natively.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const locks = useRef(0);

  useEffect(() => {
    if (window.matchMedia(MQ.reduce).matches) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.11 });
    lenisRef.current = lenis;
    if (locks.current > 0) lenis.stop();

    const onScroll = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", onScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo(target) {
        const element = typeof target === "string" ? document.querySelector(target) : null;
        if (typeof target === "string" && !element) return;

        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(element instanceof HTMLElement ? element : Number(target) || 0, {
            duration: 1.6,
            easing: (t) => 1 - Math.pow(1 - t, 4),
          });
        } else if (element) {
          element.scrollIntoView();
        } else {
          window.scrollTo(0, Number(target) || 0);
        }
      },
      lock() {
        locks.current += 1;
        document.documentElement.classList.add("scroll-locked");
        lenisRef.current?.stop();
      },
      unlock() {
        locks.current = Math.max(0, locks.current - 1);
        if (locks.current > 0) return;
        document.documentElement.classList.remove("scroll-locked");
        lenisRef.current?.start();
      },
    }),
    [],
  );

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
