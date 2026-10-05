import { cn } from "@/lib/cn";
import { Mask } from "./Mask";

type SectionLabelProps = {
  index: string;
  label: string;
  className?: string;
};

export function SectionLabel({ index, label, className }: SectionLabelProps) {
  return (
    <p className={cn("flex items-center gap-3 label text-ash", className)}>
      <span className="text-orange">{index}</span>
      <span className="size-1 bg-current" aria-hidden="true" />
      <span>{label}</span>
    </p>
  );
}

type SectionHeadingProps = {
  index: string;
  label: string;
  /** Each entry is one masked line of the title. */
  lines: string[];
  id?: string;
  className?: string;
  titleClassName?: string;
  /**
   * Pulls the title up so its first line straddles the top edge of the
   * section, bridging it with the previous one. The parent section must be
   * `flow-root` and the previous section needs bottom padding to receive it.
   */
  crossing?: boolean;
};

export function SectionHeading({
  index,
  label,
  lines,
  id,
  className,
  titleClassName = "fs-mega",
  crossing = false,
}: SectionHeadingProps) {
  const title = (
    <h2 id={id} className={cn("display", crossing ? "-mt-[0.44em]" : "mt-6", titleClassName)}>
      {lines.map((line, i) => (
        <Mask key={line} delay={i * 0.08}>
          {line}
        </Mask>
      ))}
    </h2>
  );

  return (
    <header className={cn(crossing && "relative z-[2]", className)}>
      {crossing ? title : <SectionLabel index={index} label={label} />}
      {crossing ? <SectionLabel index={index} label={label} className="mt-6" /> : title}
    </header>
  );
}
