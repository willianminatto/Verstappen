import { cn } from "@/lib/cn";

/** SSR and assistive technology always receive the final figure. Numbers animates the visual copy. */
export function Odometer({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-block tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      <span
        data-count={value}
        aria-hidden="true"
        className="inline-block"
        style={{ minWidth: `${String(value).length}ch` }}
      >
        {value}
      </span>
    </span>
  );
}
