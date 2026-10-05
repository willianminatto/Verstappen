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
};

/**
 * Renders a slot from the media manifest: `next/image` when a final asset is
 * set, otherwise the generated art plate. The parent controls the frame size.
 */
export function Media({ slot, sizes = "100vw", priority = false, className }: MediaProps) {
  if (slot.src) {
    return (
      <div className={cn("relative overflow-hidden bg-ink", className)}>
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
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
