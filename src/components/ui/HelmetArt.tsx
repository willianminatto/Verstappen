import { useId, type ReactNode } from "react";
import type { HelmetConcept } from "@/data/helmets";

const SHELL =
  "M58 212 C52 112 128 40 222 40 C312 40 366 106 366 192 C366 218 361 242 351 264 L332 291 C324 301 311 305 297 305 L122 305 C96 305 70 286 62 252 Z";
const VISOR =
  "M62 186 C62 160 80 141 110 139 L214 139 C231 139 240 151 236 167 L228 200 C225 212 215 218 203 218 L80 218 C68 218 62 205 62 186 Z";

function Pattern({ concept, id }: { concept: HelmetConcept; id: string }): ReactNode {
  const { accent, detail } = concept.palette;

  switch (concept.pattern) {
    case "bands":
      return (
        <g>
          <path d="M150 20 L230 20 L400 330 L320 330 Z" fill={accent} />
          <path d="M250 20 L276 20 L446 330 L420 330 Z" fill={detail} />
          <path d="M40 250 L400 250 L400 272 L40 272 Z" fill={detail} opacity="0.9" />
        </g>
      );
    case "split":
      return (
        <g>
          <path d="M0 330 L0 236 L400 96 L400 330 Z" fill={accent} />
          <path d="M0 236 L400 96 L400 110 L0 250 Z" fill={detail} />
          <path d="M0 262 L400 122 L400 127 L0 267 Z" fill="#050608" opacity="0.5" />
        </g>
      );
    case "rings":
      return (
        <g fill="none" stroke={accent}>
          <circle cx="330" cy="150" r="60" strokeWidth="10" />
          <circle cx="330" cy="150" r="104" strokeWidth="3" />
          <circle cx="330" cy="150" r="140" strokeWidth="3" stroke={detail} />
          <circle cx="330" cy="150" r="190" strokeWidth="1.5" stroke={detail} />
          <path d="M40 266 H400" strokeWidth="8" />
        </g>
      );
    case "checker":
      return (
        <g>
          <defs>
            <pattern id={`${id}-check`} width="36" height="36" patternUnits="userSpaceOnUse">
              <rect width="18" height="18" fill={accent} />
              <rect x="18" y="18" width="18" height="18" fill={accent} />
            </pattern>
          </defs>
          <rect x="40" y="232" width="360" height="54" fill={`url(#${id}-check)`} />
          <rect x="40" y="224" width="360" height="5" fill={detail} />
          <path d="M236 20 L260 20 L330 140 L306 140 Z" fill={detail} />
        </g>
      );
    case "numeral":
      return (
        <g>
          <text
            x="286"
            y="262"
            textAnchor="middle"
            fill={accent}
            fontSize="250"
            fontWeight="900"
            fontStyle="italic"
            fontFamily="var(--font-archivo), sans-serif"
            style={{ fontStretch: "62%" }}
          >
            1
          </text>
          <rect x="40" y="276" width="360" height="6" fill={detail} />
        </g>
      );
    case "carbon":
      return (
        <g>
          <defs>
            <pattern
              id={`${id}-weave`}
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="5" height="10" fill={accent} />
            </pattern>
          </defs>
          <rect x="40" y="20" width="360" height="300" fill={`url(#${id}-weave)`} opacity="0.7" />
          <path d="M40 258 H400" stroke={detail} strokeWidth="3" />
        </g>
      );
  }
}

/** Side-profile helmet drawn for this project; liveries come from `data/helmets.ts`. */
export function HelmetArt({ concept, className }: { concept: HelmetConcept; className?: string }) {
  const id = useId();

  return (
    <svg
      viewBox="0 0 420 340"
      role="img"
      aria-label={`${concept.name} helmet design study`}
      className={className}
    >
      <defs>
        <clipPath id={`${id}-shell`}>
          <path d={SHELL} />
        </clipPath>
        <radialGradient id={`${id}-light`} cx="42%" cy="18%" r="85%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.38" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id={`${id}-floor`}>
          <stop offset="0" stopColor="#000000" stopOpacity="0.7" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-visor`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a3550" />
          <stop offset="0.5" stopColor="#07090f" />
          <stop offset="1" stopColor="#141a2a" />
        </linearGradient>
      </defs>

      <ellipse cx="212" cy="320" rx="168" ry="10" fill={`url(#${id}-floor)`} />

      <g clipPath={`url(#${id}-shell)`}>
        <rect width="420" height="340" fill={concept.palette.base} />
        <Pattern concept={concept} id={id} />
        <rect width="420" height="340" fill={`url(#${id}-light)`} />
      </g>

      <path d={VISOR} fill={`url(#${id}-visor)`} stroke="#050608" strokeWidth="5" />
      {/* visor reflections */}
      <path d="M80 152 L212 150 L208 160 L78 163 Z" fill="#ffffff" opacity="0.16" />
      <path
        d="M84 156 L150 155"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="226" cy="178" r="5" fill="#050608" stroke="#ffffff" strokeOpacity="0.3" />
      {/* chin vents */}
      <path
        d="M92 250 H150 M92 262 H138"
        stroke="#050608"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* rim light along the crown */}
      <path
        d="M96 96 C140 52 200 40 250 44 C300 50 340 84 356 130"
        fill="none"
        stroke={`url(#${id}-rim)`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d={SHELL} fill="none" stroke="#050608" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}
