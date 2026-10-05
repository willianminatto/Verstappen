import { describe, expect, it, vi } from "vitest";
import { formatDay, formatPoints, formatUtcTime } from "./format";
import {
  parseDriverResults,
  parseDriverStanding,
  parseSchedule,
  selectLastResult,
  selectNextRace,
} from "./normalize";
import { getSeasonStatus } from "./service";

/* ── Fixtures shaped like real Jolpica responses ──────────────────────────── */

type RaceInput = { round: number; date: string; time?: string; name?: string; season?: number };

const race = ({ round, date, time, name, season = 2026 }: RaceInput) => ({
  season: String(season),
  round: String(round),
  raceName: name ?? `Round ${round} Grand Prix`,
  Circuit: {
    circuitName: `Circuit ${round}`,
    Location: { locality: `City ${round}`, country: `Country ${round}` },
  },
  date,
  ...(time ? { time } : {}),
});

const schedule = (races: RaceInput[]) => ({
  MRData: { RaceTable: { season: "2026", Races: races.map(race) } },
});

const resultRace = (input: RaceInput, result: Record<string, string>) => ({
  ...race(input),
  Results: [result],
});

const results = (races: unknown[]) => ({ MRData: { RaceTable: { Races: races } } });

const standings = (rows: unknown[], round = "16") => ({
  MRData: {
    StandingsTable: {
      season: "2026",
      StandingsLists: [{ season: "2026", round, DriverStandings: rows }],
    },
  },
});

const maxRow = {
  position: "6",
  positionText: "6",
  points: "188",
  wins: "1",
  Driver: { driverId: "max_verstappen", permanentNumber: "3" },
};

const CALENDAR: RaceInput[] = [
  { round: 1, date: "2026-03-08", time: "04:00:00Z" },
  { round: 2, date: "2026-03-15", time: "07:00:00Z" },
  { round: 3, date: "2026-12-06", time: "13:00:00Z" },
];

/** A fetcher that answers by matching the request path. */
function fakeApi(routes: Record<string, unknown | (() => unknown)>) {
  return vi.fn(async (path: string) => {
    const key = Object.keys(routes).find((route) => path.startsWith(route));
    if (key === undefined) throw new Error(`unexpected request ${path}`);
    const value = routes[key];
    return typeof value === "function" ? (value as () => unknown)() : value;
  });
}

const fail = () => {
  throw new Error("Jolpica responded 429");
};

/* ── Standings ────────────────────────────────────────────────────────────── */

describe("parseDriverStanding", () => {
  it("normalises the driver's row into numbers", () => {
    expect(parseDriverStanding(standings([maxRow]), "max_verstappen")).toEqual({
      season: 2026,
      round: 16,
      position: 6,
      points: 188,
      wins: 1,
    });
  });

  it("finds the driver by id in a full table, not by racing number", () => {
    const other = { ...maxRow, position: "1", points: "300", Driver: { driverId: "norris" } };
    expect(parseDriverStanding(standings([other, maxRow]), "max_verstappen")?.position).toBe(6);
  });

  it("keeps half points and tolerates a missing wins field", () => {
    const row = { position: "2", points: "188.5", Driver: { driverId: "max_verstappen" } };
    expect(parseDriverStanding(standings([row]), "max_verstappen")).toMatchObject({
      points: 188.5,
      wins: null,
    });
  });

  it("returns null before the first round and for other drivers", () => {
    expect(parseDriverStanding(standings([]), "max_verstappen")).toBeNull();
    expect(
      parseDriverStanding({ MRData: { StandingsTable: { StandingsLists: [] } } }, "max_verstappen"),
    ).toBeNull();
    const other = { ...maxRow, Driver: { driverId: "verstappen" } };
    expect(parseDriverStanding(standings([other]), "max_verstappen")).toBeNull();
  });

  it("returns null for payloads that are not what the API promises", () => {
    for (const payload of [null, undefined, "<html>", 42, [], {}, { MRData: null }]) {
      expect(parseDriverStanding(payload, "max_verstappen")).toBeNull();
    }
    const broken = { ...maxRow, points: "many" };
    expect(parseDriverStanding(standings([broken]), "max_verstappen")).toBeNull();
  });
});

/* ── Calendar and next race ───────────────────────────────────────────────── */

describe("parseSchedule", () => {
  it("normalises races, in round order, with UTC start times", () => {
    const parsed = parseSchedule(schedule([CALENDAR[1]!, CALENDAR[0]!]));
    expect(parsed.map((r) => r.round)).toEqual([1, 2]);
    expect(parsed[0]).toEqual({
      season: 2026,
      round: 1,
      name: "Round 1 Grand Prix",
      circuit: "Circuit 1",
      locality: "City 1",
      country: "Country 1",
      startsAt: "2026-03-08T04:00:00.000Z",
      hasTime: true,
    });
  });

  it("accepts a race without a start time", () => {
    const [parsed] = parseSchedule(schedule([{ round: 4, date: "2026-07-05" }]));
    expect(parsed).toMatchObject({ startsAt: "2026-07-05T00:00:00.000Z", hasTime: false });
  });

  it("drops malformed entries and survives empty or invalid payloads", () => {
    const payload = {
      MRData: {
        RaceTable: {
          Races: [
            race(CALENDAR[0]!),
            { round: "2" },
            null,
            "x",
            { ...race(CALENDAR[1]!), date: "soon" },
          ],
        },
      },
    };
    expect(parseSchedule(payload)).toHaveLength(1);
    expect(parseSchedule(schedule([]))).toEqual([]);
    expect(parseSchedule(null)).toEqual([]);
    expect(parseSchedule({ MRData: { RaceTable: { Races: "none" } } })).toEqual([]);
  });
});

describe("selectNextRace", () => {
  const races = parseSchedule(schedule(CALENDAR));

  it("picks the first race that has not been run", () => {
    expect(selectNextRace(races, new Date("2026-01-10T00:00:00Z"))?.round).toBe(1);
    expect(selectNextRace(races, new Date("2026-03-10T00:00:00Z"))?.round).toBe(2);
    expect(selectNextRace(races, new Date("2026-06-01T00:00:00Z"))?.round).toBe(3);
  });

  it("keeps a race as next while it is being run, then moves on", () => {
    expect(selectNextRace(races, new Date("2026-03-08T05:30:00Z"))?.round).toBe(1);
    expect(selectNextRace(races, new Date("2026-03-08T07:30:00Z"))?.round).toBe(2);
  });

  it("keeps a date-only race for its whole day", () => {
    const dateOnly = parseSchedule(schedule([{ round: 1, date: "2026-07-05" }]));
    expect(selectNextRace(dateOnly, new Date("2026-07-05T18:00:00Z"))?.round).toBe(1);
    expect(selectNextRace(dateOnly, new Date("2026-07-06T00:00:01Z"))).toBeNull();
  });

  it("returns null after the last race and for an empty calendar", () => {
    expect(selectNextRace(races, new Date("2026-12-20T00:00:00Z"))).toBeNull();
    expect(selectNextRace([], new Date("2026-06-01T00:00:00Z"))).toBeNull();
  });
});

/* ── Results ──────────────────────────────────────────────────────────────── */

describe("parseDriverResults / selectLastResult", () => {
  const finished = { position: "1", positionText: "1", grid: "3", status: "Finished" };

  it("selects the latest round and normalises it", () => {
    const payload = results([
      resultRace(CALENDAR[1]!, { position: "4", positionText: "4", grid: "2" }),
      resultRace(CALENDAR[0]!, finished),
    ]);
    expect(selectLastResult(parseDriverResults(payload))).toEqual({
      season: 2026,
      round: 2,
      name: "Round 2 Grand Prix",
      date: "2026-03-15",
      position: 4,
      outcome: "P4",
      grid: 2,
    });
  });

  it("reports a retirement instead of a position", () => {
    // The API still fills `position` for retirements; `positionText` tells the truth.
    const payload = results([
      resultRace(CALENDAR[0]!, { position: "18", positionText: "R", grid: "1", status: "Engine" }),
    ]);
    expect(selectLastResult(parseDriverResults(payload))).toMatchObject({
      position: null,
      outcome: "DNF",
    });
  });

  it("treats grid 0 (pit-lane start) and a missing grid as unknown", () => {
    const pitLane = results([resultRace(CALENDAR[0]!, { ...finished, grid: "0" })]);
    const missing = results([resultRace(CALENDAR[0]!, { position: "2", positionText: "2" })]);
    expect(parseDriverResults(pitLane)[0]?.grid).toBeNull();
    expect(parseDriverResults(missing)[0]).toMatchObject({ grid: null, outcome: "P2" });
  });

  it("handles empty arrays and invalid payloads", () => {
    expect(parseDriverResults(results([]))).toEqual([]);
    expect(parseDriverResults(results([{ ...race(CALENDAR[0]!), Results: [] }]))).toEqual([]);
    expect(parseDriverResults("Too Many Requests")).toEqual([]);
    expect(selectLastResult([])).toBeNull();
  });
});

/* ── Service: orchestration and fallback ──────────────────────────────────── */

describe("getSeasonStatus", () => {
  const midSeason = new Date("2026-03-10T00:00:00Z");
  const happy = {
    "/current.json": schedule(CALENDAR),
    "/current/drivers/max_verstappen/results.json": results([
      resultRace(CALENDAR[0]!, { position: "1", positionText: "1", grid: "1" }),
    ]),
    "/current/drivers/max_verstappen/driverstandings.json": standings([maxRow], "1"),
  };

  it("assembles the season from three requests", async () => {
    const api = fakeApi(happy);
    const status = await getSeasonStatus(midSeason, api);

    expect(api).toHaveBeenCalledTimes(3);
    expect(status).toMatchObject({ season: 2026, totalRounds: 3, seasonComplete: false });
    expect(status.nextRace?.round).toBe(2);
    expect(status.lastResult?.outcome).toBe("P1");
    expect(status.standing?.points).toBe(188);
  });

  it("never throws when the API is down: every field falls back to empty", async () => {
    const api = vi.fn(async () => {
      throw new Error("fetch failed");
    });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(getSeasonStatus(midSeason, api)).resolves.toEqual({
      season: null,
      totalRounds: null,
      nextRace: null,
      seasonComplete: false,
      lastResult: null,
      standing: null,
    });
    // No follow-up requests are attempted against an API that is not answering.
    expect(api).toHaveBeenCalledTimes(3);
    warn.mockRestore();
  });

  it("falls back to empty on responses with an unexpected shape", async () => {
    const api = fakeApi({ "/current": { message: "upstream changed" } });
    const status = await getSeasonStatus(midSeason, api);
    expect(status).toMatchObject({
      season: null,
      nextRace: null,
      lastResult: null,
      standing: null,
    });
  });

  it("keeps what did load when a single request fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const api = fakeApi({ ...happy, "/current/drivers/max_verstappen/driverstandings.json": fail });
    const status = await getSeasonStatus(midSeason, api);

    expect(status.standing).toBeNull();
    expect(status.nextRace?.round).toBe(2);
    expect(status.lastResult?.round).toBe(1);
    warn.mockRestore();
  });

  it("after the last race, looks into the following season", async () => {
    const api = fakeApi({
      ...happy,
      "/2027.json": schedule([{ round: 1, date: "2027-03-07", time: "04:00:00Z", season: 2027 }]),
    });
    const status = await getSeasonStatus(new Date("2026-12-20T00:00:00Z"), api);

    expect(status.seasonComplete).toBe(true);
    expect(status.season).toBe(2026);
    expect(status.nextRace).toMatchObject({ season: 2027, round: 1 });
  });

  it("reports a finished season with no next race when no new calendar exists", async () => {
    const api = fakeApi({ ...happy, "/2027.json": schedule([]) });
    const status = await getSeasonStatus(new Date("2026-12-20T00:00:00Z"), api);

    expect(status.seasonComplete).toBe(true);
    expect(status.nextRace).toBeNull();
    expect(status.lastResult?.round).toBe(1);
  });

  it("before the first race of a season, shows the last result of the previous one", async () => {
    const api = fakeApi({
      ...happy,
      "/current/drivers/max_verstappen/results.json": results([]),
      "/current/drivers/max_verstappen/driverstandings.json": standings([]),
      "/2025/drivers/max_verstappen/results.json": results([
        resultRace(
          { round: 24, date: "2025-12-07", season: 2025 },
          { position: "1", positionText: "1" },
        ),
      ]),
    });
    const status = await getSeasonStatus(new Date("2026-02-01T00:00:00Z"), api);

    expect(status.nextRace?.round).toBe(1);
    expect(status.standing).toBeNull();
    expect(status.lastResult).toMatchObject({ season: 2025, round: 24 });
  });
});

/* ── Formatting ───────────────────────────────────────────────────────────── */

describe("format", () => {
  it("renders dates in UTC regardless of the machine's time zone", () => {
    expect(formatDay("2026-10-11T12:00:00.000Z")).toBe("11 Oct 2026");
    expect(formatDay("2026-10-04")).toBe("04 Oct 2026");
    // 23:30 UTC must not roll over to the next day in any zone.
    expect(formatDay("2026-11-22T23:30:00.000Z")).toBe("22 Nov 2026");
    expect(formatUtcTime("2026-11-22T04:00:00.000Z")).toBe("04:00 UTC");
  });

  it("returns null instead of 'Invalid Date'", () => {
    expect(formatDay("soon")).toBeNull();
    expect(formatUtcTime("")).toBeNull();
  });

  it("prints points without a pointless decimal", () => {
    expect(formatPoints(188)).toBe("188");
    expect(formatPoints(188.5)).toBe("188.5");
  });
});
