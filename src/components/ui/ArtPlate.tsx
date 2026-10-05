import { useId, type ReactNode } from "react";
import type { ArtTone, ArtVariant } from "@/data/media";
import { cn } from "@/lib/cn";
import { r2, seeded } from "@/lib/random";

const TONES: Record<ArtTone, { accent: string; glow: string; base: string }> = {
  orange: { accent: "#ff5a00", glow: "#ff5a00", base: "#0a1124" },
  blue: { accent: "#6f95ff", glow: "#2a4fd6", base: "#081022" },
  bone: { accent: "#f1eee7", glow: "#53618a", base: "#0c111c" },
};

const BONE = "#f1eee7";

/**
 * Variants receive the seed, not a generator: each one builds its own PRNG on
 * every render, so rendering twice (React Strict Mode, hydration) always
 * yields the same markup as the server.
 */
type VariantProps = { seed: number; accent: string; id: string };

function Streaks({ seed, accent, id }: VariantProps) {
  const rand = seeded(seed);
  const thin = Array.from({ length: 96 }, (_, i) => {
    const hot = rand() < 0.4;
    return (
      <rect
        key={i}
        x={r2(rand() * 1300 - 200)}
        y={r2(rand() * 1200 - 100)}
        width={r2(50 + rand() * rand() * 950)}
        height={r2(0.6 + rand() * 2.2)}
        fill={hot ? accent : BONE}
        opacity={r2((0.15 + rand() * 0.6) * (hot ? 1 : 0.45))}
      />
    );
  });
  const bars = Array.from({ length: 12 }, (_, i) => (
    <rect
      key={i}
      x={r2(rand() * 900 - 100)}
      y={r2(rand() * 1100 - 50)}
      width={r2(260 + rand() * 700)}
      height={r2(6 + rand() * 26)}
      fill={rand() < 0.7 ? accent : BONE}
      opacity={r2(0.12 + rand() * 0.3)}
    />
  ));
  return (
    <g transform="rotate(-9 500 500)">
      <g filter={`url(#${id}-blur)`}>{bars}</g>
      {thin}
    </g>
  );
}

function Halo({ accent }: VariantProps) {
  const rings = Array.from({ length: 11 }, (_, i) => (
    <circle
      key={i}
      cx="500"
      cy="440"
      r={110 + i * 62}
      fill="none"
      stroke={i % 3 === 0 ? accent : BONE}
      strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
      opacity={r2(0.55 - i * 0.04)}
    />
  ));
  return (
    <g>
      {rings}
      <circle
        cx="500"
        cy="440"
        r="296"
        fill="none"
        stroke={accent}
        strokeWidth="14"
        strokeDasharray="2 22"
        opacity="0.7"
      />
    </g>
  );
}

const CIRCUIT_PATH =
  "M190 705 C110 520 205 300 385 262 S650 150 770 285 S870 520 705 562 S520 525 482 662 S300 870 190 705 Z";

function Circuit({ accent }: VariantProps) {
  const dots: ReactNode[] = [];
  for (let x = 50; x < 1000; x += 50) {
    for (let y = 50; y < 1000; y += 50) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill={BONE} opacity="0.16" />);
    }
  }
  const sectors = [
    { x: 385, y: 262, name: "S1" },
    { x: 770, y: 285, name: "S2" },
    { x: 482, y: 662, name: "S3" },
  ];
  return (
    <g>
      {dots}
      <path d={CIRCUIT_PATH} fill="none" stroke="#1a2032" strokeWidth="46" strokeLinejoin="round" />
      <path d={CIRCUIT_PATH} fill="none" stroke={accent} strokeWidth="2" opacity="0.9" />
      <path
        d={CIRCUIT_PATH}
        fill="none"
        stroke="#ff5a00"
        strokeWidth="5"
        strokeDasharray="150 1900"
        strokeLinecap="round"
      />
      {sectors.map((sector) => (
        <g key={sector.name}>
          <circle
            cx={sector.x}
            cy={sector.y}
            r="9"
            fill="#050608"
            stroke="#ff5a00"
            strokeWidth="2"
          />
          <text
            x={sector.x + 20}
            y={sector.y - 16}
            fill={BONE}
            fontSize="20"
            fontFamily="var(--font-jetbrains), monospace"
            letterSpacing="3"
            opacity="0.8"
          >
            {sector.name}
          </text>
        </g>
      ))}
    </g>
  );
}

function Grid({ accent, seed }: VariantProps) {
  const rand = seeded(seed);
  const dots: ReactNode[] = [];
  for (let x = 62.5; x < 1000; x += 62.5) {
    for (let y = 62.5; y < 1000; y += 62.5) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill={BONE} opacity="0.22" />);
    }
  }
  const marks = Array.from({ length: 9 }, (_, i) => {
    const x = Math.round(rand() * 14 + 1) * 62.5;
    const y = Math.round(rand() * 14 + 1) * 62.5;
    return (
      <path
        key={i}
        d={`M${x - 12} ${y}H${x + 12}M${x} ${y - 12}V${y + 12}`}
        stroke={i % 3 === 0 ? "#ff5a00" : accent}
        strokeWidth="2"
      />
    );
  });
  return (
    <g>
      {dots}
      <circle
        cx="625"
        cy="500"
        r="312.5"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        opacity="0.6"
      />
      <circle
        cx="625"
        cy="500"
        r="187.5"
        fill="none"
        stroke={BONE}
        strokeWidth="0.8"
        opacity="0.4"
      />
      {marks}
    </g>
  );
}

function Apex({ accent }: VariantProps) {
  const cx = 1060;
  const cy = 1090;
  return (
    <g fill="none">
      <circle cx={cx} cy={cy} r="770" stroke="#141927" strokeWidth="250" />
      <circle cx={cx} cy={cy} r="632" stroke={BONE} strokeWidth="26" strokeDasharray="64 64" />
      <circle
        cx={cx}
        cy={cy}
        r="632"
        stroke={accent}
        strokeWidth="26"
        strokeDasharray="64 64"
        strokeDashoffset="64"
      />
      <circle cx={cx} cy={cy} r="898" stroke={BONE} strokeWidth="4" opacity="0.8" />
      <circle
        cx={cx}
        cy={cy}
        r="704"
        stroke={accent}
        strokeWidth="3"
        strokeDasharray="3 16"
        opacity="0.9"
      />
      <circle cx={cx} cy={cy} r="742" stroke="#050608" strokeWidth="9" opacity="0.55" />
      <circle cx={cx} cy={cy} r="778" stroke="#050608" strokeWidth="6" opacity="0.4" />
      <circle
        cx={cx}
        cy={cy}
        r="952"
        stroke={BONE}
        strokeWidth="60"
        strokeDasharray="2 14"
        opacity="0.09"
      />
      <circle cx={cx} cy={cy} r="1010" stroke={BONE} strokeWidth="0.8" opacity="0.3" />
      <circle cx={cx} cy={cy} r="1090" stroke={BONE} strokeWidth="0.8" opacity="0.18" />
    </g>
  );
}

function Rain({ seed, accent, id }: VariantProps) {
  const rand = seeded(seed);
  const drops = Array.from({ length: 170 }, (_, i) => {
    const x = rand() * 1500 - 250;
    const y = rand() * 1300 - 150;
    const length = 30 + rand() * 190;
    return (
      <line
        key={i}
        x1={r2(x)}
        y1={r2(y)}
        x2={r2(x)}
        y2={r2(y + length)}
        stroke={rand() < 0.14 ? BONE : accent}
        strokeWidth={r2(0.6 + rand() * 1.6)}
        opacity={r2(0.12 + rand() * 0.5)}
      />
    );
  });
  const pillars = [180, 430, 520, 760, 880].map((x, i) => (
    <rect
      key={x}
      x={x}
      y={r2(380 + rand() * 120)}
      width={r2(10 + rand() * 26)}
      height={r2(260 + rand() * 160)}
      fill={i % 2 === 0 ? "#ff5a00" : BONE}
      opacity={r2(0.25 + rand() * 0.3)}
    />
  ));
  return (
    <g>
      <g filter={`url(#${id}-soft)`}>{pillars}</g>
      <g transform="rotate(21 500 500)">{drops}</g>
    </g>
  );
}

function Dunes({ seed, accent, id }: VariantProps) {
  const rand = seeded(seed);
  // Layered ridges as filled shapes: the dunes read as mass and light, not as rules.
  const ridges = Array.from({ length: 8 }, (_, i) => {
    const y = 250 + i * 92;
    const amp = 40 + rand() * 90;
    const shift = rand() * 220 - 110;
    return (
      <path
        key={i}
        d={`M-50 ${r2(y)} C${r2(240 + shift)} ${r2(y - amp)}, ${r2(540 + shift)} ${r2(y + amp)}, 1050 ${r2(y - amp * 0.4)} L1050 1000 L-50 1000 Z`}
        fill={i % 2 === 0 ? accent : "#050608"}
        opacity={r2(i % 2 === 0 ? 0.1 + i * 0.012 : 0.42)}
      />
    );
  });
  const crowd = Array.from({ length: 260 }, (_, i) => (
    <circle
      key={i}
      cx={r2(rand() * 1000)}
      cy={r2(118 + rand() * 46)}
      r={r2(1.2 + rand() * 2.4)}
      fill={rand() < 0.82 ? "#ff5a00" : BONE}
      opacity={r2(0.35 + rand() * 0.6)}
    />
  ));
  return (
    <g>
      <circle cx="730" cy="150" r="210" fill={`url(#${id}-sun)`} />
      {crowd}
      {ridges}
    </g>
  );
}

const VARIANTS: Record<ArtVariant, (props: VariantProps) => ReactNode> = {
  streaks: Streaks,
  halo: Halo,
  circuit: Circuit,
  grid: Grid,
  apex: Apex,
  rain: Rain,
  dunes: Dunes,
};

const GLOW: Record<ArtVariant, { cx: string; cy: string; r: string }> = {
  streaks: { cx: "72%", cy: "46%", r: "62%" },
  halo: { cx: "50%", cy: "44%", r: "48%" },
  circuit: { cx: "30%", cy: "75%", r: "60%" },
  grid: { cx: "62%", cy: "50%", r: "55%" },
  apex: { cx: "90%", cy: "95%", r: "80%" },
  rain: { cx: "50%", cy: "80%", r: "65%" },
  dunes: { cx: "50%", cy: "100%", r: "75%" },
};

type ArtPlateProps = {
  variant: ArtVariant;
  tone: ArtTone;
  seed: number;
  /** Accessible description of the visual. */
  label: string;
  className?: string;
};

/**
 * Programmatic placeholder artwork. Stands in for photography until final
 * assets are added through the media manifest.
 */
export function ArtPlate({ variant, tone, seed, label, className }: ArtPlateProps) {
  const id = useId();
  const palette = TONES[tone];
  const glow = GLOW[variant];
  const Variant = VARIANTS[variant];

  return (
    <div role="img" aria-label={label} className={cn("relative overflow-hidden bg-ink", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
      >
        <defs>
          <linearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={palette.base} />
            <stop offset="1" stopColor="#050608" />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx={glow.cx} cy={glow.cy} r={glow.r}>
            <stop offset="0" stopColor={palette.glow} stopOpacity="0.55" />
            <stop offset="0.45" stopColor={palette.glow} stopOpacity="0.12" />
            <stop offset="1" stopColor={palette.glow} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-vignette`} cx="50%" cy="50%" r="75%">
            <stop offset="0.55" stopColor="#050608" stopOpacity="0" />
            <stop offset="1" stopColor="#050608" stopOpacity="0.85" />
          </radialGradient>
          <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="26 3" />
          </filter>
          <filter id={`${id}-soft`} x="-50%" y="-20%" width="200%" height="140%">
            <feGaussianBlur stdDeviation="16 30" />
          </filter>
          <radialGradient id={`${id}-sun`}>
            <stop offset="0" stopColor="#ffd2b0" stopOpacity="0.9" />
            <stop offset="0.3" stopColor="#ff5a00" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ff5a00" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1000" height="1000" fill={`url(#${id}-base)`} />
        <rect width="1000" height="1000" fill={`url(#${id}-glow)`} />
        <Variant seed={seed} accent={palette.accent} id={id} />
        <rect width="1000" height="1000" fill={`url(#${id}-vignette)`} />
      </svg>
      <div className="scanlines absolute inset-0 opacity-50" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
