/**
 * Central media manifest.
 *
 * Every visual slot on the site is declared here. While `src` is undefined the
 * slot renders a programmatic art plate (`art` + `tone` + `seed`). To swap in a
 * final asset, drop the file in `/public/media` and set `src` — the slot will
 * render through `next/image` with the same framing. Only use images you have
 * the rights to.
 */

export type ArtVariant = "streaks" | "circuit" | "grid" | "apex" | "rain" | "dunes" | "halo";
export type ArtTone = "orange" | "blue" | "bone";

export type MediaSlot = {
  /** Path under /public (e.g. "/media/hero.jpg"). Leave undefined to use the art plate. */
  src?: string;
  alt: string;
  art: ArtVariant;
  tone: ArtTone;
  seed: number;
};

export const media = {
  hero: {
    alt: "Abstract speed streaks in orange over deep blue",
    art: "streaks",
    tone: "orange",
    seed: 7,
  },
  driver: {
    alt: "Abstract concentric light rings on a dark background",
    art: "halo",
    tone: "orange",
    seed: 3,
  },
  onTrackLead: {
    alt: "Abstract kerb sweeping through a corner under blue light",
    art: "apex",
    tone: "blue",
    seed: 31,
  },
  onTrackSpain: {
    alt: "Abstract kerb and apex composition",
    art: "apex",
    tone: "orange",
    seed: 16,
  },
  onTrackZandvoort: {
    alt: "Abstract layered dunes under a low orange sun",
    art: "dunes",
    tone: "orange",
    seed: 21,
  },
  onTrackSpa: {
    alt: "Abstract circuit line with sector markers",
    art: "circuit",
    tone: "bone",
    seed: 22,
  },
  onTrackInterlagos: {
    alt: "Abstract diagonal rain in blue light",
    art: "rain",
    tone: "blue",
    seed: 24,
  },
  beyond: {
    alt: "Abstract technical grid with crosshair markers",
    art: "grid",
    tone: "blue",
    seed: 11,
  },
} satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
