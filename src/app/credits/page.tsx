import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Monogram } from "@/components/ui/Monogram";
import { imageCredits } from "@/data/imageCredits";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Image Credits — Unofficial fan experience by Willian Minatto",
  description:
    "Image sources, licenses and publication status for Willian Minatto’s unofficial Max Verstappen fan project.",
};

export default function CreditsPage() {
  return (
    <main id="main" className="min-h-svh bg-ink px-5 py-8 md:px-10 md:py-10">
      <nav aria-label="Credits navigation" className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Back to the fan experience"
          className="flex min-h-11 items-center"
        >
          <Monogram className="h-5 w-auto text-orange" />
        </Link>
        <Link href="/" className="inline-flex min-h-11 items-center label hover:text-orange">
          Back to experience ↗
        </Link>
      </nav>
      <header className="mt-16 max-w-4xl md:mt-24">
        <p className="label text-orange">Fan-made experience · Willian Minatto</p>
        <h1 className="mt-6 display fs-mega">Image Credits</h1>
        <p className="mt-8 max-w-2xl copy text-bone/80">
          Sources, authors and image licenses. This is an unofficial fan project; image ownership
          remains with the respective authors and licensors.
        </p>
        <p className="mt-6 max-w-2xl border-l-2 border-orange pl-5 copy text-bone">
          {imageCredits.filter((credit) => credit.pending).length} photographs are listed below.
          Where the page a picture was found on has been identified, it is linked. That is not the
          same as an author or a license: where those are not confirmed they are marked as pending,
          and no permission has been obtained. They remain the property of their respective rights
          holders.
        </p>
      </header>
      <div className="mt-16 grid gap-x-12 gap-y-12 lg:grid-cols-2">
        {imageCredits.map((credit, index) => (
          <article key={credit.src} className="border-t border-bone/20 pt-6">
            <p className="label text-orange">
              {String(index + 1).padStart(2, "0")} /{" "}
              {credit.pending
                ? credit.sourceUrl
                  ? "Source page identified · license pending"
                  : "Source and license pending"
                : "License documented"}
            </p>
            <div className="mt-5 grid gap-6 sm:grid-cols-[9rem_1fr]">
              <div className="relative aspect-[4/3] w-36 bg-bone">
                <Image
                  src={credit.src}
                  alt={credit.title}
                  fill
                  sizes="144px"
                  loading="lazy"
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="wide fs-sub">{credit.title}</h2>
                <p className="mt-3 caption break-all text-ash">public{credit.src}</p>
                <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                  <div>
                    <dt className="label text-ash">Used in</dt>
                    <dd className="mt-1">{credit.usage}</dd>
                  </div>
                  <div>
                    <dt className="label text-ash">Author / photographer</dt>
                    <dd className="mt-1">{credit.author}</dd>
                  </div>
                  <div>
                    <dt className="label text-ash">Source</dt>
                    <dd className="mt-1">{credit.source}</dd>
                  </div>
                  <div>
                    <dt className="label text-ash">License</dt>
                    <dd className="mt-1">{credit.license}</dd>
                  </div>
                  <div>
                    <dt className="label text-ash">Display / alterations</dt>
                    <dd className="mt-1 text-bone/80">{credit.changes}</dd>
                  </div>
                  {credit.notes ? (
                    <div>
                      <dt className="label text-ash">Notes</dt>
                      <dd className="mt-1 text-bone/80">{credit.notes}</dd>
                    </div>
                  ) : null}
                </dl>
                <div className="mt-4 flex flex-wrap gap-x-6">
                  {credit.sourceUrl ? (
                    <a
                      href={credit.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center label underline underline-offset-4 hover:text-orange"
                    >
                      {credit.sourceUrlLabel ?? "Source"} ↗
                    </a>
                  ) : (
                    <p className="py-3 caption text-ash">Source page pending confirmation</p>
                  )}
                  {credit.licenseUrl ? (
                    <a
                      href={credit.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center label underline underline-offset-4 hover:text-orange"
                    >
                      License ↗
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <footer className="mt-20 border-t border-bone/20 pt-8 pb-4">
        <p className="wide fs-sub">Developed by Willian Minatto</p>
        <p className="mt-3 label text-orange">Max Verstappen fan · Brazil</p>
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-bone/80">
          <p>{site.disclaimer}</p>
          <p>{site.affiliation}</p>
          <p>{site.rights}</p>
          <p className="pt-3 caption text-ash">{site.copyright}</p>
        </div>
      </footer>
    </main>
  );
}
