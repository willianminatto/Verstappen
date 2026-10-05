import { Fragment } from "react";
import type { RacingNumber } from "@/data/driver";
import { cn } from "@/lib/cn";

type NumberLineageProps = {
  numbers: RacingNumber[];
  /**
   * `inline`  — one compact line of labels (hero bar)
   * `display` — oversized numerals with their seasons (The Driver)
   */
  variant?: "inline" | "display";
  className?: string;
};

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 10" fill="none" aria-hidden="true" className={className}>
      <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Racing-number history as an editorial line. Past numbers are muted or
 * outlined and only the current one carries the accent, so it never reads as
 * more than one "current" number.
 */
export function NumberLineage({ numbers, variant = "inline", className }: NumberLineageProps) {
  const spoken = numbers
    .map((number) =>
      number.current
        ? `${number.value}, current number, ${number.era.replace("–", " onwards")}`
        : `${number.value}, ${number.context}, ${number.era.replace("–", " to 20")}`,
    )
    .join("; ");

  if (variant === "display") {
    return (
      <div className={className}>
        <p className="sr-only">Racing numbers: {spoken}.</p>
        <ol aria-hidden="true" className="flex items-end gap-x-[clamp(0.75rem,2.4vw,2.5rem)]">
          {numbers.map((number, i) => (
            <Fragment key={number.value}>
              {i > 0 ? (
                <li className="pb-[clamp(2.6rem,5.2vw,5.4rem)] text-ash">
                  <Arrow className="h-2.5 w-[clamp(1rem,2.6vw,2.75rem)]" />
                </li>
              ) : null}
              <li data-reveal="up" data-delay={i * 0.1}>
                <span
                  className={cn(
                    "block display leading-[0.8]",
                    number.current
                      ? "text-[clamp(5.5rem,13vw,14rem)] text-orange"
                      : "text-[clamp(3.25rem,7.4vw,8rem)] text-outline",
                  )}
                >
                  {number.value}
                </span>
                <span
                  className={cn("mt-3 block caption", number.current ? "text-orange" : "text-ash")}
                >
                  {number.era}
                  <br />
                  {number.context}
                </span>
              </li>
            </Fragment>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <p className={cn("label", className)}>
      <span className="sr-only">Racing numbers: {spoken}.</span>
      <span aria-hidden="true" className="flex items-center gap-x-2.5">
        {numbers.map((number, i) => (
          <Fragment key={number.value}>
            {i > 0 ? <Arrow className="h-2 w-4 shrink-0 text-ash" /> : null}
            <span className={cn("tabular-nums", number.current ? "text-orange" : "text-ash")}>
              {number.value}
            </span>
          </Fragment>
        ))}
      </span>
    </p>
  );
}
