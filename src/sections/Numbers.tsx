"use client";

import { useRef } from "react";
import { Odometer } from "@/components/ui/Odometer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { headlineStat, stats, statsMeta } from "@/data/stats";
import type { Stat } from "@/data/stats";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

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

      // Digits roll up to their value the first time a figure enters.
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-odo-col]", root.current).forEach((column) => {
          const siblings = Array.from(column.parentElement?.children ?? []);
          const place = siblings.length - 1 - siblings.indexOf(column);

          gsap.fromTo(
            column,
            { y: 0, yPercent: 0 },
            {
              yPercent: Number(column.dataset.digit) * -10,
              duration: 1.9 + place * 0.25,
              ease: "expo.out",
              scrollTrigger: { trigger: column.parentElement, start: "top 88%", once: true },
            },
          );
        });
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
        className="relative overflow-hidden bg-ink px-5 py-24 md:px-10 md:py-36"
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
            <p className="text-right caption text-ash">
              Career data
              <br />
              {statsMeta.source}
              <br />
              {statsMeta.asOf}
            </p>
          </div>

          <div className="mt-14 grid gap-x-10 gap-y-16 md:mt-20 lg:grid-cols-12">
            <dl className="lg:col-span-5">
              <div className="flex flex-col-reverse">
                <dt className="mt-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                  <span className="wide fs-sub">{headlineStat.label}</span>
                  <span className="caption whitespace-nowrap text-ash">{headlineStat.detail}</span>
                </dt>
                <dd className="-ml-[0.05em]">
                  <Odometer
                    value={headlineStat.value}
                    className="display text-[clamp(17rem,50vw,48rem)] leading-[0.74] text-orange"
                  />
                </dd>
              </div>
            </dl>

            <div className="grid grid-cols-2 gap-x-5 md:gap-x-10 lg:col-span-6 lg:col-start-7">
              <dl className="space-y-12 md:space-y-24">
                {left.map((stat, i) => (
                  <StatBlock key={stat.key} stat={stat} index={i * 2 + 1} />
                ))}
              </dl>
              <dl className="mt-[clamp(4rem,11vw,12rem)] space-y-12 md:space-y-24">
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
