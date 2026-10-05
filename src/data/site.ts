export const site = {
  name: "Max Verstappen — Fan Concept",
  title: "MAX VERSTAPPEN — Unofficial Fan Concept",
  description:
    "An unofficial, fan-made concept website dedicated to Max Verstappen. Not affiliated with Max Verstappen, Red Bull Racing or Formula 1.",
  disclaimer:
    "Unofficial fan-made concept. Not affiliated with Max Verstappen, Red Bull Racing or Formula 1.",
  closingLine: ["Simply", "Lovely."],
} as const;

export type SectionLink = { id: string; index: string; label: string };

/** Order here drives the header indicator and the fullscreen menu. */
export const sections: SectionLink[] = [
  { id: "top", index: "00", label: "Start" },
  { id: "driver", index: "01", label: "The Driver" },
  { id: "career", index: "02", label: "Career" },
  { id: "numbers", index: "03", label: "Numbers" },
  { id: "on-track", index: "04", label: "On Track" },
  { id: "helmets", index: "05", label: "Helmets" },
  { id: "beyond", index: "06", label: "Beyond F1" },
  { id: "legacy", index: "07", label: "Legacy" },
  { id: "finale", index: "08", label: "Chequered Flag" },
];

/** The closing block (footer). Kept in `sections` so the indicator ends on it. */
export const finaleSection = sections[sections.length - 1];
