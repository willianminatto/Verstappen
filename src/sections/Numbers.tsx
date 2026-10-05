"use client";

import { useRef } from "react";
import { Odometer } from "@/components/ui/Odometer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { headlineStat, stats, statsMeta } from "@/data/stats";
import type { Stat } from "@/data/stats";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

const pad = (value: number) => String(value).padStart(2, "0");

function StatBlock({ stat, index }: { stat: Stat; index: number }) {
  return (
    <div className="relative">
      <dt className="flex items-baseline justify-between gap-3">
        <span className="wide text-[clamp(0.75rem,1.05vw,1.0625rem)]">{stat.label}</span>
        <span className="caption text-ash" aria-hidden="true">
          {pad(index)}
        </span>
      </dt>
      <dd className="mt-3 md:mt-5">
        <Odometer value={stat.value} className="display fs-figure" />
      </dd>
    </div>
  );
}

/**
 * A statistics poster: the headline figure bleeds off the left edge while the
 * supporting figures sit in two offset columns. All values come from
 * `data/stats.ts`.
 */
export function Numbers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      const figures = gsap.utils.toArray<HTMLElement>("[data-count]", root.current);
      const showFinal = () =>
        figures.forEach((figure) => {
          figure.textContent = figure.dataset.count ?? "0";
        });
      mm.add(MQ.reduce, showFinal);
      mm.add(MQ.motion, () => {
        const counters = figures.map((figure) => ({
          value: 0,
          final: Number(figure.dataset.count),
          figure,
        }));
        let armed = true;
        let timeline: gsap.core.Timeline | undefined;
        const reset = () => {
          counters.forEach((counter) => {
            counter.value = 0;
            counter.figure.textContent = "0";
          });
        };
        const play = () => {
          const bounds = root.current?.getBoundingClientRect();
          // A fast scroll can skip both boundaries in one update.
          if (!armed || !bounds || bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
          armed = false;
          timeline?.kill();
          reset();
          timeline = gsap.timeline();
          counters.forEach((counter, index) => {
            timeline!.to(
              counter,
              {
                value: counter.final,
                duration: 1.25,
                ease: "power2.out",
                onUpdate: () => {
                  counter.figure.textContent = String(Math.round(counter.value));
                },
                onComplete: () => {
                  counter.figure.textContent = String(counter.final);
                },
              },
              index * 0.04,
            );
          });
        };
        const rearm = () => {
          timeline?.kill();
          timeline = undefined;
          showFinal();
          armed = true;
        };
        reset();
        // Leaving the significant-entry band is insufficient: the section
        // must leave the entire viewport before another count is allowed.
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onLeave: rearm,
          onLeaveBack: rearm,
        });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: play,
          onEnterBack: play,
        });
        return () => timeline?.kill();
      });
    },
    { scope: root },
  );

  const [left, right] = [stats.filter((_, i) => i % 2 === 0), stats.filter((_, i) => i % 2 === 1)];

  return (
    <div className="relative z-10 bg-night">
      <section
        id="numbers"
        ref={root}
        data-expand
        aria-labelledby="numbers-title"
        className="relative overflow-hidden bg-ink px-5 py-16 md:px-10 lg:py-36"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-lines [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]"
        />
        <span className="brackets text-bone/50 max-md:hidden" aria-hidden="true" />

        <div className="relative">
          <div className="flex items-start justify-between gap-6">
            <SectionHeading
              id="numbers-title"
              index="03"
              label="Numbers"
              lines={["By the", "Numbers"]}
              titleClassName="fs-title"
            />
            <p className="max-w-[9rem] text-right caption text-ash lg:max-w-none">
              Career data
              <br />
              {statsMeta.source}
              <br />
              {statsMeta.asOf}
            </p>
          </div>

          <div className="mt-10 grid gap-x-10 gap-y-10 lg:mt-20 lg:grid-cols-12">
            <dl className="lg:col-span-5">
              <div className="flex flex-col-reverse">
                <dt className="mt-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                  <span className="wide fs-sub">{headlineStat.label}</span>
                  <span className="caption whitespace-nowrap text-ash">{headlineStat.detail}</span>
                </dt>
                <dd className="-ml-[0.05em]">
                  <Odometer
                    value={headlineStat.value}
                    className="display text-[clamp(12rem,42vw,24rem)] leading-[0.74] text-orange lg:text-[clamp(17rem,50vw,48rem)]"
                  />
                </dd>
              </div>
            </dl>

            <div className="grid grid-cols-2 gap-x-5 md:gap-x-10 lg:col-span-6 lg:col-start-7">
              <dl className="space-y-8 lg:space-y-24">
                {left.map((stat, i) => (
                  <StatBlock key={stat.key} stat={stat} index={i * 2 + 1} />
                ))}
              </dl>
              <dl className="mt-6 space-y-8 lg:mt-[clamp(4rem,11vw,12rem)] lg:space-y-24">
                {right.map((stat, i) => (
                  <StatBlock key={stat.key} stat={stat} index={i * 2 + 2} />
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
