import { Fragment } from "react";
import { Mask } from "@/components/ui/Mask";
import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { media } from "@/data/media";
import { drives } from "@/data/onTrack";
import { cn } from "@/lib/cn";

const pad = (value: number) => String(value).padStart(2, "0");

function Arrow() {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      aria-hidden="true"
      className="mx-[0.08em] inline-block h-[0.32em] w-auto align-middle text-orange"
    >
      <path d="M0 12h36M26 2l10 10-10 10" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

/**
 * Editorial spreads. Every visual sits in a frame with its own captions and
 * brackets, so swapping a generated plate for a photograph (via
 * `data/media.ts`) keeps the composition intact. Type deliberately crosses
 * the frame edges and drifts at its own speed for depth.
 */
export function OnTrack() {
  const total = pad(drives.length);

  return (
    <section
      id="on-track"
      aria-labelledby="on-track-title"
      className="relative z-10 flow-root bg-night pb-16 lg:pb-44"
    >
      {/* Lead frame: opens to full bleed as the section arrives. */}
      <div data-expand className="relative h-[42svh] min-h-[18rem] overflow-hidden lg:h-[88svh]">
        <div data-parallax className="absolute inset-0">
          <Media slot={media.onTrackLead} className="size-full" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-night"
        />
        <span className="brackets text-bone/60" aria-hidden="true" />
        <p className="absolute top-8 left-8 caption md:top-10 md:left-12">
          Frame 00
          <br />
          <span className="text-bone/60">On track</span>
        </p>
        <p className="absolute top-8 right-8 text-right caption md:top-10 md:right-12">
          {total} drives
          <br />
          <span className="text-bone/60">
            {drives[0]?.year} / {drives[drives.length - 1]?.year}
          </span>
        </p>
      </div>

      <div className="px-5 md:px-10">
        <SectionHeading
          id="on-track-title"
          index="04"
          label="On Track"
          lines={["Drives that", "Defined"]}
          crossing
        />

        <div className="mt-16 space-y-20 lg:mt-44 lg:space-y-64">
          {drives.map((drive, i) => {
            const flip = i % 2 === 1;

            return (
              <article
                key={`${drive.race}-${drive.year}`}
                className="relative grid items-end gap-y-8 lg:grid-cols-12 lg:gap-x-10"
              >
                {/* Year, oversized, breaking the top edge of the frame */}
                <p
                  data-drift="18"
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -top-[0.52em] z-[2] display text-[clamp(5.5rem,17vw,20rem)] leading-[0.8] text-outline [--outline:var(--color-bone)]",
                    flip ? "right-0 lg:right-[3%]" : "left-0 lg:left-[3%]",
                  )}
                >
                  {drive.year}
                </p>

                <div
                  className={cn(
                    "relative lg:col-span-8 lg:row-start-1",
                    flip ? "lg:col-start-5" : "lg:col-start-1",
                  )}
                >
                  <div
                    data-reveal="clip"
                    data-parallax
                    className="aspect-[16/9] overflow-hidden lg:aspect-[16/10]"
                  >
                    <Media
                      slot={media[drive.media]}
                      sizes="(min-width: 1024px) 66vw, calc(100vw - 2.5rem)"
                      className="size-full"
                      imageClassName="object-center"
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-0 hidden lg:block",
                      flip
                        ? "bg-gradient-to-r from-night/90 via-transparent to-transparent"
                        : "bg-gradient-to-l from-night/90 via-transparent to-transparent",
                    )}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 to-transparent"
                  />
                  <span className="brackets text-bone/60" aria-hidden="true" />
                  <p className="absolute bottom-6 left-6 caption md:bottom-8 md:left-8">
                    {pad(i + 1)} / {total}
                    <br />
                    <span className="text-bone/60">{drive.circuit}</span>
                  </p>
                  <p className="absolute right-6 bottom-6 text-right caption md:right-8 md:bottom-8">
                    {drive.coordinates}
                  </p>
                </div>

                <div
                  className={cn(
                    "relative z-[3] lg:col-span-5 lg:row-start-1 lg:pb-14",
                    flip ? "lg:col-start-1" : "lg:col-start-8",
                  )}
                >
                  <p className="label text-orange">
                    {drive.year} · {drive.circuit}
                  </p>
                  <h3 className="mt-4 display fs-title">
                    <Mask>{drive.race}</Mask>
                  </h3>

                  <p
                    data-reveal="up"
                    className="mt-6 display fs-figure whitespace-nowrap text-bone md:mt-8"
                  >
                    {drive.figure.map((part, j) => (
                      <Fragment key={part}>
                        {j > 0 ? <Arrow /> : null}
                        {part}
                      </Fragment>
                    ))}
                  </p>
                  <p className="mt-3 label">{drive.figureLabel}</p>

                  <p className="mt-6 max-w-sm copy text-ash">{drive.body}</p>

                  <dl data-reveal="up" className="mt-6 grid max-w-md grid-cols-3 gap-4 lg:mt-10">
                    {drive.details.map((detail) => (
                      <div key={detail.label}>
                        <dt className="caption text-ash">{detail.label}</dt>
                        <dd className="mt-1 wide text-[0.8125rem] md:text-[0.9375rem]">
                          {detail.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
