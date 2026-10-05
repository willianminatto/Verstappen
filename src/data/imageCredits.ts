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
  "Original file preserved. Responsive CSS crop (object-fit: cover), container overlays and parallax; Next.js generates resized/compressed delivery variants. No retouching of the original.";

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
      src: "/images/on-track/spafrancorchamps2022.jpg",
      title: "On Track — Spa-Francorchamps 2022",
      source:
        "Visible copyright mark: Verstappen.com, Red Bull Content Pool. Original URL, photographer and permission remain unconfirmed.",
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
