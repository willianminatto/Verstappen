"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * A small ring that trails the pointer and opens up over interactive
 * elements. It complements the native cursor rather than replacing it, and
 * only exists for mouse-like pointers with motion allowed.
 *
 *   a, button            → "link"
 *   [data-cursor="wide"] → larger ring, for big hover targets
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ.fine, () => {
      const el = root.current;
      if (!el) return;

      gsap.set(el, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      let shown = false;

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        if (!shown) {
          shown = true;
          gsap.set(el, { x: event.clientX, y: event.clientY });
          gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        }
        xTo(event.clientX);
        yTo(event.clientY);
      };

      const onOver = (event: PointerEvent) => {
        const target = event.target instanceof Element ? event.target : null;
        const hit = target?.closest("a, button, [data-cursor]");
        el.dataset.state = hit ? (hit.getAttribute("data-cursor") ?? "link") : "";
      };

      const onLeave = () => {
        shown = false;
        gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    });
  });

  return (
    <div ref={root} aria-hidden="true" className="cursor">
      <div className="cursor-ring" />
    </div>
  );
}
