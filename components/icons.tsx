// Blue-IQ icon set — hand-drawn, not an icon-font dependency: 24px viewBox, 20px
// default render, currentColor, 1.7–1.8 stroke. Keeping one weight across the
// whole set is what makes them read as a family next to the sidebar and nav marks.
//
// Mirrored in the other app so both read as one product; add new icons here
// rather than inlining a one-off SVG in a page.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={20} height={20} aria-hidden {...props}>
      {children}
    </svg>
  );
}

/* ── Domain ────────────────────────────────────────────────────────────────── */

/** API key — used wherever keys are surfaced (stat cards, headers).
 *
 *  Built from three separate pieces rather than one doubling-back path: the bow
 *  is a true circle, the shaft is a straight diagonal that starts exactly on the
 *  bow's edge (centre 8.2,15.8 + r4.3 lands on 11.3,12.7), and the two teeth sit
 *  perpendicular to the shaft. Keeping them separate is what stops the shape
 *  collapsing into a blob at 20px. */
export function KeyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="8.2" cy="15.8" r="4.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M11.3 12.7 20 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m16.5 7.5 1.9 1.9M18.3 5.7l1.9 1.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

/** Jobs processed — stacked layers. */
export function JobsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M3 12l9 5 9-5M3 16.5l9 5 9-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Tokens — sparkle. */
export function TokenIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3l2.4 6.1L21 12l-6.6 2.9L12 21l-2.4-6.1L3 12l6.6-2.9L12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </Svg>
  );
}

/** Success / completed — check in a circle. */
export function SuccessIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 12.2l2.4 2.4 4.6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Processing time — clock. */
export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Users / companies — people. */
export function UsersIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 6.2a3 3 0 0 1 0 5.6M16.5 19a5.5 5.5 0 0 0-2.7-4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** OCR / scanned documents — scan frame. */
export function ScanIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

/** Webhooks — a branching delivery hook. */
export function WebhookIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="7" cy="17" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="17" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="6.5" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.7 8.8 8.2 14.6M13.3 8.8l2.5 5.8M9.6 17h4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

/** Documentation — an open book. */
export function DocsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 6.5C10.6 5.2 8.6 4.6 4.5 4.6v12.8c4.1 0 6.1.6 7.5 1.9 1.4-1.3 3.4-1.9 7.5-1.9V4.6c-4.1 0-6.1.6-7.5 1.9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 6.5v12.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

/** Admin / permissions — shield. */
export function ShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.2 5 6v5.6c0 4 2.9 7.4 7 8.4 4.1-1 7-4.4 7-8.4V6l-7-2.8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.2 12.2 11 14l3.8-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Upload / drop a résumé. */
export function UploadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 15.5V4.8M8.2 8.6 12 4.8l3.8 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 14.5v3A1.5 1.5 0 0 0 6 19h12a1.5 1.5 0 0 0 1.5-1.5v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

/** Analytics — bar chart. */
export function ChartIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 19.5h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7 19.5v-6.5M12 19.5V7.5M17 19.5v-9.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  );
}

/** Latency / throughput — gauge. */
export function GaugeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 17a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m12 17 4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.4" fill="currentColor" />
    </Svg>
  );
}

/** Errors — alert triangle. */
export function AlertIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 9v4.5M12 17h.01M10.3 4.4 2.9 17.6A1.9 1.9 0 0 0 4.6 20.5h14.8a1.9 1.9 0 0 0 1.7-2.9L13.7 4.4a1.9 1.9 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Stored records — database. */
export function DatabaseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="6.5" rx="7" ry="2.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 6.5v11c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

/* ── Interface ─────────────────────────────────────────────────────────────── */

export function RefreshIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19.7 4.6v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.3" stroke="currentColor" strokeWidth="1.8" />
      <path d="m15.6 15.6 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4.5v11M8.2 11.7 12 15.5l3.8-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 15.5v2A1.5 1.5 0 0 0 6 19h12a1.5 1.5 0 0 0 1.5-1.5v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 6h15l-5.8 6.8v5.4l-3.4 1.8v-7.2L4.5 6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </Svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="9" y="9" width="10.5" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 6.6A2 2 0 0 0 13 4.5H6.5a2 2 0 0 0-2 2V13a2 2 0 0 0 2.1 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 4.5h5.5V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m19.5 4.5-7.5 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 14.5v3.6a1.9 1.9 0 0 1-1.9 1.9H5.9A1.9 1.9 0 0 1 4 18.1V7.9A1.9 1.9 0 0 1 5.9 6h3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m9 5.5 6.5 6.5L9 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 5.6v12.8l10-6.4L8 5.6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </Svg>
  );
}
