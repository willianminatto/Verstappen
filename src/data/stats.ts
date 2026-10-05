/**
 * Career statistics — single source of truth.
 *
 * These figures move after every race weekend. Update `value` here and
 * `statsMeta.asOf` together, checking against `statsMeta.source`.
 */

export type Stat = {
  key: string;
  label: string;
  value: number;
  detail?: string;
};

export const statsMeta = {
  source: "Formula1.com",
  asOf: "October 2026",
} as const;

export const headlineStat: Stat = {
  key: "championships",
  label: "World Championships",
  value: 4,
  detail: "2021 · 2022 · 2023 · 2024",
};

export const stats: Stat[] = [
  { key: "wins", label: "Race wins", value: 72 },
  { key: "podiums", label: "Podiums", value: 135 },
  { key: "poles", label: "Pole positions", value: 49 },
  { key: "entries", label: "Grands Prix entered", value: 249 },
];
