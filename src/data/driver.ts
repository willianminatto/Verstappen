export type RacingNumber = {
  value: string;
  /** Seasons the number was raced with. */
  era: string;
  context: string;
  current?: boolean;
};

/**
 * Racing numbers, oldest first. Exactly one entry is `current` — it drives the
 * hero numeral. The others are shown only as history.
 */
export const racingNumbers: RacingNumber[] = [
  { value: "33", era: "2015–21", context: "First number" },
  { value: "1", era: "2022–25", context: "World Champion" },
  { value: "3", era: "2026–", context: "Current", current: true },
];

export const currentNumber =
  racingNumbers.find((number) => number.current) ?? racingNumbers[racingNumbers.length - 1];

export type DriverFact = {
  label: string;
  value: string;
  note?: string;
  /** Renders the racing-number history under the value. */
  showNumberHistory?: boolean;
};

const facts: DriverFact[] = [
  { label: "Name", value: "Max Emilian Verstappen" },
  { label: "Nationality", value: "Dutch" },
  { label: "Born", value: "30 September 1997", note: "Hasselt, Belgium" },
  { label: "Racing number", value: currentNumber?.value ?? "", showNumberHistory: true },
  { label: "Category", value: "Formula 1", note: "Since 2015" },
  // EDITABLE: contextual only — verify the current season entry.
  { label: "Team", value: "Red Bull Racing", note: "Since 2016" },
];

export const driver = {
  /** Editorial copy written for this concept — not a quotation. */
  statement: "A driver defined by precision, raw pace and an absolute refusal to lift.",
  coordinates: "50.9307° N / 5.3325° E",
  birthplace: "Hasselt, BE",
  facts,
} as const;
