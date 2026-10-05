"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionHeading";
import { pillars } from "@/data/legacy";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const pad = (value: number) => String(value).padStart(2, "0");

/** Off-screen offset of the word inside its mask, in % of its own height. */
const OUT = 110;

/**
 * Shape of one word change, in steps (1 step = one word's share of the pinned
 * scroll). A change is centred on the boundary between two steps:
 *
 *   |<------ ZONE ------>|<- GAP ->|<- GAP ->|<------ ZONE ------>|
 *    current word leaves   stage is empty      next word enters
 *
 * Outside it the word simply rests, fully legible.
 */
const ZONE = 0.2;
const GAP = 0.025;

/**
 * The climax. Desktop with motion: the section pins and the scroll position
 * selects one of the words.
 *
 * There is exactly ONE giant word element on the stage, and everything about
 * it — which word, where it sits in its mask, whether it is visible — is a
 * pure function of the scroll progress (`render`). So:
 *
 *   - two words can never be on screen together: there is only one element,
 *     and its text is only ever replaced inside the empty gap, while hidden;
 *   - it cannot get stuck, lag behind or skip a step: nothing waits on a
 *     previous animation, every update draws the frame for where the scroll is;
 *   - scrolling back, resizing or reloading mid-section all land on the right
 *     word, because there is no state to recover.
 *
 * The step numeral and the supporting line are single elements driven by the
 * same function.
 *
 * Everywhere else (mobile, reduced motion) the plain list below is shown; on
 * desktop that list stays in the accessibility tree and the stage is hidden
 * from it.
 */
export function Legacy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      mm.add(MQ.cine, () => {
        const el = root.current;
        const word = el?.querySelector<HTMLElement>("[data-stage-word]");
        const text = el?.querySelector<HTMLElement>("[data-stage-text]");
        const line = el?.querySelector<HTMLElement>("[data-stage-line]");
        const ghost = el?.querySelector<HTMLElement>("[data-stage-ghost]");
        const counter = el?.querySelector<HTMLElement>("[data-counter]");
        const marks = gsap.utils.toArray<HTMLElement>("[data-step]", el);
        if (!el || !word || !text || !line || !ghost) return;

        const steps = pillars.length;
        const moving = [word, ghost];
        const leave = gsap.parseEase("power2.in");
        const enter = gsap.parseEase("power3.out");
        let written = -1;

        /** Puts step `index` on the stage, hiding it first. */
        const write = (index: number) => {
          const pillar = pillars[index];
          if (!pillar || index === written) return;
          written = index;
          // Explicitly hidden before the text changes; the caller then sets the
          // visibility this frame needs. Both happen before the browser paints.
          gsap.set([...moving, line], { autoAlpha: 0 });
          text.textContent = pillar.word;
          line.textContent = pillar.line;
          ghost.textContent = pad(index + 1);
          if (counter) counter.textContent = pad(index + 1);
          marks.forEach((mark, i) => mark.classList.toggle("is-on", i <= index));
        };

        /**
         * Draws the stage for a scroll position measured in steps (0 → steps).
         * Everything is derived from `position` alone.
         */
        const render = (position: number) => {
          const boundary = Math.round(position);
          const offset = position - boundary;
          const changing = boundary >= 1 && boundary <= steps - 1 && Math.abs(offset) < ZONE + GAP;

          if (!changing) {
            // Resting on a word.
            write(Math.min(steps - 1, Math.max(0, Math.floor(position))));
            gsap.set(moving, { yPercent: 0, autoAlpha: 1 });
            gsap.set(line, { autoAlpha: 1 });
            return;
          }

          if (Math.abs(offset) <= GAP) {
            // Empty stage: hide first, then replace the content.
            gsap.set([...moving, line], { autoAlpha: 0 });
            write(offset < 0 ? boundary - 1 : boundary);
            gsap.set(moving, { yPercent: offset < 0 ? -OUT : OUT });
            return;
          }

          if (offset < 0) {
            // The current word leaves, upwards.
            const t = (offset + ZONE + GAP) / ZONE;
            write(boundary - 1);
            gsap.set(moving, { yPercent: -OUT * leave(t), autoAlpha: 1 });
            gsap.set(line, { autoAlpha: Math.max(0, 1 - t * 2.5) });
            return;
          }

          // The next word enters, from below.
          const t = (offset - GAP) / ZONE;
          write(boundary);
          gsap.set(moving, { yPercent: OUT * (1 - enter(t)), autoAlpha: 1 });
          gsap.set(line, { autoAlpha: Math.max(0, (t - 0.45) / 0.55) });
        };

        render(0);

        // Arrival: the whole stage lifts in (a different element from the word).
        gsap.from("[data-stage]", {
          autoAlpha: 0,
          y: 90,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 55%", toggleActions: "play none none reverse" },
        });

        // Pin. One scrubbed timeline: the light builds and a plain number runs
        // from 0 to `steps`; each update hands that number to `render`.
        const scroll = { position: 0 };
        gsap
          .timeline({
            defaults: { ease: "none", duration: 1 },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: `+=${steps * 100}%`,
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
            },
            onUpdate: () => render(scroll.position),
          })
          .fromTo("[data-glow]", { opacity: 0.35, scale: 0.8 }, { opacity: 1, scale: 1.15 }, 0)
          .fromTo(scroll, { position: 0 }, { position: steps }, 0);

        return () => {
          gsap.set([...moving, line], { clearProps: "all" });
          written = -1;
          write(0);
        };
      });

      mm.add(MQ.compact, () => {
        gsap.utils.toArray<HTMLElement>("[data-word]", root.current).forEach((item) => {
          gsap.from(item, {
            yPercent: OUT,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: item.parentElement, start: "top 90%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  const first = pillars[0];

  return (
    <section
      id="legacy"
      ref={root}
      aria-labelledby="legacy-title"
      className="relative z-10 overflow-hidden bg-[linear-gradient(to_bottom,var(--color-navy),var(--color-ink)_22rem)] px-5 py-16 md:px-10 lg:py-28 cine:h-screen cine:py-0"
    >
      <div
        data-glow
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[85%] origin-bottom bg-[radial-gradient(60%_75%_at_50%_100%,rgb(255_90_0/0.2),rgb(11_20_41/0.9)_45%,transparent_75%)]"
      />

      {/* Step numeral: one element inside its own mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[15%] right-10 hidden h-[0.8em] overflow-hidden display text-[clamp(10rem,22vw,26rem)] leading-[0.8] text-outline [--outline:rgb(241_238_231/0.22)] cine:block"
      >
        <span data-stage-ghost className="block">
          {pad(1)}
        </span>
      </div>

      <div className="relative cine:flex cine:h-full cine:flex-col cine:justify-between cine:pt-24 cine:pb-10">
        <div className="flex items-center justify-between">
          <SectionLabel index="07" label="Legacy" />
          <p className="hidden label tabular-nums cine:block" aria-hidden="true">
            <span data-counter className="text-orange">
              01
            </span>
            <span className="text-ash"> / {pad(pillars.length)}</span>
          </p>
        </div>

        <h2 id="legacy-title" className="sr-only">
          Legacy
        </h2>

        {/* Pinned stage: a single word, a single line */}
        <div
          data-stage
          aria-hidden="true"
          className="hidden cine:flex cine:flex-1 cine:flex-col cine:justify-center"
        >
          <p className="overflow-hidden pt-[0.05em] pb-[0.03em] display text-[clamp(3rem,14.6vw,19rem)]">
            <span data-stage-word className="block">
              <span data-stage-text>{first?.word}</span>
              <span className="text-orange">.</span>
            </span>
          </p>
          <p data-stage-line className="mt-8 min-h-[3.2em] max-w-2xl wide fs-sub text-bone/70">
            {first?.line}
          </p>
        </div>

        {/* Plain list: the layout on mobile / reduced motion, and what assistive tech reads */}
        <ol className="relative mt-8 lg:mt-12 cine:sr-only">
          {pillars.map((pillar) => (
            <li key={pillar.word} className="py-5 lg:py-7">
              <p className="overflow-hidden pt-[0.04em]">
                <span data-word className="block display text-[clamp(3rem,14.6vw,19rem)]">
                  {pillar.word}
                  <span className="text-orange">.</span>
                </span>
              </p>
              <p className="mt-4 max-w-2xl wide fs-sub text-bone/70">{pillar.line}</p>
            </li>
          ))}
        </ol>

        <div className="hidden items-center gap-4 cine:flex">
          <span className="label text-ash">What stays when the lap is over</span>
          <span className="flex gap-1.5" aria-hidden="true">
            {pillars.map((pillar, i) => (
              <span
                key={pillar.word}
                data-step
                className={`size-2 bg-bone/25 transition-colors duration-300 [&.is-on]:bg-orange ${i === 0 ? "is-on" : ""}`}
              />
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
