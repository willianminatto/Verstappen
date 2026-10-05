import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MaskProps = {
  children: ReactNode;
  /** Seconds, staggers stacked lines. */
  delay?: number;
  className?: string;
};

/** One line of text that rises from behind a mask when it scrolls into view. */
export function Mask({ children, delay = 0, className }: MaskProps) {
  return (
    <span
      data-reveal="mask"
      data-delay={delay}
      className={cn("block overflow-hidden pt-[0.04em] pb-[0.06em]", className)}
    >
      <span className="block">{children}</span>
    </span>
  );
}
