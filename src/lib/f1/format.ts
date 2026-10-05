/**
 * Date formatting for race data. Everything is rendered in UTC with a fixed
 * locale, on the server, so the markup is identical wherever and whenever it
 * is hydrated — the visitor's own time zone is never consulted.
 */

const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
});

function parse(iso: string): Date | null {
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "11 Oct 2026" — or null when the input is not a date. */
export function formatDay(iso: string): string | null {
  const date = parse(iso);
  return date ? DAY.format(date) : null;
}

/** "12:00 UTC" — or null when the input is not a date. */
export function formatUtcTime(iso: string): string | null {
  const date = parse(iso);
  return date ? `${TIME.format(date)} UTC` : null;
}

/** Points without a trailing ".0" (half points exist: "188.5"). */
export function formatPoints(points: number): string {
  return Number.isInteger(points) ? String(points) : points.toFixed(1);
}
