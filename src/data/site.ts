export const site = {
  name: "Max Verstappen — Fan Concept",
  title: "Unofficial Max Verstappen fan experience by Willian Minatto",
  description:
    "Fan-made by Willian Minatto, a Max Verstappen fan in Brazil. An unofficial portfolio and educational project.",
  disclaimer: "Unofficial fan project created for portfolio and educational purposes.",
  affiliation:
    "Not affiliated with, endorsed by, or sponsored by Max Verstappen, Verstappen.com, Red Bull Racing, Formula 1 or the FIA.",
  rights:
    "Names, likenesses, logos and trademarks associated with Max Verstappen, Red Bull Racing, Formula 1 / F1 and the FIA belong to their respective rights holders. Photographs belong to their respective authors or licensors. Original website code and design are by Willian Minatto.",
  copyright: "© 2026 Willian Minatto · Original website design and development.",
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
  { id: "helmets", index: "05", label: "Championship Helmets" },
  { id: "beyond", index: "06", label: "Beyond F1" },
  { id: "legacy", index: "07", label: "Legacy" },
  { id: "finale", index: "08", label: "Chequered Flag" },
];

/** The closing block (footer). Kept in `sections` so the indicator ends on it. */
export const finaleSection = sections[sections.length - 1];
