// Blue-IQ icon set. Drawn for this product rather than pulled from a generic
// pack: a 24px grid, a 1.6px stroke, and a duotone "body" - one soft shape
// filled at 14% of currentColor under the line work - so every icon carries
// the same weight and reads as one family next to the logo.
//
// Rules: stroke is currentColor, the tint is currentColor at FILL opacity, and
// nothing else. Add new icons here rather than inlining a one-off SVG.
import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const FILL = 0.14;

function Svg({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={20}
      height={20}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/** The duotone body: a tinted shape with no stroke of its own. */
function Tint({ d }: { d: string }) {
  return <path d={d} fill="currentColor" fillOpacity={FILL} stroke="none" />;
}

/* -- Navigation --------------------------------------------------------------- */

/** Overview: two tiles and a rising trace, the dashboard in miniature. */
export function OverviewIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 4h7v7H4z" />
      <rect x="4" y="4" width="7" height="7" rx="1.8" />
      <rect x="13" y="4" width="7" height="4.5" rx="1.6" />
      <path d="M4 19.5l4.2-4.6 3.3 2.6 4.3-5.2 4.2 3.4" />
    </Svg>
  );
}

/** Endpoints: a route from one node branching to two. */
export function EndpointIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M3.6 12a2.6 2.6 0 1 0 5.2 0 2.6 2.6 0 1 0-5.2 0Z" />
      <circle cx="6.2" cy="12" r="2.6" />
      <path d="M8.8 12h3c1.6 0 2.2-5.5 4.4-5.5M11.8 12c1.6 0 2.2 5.5 4.4 5.5" />
      <rect x="16.4" y="4.6" width="4" height="3.8" rx="1.2" />
      <rect x="16.4" y="15.6" width="4" height="3.8" rx="1.2" />
    </Svg>
  );
}

/** API key with a tag - the credential, not a door. */
export function KeyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 15.8a4.3 4.3 0 1 0 8.6 0 4.3 4.3 0 1 0-8.6 0Z" />
      <circle cx="8.3" cy="15.8" r="4.3" />
      <circle cx="8.3" cy="15.8" r="1.3" />
      <path d="M11.4 12.7l8.3-8.3M16.2 7.9l2 2M18.4 5.7l1.6 1.6" />
    </Svg>
  );
}

/** Webhook: a delivery leaving a node, with signal arcs. */
export function WebhookIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M3.5 17.5a3 3 0 1 0 6 0 3 3 0 1 0-6 0Z" />
      <circle cx="6.5" cy="17.5" r="3" />
      <path d="M8.6 15.4l5.6-5.6" />
      <path d="M13.2 5.3a5 5 0 0 1 5.5 5.5M13.6 8.1a2.3 2.3 0 0 1 2.3 2.3" />
      <circle cx="15" cy="9" r="0.6" fill="currentColor" />
    </Svg>
  );
}

/** Docs: an open reference with a code bracket. */
export function DocsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 5.5c2.7-1 5.3-1 8 .6v13.4c-2.7-1.6-5.3-1.6-8-.6Z" />
      <path d="M12 6.1c-2.7-1.6-5.3-1.6-8-.6v13.4c2.7-1 5.3-1 8 .6m0-13.4c2.7-1.6 5.3-1.6 8-.6v13.4c-2.7-1-5.3-1-8 .6m0-13.4v13.4" />
      <path d="M15.2 10.2l-1.2 1.4 1.2 1.4M17.2 10.2l1.2 1.4-1.2 1.4" />
    </Svg>
  );
}

/** Admin: a shield with a check. */
export function AdminIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M12 3.2l7 2.8v5.3c0 4.4-3 7.7-7 8.8-4-1.1-7-4.4-7-8.8V6z" />
      <path d="M12 3.2l7 2.8v5.3c0 4.4-3 7.7-7 8.8-4-1.1-7-4.4-7-8.8V6z" />
      <path d="M9.2 11.8l2 2 3.8-4" />
    </Svg>
  );
}
export const ShieldIcon = AdminIcon;

/** Customers: an organisation - a building with its people count. */
export function CustomersIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 20V6.5L11 4v16z" />
      <path d="M4 20V6.5L11 4v16M11 9.5h7.5a1.5 1.5 0 0 1 1.5 1.5v9M2.8 20h18.4" />
      <path d="M7 8.5v.01M7 12v.01M7 15.5v.01M14.5 13h2M14.5 16.5h2" strokeWidth={1.9} />
    </Svg>
  );
}

/** People - used for counts of users/organisations in stat tiles. */
export function UsersIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M5.6 8a3.4 3.4 0 1 0 6.8 0 3.4 3.4 0 1 0-6.8 0Z" />
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3.3 19.5a5.8 5.8 0 0 1 11.4 0M16 5a3.2 3.2 0 0 1 0 6.1M17.2 14.2a5.6 5.6 0 0 1 3.5 5.3" />
    </Svg>
  );
}

/** Data: a table with a highlighted row. */
export function DatabaseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 10h16v4H4z" />
      <rect x="4" y="4.5" width="16" height="15" rx="2.2" />
      <path d="M4 10h16M4 14h16M10 4.5v15" />
    </Svg>
  );
}

/** Profile: a person in a frame. */
export function ProfileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z" />
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <circle cx="12" cy="10" r="2.8" />
      <path d="M7.4 18.2a5 5 0 0 1 9.2 0" />
    </Svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M5 5.5A1.5 1.5 0 0 1 6.5 4H11v16H6.5A1.5 1.5 0 0 1 5 18.5z" />
      <path d="M11 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H11M15 8l4 4-4 4M19 12H9.5" />
    </Svg>
  );
}

/** Sidebar collapse: a panel edge with a chevron. */
export function CollapseIcon({ collapsed, ...props }: IconProps & { collapsed?: boolean }) {
  return (
    <Svg {...props} style={collapsed ? { transform: "scaleX(-1)" } : undefined}>
      <Tint d="M4 5.5A1.5 1.5 0 0 1 5.5 4H9v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
      <rect x="4" y="4" width="16" height="16" rx="2.2" />
      <path d="M9 4v16M15.5 9.5L13 12l2.5 2.5" />
    </Svg>
  );
}

/* -- Domain metrics ----------------------------------------------------------- */

/** Jobs: two stacked documents. */
export function JobsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M8 7.5A1.5 1.5 0 0 1 9.5 6H16l3 3v10.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 8 19.5z" />
      <path d="M8 7.5A1.5 1.5 0 0 1 9.5 6H16l3 3v10.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 8 19.5zM16 6v3h3" />
      <path d="M5 16.5V4.5A1.5 1.5 0 0 1 6.5 3H13M11 13h5M11 16.5h3.5" />
    </Svg>
  );
}

/** Tokens: a stack of counters. */
export function TokenIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M5 7c0-1.4 3.1-2.5 7-2.5s7 1.1 7 2.5-3.1 2.5-7 2.5S5 8.4 5 7Z" />
      <ellipse cx="12" cy="7" rx="7" ry="2.5" />
      <path d="M5 7v5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V7M5 12v5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-5" />
    </Svg>
  );
}

/** Success: a seal with a check. */
export function SuccessIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M12 3.5l2.2 1.6 2.7-.1.9 2.6 2.2 1.6-.8 2.6.8 2.6-2.2 1.6-.9 2.6-2.7-.1L12 20.5l-2.2-1.6-2.7.1-.9-2.6L4 14.8l.8-2.6L4 9.6l2.2-1.6.9-2.6 2.7.1z" />
      <path d="M12 3.5l2.2 1.6 2.7-.1.9 2.6 2.2 1.6-.8 2.6.8 2.6-2.2 1.6-.9 2.6-2.7-.1L12 20.5l-2.2-1.6-2.7.1-.9-2.6L4 14.8l.8-2.6L4 9.6l2.2-1.6.9-2.6 2.7.1z" />
      <path d="M9 12.2l2 2 4-4.2" />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0Z" />
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 1.8" />
    </Svg>
  );
}

/** OCR: a page under a read line. */
export function ScanIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M7 4h7l3 3v13H7z" />
      <path d="M7 4h7l3 3v13H7zM14 4v3h3" />
      <path d="M3.5 12.5h17" />
      <path d="M9.5 9h3M9.5 16h5" />
    </Svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 15h16v3.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5z" />
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15M12 15V4M7.5 8.5L12 4l4.5 4.5" />
    </Svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M5 20v-6h3v6zM10.5 20V9h3v11zM16 20V5h3v15z" />
      <path d="M5 20v-6h3v6zM10.5 20V9h3v11zM16 20V5h3v15zM3 20h18" />
    </Svg>
  );
}

export function GaugeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 16a8 8 0 1 1 16 0z" />
      <path d="M4 16a8 8 0 1 1 16 0M12 16l3.5-4.5M3 19.5h18" />
    </Svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M10.3 4.4a2 2 0 0 1 3.4 0l7.1 12.4a2 2 0 0 1-1.7 3H4.9a2 2 0 0 1-1.7-3z" />
      <path d="M10.3 4.4a2 2 0 0 1 3.4 0l7.1 12.4a2 2 0 0 1-1.7 3H4.9a2 2 0 0 1-1.7-3zM12 9.5v4M12 16.6v.01" />
    </Svg>
  );
}

/** A file with its type badge - for file-type breakdowns. */
export function FileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M6 4.5A1.5 1.5 0 0 1 7.5 3H14l4 4v12.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5z" />
      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3H14l4 4v12.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5zM14 3v4h4M9 13h6M9 16.5h4" />
    </Svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 9h16v9.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z" />
      <rect x="4" y="5" width="16" height="15" rx="1.8" />
      <path d="M4 9h16M8.5 3v4M15.5 3v4" />
    </Svg>
  );
}

/* -- Actions ------------------------------------------------------------------ */

export function RefreshIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19.5 12a7.5 7.5 0 0 1-13.3 4.8M4.5 12a7.5 7.5 0 0 1 13.3-4.8" />
      <path d="M18.3 3.8v3.6h-3.6M5.7 20.2v-3.6h3.6" />
    </Svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4.5 10.5a6 6 0 1 0 12 0 6 6 0 1 0-12 0Z" />
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </Svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 5h16l-6 7.5V19l-4-2v-4.5z" />
      <path d="M4 5h16l-6 7.5V19l-4-2v-4.5z" />
    </Svg>
  );
}

/** Sort: two opposed arrows. */
export function SortIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 4v16M4.5 7.5L8 4l3.5 3.5M16 20V4M12.5 16.5L16 20l3.5-3.5" />
    </Svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M4 15h16v3.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5z" />
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15M12 4v11M7.5 10.5L12 15l4.5-4.5" />
    </Svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M9 9h10.5v10.5H9z" />
      <rect x="9" y="9" width="10.5" height="10.5" rx="2" />
      <path d="M15 9V6a1.5 1.5 0 0 0-1.5-1.5h-7.5A1.5 1.5 0 0 0 4.5 6v7.5A1.5 1.5 0 0 0 6 15h3" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth={2} />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" strokeWidth={1.9} />
    </Svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M6.5 7.5h11l-.9 11.2a1.5 1.5 0 0 1-1.5 1.3H8.9a1.5 1.5 0 0 1-1.5-1.3z" />
      <path d="M4.5 7.5h15M9.5 7.5V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2.5M6.5 7.5l.9 11.2a1.5 1.5 0 0 0 1.5 1.3h6.2a1.5 1.5 0 0 0 1.5-1.3l.9-11.2M10.3 11v5.5M13.7 11v5.5" />
    </Svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13.5 4.5H19.5V10.5M19.5 4.5l-8 8M17 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 4 18.5v-10A1.5 1.5 0 0 1 5.5 7H10" />
    </Svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 19V5M6.5 10.5L12 5l5.5 5.5" strokeWidth={2} />
    </Svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M6.5 13.5L12 19l5.5-5.5" strokeWidth={2} />
    </Svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <Tint d="M7 5.5v13l11-6.5z" />
      <path d="M7 5.5v13l11-6.5z" />
    </Svg>
  );
}
