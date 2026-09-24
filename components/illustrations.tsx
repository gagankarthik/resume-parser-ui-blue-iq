// Blue-IQ diagram set: the small, schematic SVGs (empty states, the API
// network, the Sonar lens). Anything meant to look like a real object -
// documents, cards, photos - lives in components/realistic.tsx instead.
//
// All decorative: every one is aria-hidden, and the copy beside it carries the
// meaning.

const INK = "#0c1a3a";
const BLUE = "#1a5fe6";
const LOGO = "#297aff";
const CYAN = "#34c2ff";
const LINE = "#c9d3e3";
const SOFT = "#dce8ff";

type ArtProps = { className?: string };

/* -- Error pages ----------------------------------------------------------- */

/** A disconnected plug: the dashboard failed to reach the API. */
export function UnpluggedArt({ className = "h-auto w-full" }: ArtProps) {
  return (
    <svg viewBox="0 0 240 120" className={className} fill="none" aria-hidden>
      <path d="M10 60h62" stroke={LINE} strokeWidth="4" strokeLinecap="round" />
      <rect x="72" y="42" width="34" height="36" rx="7" fill={BLUE} />
      <path d="M106 52h14M106 68h14" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
      <path d="M130 44l6 6M138 60h9M130 76l6-6" stroke="#b7820a" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="156" y="42" width="34" height="36" rx="7" fill="#fff" stroke={INK} strokeOpacity=".35" strokeWidth="1.6" />
      <circle cx="166" cy="60" r="2.5" fill={INK} fillOpacity=".4" />
      <circle cx="180" cy="60" r="2.5" fill={INK} fillOpacity=".4" />
      <path d="M190 60h40" stroke={LINE} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/* -- Dashboard empty states ------------------------------------------------ */

/** A key on a tag - no API keys yet. */
export function KeyArt({ className = "h-16 w-auto" }: ArtProps) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden>
      <path d="M72 14h32a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H72l-10-15 10-15Z" fill="#fff" stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="74" cy="29" r="3" fill={LINE} />
      <path d="M82 25h18M82 33h12" stroke={SOFT} strokeWidth="3" strokeLinecap="round" />
      <path d="M71 29c-10 2-18 8-24 16" stroke={LINE} strokeWidth="1.4" />
      <circle cx="36" cy="52" r="15" fill={BLUE} />
      <circle cx="36" cy="52" r="5" fill="#fff" />
      <path d="M47 62l22 12M60 69l-4 6M66 72l-3 5" stroke={BLUE} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

/** Two endpoints waiting to be joined - no webhooks yet. */
export function HookArt({ className = "h-16 w-auto" }: ArtProps) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden>
      <rect x="8" y="22" width="36" height="36" rx="8" fill={BLUE} />
      <path d="M18 34h16M18 40h10M18 46h13" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M44 40h12" stroke={BLUE} strokeWidth="2" />
      <path d="M60 40h10" stroke={LINE} strokeWidth="2" strokeDasharray="3 4" />
      <path d="M74 40h2" stroke={LINE} strokeWidth="2" />
      <rect x="78" y="22" width="36" height="36" rx="8" fill="#fff" stroke={LINE} strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M90 40h12M96 34v12" stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* -- Landing: hero ---------------------------------------------------------- */

/** The Sonar engine between the paperwork and the record: the logogram in a
 *  lens, with the flow running through it. */
export function SonarLensArt({ className = "h-auto w-full" }: ArtProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} fill="none" aria-hidden>
      <path d="M4 60h32M124 60h28" stroke={BLUE} strokeWidth="2" strokeDasharray="3 5" strokeLinecap="round" />
      <path d="M148 53l8 7-8 7" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="60" r="44" fill="#fff" style={{ filter: "drop-shadow(0 10px 20px rgba(26,95,230,0.18))" }} />
      <circle cx="80" cy="60" r="41" stroke={SOFT} strokeWidth="6" />
      <g transform="translate(61.5 41) scale(0.92)">
        <path
          d="M33.724 36.5809C37.7426 32.5622 40.0003 27.1118 40.0003 21.4286C40.0003 15.7454 37.7426 10.2949 33.724 6.27629C29.7054 2.25765 24.2549 0 18.5717 0C12.8885 0 7.43807 2.25764 3.41943 6.27628L10.4905 13.3473C11.6063 14.4631 13.4081 14.4074 14.8276 13.7181C15.9836 13.1568 17.2622 12.8571 18.5717 12.8571C20.845 12.8571 23.0252 13.7602 24.6326 15.3677C26.2401 16.9751 27.1431 19.1553 27.1431 21.4286C27.1431 22.7381 26.8435 24.0167 26.2822 25.1727C25.5929 26.5922 25.5372 28.394 26.6529 29.5098L33.724 36.5809Z"
          fill={LOGO}
        />
        <path d="M30 40H19.5098C17.9943 40 16.5408 39.398 15.4692 38.3263L1.67368 24.5308C0.60204 23.4592 0 22.0057 0 20.4902V10L30 40Z" fill={CYAN} />
        <path d="M10.7143 39.9999H4.28571C1.91878 39.9999 0 38.0812 0 35.7142V29.2856L10.7143 39.9999Z" fill={CYAN} />
      </g>
    </svg>
  );
}

/* -- Landing: feature row --------------------------------------------------- */

/** One record reaching every system that consumes it. */
export function ApiNetworkArt({ className = "h-auto w-full" }: ArtProps) {
  const nodes = [
    { x: 50, y: 34, label: "ATS" },
    { x: 150, y: 16, label: "Webhook" },
    { x: 250, y: 34, label: "CRM" },
    { x: 50, y: 150, label: "HRIS" },
    { x: 150, y: 170, label: "SDK" },
    { x: 250, y: 150, label: "Warehouse" },
  ];
  return (
    <svg viewBox="0 0 300 190" className={className} fill="none" aria-hidden>
      {nodes.map((n) => (
        <path key={`l${n.label}`} d={`M150 93 L${n.x} ${n.y}`} stroke="#0f172a" strokeOpacity=".22" strokeWidth="1.4" strokeDasharray="3 4" />
      ))}
      <circle cx="150" cy="93" r="32" fill="#fff" style={{ filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.1))" }} />
      <text x="150" y="100" textAnchor="middle" fontSize="20" fontWeight="600" fill={BLUE} fontFamily="ui-monospace, monospace">
        {"{ }"}
      </text>
      {nodes.map((n) => {
        const w = n.label.length * 6.6 + 24;
        return (
          <g key={n.label}>
            <rect x={n.x - w / 2} y={n.y - 12} width={w} height="24" rx="12" fill="#fff" stroke="#000" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#1e293b" fontFamily="ui-sans-serif, system-ui">
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

