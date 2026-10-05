"use client";

import { useRef } from "react";
import { Monogram } from "@/components/ui/Monogram";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { markIntroReady } from "@/lib/intro";
import { useScroll } from "./ScrollProvider";

/**
 * Opening curtain: a one-second count with five start lights, then two panels lift in sequence and
 * the hero entrance starts underneath. It is a title card, not a loader — the
 * page is already rendered behind it. Decorative: hidden from assistive tech
 * and skipped when reduced motion is requested or JavaScript is unavailable.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const { lock, unlock } = useScroll();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      let released = false;
      const release = (announce: boolean) => {
        if (released) return;
        released = true;
        unlock();
        if (announce) markIntroReady();
      };

      lock();
      const mm = gsap.matchMedia(root);

      mm.add(MQ.reduce, () => {
        gsap.set(el, { display: "none" });
        release(true);
      });

      mm.add(MQ.motion, () => {
        const count = el.querySelector<HTMLElement>("[data-tick]");
        const progress = { value: 0 };

        gsap
          .timeline()
          .to(progress, {
            value: 100,
            duration: 1,
            ease: "power3.inOut",
            onUpdate: () => {
              if (count) count.textContent = String(Math.round(progress.value)).padStart(3, "0");
            },
          })
          .to("[data-light]", { backgroundColor: "#ff5a00", duration: 0.1, stagger: 0.17 }, 0.08)
          .to("[data-inner]", { opacity: 0, duration: 0.22, ease: "power1.in" }, ">0.05")
          .add(() => release(true))
          .to("[data-panel]", { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "<")
          .to("[data-veil]", { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "<0.12")
          .set(el, { display: "none" });
      });

      return () => release(false);
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="preloader fixed inset-0 z-[100]">
      <div data-veil className="absolute inset-0 bg-orange" />
      <div data-panel className="absolute inset-0 flex flex-col justify-between bg-ink p-5 md:p-10">
        <div data-inner className="flex items-start justify-between label text-ash">
          <Monogram className="h-4 w-auto text-bone md:h-[1.125rem]" />
          <span>Fan concept</span>
        </div>
        <div data-inner className="flex items-end gap-4 md:gap-8">
          <span className="mb-[0.3rem] hidden label text-ash sm:block">Lights out</span>
          <span className="mb-[0.55rem] flex flex-1 gap-1.5">
            {[0, 1, 2, 3, 4].map((light) => (
              <span key={light} data-light className="size-2.5 bg-steel" />
            ))}
          </span>
          <span data-tick className="display text-[clamp(4rem,15vw,13rem)] text-bone tabular-nums">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
