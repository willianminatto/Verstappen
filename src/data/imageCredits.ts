import { helmets } from "./helmets";

export type ImageCredit = {
  src: string;
  title: string;
  author: string;
  source: string;
  sourceUrl?: string;
  license: string;
  licenseUrl?: string;
  changes: string;
  pending: boolean;
};

const pending = "source/license pending confirmation";
const photoChanges =
  "Original file preserved. Responsive CSS crop (object-fit: cover), container overlays and parallax, plus a CSS-only editorial grade applied at display time (slightly reduced saturation, added contrast, navy colour cast, soft vignette, film grain). No watermark or credit has been removed and the stored original is not retouched. Next.js generates resized/compressed delivery variants.";

/** Evidence-based image inventory. An existing local file does not establish permission to publish. */
export const imageCredits: ImageCredit[] = [
  ...[
    {
      src: "/images/hero/max-hero.jpg",
      title: "Hero — Max Verstappen",
      source: "Local file supplied for this project; original source unconfirmed.",
    },
    {
      src: "/images/driver/max-driver.jpg",
      title: "The Driver — portrait",
      source: "Local file supplied for this project; original source unconfirmed.",
    },
    {
      src: "/images/beyond/max-sim-racing.jpg",
      title: "Beyond Formula 1 — sim racing",
      source: "Local file supplied for this project; original source unconfirmed.",
    },
    {
      src: "/images/on-track/on-track-intro.jpg",
      title: "On Track — opening visual",
      source: "Local file supplied for this project; original source unconfirmed.",
    },
    {
      src: "/images/on-track/barcelona2016.jpg",
      title: "On Track — Barcelona 2016",
      source: "Local file supplied for this project; original source unconfirmed.",
    },
    {
      src: "/images/on-track/zandvoort2021.jpg",
      title: "On Track — Zandvoort 2021",
      source: "Local file supplied for this project; original source unconfirmed.",
    },
    {
      src: "/images/on-track/spa-francorchamps-2022.jpg",
      title: "On Track — Spa-Francorchamps 2022",
      source:
        "Replacement file supplied locally on 5 October 2026 (1200 × 800 JPEG, no visible credit or watermark). It replaces an earlier image that carried a Verstappen.com / Red Bull Content Pool mark. Original source, photographer and license of the replacement are still unconfirmed; replace or clear before publication.",
    },
    {
      src: "/images/on-track/interlagos2024.jpg",
      title: "On Track — Interlagos 2024",
      source: "Local file supplied for this project; original source unconfirmed.",
    },
  ].map((photo) => ({
    ...photo,
    author: "Photographer pending confirmation",
    license: pending,
    changes:
      photoChanges +
      (photo.src.includes("/hero/")
        ? " The Hero fills the viewport with a proportional cover crop and breakpoint-specific object-position; no edge mask."
        : ""),
    pending: true,
  })),
  ...helmets.map((helmet) => ({
    src: helmet.src,
    title: `Championship helmet — ${helmet.name}`,
    author: "Auge=mit",
    source: "Wikimedia Commons",
    sourceUrl: helmet.sourceUrl,
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    changes:
      "Original 2500 × 2300 file preserved intact. No crop, retouching or background removal. CSS contain, padding and multiply blend over a neutral backdrop; container tilt and shadow. Next.js generates resized/compressed delivery variants, which retain CC BY-SA 4.0.",
    pending: false,
  })),
];
