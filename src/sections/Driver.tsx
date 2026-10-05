"use client";

import { useRef } from "react";
import { Mask } from "@/components/ui/Mask";
import { Media } from "@/components/ui/Media";
import { NumberLineage } from "@/components/ui/NumberLineage";
import { SectionLabel } from "@/components/ui/SectionHeading";
import { currentNumber, driver, racingNumbers } from "@/data/driver";
import { media } from "@/data/media";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

export function Driver() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      // The statement "develops" word by word as it crosses the viewport.
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "power1.out",
            stagger: 0.14,
            scrollTrigger: {
              trigger: "[data-statement]",
              start: "top 78%",
              end: "bottom 52%",
              scrub: 0.4,
            },
          },
        );
      });
    },
    { scope: root },
  );

  const name = driver.facts.find((fact) => fact.label === "Name");
  const facts = driver.facts.filter((fact) => fact.label !== "Name" && !fact.showNumberHistory);

  return (
    <section
      id="driver"
      ref={root}
      aria-labelledby="driver-title"
      className="relative z-10 bg-ink px-5 pt-16 pb-20 md:px-10 lg:pt-32 lg:pb-72"
    >
      <div className="flex items-start justify-between">
        <SectionLabel index="01" label="The Driver" />
        <p className="hidden text-right caption text-ash sm:block">
          {driver.birthplace}
          <br />
          {driver.coordinates}
        </p>
      </div>

      <h2
        id="driver-title"
        data-statement
        className="mt-10 display text-[clamp(2.75rem,9.2vw,11.5rem)] md:mt-14 lg:max-w-[88%]"
      >
        {driver.statement.split(" ").map((word, i) => (
          <span key={i} data-word className="inline-block">
            {word}&nbsp;
          </span>
        ))}
      </h2>

      <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-12 lg:mt-40 lg:gap-x-10 lg:gap-y-16">
        {/* Portrait, with the current number breaking out of its frame */}
        <figure className="relative self-start sm:col-span-5 lg:mt-24">
          <div data-reveal="clip" data-parallax className="aspect-[4/5] overflow-hidden">
            <Media
              slot={media.driver}
              grade="light"
              sizes="(min-width: 640px) 40vw, calc(100vw - 2.5rem)"
              className="size-full"
              imageClassName="object-[50%_30%]"
            />
          </div>
          <span className="brackets text-bone/60" aria-hidden="true" />
          <span
            data-drift="14"
            aria-hidden="true"
            className="pointer-events-none absolute -right-[4%] -bottom-[9%] display text-[clamp(11rem,30vw,30rem)] leading-[0.8] text-outline [--outline:var(--color-bone)] lg:-right-[20%]"
          >
            {currentNumber?.value}
          </span>
          <figcaption className="absolute inset-x-6 top-6 flex justify-between caption md:inset-x-8 md:top-8">
            <span>MV / {currentNumber?.value.padStart(2, "0")}</span>
            <span className="text-bone/60">Portrait</span>
          </figcaption>
        </figure>

        <div className="sm:col-span-7 lg:col-span-6 lg:col-start-7">
          {name ? (
            <div>
              <p className="label text-ash">{name.label}</p>
              <p className="mt-4 display fs-title">
                {name.value.split(" ").map((part, i) => (
                  <Mask key={part} delay={i * 0.07}>
                    {part}
                  </Mask>
                ))}
              </p>
            </div>
          ) : null}

          <dl className="mt-12 grid grid-cols-2 gap-x-6 md:mt-16 md:gap-x-10">
            {facts.map((fact) => (
              <div key={fact.label} className="relative pb-10 lg:pb-14">
                <dt className="label text-ash">{fact.label}</dt>
                <dd data-reveal="up" className="mt-3">
                  <span className="block wide fs-sub">{fact.value}</span>
                  {fact.note ? (
                    <span className="mt-2 block caption text-ash">{fact.note}</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>

          <div className="relative">
            <p className="label text-ash">Racing number</p>
            <NumberLineage numbers={racingNumbers} variant="display" className="mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
