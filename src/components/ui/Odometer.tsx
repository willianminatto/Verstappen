import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * A number drawn as rolling digit columns. Each column rests on its digit via
 * CSS (`--d`), so it is correct without JavaScript; sections animate the
 * `[data-odo-col]` elements from 0 to that resting position.
 */
export function Odometer({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-block tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="flex h-[1lh] items-start overflow-hidden">
        {Array.from(String(value)).map((digit, i) => (
          <span
            key={i}
            data-odo-col
            data-digit={digit}
            style={{ "--d": Number(digit) } as CSSProperties}
            className="odo-col flex flex-col"
          >
            {DIGITS.map((n) => (
              <span key={n} className="block h-[1lh] shrink-0">
                {n}
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}
