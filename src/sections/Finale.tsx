"use client";

import { useRef } from "react";
import { useScroll } from "@/components/layout/ScrollProvider";
import { Chars } from "@/components/ui/Chars";
import { Monogram } from "@/components/ui/Monogram";
import { currentNumber } from "@/data/driver";
import { finaleSection, site } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * Closing frame. On large screens (`reveal:`) it is fixed behind the page and
 * uncovered as the last section lifts away; the closing line assembles with
 * that movement. Elsewhere it is an ordinary block that assembles on arrival.
 */
export function Finale() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      const assemble = (scrollTrigger: ScrollTrigger.Vars) =>
        gsap
          .timeline({ defaults: { ease: "power3.out" }, scrollTrigger })
          .from(
            "[data-char]",
            { yPercent: 118, rotation: 7, transformOrigin: "0% 100%", stagger: 0.07 },
            0,
          )
          .from("[data-line]", { scaleX: 0.9, transformOrigin: "0% 50%", ease: "none" }, 0)
          .from("[data-numeral]", { yPercent: 30, scale: 1.25, opacity: 0, ease: "none" }, 0)
          .from("[data-glow]", { opacity: 0, scale: 0.6, ease: "none" }, 0);

      mm.add(MQ.reveal, () => {
        assemble({ trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 });
      });

      mm.add(MQ.noReveal, () => {
        assemble({ trigger: root.current, start: "top 78%", end: "bottom bottom", scrub: 0.6 });
      });
    },
    { scope: root },
  );

  const [first, second] = site.closingLine;

  return (
    <footer
      id={finaleSection?.id}
      ref={root}
      className="relative reveal:h-svh reveal:[clip-path:inset(0)]"
    >
      <div className="relative flex flex-col justify-between gap-12 overflow-hidden bg-night px-5 pt-24 pb-6 md:px-10 md:pt-28 md:pb-8 reveal:fixed reveal:inset-x-0 reveal:bottom-0 reveal:h-svh reveal:gap-6 reveal:pt-24">
        <div
          data-glow
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[75%] origin-bottom bg-[radial-gradient(55%_90%_at_50%_100%,rgb(255_90_0/0.34),transparent)]"
        />
        <span
          data-numeral
          aria-hidden="true"
          className="pointer-events-none absolute top-[38%] right-[-8vw] block -translate-y-1/2 max-lg:opacity-35 md:top-1/2 md:right-[4vw]"
        >
          <span className="block -skew-x-[9deg] display text-[min(78svh,70vw)] leading-[0.8] text-orange/90 reveal:text-[min(62svh,40vw)]">
            {currentNumber?.value}
          </span>
        </span>

        <div className="relative flex items-start justify-between gap-6">
          <p className="flex items-center gap-3 label text-ash">
            <span className="text-orange">{finaleSection?.index}</span>
            <span className="size-1 bg-current" aria-hidden="true" />
            <span>{finaleSection?.label}</span>
          </p>
          <p className="text-right">
            <span className="block wide text-[clamp(0.8125rem,1.1vw,1.125rem)]">
              Max Verstappen
            </span>
            <span className="mt-1 block caption text-ash">
              No. {currentNumber?.value} · Fan concept
            </span>
          </p>
        </div>

        <p className="relative display text-[clamp(4.5rem,29vw,40rem)] leading-[0.8] reveal:text-[min(27.5vw,30svh)]">
          <span className="sr-only">{site.closingLine.join(" ")}</span>
          <span data-line className="block">
            <Chars text={first} />
          </span>
          <span data-line className="block">
            <Chars text={second} className="text-outline [--outline:var(--color-bone)]" />
          </span>
        </p>

        <div className="relative grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <Monogram className="h-5 w-auto text-orange" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/80">{site.disclaimer}</p>
          </div>
          <p className="caption text-ash md:col-span-3">
            Concept build · v0.2
            <br />
            Visuals are generated artwork
          </p>
          <div className="md:col-span-3 md:text-right">
            <a
              href="#top"
              onClick={(event) => {
                event.preventDefault();
                scrollTo(0);
              }}
              className="group -my-3 inline-flex min-h-11 items-center gap-3 label"
            >
              <span className="transition-colors duration-300 group-hover:text-orange">
                Back to start
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="size-4 transition-transform duration-500 ease-expo group-hover:-translate-y-1"
              >
                <path d="M12 22V3M4 11l8-8 8 8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
