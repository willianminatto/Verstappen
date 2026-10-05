import { cn } from "@/lib/cn";

/**
 * A masked line split into characters for staggered entrances. Decorative:
 * pair it with a visually hidden copy of the full text.
 */
export function Chars({ text, className }: { text: string; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("block overflow-hidden pt-[0.04em]", className)}>
      {Array.from(text).map((char, i) => (
        <span key={i} data-char className="inline-block">
          {char}
        </span>
      ))}
    </span>
  );
}
