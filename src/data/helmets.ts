export type HelmetPattern = "bands" | "split" | "rings" | "checker" | "numeral" | "carbon";

export type HelmetConcept = {
  id: string;
  name: string;
  note: string;
  finish: string;
  pattern: HelmetPattern;
  /** Shell base, primary accent, secondary detail. */
  palette: { base: string; accent: string; detail: string };
  /** Locally stored original image under /public. */
  src: string;
  sourceUrl: string;
};

/** Original Wikimedia Commons helmet images; attribution is also shown on each card. */
export const helmets: HelmetConcept[] = [
  {
    id: "max-2021",
    name: "2021",
    note: "First world title.",
    finish: "2021 season",
    pattern: "bands",
    palette: { base: "#f1eee7", accent: "#ff5a00", detail: "#c9a45c" },
    src: "/images/helmets/max-helmet-2021.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Max_Verstappen_Integralhelm_2021.jpg",
  },
  {
    id: "max-2022",
    name: "2022",
    note: "Back-to-back.",
    finish: "2022 season",
    pattern: "bands",
    palette: { base: "#f1eee7", accent: "#c9a45c", detail: "#ff5a00" },
    src: "/images/helmets/max-helmet-2022.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Max_Verstappen_Integralhelm_2022.jpg",
  },
  {
    id: "max-2023",
    name: "2023",
    note: "Three-time world champion.",
    finish: "2023 season",
    pattern: "bands",
    palette: { base: "#f1eee7", accent: "#ef233c", detail: "#0d1830" },
    src: "/images/helmets/max-helmet-2023.png",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Max_Verstappen_Integralhelm_2023.png",
  },
  {
    id: "max-2024",
    name: "2024",
    note: "Four-time world champion.",
    finish: "2024 season",
    pattern: "bands",
    palette: { base: "#f1eee7", accent: "#3b6cff", detail: "#ef233c" },
    src: "/images/helmets/max-helmet-2024.png",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Max_Verstappen_Integralhelm_2024.png",
  },
];
