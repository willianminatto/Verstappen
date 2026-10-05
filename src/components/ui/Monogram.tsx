/** Project monogram. Original mark — not an official logo. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 46 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2 22V2l10 12L22 2v20M26 2l8 20 8-20"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />
    </svg>
  );
}
