import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { beyondIntro, pursuits } from "@/data/beyond";
import { media } from "@/data/media";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * A change of atmosphere: deeper blue, a field of registration dots and
 * numbered channels, closer to a sim rig or an engineer's screen than to the track.
 */
export function Beyond() {
  return (
    <section
      id="beyond"
      aria-labelledby="beyond-title"
      className="relative z-10 bg-[linear-gradient(to_bottom,var(--color-ink),var(--color-navy)_28rem)] px-5 py-16 md:px-10 lg:py-44"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 grid-lines [mask-image:linear-gradient(to_bottom,transparent,black_24rem,black_80%,transparent)]"
      />

      <div className="relative">
        <SectionHeading
          id="beyond-title"
          index="06"
          label="Beyond Formula 1"
          lines={["Beyond", "Formula 1"]}
        />

        <div className="mt-10 grid gap-8 lg:mt-24 lg:grid-cols-12 lg:items-end lg:gap-10">
          <p data-reveal="up" className="wide fs-sub lg:col-span-5">
            {beyondIntro}
          </p>
          <div className="relative lg:col-span-6 lg:col-start-7">
            <div
              data-reveal="clip"
              data-parallax
              className="aspect-[4/3] overflow-hidden lg:aspect-[16/10]"
            >
              <Media
                slot={media.beyond}
                sizes="(min-width: 1024px) 50vw, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 2.5rem)"
                className="size-full"
                imageClassName="object-cover object-[50%_24%]"
              />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-navy/10" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/85 to-transparent"
            />
            <span className="brackets text-bone/60" aria-hidden="true" />
            <p className="absolute bottom-6 left-6 caption md:bottom-8 md:left-8">
              Sim racing
              <br />
              <span className="text-bone/60">Off-season / Competition never stops</span>
            </p>
          </div>
        </div>

        <ul className="mt-12 space-y-2 lg:mt-32">
          {pursuits.map((pursuit, i) => (
            <li
              key={pursuit.title}
              data-reveal="up"
              data-cursor="wide"
              className="group relative overflow-hidden bg-bone/[0.04]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-700 ease-expo group-hover:scale-y-100"
              />
              <div className="relative grid gap-x-8 gap-y-4 px-5 py-6 transition-colors duration-500 group-hover:text-ink md:grid-cols-12 md:items-center md:px-8 lg:py-9">
                <p className="flex items-center gap-3 label md:col-span-2 md:block">
                  <span className="text-orange transition-colors duration-500 group-hover:text-rust">
                    <span
                      aria-hidden="true"
                      className="mr-2 inline-block size-1.5 bg-current align-middle"
                    />
                    CH {pad(i + 1)}
                  </span>
                  <span className="text-ash transition-colors duration-500 group-hover:text-ink/70 md:mt-1 md:block">
                    {pursuit.tag}
                  </span>
                </p>
                <h3 className="display text-[clamp(2.75rem,5.1vw,6rem)] transition-transform duration-700 ease-expo group-hover:translate-x-2 md:col-span-6">
                  {pursuit.title}
                </h3>
                <div className="md:col-span-4">
                  <p className="max-w-sm copy text-bone/75 transition-colors duration-500 group-hover:text-ink/80">
                    {pursuit.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
