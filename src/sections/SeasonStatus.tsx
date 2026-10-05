import { formatDay, formatPoints, formatUtcTime, getSeasonStatus } from "@/lib/f1";

const FALLBACK = "Not available right now";

/**
 * Current-season strip between the hero and The Driver: next race,
 * championship position, last result.
 *
 * A server component. The data comes from `lib/f1` (Jolpica, cached by
 * Next.js) and every date is formatted in UTC here, so the markup is the same
 * on the server and in the browser. If nothing could be loaded the strip is
 * simply not rendered; if only part of it loaded, the missing part says so.
 */
export async function SeasonStatus() {
  const { season, totalRounds, nextRace, seasonComplete, lastResult, standing } =
    await getSeasonStatus();

  if (!nextRace && !lastResult && !standing) return null;

  const raceDay = nextRace ? formatDay(nextRace.startsAt) : null;
  const raceTime = nextRace?.hasTime ? formatUtcTime(nextRace.startsAt) : null;
  const place = nextRace ? [nextRace.locality, nextRace.country].filter(Boolean).join(" · ") : "";
  const resultDay = lastResult ? formatDay(lastResult.date) : null;

  return (
    <aside
      aria-labelledby="season-title"
      className="relative z-10 bg-ink px-5 pt-14 md:px-10 lg:pt-24"
    >
      <div className="flex items-start justify-between gap-6">
        <h2 id="season-title" className="flex items-center gap-3 label text-ash">
          <span className="size-1 bg-orange" aria-hidden="true" />
          {season ? `${season} season` : "Season"}
        </h2>
        <p className="text-right caption text-ash">
          {standing?.round && totalRounds ? (
            <>
              After round {standing.round} of {totalRounds}
              <br />
            </>
          ) : null}
          Data · Jolpica F1
        </p>
      </div>

      <dl className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-12 lg:mt-12">
        <div data-reveal="up" className="md:col-span-6">
          <dt className="label text-orange">Next race</dt>
          <dd className="mt-3">
            {nextRace ? (
              <>
                <span className="block display fs-title">{nextRace.name}</span>
                <span className="mt-4 block wide text-[clamp(0.8125rem,1.1vw,1.0625rem)]">
                  {nextRace.circuit ?? place}
                </span>
                {nextRace.circuit && place ? (
                  <span className="mt-1 block caption text-ash">{place}</span>
                ) : null}
                <span className="mt-4 block label">
                  {raceDay ? <time dateTime={nextRace.startsAt}>{raceDay}</time> : null}
                  {raceTime ? <span className="text-ash"> · {raceTime}</span> : null}
                  <span className="text-ash">
                    {" "}
                    · Round {nextRace.round}
                    {nextRace.season !== season ? ` · ${nextRace.season}` : ""}
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="block display fs-title">
                  {seasonComplete ? "Season complete" : "To be confirmed"}
                </span>
                <span className="mt-4 block caption text-ash">
                  {seasonComplete ? "Next calendar not published yet" : FALLBACK}
                </span>
              </>
            )}
          </dd>
        </div>

        <div data-reveal="up" data-delay="0.08" className="md:col-span-3">
          <dt className="label text-orange">Championship</dt>
          <dd className="mt-3">
            {standing ? (
              <>
                <span className="block display fs-title tabular-nums">
                  {standing.position ? `P${standing.position}` : "Unranked"}
                </span>
                <span className="mt-4 block wide text-[clamp(0.8125rem,1.1vw,1.0625rem)] tabular-nums">
                  {formatPoints(standing.points)} pts
                </span>
                {standing.wins !== null ? (
                  <span className="mt-1 block caption text-ash">
                    {standing.wins} {standing.wins === 1 ? "win" : "wins"} this season
                  </span>
                ) : null}
              </>
            ) : (
              <span className="block caption text-ash">{FALLBACK}</span>
            )}
          </dd>
        </div>

        <div data-reveal="up" data-delay="0.16" className="md:col-span-3">
          <dt className="label text-orange">Last result</dt>
          <dd className="mt-3">
            {lastResult ? (
              <>
                <span className="block display fs-title tabular-nums">{lastResult.outcome}</span>
                <span className="mt-4 block wide text-[clamp(0.8125rem,1.1vw,1.0625rem)]">
                  {lastResult.name}
                </span>
                <span className="mt-1 block caption text-ash">
                  Round {lastResult.round}
                  {lastResult.season !== season ? ` · ${lastResult.season}` : ""}
                  {resultDay ? (
                    <>
                      {" · "}
                      <time dateTime={lastResult.date}>{resultDay}</time>
                    </>
                  ) : null}
                  {lastResult.grid ? ` · Grid P${lastResult.grid}` : ""}
                </span>
              </>
            ) : (
              <span className="block caption text-ash">{FALLBACK}</span>
            )}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
