export type HelmetPattern = "bands" | "split" | "rings" | "checker" | "numeral" | "carbon";

export type HelmetConcept = {
  id: string;
  name: string;
  note: string;
  finish: string;
  pattern: HelmetPattern;
  /** Shell base, primary accent, secondary detail. */
  palette: { base: string; accent: string; detail: string };
  /** Optional final image under /public — replaces the drawn concept when set. */
  src?: string;
};

/**
 * Abstract design studies created for this concept. They are NOT reproductions
 * of official helmet designs. Replace with licensed imagery via `src` later.
 */
export const helmets: HelmetConcept[] = [
  {
    id: "oranje",
    name: "Oranje",
    note: "Home colours, turned all the way up.",
    finish: "Gloss",
    pattern: "bands",
    palette: { base: "#ff5a00", accent: "#f1eee7", detail: "#0d1830" },
  },
  {
    id: "night-race",
    name: "Night Race",
    note: "Deep blue shell built for floodlights.",
    finish: "Satin",
    pattern: "split",
    palette: { base: "#0d1830", accent: "#ff5a00", detail: "#3b6cff" },
  },
  {
    id: "white-out",
    name: "White Out",
    note: "A clean base with a single racing line.",
    finish: "Matte",
    pattern: "rings",
    palette: { base: "#f1eee7", accent: "#ff5a00", detail: "#0d1830" },
  },
  {
    id: "grid",
    name: "Grid Slot",
    note: "Start-line geometry wrapped around the shell.",
    finish: "Gloss",
    pattern: "checker",
    palette: { base: "#111317", accent: "#f1eee7", detail: "#ff5a00" },
  },
  {
    id: "number-one",
    name: "Number One",
    note: "The champion's numeral of 2022–25 as the whole design.",
    finish: "Chrome flake",
    pattern: "numeral",
    palette: { base: "#c9a45c", accent: "#050608", detail: "#f1eee7" },
  },
  {
    id: "raw",
    name: "Raw",
    note: "Exposed weave, nothing else.",
    finish: "Bare carbon",
    pattern: "carbon",
    palette: { base: "#15171c", accent: "#2b2f38", detail: "#ff5a00" },
  },
];
