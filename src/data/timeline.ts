export type Milestone = {
  year: string;
  phase: string;
  title: string;
  body: string;
  stat?: { value: string; label: string };
};

/** Career milestones, oldest first. Keep it short: only the defining moments. */
export const timeline: Milestone[] = [
  {
    year: "2013",
    phase: "Karting",
    title: "World karting champion",
    body: "Years on Dutch and Belgian kart tracks end at the very top: the KZ world title and two European championships in a single season.",
    stat: { value: "KZ", label: "World title" },
  },
  {
    year: "2014",
    phase: "Formula 3",
    title: "One season in single-seaters",
    body: "Straight from karts into the FIA Formula 3 European Championship with Van Amersfoort Racing. Third overall.",
    stat: { value: "10", label: "Race wins" },
  },
  {
    year: "2015",
    phase: "Formula 1 debut · Toro Rosso",
    title: "The youngest starter",
    body: "Melbourne, Australian Grand Prix. On the grid with Scuderia Toro Rosso as the youngest driver ever to start a Formula 1 race.",
    stat: { value: "17y 166d", label: "Age on debut" },
  },
  {
    year: "2016",
    phase: "Red Bull Racing · First victory",
    title: "Promoted, then first",
    body: "Called up to Red Bull Racing ahead of the Spanish Grand Prix — and wins it at the first attempt, the youngest winner the sport has seen.",
    stat: { value: "18y 228d", label: "Age at first win" },
  },
  {
    year: "2021",
    phase: "First championship",
    title: "World Champion",
    body: "A season-long duel settled on the final lap of the final race in Abu Dhabi.",
    stat: { value: "10", label: "Wins that season" },
  },
  {
    year: "2022",
    phase: "Second title",
    title: "Back to back",
    body: "A new regulation era, the same answer. The title is sealed at Suzuka with races to spare.",
    stat: { value: "15", label: "Wins that season" },
  },
  {
    year: "2023",
    phase: "Third title",
    title: "The dominant year",
    body: "Nineteen wins from twenty-two races, ten of them in a row. One of the most complete seasons in the history of the sport.",
    stat: { value: "19 / 22", label: "Races won" },
  },
  {
    year: "2024",
    phase: "Fourth title",
    title: "Four in a row",
    body: "A harder fight against a closing field, decided under the lights of Las Vegas.",
    stat: { value: "4×", label: "World Champion" },
  },
];
