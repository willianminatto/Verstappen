"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { timeline } from "@/data/timeline";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

const pad = (value: number) => String(value).padStart(2, "0");

/** Line across the viewport where a milestone becomes the active one. */
const READ_LINE = "62%";

export function Timeline() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      mm.add(MQ.motion, () => {
        const list = root.current?.querySelector<HTMLElement>("[data-list]");
        const headLabel = root.current?.querySelector<HTMLElement>("[data-head-label]");
        const items = gsap.utils.toArray<HTMLElement>(".tl-item", root.current);
        if (!list) return;

        // A small year tag travels down the marker column with the reading position.
        gsap.fromTo(
          "[data-head]",
          { y: 0 },
          {
            y: () => list.offsetHeight,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: `top ${READ_LINE}`,
              end: `bottom ${READ_LINE}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        items.forEach((item, i) => {
          const isLast = i === items.length - 1;

          // past → solid year; active → full-contrast copy, marked on the rail.
          ScrollTrigger.create({
            trigger: item,
            start: `top ${READ_LINE}`,
            end: isLast ? "max" : `bottom ${READ_LINE}`,
            onToggle: (self) => {
              item.classList.toggle("is-active", self.isActive);
              if (self.isActive && headLabel) headLabel.textContent = item.dataset.year ?? "";
            },
            onEnter: () => item.classList.add("is-past"),
            onLeaveBack: () => {
              item.classList.remove("is-past");
              if (i === 0 && headLabel) headLabel.textContent = item.dataset.year ?? "";
            },
          });

          // Each year grows into place as it approaches the reading line.
          gsap.fromTo(
            item.querySelector(".tl-year"),
            { scale: 0.8 },
            {
              scale: 1,
              ease: "none",
              transformOrigin: "left bottom",
              scrollTrigger: {
                trigger: item,
                start: "top 100%",
                end: `top ${READ_LINE}`,
                scrub: true,
              },
            },
          );
        });

        return () => items.forEach((item) => item.classList.remove("is-active", "is-past"));
      });
    },
    { scope: root },
  );

  return (
    <section
      id="career"
      ref={root}
      aria-labelledby="career-title"
      className="relative z-10 flow-root bg-night px-5 pb-28 md:px-10 md:pb-44"
    >
      <SectionHeading
        id="career-title"
        index="02"
        label="Career"
        lines={["The", "Ascent"]}
        crossing
      />

      <div data-list className="relative mt-16 md:mt-28">
        <div
          data-head
          aria-hidden="true"
          className="absolute top-0 left-[45.8333%] z-[1] hidden pl-5 cine:block"
        >
          <span data-head-label className="bg-orange px-2 py-1 caption font-medium text-ink">
            {timeline[0]?.year}
          </span>
        </div>

        <ol>
          {timeline.map((milestone, i) => (
            <li
              key={milestone.year}
              data-year={milestone.year}
              className="tl-item relative grid gap-x-10 gap-y-3 py-10 pl-7 lg:grid-cols-12 lg:py-20 lg:pl-0"
            >
              <span
                aria-hidden="true"
                className="tl-dot absolute top-[3.6rem] left-0 size-[9px] -translate-x-1/2 lg:top-[6.6rem] lg:left-[45.8333%]"
              />
              <div className="lg:col-span-5">
                <p className="caption text-ash">
                  {pad(i + 1)} / {pad(timeline.length)}
                </p>
                <span className="tl-year mt-2 block display text-[clamp(4.75rem,15vw,17rem)]">
                  {milestone.year}
                </span>
              </div>
              <div data-reveal="up" className="lg:col-span-5 lg:col-start-7 lg:pt-10">
                <div className="tl-body">
                  <p className="label text-orange">{milestone.phase}</p>
                  <h3 className="mt-3 wide fs-sub">{milestone.title}</h3>
                  <p className="mt-4 max-w-md copy text-ash">{milestone.body}</p>
                  {milestone.stat ? (
                    <p className="mt-8 flex items-baseline gap-3">
                      <span className="display text-4xl md:text-5xl">{milestone.stat.value}</span>
                      <span className="caption text-ash">{milestone.stat.label}</span>
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
