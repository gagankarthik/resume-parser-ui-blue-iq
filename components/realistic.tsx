// Realistic illustration kit. Real objects from a document team's desk - a
// resume, a nursing license card, a staffing contract, a phone photo of a page -
// rendered with real typeset content, paper grain, directional light and
// layered contact shadows, instead of grey bars standing in for text.
//
// Everything is HTML/CSS plus small inline SVG: no image requests, crisp at any
// density, and server-rendered. All pieces are decorative (aria-hidden); the
// copy beside them carries the meaning. Pieces have a fixed natural size;
// callers fit them with CSS zoom (e.g. `[zoom:0.8] sm:[zoom:1]`), which scales
// the layout box too and keeps type proportions true.

import type { CSSProperties, ReactNode } from "react";

/* -- Materials ------------------------------------------------------------ */

/** Pieces are placed by their caller; only default to `relative` (for their
 *  own overlays) when the caller did not ask for absolute placement. */
function pos(className: string): string {
  return /(^|\s)absolute(\s|$)/.test(className) ? "" : "relative ";
}

/** Fine paper grain: fractal noise, desaturated, laid over the sheet. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.09'/%3E%3C/svg%3E\")";

/** Contact + ambient shadow of a sheet lying on a surface. */
const SHEET_SHADOW =
  "0 0.5px 0 rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.08), 0 10px 18px -8px rgba(15,23,42,0.22), 0 34px 60px -28px rgba(15,23,42,0.35)";

/** Light from the upper left, falling off across the page. */
const PAPER_LIGHT = "linear-gradient(158deg, #ffffff 0%, #fdfdfb 45%, #f4f3ee 100%)";

function Sheet({
  width,
  height,
  children,
  className = "",
  style,
  tone = PAPER_LIGHT,
}: {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  tone?: string;
}) {
  return (
    <div
      aria-hidden
      data-nosnippet
      className={pos(className) + "overflow-hidden rounded-[3px] text-left " + className}
      style={{ width, height, background: tone, boxShadow: SHEET_SHADOW, ...style }}
    >
      <div className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

/** A highlighter stroke: translucent, multiplied, slightly uneven at the ends. */
export function Highlight({ children, color = "rgba(255,214,64,0.62)" }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="relative whitespace-nowrap"
      style={{
        backgroundImage: `linear-gradient(100deg, transparent 0.12em, ${color} 0.22em, ${color} calc(100% - 0.25em), transparent calc(100% - 0.1em))`,
        backgroundSize: "100% 72%",
        backgroundPosition: "0 70%",
        backgroundRepeat: "no-repeat",
        mixBlendMode: "multiply",
        borderRadius: "0.2em 0.5em 0.3em 0.6em",
        padding: "0 0.12em",
      }}
    >
      {children}
    </span>
  );
}

/* -- The resume ----------------------------------------------------------- */

function SectionHead({ children }: { children: ReactNode }) {
  return <p className="mt-[9px] border-b border-[#1f2a44]/25 pb-[2px] text-[6.4px] font-bold uppercase tracking-[0.14em] text-[#1f2a44]">{children}</p>;
}

function Mark({ on, children }: { on: boolean; children: ReactNode }) {
  return on ? <Highlight>{children}</Highlight> : <>{children}</>;
}

/** A registered nurse's one-page resume, typeset the way a real one is. Letter
 *  proportions (8.5 x 11). `marked` adds the reviewer's highlighter. */
export function ResumeSheet({ marked = false, className = "", style }: { marked?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <Sheet width={300} height={388} className={className} style={style}>
      <div className="px-[26px] pt-[24px] font-serif text-[6.3px] leading-[1.5] text-[#2b3445]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <p className="text-[17px] leading-none tracking-[0.01em] text-[#141c2e]">
          <Mark on={marked}>Jane A. Smith</Mark>, <span className="text-[12px]">RN, BSN</span>
        </p>
        <p className="mt-[5px] text-[6px] tracking-[0.02em] text-[#4a5468]">
          Knoxville, TN 37902 &nbsp;|&nbsp; (865) 541-1111 &nbsp;|&nbsp; jane.smith@example.com
        </p>

        <SectionHead>Summary</SectionHead>
        <p className="mt-[3px]">
          Registered Nurse with six years on a 32-bed telemetry unit. Charge nurse experience, preceptor to new graduates,
          and a record of zero falls across two consecutive quarters.
        </p>

        <SectionHead>Experience</SectionHead>
        <div className="mt-[4px] flex justify-between">
          <p className="font-bold text-[#141c2e]">
            <Mark on={marked}>Fort Sanders Regional Medical Center</Mark>
          </p>
          <p className="italic text-[#4a5468]">
            <Mark on={marked}>01/2022</Mark> to present
          </p>
        </div>
        <p className="italic">
          Registered Nurse, <Mark on={marked}>Med Surg / Telemetry</Mark>
        </p>
        <ul className="mt-[2px] list-disc pl-[10px]">
          <li>Charge nurse on a 32-bed telemetry unit, 1:5 ratio, rotating nights</li>
          <li>Precepted six new graduate nurses through orientation</li>
          <li>Unit champion for the sepsis early-warning protocol</li>
        </ul>
        <div className="mt-[5px] flex justify-between">
          <p className="font-bold text-[#141c2e]">Parkwest Medical Center</p>
          <p className="italic text-[#4a5468]">06/2019 to 12/2021</p>
        </div>
        <p className="italic">Registered Nurse, Progressive Care</p>
        <ul className="mt-[2px] list-disc pl-[10px]">
          <li>Step-down care for cardiac and post-surgical patients</li>
          <li>Titrated drips per protocol; telemetry interpretation</li>
        </ul>

        <SectionHead>Education</SectionHead>
        <div className="mt-[4px] flex justify-between">
          <p>
            <span className="font-bold text-[#141c2e]">University of Tennessee</span>, Bachelor of Science in Nursing
          </p>
          <p className="italic text-[#4a5468]">2019</p>
        </div>

        <SectionHead>Licenses and certifications</SectionHead>
        <p className="mt-[3px]">
          <Mark on={marked}>Registered Nurse, Tennessee (multistate)</Mark>
        </p>
        <p>
          <Mark on={marked}>Basic Life Support</Mark>, American Heart Association
        </p>
        <p>Advanced Cardiovascular Life Support, American Heart Association</p>
      </div>
    </Sheet>
  );
}

/* -- The license card ----------------------------------------------------- */

/** A generic state nursing license, CR80 proportions: guilloche background,
 *  seal, photo, holographic stripe. Not modelled on any real board's card. */
export function LicenseCard({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden
      data-nosnippet
      className={pos(className) + "overflow-hidden rounded-[12px] text-left " + className}
      style={{
        width: 252,
        height: 159,
        background:
          "repeating-radial-gradient(circle at 78% 30%, rgba(255,255,255,0.10) 0 1px, transparent 1px 5px), linear-gradient(135deg, #1a5fe6 0%, #1449c4 55%, #0b2a73 100%)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.35) inset, 0 2px 3px rgba(15,23,42,0.18), 0 18px 34px -14px rgba(11,42,115,0.55)",
        ...style,
      }}
    >
      {/* gloss */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 38%)" }} />
      {/* header band */}
      <div className="relative flex items-center gap-2 px-3.5 pt-3">
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none">
          <circle cx="12" cy="12" r="10.5" stroke="#fff" strokeOpacity=".85" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="7.5" stroke="#fff" strokeOpacity=".55" strokeWidth=".8" strokeDasharray="1.5 1.2" />
          <path d="M12 7.2l1.3 2.8 3 .3-2.3 2 .7 3-2.7-1.6-2.7 1.6.7-3-2.3-2 3-.3z" fill="#fff" fillOpacity=".9" />
        </svg>
        <div className="leading-tight">
          <p className="text-[7px] font-bold tracking-[0.16em] text-white/90">STATE BOARD OF NURSING</p>
          <p className="text-[6px] tracking-[0.08em] text-white/65">License to practice</p>
        </div>
      </div>
      <div className="relative mt-2.5 flex gap-3 px-3.5">
        {/* photo */}
        <div className="h-[74px] w-[58px] shrink-0 overflow-hidden rounded-[4px] ring-1 ring-white/40" style={{ background: "linear-gradient(180deg, #dbe6f7, #b9c9e6)" }}>
          <svg viewBox="0 0 58 74" width="58" height="74">
            <defs>
              <linearGradient id="lc-skin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e9c3a6" />
                <stop offset="1" stopColor="#c99a7c" />
              </linearGradient>
            </defs>
            <path d="M8 74c1-15 9-22 21-22s20 7 21 22z" fill="#2c4a7a" />
            <path d="M22 52l7 7 7-7v-5H22z" fill="url(#lc-skin)" />
            <ellipse cx="29" cy="34" rx="11" ry="13" fill="url(#lc-skin)" />
            <path d="M17 33c-1-12 6-18 13-18s13 5 12 17c-2-6-6-9-12-9-7 0-11 4-13 10z" fill="#3b2a22" />
          </svg>
        </div>
        <div className="min-w-0 text-white">
          <p className="text-[6px] tracking-[0.08em] text-white/60">NAME</p>
          <p className="text-[10.5px] font-semibold leading-tight tracking-[0.02em]">JANE A. SMITH</p>
          <p className="mt-1.5 text-[6px] tracking-[0.08em] text-white/60">LICENSE TYPE</p>
          <p className="text-[8.5px] font-semibold leading-tight">Registered Nurse</p>
          <p className="mt-1.5 text-[6px] tracking-[0.08em] text-white/60">STATUS</p>
          <p className="text-[8.5px] font-semibold leading-tight">Active, multistate</p>
        </div>
      </div>
      {/* holographic stripe */}
      <div
        className="absolute bottom-3 right-3.5 h-[22px] w-[64px] rounded-[4px] opacity-90"
        style={{ background: "conic-gradient(from 200deg, #9ff3ff, #ffd6f5, #fff3a8, #b9ffcf, #9fc2ff, #9ff3ff)", mixBlendMode: "screen" }}
      />
      <p className="absolute bottom-3 left-3.5 text-[6.5px] tracking-[0.06em] text-white/75">Expires 03/31/2027</p>
    </div>
  );
}

/* -- The contract --------------------------------------------------------- */

export function ContractSheet({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <Sheet width={290} height={375} className={className} style={style}>
      <div className="px-[26px] pt-[26px] text-[6.1px] leading-[1.55] text-[#2b3445]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <p className="text-center text-[10px] font-bold tracking-[0.06em] text-[#141c2e]">CLINICAL STAFFING SERVICES AGREEMENT</p>
        <p className="mt-[6px] text-center italic text-[#4a5468]">Effective 1 July 2025</p>
        {[
          ["1. Parties.", "This agreement is made between the Agency and the Facility named in Schedule A, each a Party."],
          ["2. Services.", "The Agency will supply licensed clinical staff to fill the assignments the Facility requests in writing."],
          ["3. Term.", "The term runs from the effective date to 30 June 2027 and renews for one year unless either Party gives 60 days' notice."],
          ["4. Credentials.", "Every clinician placed will hold a current license in the state of assignment and BLS certification."],
          ["5. Rates.", "Bill rates are set out in Schedule B and are fixed for the first twelve months of the term."],
          ["6. Governing law.", "This agreement is governed by the laws of the State of Tennessee."],
        ].map(([h, b]) => (
          <p key={h} className="mt-[6px] text-justify">
            <span className="font-bold text-[#141c2e]">{h}</span> {b}
          </p>
        ))}
        <div className="mt-[16px] grid grid-cols-2 gap-5">
          {["For the Agency", "For the Facility"].map((who, i) => (
            <div key={who}>
              <svg viewBox="0 0 110 30" className="h-[22px] w-full" fill="none">
                <path
                  d={
                    i
                      ? "M4 22c8-14 12-16 14-8s-2 10 3 4 8-14 11-6-1 10 5 3 10-9 14-3 6 4 12-1 12-6 20-4"
                      : "M3 20c6-4 10-16 14-12s-6 16 0 12 10-12 13-6-2 9 4 5 7-7 10-3 9 2 14-2 11-3 18 1"
                  }
                  stroke="#1c3fa8"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="border-t border-[#1f2a44]/40 pt-[2px] text-[5.6px] italic text-[#4a5468]">{who}</div>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/* -- The phone photo of a page ------------------------------------------- */

/** The same resume as someone photographed it on a desk: warm cast, slight
 *  keystone, a fold, a coffee ring and a vignette. */
export function PhotographedPage({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div aria-hidden data-nosnippet className={pos(className) + className} style={{ width: 300, height: 388, perspective: 900, ...style }}>
      <div style={{ transform: "rotateX(9deg) rotateZ(-4deg)", transformOrigin: "50% 60%" }}>
        <div className="relative" style={{ filter: "sepia(0.22) saturate(0.9) contrast(0.96) brightness(0.98)" }}>
          <ResumeSheet />
          {/* fold across the middle */}
          <div
            className="pointer-events-none absolute inset-x-0 top-[47%] h-[16px]"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(60,45,20,0.10) 45%, rgba(255,255,255,0.35) 55%, rgba(0,0,0,0) 100%)" }}
          />
          {/* coffee ring */}
          <div
            className="pointer-events-none absolute right-[34px] top-[210px] h-[74px] w-[74px] rounded-full"
            style={{
              background: "radial-gradient(circle, transparent 58%, rgba(146,98,48,0.28) 62%, rgba(146,98,48,0.12) 68%, transparent 72%)",
              mixBlendMode: "multiply",
            }}
          />
          {/* uneven phone lighting + vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(120% 90% at 30% 20%, rgba(255,250,235,0.18) 0%, rgba(0,0,0,0) 45%, rgba(40,30,15,0.22) 100%)" }}
          />
        </div>
      </div>
    </div>
  );
}

/* -- Small realistic props ------------------------------------------------ */

/** A sticky note with a curled lower edge. */
export function StickyNote({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden
      data-nosnippet
      className={pos(className) + className}
      style={{
        width: 128,
        minHeight: 118,
        padding: "14px 14px 20px",
        background: "linear-gradient(170deg, #fff2a6 0%, #ffe879 70%, #f7d95a 100%)",
        boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 14px 18px -12px rgba(120,90,0,0.55)",
        borderBottomRightRadius: "28px 8px",
        ...style,
      }}
    >
      <div className="text-[14px] leading-snug text-[#3b3200]" style={{ fontFamily: "'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive" }}>
        {children}
      </div>
    </div>
  );
}
