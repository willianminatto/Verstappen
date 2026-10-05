"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { HelmetArt } from "@/components/ui/HelmetArt";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { helmets } from "@/data/helmets";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Desktop with motion: the section pins and vertical scroll drives the track
 * sideways, each study turning slightly as it crosses the screen. Everywhere
 * else it is a native, snap-scrolling gallery (touch and keyboard friendly) —
 * the layout switch lives in the `cine:` classes.
 */
export function Helmets() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      const el = root.current;
      if (!el) return;

      const track = el.querySelector<HTMLElement>("[data-track]");
      const counter = el.querySelector<HTMLElement>("[data-counter]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
      if (!track) return;

      mm.add(MQ.cine, () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set("[data-progress]", { scaleX: self.progress });
              if (counter) {
                const step = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
                counter.textContent = pad(step);
              }
            },
          },
        });

        // Each study turns and its numeral slides as the card crosses the screen.
        cards.forEach((card) => {
          const across = {
            trigger: card,
            containerAnimation: travel,
            start: "left right",
            end: "right left",
            scrub: true,
          };
          gsap.fromTo(
            card.querySelector("[data-helmet]"),
            { rotation: 5, xPercent: 7 },
            { rotation: -5, xPercent: -7, ease: "none", scrollTrigger: across },
          );
          gsap.fromTo(
            card.querySelector("[data-ghost]"),
            { xPercent: 22 },
            { xPercent: -22, ease: "none", scrollTrigger: across },
          );
        });

        return () => {
          gsap.set("[data-progress]", { clearProps: "transform" });
          if (counter) counter.textContent = pad(1);
        };
      });

      // Native gallery: mirror its scroll position on the progress line.
      mm.add(MQ.native, () => {
        const viewport = el.querySelector<HTMLElement>("[data-viewport]");
        if (!viewport) return;
        const setProgress = gsap.quickSetter("[data-progress]", "scaleX");
        let frame = 0;

        const update = () => {
          frame = 0;
          const max = viewport.scrollWidth - viewport.clientWidth;
          const progress = max > 0 ? viewport.scrollLeft / max : 0;
          setProgress(Math.max(0.04, progress));
          if (counter) {
            const step = Math.min(cards.length, Math.round(progress * (cards.length - 1)) + 1);
            counter.textContent = pad(step);
          }
        };
        const onScroll = () => {
          if (!frame) frame = requestAnimationFrame(update);
        };

        update();
        viewport.addEventListener("scroll", onScroll, { passive: true });
        return () => {
          cancelAnimationFrame(frame);
          viewport.removeEventListener("scroll", onScroll);
        };
      });
    },
    { scope: root },
  );

  const total = pad(helmets.length);

  return (
    <section
      id="helmets"
      ref={root}
      aria-labelledby="helmets-title"
      className="relative z-10 overflow-hidden bg-ink pt-24 pb-16 md:py-36 cine:h-screen cine:py-0"
    >
      <div
        data-viewport
        role="region"
        aria-label="Helmet design studies, horizontally scrollable"
        tabIndex={0}
        className="snap-x snap-mandatory scroll-px-5 [scrollbar-width:none] overflow-x-auto md:scroll-px-10 cine:h-full cine:snap-none cine:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        <div
          data-track
          className="flex w-max items-stretch gap-4 px-5 md:gap-7 md:px-10 cine:h-full cine:items-center"
        >
          <div className="flex w-[84vw] shrink-0 snap-start flex-col justify-center sm:w-[60vw] lg:w-[44vw]">
            <SectionHeading
              id="helmets-title"
              index="05"
              label="Helmets"
              lines={["Helmet", "Studies"]}
              titleClassName="text-[clamp(3.75rem,10vw,11.5rem)]"
            />
            <p className="mt-8 max-w-sm copy text-ash">
              A helmet is the one surface a driver truly owns. Six abstract studies on that idea.
            </p>
            <p className="mt-8 flex items-center gap-3 label">
              <span className="hidden cine:inline">Keep scrolling</span>
              <span className="cine:hidden">Swipe or scroll</span>
              <svg
                viewBox="0 0 40 10"
                fill="none"
                aria-hidden="true"
                className="nudge-x h-2.5 w-10 text-orange"
              >
                <path d="M0 5h38M34 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </p>
            <p className="mt-3 caption text-ash">Concept liveries · not official designs</p>
          </div>

          {helmets.map((concept, i) => (
            <article
              key={concept.id}
              data-card
              data-cursor="wide"
              style={{ "--tint": concept.palette.accent } as CSSProperties}
              className="group relative flex w-[80vw] shrink-0 snap-center flex-col overflow-hidden bg-night p-5 sm:w-[50vw] md:p-7 lg:w-[33vw] cine:h-[min(76vh,46rem)]"
            >
              {/* studio light, tinted by the livery */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_42%,color-mix(in_srgb,var(--tint)_22%,transparent),transparent)] opacity-70 transition-opacity duration-700 group-hover:opacity-100"
              />
              <span
                data-ghost
                aria-hidden="true"
                className="pointer-events-none absolute top-[14%] right-0 left-0 text-center display text-[clamp(11rem,22vw,24rem)] leading-[0.8] text-outline [--outline:rgb(241_238_231/0.22)]"
              >
                {pad(i + 1)}
              </span>

              <p className="relative flex justify-between caption text-ash">
                <span>
                  Study <span className="text-orange">{pad(i + 1)}</span>
                </span>
                <span>{concept.finish}</span>
              </p>

              <div className="relative flex min-h-0 flex-1 items-center justify-center py-6">
                <div data-helmet className="relative aspect-[5/4] w-full max-w-[30rem]">
                  {concept.src ? (
                    <Image
                      src={concept.src}
                      alt={`${concept.name} helmet`}
                      fill
                      sizes="(min-width: 1024px) 33vw, 80vw"
                      className="object-contain"
                    />
                  ) : (
                    <HelmetArt
                      concept={concept}
                      className="size-full drop-shadow-[0_2.5rem_2.5rem_rgb(0_0_0/0.55)] transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
                    />
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="flex items-end justify-between gap-4">
                  <h3 className="display text-[clamp(2.5rem,4.6vw,5rem)]">{concept.name}</h3>
                  <ul aria-label="Palette" className="mb-1 flex gap-1.5">
                    {Object.entries(concept.palette).map(([role, colour]) => (
                      <li
                        key={role}
                        className="size-3 border border-bone/25"
                        style={{ backgroundColor: colour }}
                      >
                        <span className="sr-only">
                          {role}: {colour}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-2 copy text-ash">{concept.note}</p>
              </div>
            </article>
          ))}

          <div aria-hidden="true" className="w-[2vw] shrink-0" />
        </div>
      </div>

      <div className="pointer-events-none mt-8 flex items-center gap-4 px-5 md:px-10 cine:absolute cine:inset-x-0 cine:bottom-7 cine:mt-0">
        <span className="flex items-baseline gap-2 tabular-nums">
          <span data-counter className="display text-4xl text-orange md:text-5xl">
            01
          </span>
          <span className="label text-ash">/ {total} studies</span>
        </span>
        <div className="relative h-0.5 w-16 bg-bone/20">
          <div data-progress className="absolute inset-0 origin-left bg-orange" />
        </div>
      </div>
    </section>
  );
}
