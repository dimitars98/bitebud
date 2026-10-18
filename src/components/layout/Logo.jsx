// BiteBud "Route B" mark: the B is one courier route,
// starting at the kitchen (ring) and ending at your door (dot).
// `onDark` forces the dark-background colours (e.g. the footer) in both themes.
export default function Logo({ size = 40, className = "", onDark = false }) {
  const stroke = onDark ? "text-(--brand-primary)" : "text-(--brand) dark:text-(--brand-primary)";
  const dot = onDark ? "fill-white" : "fill-(--text-secondary) dark:fill-(--text-primary)";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={`${stroke} ${className}`}
    >
      <path
        d="M30 88 V14 H54 A17 17 0 0 1 54 48 H56 A20 20 0 0 1 56 88 H50"
        fill="none"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* kitchen: start ring */}
      <circle cx="30" cy="88" r="6.75" fill="none" stroke="currentColor" strokeWidth="4.5" />
      {/* door: end dot */}
      <circle cx="46" cy="88" r="7" className={dot} />
    </svg>
  );
}
