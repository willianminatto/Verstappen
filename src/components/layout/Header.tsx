"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Monogram } from "@/components/ui/Monogram";
import { sections, site } from "@/data/site";
import { cn } from "@/lib/cn";
import { useScroll } from "./ScrollProvider";

/**
 * Minimal fixed navigation: monogram, live section indicator (with a dot per
 * section as the progress meter) and menu trigger. The bar uses `mix-blend-difference`, so it stays
 * legible over any section without restyling.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  /** Section previewed in the menu (hover / keyboard focus). */
  const [preview, setPreview] = useState<number | null>(null);
  const { lock, unlock, scrollTo } = useScroll();

  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const pendingTarget = useRef<string | null>(null);

  // Live section indicator. One observer, a line across the middle of the
  // viewport. Pinned sections can overlap that line for a moment (or during a
  // jump), so the sections currently on it are tracked and the last one in
  // page order — the one painted on top — wins.
  useEffect(() => {
    const onLine = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = sections.findIndex((section) => section.id === entry.target.id);
          if (index < 0) continue;
          if (entry.isIntersecting) onLine.add(index);
          else onLine.delete(index);
        }
        if (onLine.size > 0) setActive(Math.max(...onLine));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  // Menu open state: freeze the page, trap focus in the overlay, restore after.
  useEffect(() => {
    if (!open) return;

    const content = document.getElementById("content");
    const trigger = menuButton.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    lock();
    content?.setAttribute("inert", "");
    window.addEventListener("keydown", onKeyDown);
    closeButton.current?.focus({ preventScroll: true });

    return () => {
      unlock();
      content?.removeAttribute("inert");
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus({ preventScroll: true });
      setPreview(null);
      if (pendingTarget.current) {
        scrollTo(pendingTarget.current);
        pendingTarget.current = null;
      }
    };
  }, [open, lock, unlock, scrollTo]);

  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    if (open) {
      pendingTarget.current = `#${id}`;
      setOpen(false);
    } else {
      scrollTo(`#${id}`);
    }
  };

  const current = sections[active] ?? sections[0];
  const last = sections[sections.length - 1];
  const shown = sections[preview ?? active] ?? current;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="flex items-center justify-between px-5 py-3 md:px-10 md:py-5">
          <a
            href="#top"
            onClick={(event) => goTo(event, "top")}
            aria-label="Max Verstappen fan concept, back to start"
            className="pointer-events-auto -m-2 flex min-h-11 items-center p-2"
          >
            <Monogram className="h-4 w-auto md:h-[1.125rem]" />
          </a>

          <p className="hidden items-center gap-3 label sm:flex">
            <span className="overflow-hidden tabular-nums">
              <span key={current?.id} className="tick-in">
                {current?.index}
              </span>
              <span className="opacity-60"> / {last?.index}</span>
            </span>
            <span className="flex items-center gap-[3px]" aria-hidden="true">
              {sections.map((section, i) => (
                <span
                  key={section.id}
                  className={cn(
                    "size-[3px] bg-current transition-opacity duration-500",
                    i <= active ? "opacity-100" : "opacity-30",
                  )}
                />
              ))}
            </span>
            <span className="overflow-hidden">
              <span key={current?.id} className="tick-in">
                {current?.label}
              </span>
            </span>
          </p>

          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="group pointer-events-auto -m-2 flex min-h-11 items-center gap-3 p-2 label"
          >
            <span>Menu</span>
            <span className="flex w-7 flex-col items-end gap-[5px]" aria-hidden="true">
              <span className="h-px w-full origin-right bg-current transition-transform duration-500 ease-expo group-hover:scale-x-50" />
              <span className="h-px w-full origin-right scale-x-50 bg-current transition-transform duration-500 ease-expo group-hover:scale-x-100" />
            </span>
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        data-open={open}
        inert={!open}
        className="menu fixed inset-0 z-[60] bg-ink text-bone"
      >
        <div className="menu-inner flex h-full flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-3 md:px-10 md:py-5">
            <Monogram className="h-4 w-auto text-orange md:h-[1.125rem]" />
            <button
              ref={closeButton}
              type="button"
              onClick={() => setOpen(false)}
              className="group -m-2 flex min-h-11 items-center gap-3 p-2 label"
            >
              <span>Close</span>
              <span
                className="relative block size-7 transition-transform duration-500 ease-expo group-hover:rotate-90"
                aria-hidden="true"
              >
                <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <div className="grid flex-1 gap-8 px-5 py-6 md:px-10 lg:grid-cols-12 lg:gap-10">
            <nav aria-label="Sections" className="self-center lg:col-span-8">
              <ul className="menu-list">
                {sections.map((section, i) => (
                  <li key={section.id} className="overflow-hidden">
                    <a
                      href={`#${section.id}`}
                      onClick={(event) => goTo(event, section.id)}
                      onMouseEnter={() => setPreview(i)}
                      onMouseLeave={() => setPreview(null)}
                      onFocus={() => setPreview(i)}
                      onBlur={() => setPreview(null)}
                      aria-current={i === active ? "true" : undefined}
                      style={{ "--i": i } as CSSProperties}
                      className="menu-rise menu-link group flex items-baseline gap-4 py-2 md:gap-7 md:py-2.5"
                    >
                      <span className="w-7 label text-ash transition-colors duration-300 group-hover:text-orange group-focus-visible:text-orange group-aria-[current]:text-orange">
                        {section.index}
                      </span>
                      <span className="display text-[clamp(2.125rem,6vh,4.75rem)] transition-transform duration-700 ease-expo group-hover:translate-x-3 group-focus-visible:translate-x-3">
                        {section.label}
                      </span>
                      {i === active ? (
                        <span className="ml-auto flex items-center gap-2 self-center caption text-orange">
                          <span className="size-1.5 bg-orange" aria-hidden="true" />
                          You are here
                        </span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div
              aria-hidden="true"
              className="menu-fade hidden flex-col items-end justify-end lg:col-span-4 lg:flex"
            >
              <span className="label text-ash">{preview === null ? "Now viewing" : "Go to"}</span>
              <span className="mt-2 block overflow-hidden">
                <span
                  key={shown?.id}
                  className="menu-numeral block display text-[clamp(10rem,23vw,25rem)] leading-[0.8] text-outline [--outline:var(--color-bone)]"
                >
                  {shown?.index}
                </span>
              </span>
            </div>
          </div>

          <p className="menu-fade max-w-xl px-5 pb-5 caption text-ash md:px-10 md:pb-7">
            {site.disclaimer}
          </p>
        </div>
      </div>
    </>
  );
}
