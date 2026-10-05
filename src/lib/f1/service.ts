import { fetchJolpica } from "./client";
import { DRIVER_ID } from "./config";
import {
  parseDriverResults,
  parseDriverStanding,
  parseSchedule,
  selectLastResult,
  selectNextRace,
} from "./normalize";
import { EMPTY_SEASON_STATUS, type RaceEvent, type RaceResult, type SeasonStatus } from "./types";

type Fetcher = (path: string) => Promise<unknown>;

/** Runs a request and turns any failure into `null` — nothing here may throw. */
async function attempt(fetcher: Fetcher, path: string): Promise<unknown> {
  try {
    return await fetcher(path);
  } catch (error) {
    console.warn(`[f1] ${path} unavailable:`, error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Current state of the season for the driver: next race, last result and
 * championship position.
 *
 * Three requests against the `current` season, in parallel, each allowed to
 * fail on its own. Two more are made only when they are needed:
 *
 *   - every race of the current calendar has been run → look for the first
 *     race of the following season (off-season);
 *   - the current season has no result yet → fall back to the last race of
 *     the previous one (pre-season).
 *
 * Never throws: with the API unreachable it resolves to empty fields and the
 * UI shows its quiet fallback.
 */
export async function getSeasonStatus(
  now: Date = new Date(),
  fetcher: Fetcher = fetchJolpica,
): Promise<SeasonStatus> {
  try {
    const [schedulePayload, resultsPayload, standingPayload] = await Promise.all([
      attempt(fetcher, "/current.json?limit=100"),
      attempt(fetcher, `/current/drivers/${DRIVER_ID}/results.json?limit=100`),
      attempt(fetcher, `/current/drivers/${DRIVER_ID}/driverstandings.json`),
    ]);

    const races = parseSchedule(schedulePayload);
    const results = parseDriverResults(resultsPayload);
    const standing = parseDriverStanding(standingPayload, DRIVER_ID);

    const season = races[0]?.season ?? standing?.season ?? results[0]?.season ?? null;

    let nextRace: RaceEvent | null = selectNextRace(races, now);
    const seasonComplete = races.length > 0 && nextRace === null;
    if (seasonComplete && season !== null) {
      nextRace = selectNextRace(
        parseSchedule(await attempt(fetcher, `/${season + 1}.json?limit=100`)),
        now,
      );
    }

    let lastResult: RaceResult | null = selectLastResult(results);
    if (lastResult === null && season !== null && resultsPayload !== null) {
      lastResult = selectLastResult(
        parseDriverResults(
          await attempt(fetcher, `/${season - 1}/drivers/${DRIVER_ID}/results.json?limit=100`),
        ),
      );
    }

    return {
      season,
      totalRounds: races.length > 0 ? races.length : null,
      nextRace,
      seasonComplete,
      lastResult,
      standing,
    };
  } catch (error) {
    console.warn("[f1] season status failed:", error instanceof Error ? error.message : error);
    return EMPTY_SEASON_STATUS;
  }
}
