import { RACE_WINDOW_MS } from "./config";
import type {
  ChampionshipStanding,
  JolpicaDriverStanding,
  JolpicaRace,
  JolpicaResult,
  JolpicaStandingsList,
  RaceEvent,
  RaceResult,
} from "./types";

/* ── Defensive readers: the payload is `unknown` until proven otherwise ───── */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function at(value: unknown, ...path: string[]): unknown {
  let current = value;
  for (const key of path) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** Jolpica sends numbers as strings ("188", "1"). Rejects anything non-finite. */
function int(value: unknown): number | null {
  const raw = typeof value === "number" ? String(value) : text(value);
  if (raw === null || !/^-?\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function decimal(value: unknown): number | null {
  const raw = typeof value === "number" ? String(value) : text(value);
  if (raw === null || !/^-?\d+(\.\d+)?$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^(\d{2}:\d{2}(?::\d{2})?)(?:Z|\+00:00)?$/;

/** Builds a UTC instant from the API's separate `date` and optional `time`. */
function startOf(date: unknown, time: unknown): { startsAt: string; hasTime: boolean } | null {
  const day = text(date);
  if (day === null || !DATE.test(day)) return null;

  const clock = text(time)?.match(TIME)?.[1];
  const normalised = clock ? (clock.length === 5 ? `${clock}:00` : clock) : "00:00:00";
  const instant = new Date(`${day}T${normalised}Z`);
  if (Number.isNaN(instant.getTime())) return null;

  return { startsAt: instant.toISOString(), hasTime: Boolean(clock) };
}

/* ── Calendar ─────────────────────────────────────────────────────────────── */

function toRaceEvent(input: unknown): RaceEvent | null {
  if (!isRecord(input)) return null;
  const race = input as JolpicaRace;

  const season = int(race.season);
  const round = int(race.round);
  const name = text(race.raceName);
  const start = startOf(race.date, race.time);
  if (season === null || round === null || name === null || start === null) return null;

  return {
    season,
    round,
    name,
    circuit: text(at(input, "Circuit", "circuitName")),
    locality: text(at(input, "Circuit", "Location", "locality")),
    country: text(at(input, "Circuit", "Location", "country")),
    ...start,
  };
}

/** Race calendar of a season, in round order. Malformed entries are dropped. */
export function parseSchedule(payload: unknown): RaceEvent[] {
  return list(at(payload, "MRData", "RaceTable", "Races"))
    .map(toRaceEvent)
    .filter((race): race is RaceEvent => race !== null)
    .sort((a, b) => a.round - b.round);
}

/**
 * First race that has not been run yet. A race stays "next" until a few hours
 * after its start, so it does not vanish during the Grand Prix itself; when
 * only the date is known it stays for that whole UTC day.
 */
export function selectNextRace(races: RaceEvent[], now: Date): RaceEvent | null {
  const time = now.getTime();
  const upcoming = races
    .filter((race) => {
      const start = Date.parse(race.startsAt);
      const window = race.hasTime ? RACE_WINDOW_MS : 24 * 60 * 60 * 1000;
      return start + window > time;
    })
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));

  return upcoming[0] ?? null;
}

/* ── Results ──────────────────────────────────────────────────────────────── */

const OUTCOMES: Record<string, string> = {
  R: "DNF",
  D: "DSQ",
  E: "EXC",
  W: "WD",
  F: "DNQ",
  N: "NC",
};

function toRaceResult(input: unknown): RaceResult | null {
  if (!isRecord(input)) return null;
  const race = input as JolpicaRace;

  const season = int(race.season);
  const round = int(race.round);
  const name = text(race.raceName);
  const date = text(race.date);
  const result = list(race.Results)[0] as JolpicaResult | undefined;
  if (season === null || round === null || name === null || date === null || !DATE.test(date)) {
    return null;
  }
  if (!isRecord(result)) return null;

  // `positionText` is numeric only for classified finishers ("R", "D"… otherwise).
  const positionText = text(result.positionText);
  const classified = positionText !== null && /^\d+$/.test(positionText);
  const position = classified ? int(positionText) : null;
  const grid = int(result.grid);

  let outcome: string;
  if (position !== null) outcome = `P${position}`;
  else if (positionText !== null) outcome = OUTCOMES[positionText.toUpperCase()] ?? "NC";
  else return null;

  return {
    season,
    round,
    name,
    date,
    position,
    outcome,
    grid: grid !== null && grid > 0 ? grid : null,
  };
}

/** A driver's race results for a season, in round order. */
export function parseDriverResults(payload: unknown): RaceResult[] {
  return list(at(payload, "MRData", "RaceTable", "Races"))
    .map(toRaceResult)
    .filter((result): result is RaceResult => result !== null)
    .sort((a, b) => a.round - b.round);
}

/** Most recent result: highest season, then highest round. */
export function selectLastResult(results: RaceResult[]): RaceResult | null {
  return [...results].sort((a, b) => b.season - a.season || b.round - a.round)[0] ?? null;
}

/* ── Championship ─────────────────────────────────────────────────────────── */

/** The driver's row in the latest standings, or null when there is none yet. */
export function parseDriverStanding(
  payload: unknown,
  driverId: string,
): ChampionshipStanding | null {
  const lists = list(at(payload, "MRData", "StandingsTable", "StandingsLists"));
  const latest = lists[lists.length - 1] as JolpicaStandingsList | undefined;
  if (!isRecord(latest)) return null;

  const rows = list(latest.DriverStandings) as JolpicaDriverStanding[];
  const row =
    rows.find((entry) => isRecord(entry) && at(entry, "Driver", "driverId") === driverId) ??
    // The endpoint is already filtered by driver; accept a lone row without an id.
    (rows.length === 1 && isRecord(rows[0]) && at(rows[0], "Driver", "driverId") === undefined
      ? rows[0]
      : undefined);
  if (!isRecord(row)) return null;

  const season = int(latest.season);
  const points = decimal(row.points);
  if (season === null || points === null) return null;

  return {
    season,
    round: int(latest.round),
    position: int(row.position),
    points,
    wins: int(row.wins),
  };
}
