/**
 * Central media manifest.
 *
 * Every visual slot on the site is declared here. While `src` is undefined the
 * slot renders a programmatic art plate (`art` + `tone` + `seed`). To swap in a
 * final asset, drop the file in `/public/images` and set `src` — the slot will
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
    src: "/images/hero/max-hero.jpg",
    alt: "Max Verstappen celebrating on his Red Bull Racing car",
    art: "streaks",
    tone: "orange",
    seed: 7,
  },
  driver: {
    src: "/images/driver/max-driver.jpg",
    alt: "Max Verstappen smiling and raising four fingers, with his face, torso and hand visible",
    art: "halo",
    tone: "orange",
    seed: 3,
  },
  onTrackLead: {
    src: "/images/on-track/on-track-intro.jpg",
    alt: "A Red Bull Racing car and a Mercedes racing side by side on track",
    art: "apex",
    tone: "blue",
    seed: 31,
  },
  onTrackSpain: {
    src: "/images/on-track/barcelona2016.jpg",
    alt: "Max Verstappen driving a Red Bull Racing car at Barcelona-Catalunya",
    art: "apex",
    tone: "orange",
    seed: 16,
  },
  onTrackZandvoort: {
    src: "/images/on-track/zandvoort2021.jpg",
    alt: "Max Verstappen racing at Zandvoort in front of orange-clad spectators",
    art: "dunes",
    tone: "orange",
    seed: 21,
  },
  onTrackSpa: {
    src: "/images/on-track/spafrancorchamps2022.jpg",
    alt: "Max Verstappen driving at Spa-Francorchamps",
    art: "circuit",
    tone: "bone",
    seed: 22,
  },
  onTrackInterlagos: {
    src: "/images/on-track/interlagos2024.jpg",
    alt: "Max Verstappen racing in wet conditions at Interlagos",
    art: "rain",
    tone: "blue",
    seed: 24,
  },
  beyond: {
    src: "/images/beyond/max-sim-racing.jpg",
    alt: "Max Verstappen at a racing simulator, holding the steering wheel in front of multiple monitors",
    art: "grid",
    tone: "blue",
    seed: 11,
  },
} satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
