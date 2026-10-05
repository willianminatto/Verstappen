import Image from "next/image";
import type { MediaSlot } from "@/data/media";
import { cn } from "@/lib/cn";
import { ArtPlate } from "./ArtPlate";

type MediaProps = {
  slot: MediaSlot;
  /** Passed to next/image once a real asset is set. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /**
   * Editorial treatment applied to photographs:
   *   `standard` — the shared grade (default)
   *   `light`    — a gentler version, for images that carry a person's face large
   *   `none`     — the file as it is
   */
  grade?: "standard" | "light" | "none";
};

/**
 * Renders a slot from the media manifest: `next/image` when a final asset is
 * set, otherwise the generated art plate. The parent controls the frame size.
 *
 * Photographs from different sources are brought into one look here, with CSS
 * only — the stored files are never edited: a slight pull on saturation and
 * contrast, a cool navy cast, a soft vignette and film grain. Sections add
 * their own gradients on top where text needs them.
 */
export function Media({
  slot,
  sizes = "100vw",
  priority = false,
  className,
  imageClassName,
  grade = "standard",
}: MediaProps) {
  if (slot.src) {
    const graded = grade !== "none";
    const light = grade === "light";

    return (
      <div className={cn("relative overflow-hidden bg-ink", className)}>
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          style={slot.position ? { objectPosition: slot.position } : undefined}
          className={cn(
            "object-cover",
            graded && (light ? "photo-grade-light" : "photo-grade"),
            imageClassName,
          )}
        />
        {graded ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {/* cool cast shared by every photo */}
            <div
              className={cn(
                "absolute inset-0 bg-navy mix-blend-color",
                light ? "opacity-10" : "opacity-20",
              )}
            />
            <div
              className={cn(
                "absolute inset-0 bg-navy mix-blend-soft-light",
                light ? "opacity-30" : "opacity-50",
              )}
            />
            <div
              className={cn("absolute inset-0", light ? "photo-vignette-light" : "photo-vignette")}
            />
            <div className={cn("grain absolute inset-0", light ? "opacity-25!" : "opacity-35!")} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <ArtPlate
      variant={slot.art}
      tone={slot.tone}
      seed={slot.seed}
      label={slot.alt}
      className={className}
    />
  );
}
