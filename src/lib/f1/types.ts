/* ── External: only the parts of Jolpica's responses this project reads ───── */

export type JolpicaRace = {
  season?: string;
  round?: string;
  raceName?: string;
  date?: string;
  time?: string;
  Circuit?: {
    circuitName?: string;
    Location?: { locality?: string; country?: string };
  };
  Results?: JolpicaResult[];
};

export type JolpicaResult = {
  position?: string;
  positionText?: string;
  grid?: string;
  status?: string;
  points?: string;
};

export type JolpicaDriverStanding = {
  position?: string;
  positionText?: string;
  points?: string;
  wins?: string;
  Driver?: { driverId?: string };
};

export type JolpicaStandingsList = {
  season?: string;
  round?: string;
  DriverStandings?: JolpicaDriverStanding[];
};

/* ── Internal: what the UI works with ─────────────────────────────────────── */

export type RaceEvent = {
  season: number;
  round: number;
  name: string;
  circuit: string | null;
  locality: string | null;
  country: string | null;
  /** ISO 8601, UTC. Midnight when the API gave no start time. */
  startsAt: string;
  /** False when only the date is known. */
  hasTime: boolean;
};

export type RaceResult = {
  season: number;
  round: number;
  name: string;
  /** ISO date (YYYY-MM-DD) of the race. */
  date: string;
  /** Classified finishing position, or null when not classified. */
  position: number | null;
  /** Short outcome for display: "P1", "DNF", "DSQ"… */
  outcome: string;
  /** Starting grid slot; null for a pit-lane start or when unknown. */
  grid: number | null;
};

export type ChampionshipStanding = {
  season: number;
  /** Round the standing was computed after. */
  round: number | null;
  position: number | null;
  points: number;
  wins: number | null;
};

export type SeasonStatus = {
  /** Season the data belongs to, taken from the API — never hard-coded. */
  season: number | null;
  /** Rounds on the calendar of that season. */
  totalRounds: number | null;
  nextRace: RaceEvent | null;
  /** True when the calendar is known and every race on it has been run. */
  seasonComplete: boolean;
  lastResult: RaceResult | null;
  standing: ChampionshipStanding | null;
};

export const EMPTY_SEASON_STATUS: SeasonStatus = {
  season: null,
  totalRounds: null,
  nextRace: null,
  seasonComplete: false,
  lastResult: null,
  standing: null,
};
