import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { API_BASE } from "@/lib/config";
import { ORG_NAME, SITE_NAME, SITE_URL } from "@/lib/site";
import { getSessionClaims } from "@/lib/session";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { CodeTabs, type Sample } from "@/components/landing/CodeTabs";
import { HeroCanvas } from "@/components/landing/HeroCanvas";
import { ApiNetworkArt } from "@/components/illustrations";
import { Highlight, LicenseCard, PhotographedPage, ResumeSheet } from "@/components/realistic";
import { GlowCard, Panel, Pill } from "@/components/ui";

const DEMO_URL = "https://blue-iq.ai/contact";

// Title leads with the term people search ("resume parsing API"), stays under
// 60 characters so it is not truncated, and puts the brand last. `absolute`
// skips the root template, which would append the brand a second time.
const TITLE = "Resume Parsing API with Confidence Scores | Blue-IQ Capture";
const DESCRIPTION =
  "Parse resumes, nursing licenses and certifications into structured JSON with a confidence score on every field. Null instead of guesses. REST API and signed webhooks.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "resume parsing API",
    "resume parser",
    "CV parser",
    "nursing license verification",
    "healthcare staffing",
    "credential extraction",
    "confidence scores",
    "structured JSON",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Organization + WebSite + SoftwareApplication, linked by @id. No price and no
// rating: the product is sold by demo, and structured data that claims a free
// offer or invents reviews is a manual-action risk, not a rich-result win.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: ORG_NAME,
      brand: { "@type": "Brand", name: "Blue-IQ" },
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      sameAs: ["https://blue-iq.ai"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: SITE_NAME,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Resume parsing API",
      operatingSystem: "Web",
      url: SITE_URL,
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      featureList: [
        "Confidence score on every extracted field",
        "Null instead of invented values",
        "PDF, DOCX, RTF, PNG, JPG and TIFF input up to 10 MB",
        "Batches of up to 200 files",
        "HMAC-signed webhooks",
      ],
    },
  ],
};

export default async function Landing() {
  const authed = !!(await getSessionClaims());
  return (
    <div className="relative overflow-x-clip bg-white">
      {/* Static, server-defined JSON-LD; "<" escaped so "</script>" can never break out. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <SiteNav authed={authed} />
      <main>
        <Hero />
        <CoreFeatures />
        <HowItWorks />
        <NeverGuesses />
        <Developers />
        <Trust />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ── Shared bits ─────────────────────────────────────────────────────────── */

const WRAP = "mx-auto w-full max-w-[1100px] px-5";

/** Section heading: left-aligned, no label above it. The heading says what the
 *  section is about in the words people search with. */
function SectionHead({ id, title, lede, className = "" }: { id: string; title: string; lede?: ReactNode; className?: string }) {
  return (
    <div className={"max-w-2xl " + className}>
      <h2 id={id} className="text-balance text-[2rem] font-medium leading-[1.12] tracking-[-0.02em] text-[#0f172a] sm:text-[2.5rem]">
        {title}
      </h2>
      {lede && <p className="mt-3 text-pretty text-[1.0625rem] leading-[1.6] text-ink-soft">{lede}</p>}
    </div>
  );
}

function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex h-12 items-center justify-center rounded-[12px] bg-accent-600 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-accent-700"
    >
      {children}
    </a>
  );
}

function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 items-center justify-center rounded-[12px] border border-black bg-white px-7 text-[15px] font-semibold text-[#0f172a] shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f4f8f9]"
    >
      {children}
    </Link>
  );
}

/** A score as the feature row draws it: label, number, and a thin bar. */
function Field({ label, value, score }: { label: string; value: string; score: number }) {
  const tone = score >= 0.9 ? "#1a5fe6" : score >= 0.8 ? "#c9920c" : "#c2410c";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10.5px] text-ink-soft">{label}</span>
        <span className="font-mono text-[10.5px] tabular-nums text-ink-soft">{score.toFixed(2)}</span>
      </div>
      <div className="mt-1 truncate text-[12.5px] font-medium text-[#1e293b]">{value}</div>
      <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-[#1e293b]/[0.07]">
        <div className="h-full rounded-full" style={{ width: `${Math.max(score, 0.03) * 100}%`, background: tone }} />
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

/** Headline, two actions and the limits a buyer checks first, over the live
 *  flow-field canvas on deep brand navy - the animation is the visual. Text colours
 *  here are the dark-surface set: white 16:1, body #c3d3f3 11:1, labels
 *  #9fb4de 7.6:1 against the navy. */
function Hero() {
  return (
    // -mt-16 pulls the hero up under the 4rem sticky nav, so nav and hero are
    // one surface and the streams flow behind the nav; pt adds the 4rem back.
    <section aria-labelledby="hero-title" className="relative isolate -mt-16 overflow-hidden bg-[#06112b]">
      <HeroCanvas />
      <div className={WRAP + " flex min-h-[min(88vh,820px)] items-center pb-20 pt-28 sm:pb-28 sm:pt-32"}>
        <div className="max-w-3xl" data-hero-text>
          <h1
            id="hero-title"
            className="text-balance text-[2.5rem] font-medium leading-[1.04] tracking-[-0.035em] text-white sm:text-[3.4rem] lg:text-[4rem]"
          >
            Resume parsing that scores every field it returns.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-[1.0625rem] leading-relaxed text-[#c3d3f3] sm:text-lg">
            Blue-IQ Capture reads resumes, nursing licenses and certifications, and returns structured
            JSON with a confidence score on each field. Your team stops re-typing records and only checks
            the values that are actually in doubt.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink href={DEMO_URL}>Book a demo</PrimaryLink>
            <Link
              href="/docs"
              className="inline-flex h-12 items-center justify-center rounded-[12px] border border-white/40 bg-white/[0.06] px-7 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/[0.12]"
            >
              Read the API docs
            </Link>
          </div>
          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/15 pt-5 text-left">
            <Fact term="Formats" detail="PDF, DOCX, RTF, PNG, JPG, TIFF" />
            <Fact term="File size" detail="Up to 10 MB" />
            <Fact term="Batch" detail="200 files per request" />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Fact({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-[#9fb4de]">{term}</dt>
      <dd className="mt-1 text-[14px] font-semibold leading-snug text-white">{detail}</dd>
    </div>
  );
}

/* ── Core features ───────────────────────────────────────────────────────── */

function CoreFeatures() {
  return (
    <section className="bg-white px-5 py-20 sm:py-24" aria-labelledby="features-title">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead
          id="features-title"
          title="Three things most resume parsers skip"
          lede="A score on every field, a documented API, and a searchable history of every parse."
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <GlowCard glow="amber" title="Field-level confidence scores">
            <Panel className="absolute left-6 right-6 top-[30px] text-[0.8rem] leading-[1.7] text-[#475569]">
              Registered Nurse with 6 years on a <Highlight>32-bed telemetry unit</Highlight>, holding a{" "}
              <Highlight>compact TN license</Highlight> and <Highlight>BLS certification</Highlight>
            </Panel>
            <Pill className="absolute left-10 top-[184px]">
              <svg viewBox="0 0 16 16" width={13} height={13} fill="none" aria-hidden>
                <path d="M3.5 14V2.5M3.5 3h8l-1.6 3 1.6 3h-8" stroke="#b7820a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Review low scores
            </Pill>
          </GlowCard>

          <GlowCard glow="pink" title="REST API and signed webhooks">
            <div className="absolute inset-x-0 bottom-[70px] top-0 flex items-center justify-center px-6">
              <ApiNetworkArt className="mt-5 h-[180px] w-full" />
            </div>
          </GlowCard>

          <GlowCard glow="lilac" title="Parsed record library" className="sm:col-span-2 lg:col-span-1">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
                maskImage: "radial-gradient(circle at center top, black 0%, transparent 80%)",
                WebkitMaskImage: "radial-gradient(circle at center top, black 0%, transparent 80%)",
              }}
              aria-hidden
            />
            {/* Filed resumes, fanned like a pulled drawer. */}
            <div className="absolute left-1/2 top-[34px] h-[170px] w-[240px] -translate-x-1/2" aria-hidden>
              <ResumeSheet className="absolute left-[18px] top-[10px] [zoom:0.42]" style={{ transform: "rotate(-9deg)" }} />
              <ResumeSheet className="absolute left-[64px] top-[2px] [zoom:0.42]" style={{ transform: "rotate(-1deg)" }} />
              <ResumeSheet marked className="absolute left-[108px] top-[12px] [zoom:0.42]" style={{ transform: "rotate(7deg)" }} />
            </div>
            <Pill className="absolute left-1/2 top-[220px] -translate-x-1/2 font-medium">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="8" stroke="#64748b" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Search every parse
            </Pill>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}

/* ── How it works - three genuine, ordered stages ────────────────────────── */

/** Stage 1: what actually arrives - a phone photo of a page and a license card. */
function IngestScene() {
  return (
    <div className="absolute inset-x-0 top-[40px] h-[210px]" aria-hidden>
      <PhotographedPage className="absolute left-[14%] top-0 [zoom:0.5]" />
      <LicenseCard className="absolute right-[10%] top-[92px] [zoom:0.62]" style={{ transform: "rotate(6deg)" }} />
      <Pill className="absolute left-6 top-[170px]">PDF, DOCX, scans</Pill>
    </div>
  );
}

/** Stage 2: a close-up of the page with the reviewer's marks and the scores. */
function ReadScene() {
  return (
    <div className="absolute inset-x-6 top-[40px] h-[196px]" aria-hidden>
      <div className="h-full overflow-hidden rounded-[6px]">
        <ResumeSheet marked className="[zoom:0.92]" style={{ marginTop: -80 }} />
      </div>
      <Pill className="absolute -right-1 top-[34px]">0.94</Pill>
      <Pill mark className="absolute -left-1 top-[112px]">bls_expires: null</Pill>
    </div>
  );
}

/** Stage 3: the record as it leaves, and where it goes. */
function DeliverScene() {
  return (
    <div className="absolute inset-x-6 top-[40px]" aria-hidden>
      <pre className="overflow-hidden rounded-xl bg-[#0d1c40] p-4 font-mono text-[11px] leading-[1.7] text-[#dbe6ff] shadow-[0_18px_30px_-16px_rgba(11,42,115,0.6)]">
        {`{
  "full_name": "Jane A. Smith",
  "specialty_id": "88",
  "licenses": [{ "state": "TN" }],
  "confidence": { "overall": 0.94 }
}`}
      </pre>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill>ATS</Pill>
        <Pill>CRM</Pill>
        <Pill>Warehouse</Pill>
      </div>
    </div>
  );
}

const STAGES: { title: string; body: string; glow: "sky" | "lime" | "peach"; art: ReactNode }[] = [
  {
    title: "Send the file",
    body: "A PDF, a Word file or a phone photo of a page, to one endpoint. Up to 200 in a batch.",
    glow: "sky",
    art: <IngestScene />,
  },
  {
    title: "Sonar reads and scores it",
    body: "Every field gets a score from 0 to 1. Nothing on the page means null, never a guess.",
    glow: "lime",
    art: <ReadScene />,
  },
  {
    title: "The record lands where you work",
    body: "Poll or take a signed webhook, then write validated JSON into your ATS, CRM or warehouse.",
    glow: "peach",
    art: <DeliverScene />,
  },
];

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-white px-5 py-20 sm:py-24" aria-labelledby="how-title">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead
          id="how-title"
          title="How a resume becomes a structured record"
          lede="Three calls, no templates to train and no fields to map by hand. A clean export and a crooked phone photo go through the same flow."
        />
        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STAGES.map((s, i) => (
            <li key={s.title}>
              <GlowCard glow={s.glow} height="h-[400px]" title={s.title} body={s.body}>
                <span className="absolute left-6 top-4 z-[3] grid h-7 w-7 place-items-center rounded-full border border-black bg-white text-[12px] font-semibold text-[#1e293b]">
                  {i + 1}
                </span>
                {s.art}
              </GlowCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Never guesses ──────────────────────────────────────────────────────── */

function NeverGuesses() {
  return (
    <section id="why" className="scroll-mt-20 bg-white px-5 py-20 sm:py-24" aria-labelledby="why-title">
      <div className="mx-auto grid w-full max-w-[1100px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-12">
        <SectionHead
          id="why-title"
          title="A wrong value costs more than an empty one"
          lede="Generic parsers fill gaps with something plausible, and nobody notices until a credential check fails. Here is the same license as a typical parser returns it, and as Capture does."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <GlowCard
            glow="peach"
            height="h-[380px]"
            title="A typical parser"
            body="Two values invented to fill the gaps. Both look real, and nobody finds out until a credential check fails."
          >
            <Panel className="absolute left-6 right-6 top-7">
              <CompareRows
                rows={[
                  ["license_type", "RN"],
                  ["state", "TN"],
                  ["license_number", "RN-2201847", "invented"],
                  ["expires", "2026-03-31", "invented"],
                ]}
              />
            </Panel>
          </GlowCard>

          <GlowCard
            glow="brand"
            height="h-[380px]"
            title="Blue-IQ Capture"
            body="The two fields that are not on the page come back null, flagged, so they are chased rather than trusted."
          >
            <Panel className="absolute left-6 right-6 top-7">
              <CompareRows
                rows={[
                  ["license_type", "RN", "0.98"],
                  ["state", "TN", "0.97"],
                  ["license_number", "null", "review"],
                  ["expires", "null", "review"],
                ]}
              />
            </Panel>
            <Pill className="absolute right-8 top-[204px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c2410c]" aria-hidden />2 flagged for review
            </Pill>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}

function CompareRows({ rows }: { rows: string[][] }) {
  return (
    <dl className="space-y-2.5 font-mono text-[12px]">
      {rows.map(([k, v, tag]) => (
        <div key={k} className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-soft">{k}</dt>
          <dd className="flex items-baseline gap-2">
            {v === "null" ? (
              <span className="rounded bg-mark px-1.5 font-semibold text-[#0f172a]">null</span>
            ) : (
              <span className={tag === "invented" ? "font-semibold text-[#c2410c] line-through decoration-[#c2410c]/60" : "text-[#1e293b]"}>{v}</span>
            )}
            {tag && <span className="text-[10.5px] text-ink-soft">{tag}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Developers ─────────────────────────────────────────────────────────── */

const SAMPLES: Sample[] = [
  {
    id: "curl",
    label: "cURL",
    code: `curl -X POST "${API_BASE}/api/v1/resume/parse" \\
  -H "X-API-Key: rp_live_your_key" \\
  -F "file=@resume.pdf"

# { "job_id": "01J3K...", "status": "processing",
#   "poll_url": "/api/v1/resume/job/01J3K..." }`,
  },
  {
    id: "node",
    label: "Node",
    code: `const form = new FormData();
form.append("file", await fs.openAsBlob("resume.pdf"), "resume.pdf");

const res = await fetch("${API_BASE}/api/v1/resume/parse", {
  method: "POST",
  headers: { "X-API-Key": process.env.BLUEIQ_API_KEY },
  body: form,
});
const { job_id, poll_url } = await res.json();`,
  },
  {
    id: "python",
    label: "Python",
    code: `import os, requests

res = requests.post(
    "${API_BASE}/api/v1/resume/parse",
    headers={"X-API-Key": os.environ["BLUEIQ_API_KEY"]},
    files={"file": open("resume.pdf", "rb")},
)
job = res.json()   # job_id, status, poll_url`,
  },
];

const RESPONSE = `{
  "status": "completed",
  "data": {
    "personal_info": { "full_name": "Jane Smith", "credentials": ["RN", "BSN"] },
    "licenses": [{ "license_type": "RN", "state": "TN", "is_compact": true }]
  },
  "confidence": { "overall": 0.9, "catalog_mapping": 0.8 },
  "partial": false,
  "warnings": []
}`;

function Developers() {
  return (
    <section id="developers" className="scroll-mt-20 bg-white px-5 py-20 sm:py-24" aria-labelledby="dev-title">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead
          id="dev-title"
          title="A resume parser API you can wire in in an afternoon"
          lede="Submit a file, then poll for the result or take a webhook. Nothing parses on the request path, so a call never blocks and never trips a gateway timeout."
        />

        <div className="glow-sky card-lift mt-12 grid gap-8 rounded-[20px] p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:p-10">
          <dl className="flex flex-col gap-4">
            <DevFact term="Signed webhooks">HMAC-SHA256 over the timestamp and the raw body, so a captured delivery cannot be replayed.</DevFact>
            <DevFact term="One error shape">A stable error code on every failure, and a hint that is safe to show your users.</DevFact>
            <DevFact term="Large files and batches">Presigned uploads for big scans, and up to 200 files in one request.</DevFact>
            <Link
              href="/docs"
              className="mt-2 inline-flex h-11 w-fit items-center rounded-[12px] border border-black bg-white px-5 text-sm font-semibold text-[#0f172a] shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f4f8f9]"
            >
              Open the API reference
            </Link>
          </dl>
          <div className="min-w-0">
            <CodeTabs samples={SAMPLES} response={RESPONSE} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DevFact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <Panel>
      <dt className="text-[15px] font-semibold text-[#1e293b]">{term}</dt>
      <dd className="mt-1 text-[13.5px] leading-relaxed text-[#334155]">{children}</dd>
    </Panel>
  );
}

/* ── Trust & security ────────────────────────────────────────────────────── */

function Trust() {
  return (
    <section id="security" className="scroll-mt-20 bg-white px-5 py-20 sm:py-24" aria-labelledby="trust-title">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHead
          id="trust-title"
          title="How we handle the records you send"
          lede="Clinical histories, signed agreements, salary lines. None of it is test data, so it is encrypted, isolated per workspace, and never written to our logs."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <GlowCard glow="sky" height="h-[352px]" title="Encryption in transit" body="TLS on every request, with a per-workspace key you can rotate whenever you like.">
            <Panel className="absolute left-6 right-6 top-7">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#1e293b]/[0.05]">
                  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" aria-hidden>
                    <rect x="5" y="10.5" width="14" height="9" rx="2.5" stroke="#1e293b" strokeWidth="1.8" />
                    <path d="M8.5 10.5V8a3.5 3.5 0 1 1 7 0v2.5" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-ink-soft">TLS 1.3</p>
                  <p className="truncate font-mono text-[11.5px] text-[#1e293b]">api.parsinglab.blue-iq.ai</p>
                </div>
              </div>
              <div className="mt-3 truncate rounded-lg bg-[#1e293b]/[0.04] px-2.5 py-2 font-mono text-[11px] text-ink-soft">X-API-Key: rp_live_••••••••</div>
            </Panel>
          </GlowCard>

          <GlowCard glow="lilac" height="h-[352px]" title="Workspace isolation" body="Documents and keys never leave their workspace. Role-based access and SSO on top.">
            <Panel className="absolute left-6 right-6 top-7">
              <div className="grid grid-cols-2 gap-2.5">
                {["acme", "globex"].map((w, i) => (
                  <div key={w} className="rounded-lg bg-[#1e293b]/[0.04] p-2.5">
                    <p className="font-mono text-[10.5px] text-ink-soft">{w}</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-[5px] w-full rounded-full bg-[#1e293b]/[0.1]" />
                      <div className="h-[5px] rounded-full bg-[#1e293b]/[0.1]" style={{ width: i ? "55%" : "70%" }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center font-mono text-[10.5px] text-ink-soft">no shared access</p>
            </Panel>
          </GlowCard>

          <GlowCard glow="lime" height="h-[352px]" title="Zero-retention option" body="Parsed in memory, returned, discarded. Nothing stored is nothing to leak.">
            <Panel className="absolute left-6 right-6 top-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-ink-soft">zero_retention</span>
                <span className="relative inline-flex h-[18px] w-[32px] items-center rounded-full bg-accent-600" aria-hidden>
                  <span className="absolute right-[2px] h-[14px] w-[14px] rounded-full bg-white" />
                </span>
              </div>
              <div className="mt-3.5 space-y-2">
                {["parsed in memory", "returned to caller", "discarded"].map((t, i) => (
                  <div key={t} className="flex items-center gap-2 text-[11.5px] text-[#475569]">
                    <span className={"h-1.5 w-1.5 rounded-full " + (i === 2 ? "bg-accent-600" : "bg-[#cbd5e1]")} />
                    {t}
                  </div>
                ))}
              </div>
            </Panel>
          </GlowCard>

          <GlowCard glow="peach" height="h-[352px]" title="Content-free audit trail" body="We log that a parse happened, how long it took and what it cost. Never a word of what it said.">
            <Panel className="absolute left-6 right-6 top-7">
              <div className="space-y-2.5 font-mono text-[11px]">
                {[
                  ["duration", "22.7s"],
                  ["file_type", "pdf"],
                  ["tokens", "38,905"],
                  ["content", null],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex items-baseline justify-between gap-2">
                    <span className="text-ink-soft">{k}</span>
                    {v ? <span className="text-[#1e293b]">{v}</span> : <span className="h-[9px] w-[62px] rounded-full bg-[#1e293b]/[0.09]" />}
                  </div>
                ))}
              </div>
            </Panel>
            <Pill className="absolute left-8 top-[172px]">never logged</Pill>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}

/* ── Closing CTA ─────────────────────────────────────────────────────────── */

function Cta() {
  return (
    <section id="demo" className="scroll-mt-20 bg-white px-5 pb-24 pt-10" aria-labelledby="cta-title">
      <div className="glow-amber card-lift mx-auto grid w-full max-w-[1100px] items-center gap-10 overflow-hidden rounded-[20px] px-6 py-12 sm:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-16">
        <div>
          <h2 id="cta-title" className="text-balance text-[2.1rem] font-medium leading-[1.1] tracking-[-0.03em] text-[#0f172a] sm:text-[2.6rem]">
            Send us your worst document.
          </h2>
          <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-[#334155]">
            The messy scan. The seven-page contract. The resume with three job titles crammed into one line.
            We will run it live and show you exactly what comes back.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink href={DEMO_URL}>Talk to us</PrimaryLink>
            <SecondaryLink href="/signup">Create an account</SecondaryLink>
          </div>
        </div>

        <Panel className="p-5">
          <div className="grid h-[260px] place-items-center overflow-hidden rounded-lg bg-[linear-gradient(180deg,#e9e4da,#d9d2c3)]" aria-hidden>
            <PhotographedPage className="[zoom:0.62]" />
          </div>
          <div className="mt-4 space-y-3 border-t border-[#e2e8f0] pt-4">
            <Field label="full_name" value="Jane A. Smith" score={0.97} />
            <Field label="start_date" value="01/2022" score={0.83} />
            <Field label="bls_expires" value="null" score={0} />
          </div>
          <p className="mt-4 font-mono text-[10.5px] text-ink-soft">1 field flagged, nothing invented</p>
        </Panel>
      </div>
    </section>
  );
}
