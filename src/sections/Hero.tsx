"use client";

import { useRef } from "react";
import { useScroll } from "@/components/layout/ScrollProvider";
import { Chars } from "@/components/ui/Chars";
import { Media } from "@/components/ui/Media";
import { NumberLineage } from "@/components/ui/NumberLineage";
import { currentNumber, driver, racingNumbers } from "@/data/driver";
import { media } from "@/data/media";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { onIntroReady } from "@/lib/intro";

/** Crosshair markers of the mid "instrument" layer: position in % of the hero. */
const MARKS = [
  { x: 23, y: 31, name: "S1" },
  { x: 57, y: 19, name: "S2" },
  { x: 44, y: 58, name: "S3" },
];

/**
 * Four depth layers — plate, instruments, numeral, type — that enter at
 * different speeds, lean with the pointer, and separate again on the way out
 * while the next section slides over the pinned hero.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      mm.add(MQ.motion, () => {
        // Entrance: held until the preloader curtain starts to lift.
        const intro = gsap
          .timeline({ paused: true, defaults: { ease: "expo.out" } })
          .from("[data-hero-bg]", { scale: 1.4, opacity: 0, duration: 2.4, ease: "power3.out" }, 0)
          .fromTo(
            "[data-hero-numeral]",
            { clipPath: "inset(100% 0% 0% 0%)", yPercent: 14 },
            { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, duration: 1.7 },
            0.1,
          )
          .from(
            "[data-hero-max] [data-char]",
            { yPercent: 115, duration: 1.3, stagger: 0.05 },
            0.25,
          )
          .from(
            "[data-hero-name] [data-char]",
            { yPercent: 115, duration: 1.4, stagger: 0.03 },
            0.36,
          )
          .from("[data-hero-mark]", { scale: 0, opacity: 0, duration: 0.9, stagger: 0.09 }, 0.8)
          .from("[data-hero-meta]", { opacity: 0, y: 12, duration: 0.9, stagger: 0.06 }, 0.9);

        const unsubscribe = onIntroReady(() => intro.play());

        return unsubscribe;
      });

      // Desktop exit: the next section covers the pinned hero.
      mm.add(MQ.cine, () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              pin: true,
              pinSpacing: false,
              scrub: true,
            },
          })
          .to("[data-hero-stage]", { scale: 0.92 }, 0)
          .to("[data-layer='plate']", { yPercent: 10 }, 0)
          .to("[data-layer='instruments']", { yPercent: -30 }, 0)
          .to("[data-layer='numeral']", { yPercent: -14, scale: 1.12 }, 0)
          .to("[data-layer='type']", { yPercent: -22 }, 0)
          .to("[data-hero-fade]", { opacity: 0, duration: 0.3 }, 0)
          .to("[data-hero-shade]", { opacity: 0.82 }, 0);
      });

      // Mobile stays in normal flow: the photo and title leave together,
      // without the pinned shrink/fade creating a dark transition band.
      mm.add(MQ.compact, () => {
        gsap.to("[data-hero-bg]", {
          scale: 1.04,
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Pointer parallax: each layer leans by its own depth.
      mm.add(MQ.fine, () => {
        const el = root.current;
        if (!el) return;

        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", el).map((layer) => ({
          depth: Number(layer.dataset.depth),
          x: gsap.quickTo(layer, "x", { duration: 1.1, ease: "power3" }),
          y: gsap.quickTo(layer, "y", { duration: 1.1, ease: "power3" }),
        }));

        const onMove = (event: PointerEvent) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          for (const layer of layers) {
            layer.x(nx * layer.depth);
            layer.y(ny * layer.depth * 0.6);
          }
        };

        el.addEventListener("pointermove", onMove, { passive: true });
        return () => el.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      aria-label="Introduction"
      className="relative h-svh min-h-0 overflow-hidden bg-ink lg:min-h-[34rem]"
    >
      <div data-hero-stage className="absolute inset-0 flex flex-col justify-between">
        {/* Layer 1 — plate */}
        <div data-layer="plate" data-depth="-10" className="absolute -inset-[3%]">
          <div data-hero-bg className="size-full">
            <Media
              slot={media.hero}
              priority
              sizes="100vw"
              className="size-full"
              imageClassName="object-cover object-[50%_32%] sm:object-[50%_26%] lg:object-[50%_20%] 2xl:object-[50%_18%]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/20 via-transparent to-ink/30"
            />
          </div>
        </div>

        {/* Layer 2 — instruments */}
        <div
          data-layer="instruments"
          data-depth="18"
          data-hero-fade
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-bone/70"
        >
          {MARKS.map((mark) => (
            <span
              key={mark.name}
              data-hero-mark
              className="absolute flex items-start gap-2"
              style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none">
                <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="1" />
              </svg>
              <span className="caption">{mark.name}</span>
            </span>
          ))}
          <span
            data-hero-mark
            className="absolute top-[40%] left-3 hidden caption text-bone/50 [writing-mode:vertical-rl] lg:block"
          >
            MV 03 · 2026
          </span>
        </div>

        {/* Layer 3 — numeral */}
        <div
          data-layer="numeral"
          data-depth="34"
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-[3vw] flex items-center max-lg:opacity-35 md:right-[7vw]"
        >
          <span data-hero-numeral className="block">
            <span className="block -skew-x-[9deg] display text-[min(90svh,118vw)] leading-[0.8] text-orange">
              {currentNumber?.value}
            </span>
          </span>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink/90 via-ink/20 to-transparent lg:h-2/3 lg:from-ink lg:via-ink/45"
        />

        {/* Top microdata */}
        <div
          data-hero-fade
          className="relative flex items-start justify-between gap-4 px-5 pt-24 label max-sm:text-[0.625rem] max-sm:tracking-[0.1em] md:px-10 md:pt-28"
        >
          <p data-hero-meta>
            <span className="block text-ash">Driver file</span>
            <span className="block whitespace-nowrap">F1 · Since 2015</span>
          </p>
          <p data-hero-meta className="text-right">
            <span className="block text-ash">{driver.birthplace}</span>
            <span className="block whitespace-nowrap">{driver.coordinates}</span>
          </p>
        </div>

        {/* Layer 4 — type */}
        <div className="relative px-5 pb-4 md:px-10 md:pb-7">
          <h1
            data-layer="type"
            data-depth="-22"
            className="display text-[calc((100vw-2.5rem)/4.85)] whitespace-nowrap md:text-[calc((100vw-5rem)/4.85)]"
          >
            <span className="sr-only">Max Verstappen</span>
            <span data-hero-max className="block">
              <Chars
                text="MAX"
                className="tracking-[0.012em] text-outline [--outline:var(--color-bone)]"
              />
            </span>
            <span data-hero-name className="block">
              <Chars text="VERSTAPPEN" />
            </span>
          </h1>

          <div
            data-hero-fade
            className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 label md:mt-6"
          >
            <a
              data-hero-meta
              href="#driver"
              onClick={(event) => {
                event.preventDefault();
                scrollTo("#driver");
              }}
              className="group -ml-2 flex min-h-11 items-center gap-3 px-2"
            >
              <span
                className="relative block h-7 w-px overflow-hidden bg-bone/25"
                aria-hidden="true"
              >
                <span className="scroll-cue absolute inset-0 bg-orange" />
              </span>
              <span className="transition-colors duration-300 group-hover:text-orange">Scroll</span>
            </a>
            <div data-hero-meta className="flex items-center justify-center gap-3">
              <span className="text-ash">No.</span>
              <NumberLineage numbers={racingNumbers} />
            </div>
            <p data-hero-meta className="text-right text-ash max-sm:max-w-[6.5rem]">
              Unofficial fan concept
            </p>
          </div>
        </div>
      </div>

      <div
        data-hero-shade
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink opacity-0"
      />
    </section>
  );
}
