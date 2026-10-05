/**
 * Jolpica F1 (the maintained successor of the Ergast API). Public, no key.
 * https://api.jolpi.ca/docs/
 */
export const JOLPICA_BASE_URL = (
  process.env.JOLPICA_BASE_URL ?? "https://api.jolpi.ca/ergast/f1"
).replace(/\/+$/, "");

/**
 * Stable driver identifier. Never the racing number, which changes — and not
 * `verstappen`, which in this API is Jos Verstappen.
 */
export const DRIVER_ID = "max_verstappen";

/**
 * How long a response is reused before Next.js refreshes it in the background.
 * Standings and results only move on race weekends, so 30 minutes keeps the
 * page current within half an hour of a race while costing a handful of
 * requests per hour — far below Jolpica's unauthenticated limit.
 */
export const REVALIDATE_SECONDS = 30 * 60;

/** No external call may hold a render for longer than this. */
export const REQUEST_TIMEOUT_MS = 6_000;

/** A race still counts as "next" until this long after its start time. */
export const RACE_WINDOW_MS = 3 * 60 * 60 * 1000;
