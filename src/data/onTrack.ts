import type { MediaKey } from "./media";

export type Drive = {
  race: string;
  year: string;
  circuit: string;
  /** Approximate circuit location, shown as a frame caption. */
  coordinates: string;
  /** Oversized figure shown next to the visual. Multiple parts are joined by an arrow. */
  figure: string[];
  figureLabel: string;
  body: string;
  details: { label: string; value: string }[];
  media: MediaKey;
};

export const drives: Drive[] = [
  {
    race: "Spanish Grand Prix",
    year: "2016",
    circuit: "Barcelona-Catalunya",
    coordinates: "41.57° N / 2.26° E",
    figure: ["P1"],
    figureLabel: "First race for Red Bull Racing",
    body: "A new team, a new car, and a first Grand Prix victory inside one weekend.",
    details: [
      { label: "Grid", value: "P4" },
      { label: "Age", value: "18y 228d" },
      { label: "Record", value: "Youngest winner" },
    ],
    media: "onTrackSpain",
  },
  {
    race: "Dutch Grand Prix",
    year: "2021",
    circuit: "Zandvoort",
    coordinates: "52.39° N / 4.54° E",
    figure: ["P1"],
    figureLabel: "Pole to flag at home",
    body: "The race returns to the dunes after 36 years, in front of a wall of orange. Pole position, then the win.",
    details: [
      { label: "Grid", value: "P1" },
      { label: "Crowd", value: "Home race" },
      { label: "Conditions", value: "Dry" },
    ],
    media: "onTrackZandvoort",
  },
  {
    race: "Belgian Grand Prix",
    year: "2022",
    circuit: "Spa-Francorchamps",
    coordinates: "50.44° N / 5.97° E",
    figure: ["P14", "P1"],
    figureLabel: "Through the field",
    body: "Grid penalties put him in the middle of the pack. He was leading before half distance.",
    details: [
      { label: "Grid", value: "P14" },
      { label: "Finish", value: "P1" },
      { label: "Conditions", value: "Dry" },
    ],
    media: "onTrackSpa",
  },
  {
    race: "São Paulo Grand Prix",
    year: "2024",
    circuit: "Interlagos",
    coordinates: "23.70° S / 46.70° W",
    figure: ["P17", "P1"],
    figureLabel: "Sixteen places in the rain",
    body: "From the back half of the grid to the top step in treacherous wet conditions.",
    details: [
      { label: "Grid", value: "P17" },
      { label: "Finish", value: "P1" },
      { label: "Conditions", value: "Wet" },
    ],
    media: "onTrackInterlagos",
  },
];
