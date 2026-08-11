import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { API_BASE } from "@/lib/config";
import { getSessionClaims } from "@/lib/session";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Reveal } from "@/components/landing/Reveal";

const DEMO_URL = "https://blue-iq.ai/contact";
// Hero background video. Third-party CloudFront asset (~20 MB) supplied with
// the design; it is not hosted by us, so if it ever 404s the hero degrades to
// the flat --canvas background rather than breaking.
// Card illustrations supplied with the design. Same third-party R2 bucket
// caveat as HERO_VIDEO: not hosted by us, so a card degrades to its gradient
// rather than breaking if either ever disappears.
const NETWORK_SVG = "https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg";
const LIBRARY_SVG = "https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/library%20icon.svg";
const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4";

export const metadata: Metadata = {
  title: "Blue-IQ Capture | Universal Document AI (Any Document to Structured Data)",
  description:
    "Blue-IQ Capture turns any document (resumes, contracts, invoices, licenses) into structured, confidence-scored data. Domain-tuned, never fabricates. Powered by the Sonar engine.",
  keywords: [
    "document AI",
    "intelligent document processing",
    "IDP",
    "document data extraction",
    "confidence scoring",
    "schema-validated JSON",
    "resume parsing",
    "contract data extraction",
    "invoice extraction",
    "Sonar engine",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Blue-IQ Capture | Universal Document AI",
    description:
      "Point Capture at your paperwork and get back clean, schema-validated, confidence-scored data - for any document, in any industry. Powered by the Sonar engine.",
    siteName: "Blue-IQ Capture",
  },
  twitter: {
    card: "summary",
    title: "Blue-IQ Capture | Universal Document AI",
    description: "Any document in. Structured, scored data out. Powered by the Sonar engine.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Blue-IQ Capture",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Universal document AI: turns resumes, contracts, invoices, and licenses into schema-validated, confidence-scored data. Domain-tuned, never fabricates, powered by the Sonar engine.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Book a demo on your own documents" },
};

export default async function Landing() {
  const authed = !!(await getSessionClaims());
  return (
    <div className="relative overflow-x-clip">
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
        <MoreThanParser />
        <Trust />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

const MEDIA_MASK = {
  maskImage:
    "linear-gradient(to bottom, transparent 0%, #000 30%, #000 100%), linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent 0%, #000 30%, #000 100%), linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)",
  WebkitMaskComposite: "source-in",
} as const;

function Hero() {
  return (
    <section className="relative flex min-h-[100vh] w-full flex-col overflow-hidden bg-[var(--canvas)]">
      {/* Copy sits centred at the top; the video fills the floor beneath it. */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-14 text-center sm:pt-20">
        <h1
          className="animate-fade-up font-display text-[2.35rem] font-semibold leading-[1.08] tracking-tight sm:text-[3rem] lg:text-[3.6rem] lg:leading-[1.06]"
          style={{ animationDelay: "40ms" }}
        >
          <span className="text-ink">Any document in.</span>
          <br />
          <span className="text-ink-soft">Structured data out,</span>{" "}
          <span className="whitespace-nowrap text-accent-700">
            scored<HeroPill />field
          </span>{" "}
          <span className="text-ink-soft">by field.</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft"
          style={{ animationDelay: "110ms" }}
        >
          Resumes, contracts, invoices, licences. Capture pulls out the fields that matter and tells
          you how sure it is about each one, so your team stops re-typing and only checks what is
          actually in doubt.
        </p>

        <div className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "180ms" }}>
          <a
            href={DEMO_URL}
            className="group inline-flex items-center gap-2 rounded-lg bg-accent-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-800"
          >
            Book a demo
            <Arrow />
          </a>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent-300 hover:bg-accent-50"
          >
            Read the docs
          </Link>
        </div>
      </div>

      {/* The video takes the floor of the hero. mt-auto pins it to the bottom, so
          the subject's neck terminates exactly on the section boundary; the mask
          feathers the top and sides but deliberately leaves the bottom hard. */}
      <div className="animate-fade-up relative mt-auto h-[52vh] w-full sm:h-[60vh]" style={{ animationDelay: "240ms" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
          style={{ ...MEDIA_MASK, objectPosition: "50% 30%" }}
          src={HERO_VIDEO}
        />
      </div>
    </section>
  );
}

/** The inline pill punctuating the headline: an aperture reading a value. */
function HeroPill() {
  return (
    <span
      className="mx-1.5 inline-flex h-[0.58em] w-[26px] items-center justify-center rounded-full border-2 border-accent-700 align-middle md:w-[42px] lg:w-[58px]"
      aria-hidden
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent-700" />
    </span>
  );
}

/* ── Core features ───────────────────────────────────────────────────────── */

/** Three gradient cards on white. The visual system is taken verbatim from the
 *  supplied design - radial gradients from the top of each card, 20px radius,
 *  340px tall, content bottom-aligned, warm badge gradient - but the COPY
 *  describes Capture. The reference's wording ("from idea to image", "Smart
 *  Prompt Suggestions") belongs to an image generator; shipping it here would
 *  claim this product does something it does not. */
function CoreFeatures() {
  return (
    <section className="bg-white px-5 py-20 sm:py-24" aria-label="Core features">
      <div className="mx-auto w-full max-w-[1100px] text-center">
        <p
          className="mb-4 text-xs font-semibold uppercase tracking-[1px]"
          style={{
            backgroundImage: "linear-gradient(90deg, #F5C344, #F28482, #B567C2)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Core Features
        </p>
        <h2 className="mb-3 text-[2.25rem] font-medium tracking-[-0.02em] text-[#0f172a] sm:text-[2.75rem]">
          Fast where it can be. Careful where it counts.
        </h2>
        <p className="mb-[50px] text-[1.125rem] leading-[1.5] text-[#64748b]">
          Three things every document team asks for,
          <br />
          and most parsers quietly skip
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Field-level confidence"
            gradient="radial-gradient(circle at 50% 0%, #FFB347 0%, #F9ED96 30%, #F4F8F9 60%, #F4F8F9 100%)"
          >
            <div
              className="absolute left-6 right-6 top-[30px] rounded-xl bg-white p-4 text-[0.8rem] leading-[1.6] text-[#475569]"
              style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.04)" }}
            >
              Registered Nurse with 6 years on a{" "}
              <GradientPhrase>32-bed telemetry unit</GradientPhrase>, holding a{" "}
              <GradientPhrase>compact TN licence</GradientPhrase> and{" "}
              <GradientPhrase>BLS certification</GradientPhrase>
            </div>

            <span
              className="absolute left-10 top-[180px] inline-flex items-center gap-1.5 rounded-[20px] border border-black bg-white px-3.5 py-[5px] text-[0.75rem] font-semibold text-[#1e293b]"
              style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}
            >
              <span style={{ color: "#a855f7", fontSize: "1rem" }}>✦</span>
              Review low scores
            </span>

            <svg
              viewBox="0 0 24 24"
              width={24}
              height={24}
              className="absolute left-[110px] top-[205px] z-10"
              style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))" }}
              aria-hidden
            >
              <path d="M4 2L20 11L11 13L9 22L4 2Z" fill="#0f172a" stroke="#ffffff" strokeWidth="1" />
            </svg>
          </FeatureCard>

          <FeatureCard
            title="API access"
            gradient="radial-gradient(circle at 50% 0%, #E5A1F5 0%, #F8ACA0 30%, #F4F8F9 60%, #F4F8F9 100%)"
          >
            <div className="absolute inset-x-0 bottom-[70px] top-0 flex items-center justify-center px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={NETWORK_SVG} alt="" aria-hidden className="mt-5 h-[180px] w-full object-contain" />
            </div>
          </FeatureCard>

          <FeatureCard
            title="Parsed record library"
            gradient="radial-gradient(circle at 50% 0%, #F9ED96 0%, #E5A1F5 30%, #F4F8F9 60%, #F4F8F9 100%)"
          >
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LIBRARY_SVG}
              alt=""
              aria-hidden
              className="absolute left-1/2 top-[50px] w-[170px] -translate-x-1/2"
              style={{ filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.08))" }}
            />
            <span
              className="absolute left-1/2 top-[220px] inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-[20px] border border-black bg-white px-[18px] py-1.5 text-[0.75rem] font-medium text-[#1e293b]"
              style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="8" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Search every parse
            </span>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  gradient,
  children,
}: {
  title: string;
  gradient: string;
  children: ReactNode;
}) {
  return (
    <div
      className="relative flex h-[340px] flex-col justify-end overflow-hidden rounded-[20px] bg-[#F4F8F9] text-left"
      style={{ background: gradient, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
    >
      {children}
      <h3 className="relative z-[2] p-6 text-[1.05rem] font-semibold text-[#1e293b]">{title}</h3>
    </div>
  );
}

/** A phrase the parser lifted out of the prose, tinted to read as "extracted". */
function GradientPhrase({ children }: { children: ReactNode }) {
  return (
    <span
      className="font-semibold"
      style={{
        backgroundImage: "linear-gradient(90deg, #FFB347, #E5A1F5)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}

/* ── How it works - three genuine, ordered stages ────────────────────────── */

function HowItWorks() {
  const STAGES: { n: string; title: string; body: string; mono: string; bg: string; art: ReactNode }[] = [
    {
      n: "01",
      title: "Ingest anything",
      body: "PDFs, scans, exports, whatever landed in the inbox. Post them to the API or drop them in a watched folder. If someone photographed it on a phone, OCR picks it up.",
      mono: "api - watched folder - ocr",
      bg: "linear-gradient(180deg, #fcfdfd 0%, #f4f7f9 30%, #e2ebef 66%, #cedce4 100%)",
      art: <ArtIngest />,
    },
    {
      n: "02",
      title: "Read and score with Sonar",
      body: "Sonar reads the document and scores itself as it goes. Where it is unsure, it says so. Where it has nothing, it returns null. It will not invent a value to fill a gap.",
      mono: "confidence: { field: 0.91 }",
      bg: "radial-gradient(90% 70% at 6% 0%, rgba(226,236,200,.9) 0%, rgba(226,236,200,0) 70%), linear-gradient(168deg, #e2ebc9 0%, #e9f0c4 48%, #f0f4b8 78%, #f3f5b0 100%)",
      art: <ArtScore />,
    },
    {
      n: "03",
      title: "Deliver where you work",
      body: "Validated JSON goes straight into your ATS, CRM or warehouse over a documented REST API and signed webhooks. Nobody re-types anything.",
      mono: "-> ATS - CRM - warehouse",
      bg: "linear-gradient(103deg, #eae9f5 0%, #e2e0f1 34%, #cfcdea 72%, #c2c0e6 100%)",
      art: <ArtDeliver />,
    },
  ];
  return (
    <section id="how" className="bg-surface" aria-label="How it works">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">

        <SectionHead title="Paperwork in. Payload out. Three stages." />
        {/* The three stages as a feature mosaic, following the supplied design
            language: 22px radius, a 1.6px white inner border, a very soft lift
            shadow, one pastel gradient per panel, 800-weight tight-tracked
            headings, and chips whose ring is a shadow rather than a border (a
            border would add a layout pixel and harden the edge). Each panel
            carries an inline-SVG illustration of what that stage actually does -
            no stock art, nothing external to load. */}
        <ol className="mt-12 grid gap-5 lg:grid-cols-3">
          {STAGES.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 90}>
              <article
                className="relative flex h-full flex-col overflow-hidden rounded-[22px] p-7"
                style={{
                  background: s.bg,
                  border: "1.6px solid rgba(255,255,255,.92)",
                  boxShadow: "0 2px 16px rgba(24,30,45,.045)",
                }}
              >
                <span
                  className="inline-flex h-[31px] w-fit items-center rounded-full px-[15px] text-[12px] font-bold tracking-[-0.01em] text-[#111]"
                  style={{
                    background: "linear-gradient(100deg, #ffffff 18%, rgba(255,255,255,.62) 100%)",
                    boxShadow: "0 3px 9px rgba(70,66,120,.09)",
                  }}
                >
                  {s.n}
                </span>

                <h3 className="mt-5 font-display text-[23px] font-extrabold leading-[1.15] tracking-[-0.028em] text-[#0d0d10]">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-[#2b2b2b]/80">{s.body}</p>

                <div className="mt-7 grow">{s.art}</div>

                <code
                  className="mt-6 inline-flex h-[34px] w-fit max-w-full items-center truncate rounded-full bg-white/85 px-[15px] font-mono text-[11px] text-[#151515] backdrop-blur-[7px]"
                  style={{ boxShadow: "0 0 0 3px rgba(0,0,0,.047)" }}
                >
                  {s.mono}
                </code>
              </article>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120}>
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#1e2942] bg-[#0b1220] shadow-[0_44px_90px_-52px_rgba(11,18,32,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="font-mono text-xs text-[#7d889e]">POST /api/v1/parse</span>
              <Link href="/docs" className="font-mono text-xs text-[#8fb4ff] hover:text-white">full reference {"->"}</Link>
            </div>
            <div className="grid gap-px bg-white/10 lg:grid-cols-2">
              <pre className="overflow-x-auto bg-[#0b1220] p-6 font-mono text-[13px] leading-relaxed text-[#dbe4f5]">
                <code>
                  <span className="text-[#64748b]"># one call, any document</span>
                  {"\n"}<span className="text-[#8fb4ff]">curl</span> -X POST \
                  {"\n  "}{API_BASE}<span className="text-[#64748b]">/api/v1/parse</span> \
                  {"\n  "}-H <S>&quot;X-API-Key: cap_live_...&quot;</S> \
                  {"\n  "}-F <S>&quot;file=@contract.pdf&quot;</S>
                </code>
              </pre>
              <pre className="overflow-x-auto bg-[#0b1220] p-6 font-mono text-[13px] leading-relaxed text-[#dbe4f5]">
                <code>
                  <span className="text-[#64748b]">{"// 200 OK"}</span>
                  {"\n"}<span className="text-[#64748b]">{"{"}</span>
                  {"\n  "}<K>&quot;status&quot;</K>: <S>&quot;completed&quot;</S>,
                  {"\n  "}<K>&quot;data&quot;</K>: <span className="text-[#64748b]">{"{"}</span> <K>&quot;parties&quot;</K>, <K>&quot;term&quot;</K>, <K>&quot;total&quot;</K>... <span className="text-[#64748b]">{"}"}</span>,
                  {"\n  "}<K>&quot;confidence&quot;</K>: <span className="text-[#64748b]">{"{"}</span> <K>&quot;overall&quot;</K>: <span className="text-[#f0b454]">0.94</span> <span className="text-[#64748b]">{"}"}</span>,
                  {"\n  "}<K>&quot;fabricated&quot;</K>: <span className="text-[#f0b454]">false</span>
                  {"\n"}<span className="text-[#64748b]">{"}"}</span>
                </code>
              </pre>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Stage 1 - ingest. A fan of source documents feeding one intake, with the
 *  formats named on ring-shadowed chips. */
function ArtIngest() {
  return (
    <div className="relative h-[150px]">
      <svg viewBox="0 0 300 150" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        {[
          { x: 14, y: 24, r: -9 },
          { x: 40, y: 16, r: -3 },
          { x: 66, y: 10, r: 4 },
        ].map((s, i) => (
          <g key={i} transform={`rotate(${s.r} ${s.x + 41} ${s.y + 52})`}>
            <rect x={s.x} y={s.y} width="82" height="104" rx="8" fill="#fff" stroke="#0d1b24" strokeOpacity=".13" strokeWidth="1.4" />
            {[0, 1, 2, 3].map((n) => (
              <rect key={n} x={s.x + 12} y={s.y + 20 + n * 15} width={n === 3 ? 34 : 58 - n * 6} height="6" rx="3" fill="#0d1b24" fillOpacity={i === 2 ? 0.16 : 0.1} />
            ))}
          </g>
        ))}
        <path d="M162 62h44" stroke="#0d1b24" strokeOpacity=".35" strokeWidth="1.6" strokeDasharray="4 5" strokeLinecap="round" />
        <path d="M198 55.5l7.5 6.5-7.5 6.5" stroke="#0d1b24" strokeOpacity=".5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="216" y="26" width="70" height="72" rx="12" fill="#fff" stroke="#0d1b24" strokeOpacity=".16" strokeWidth="1.5" />
        <path d="M251 48v26M240.5 63.5L251 74l10.5-10.5" stroke="#0d1b24" strokeOpacity=".62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute bottom-0 left-0 flex flex-wrap gap-2">
        {["PDF", "DOCX", "Scan"].map((t) => (
          <span
            key={t}
            className="inline-flex h-[26px] items-center rounded-full bg-white/90 px-3 text-[11px] font-medium tracking-[-0.018em] text-[#131313] backdrop-blur-[7px]"
            style={{ boxShadow: "0 0 0 3px rgba(0,0,0,.047)" }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Stage 2 - read and score. Extracted fields with their confidence, and the
 *  dual sparkle from the reference marking the engine's own judgement. */
function ArtScore() {
  const fields: [string, number][] = [
    ["profession", 1.0],
    ["specialty", 0.94],
    ["facility", 0.88],
  ];
  return (
    <div className="relative h-[150px]">
      <div
        className="absolute inset-x-0 top-0 rounded-[11px] bg-white/90 p-4 backdrop-blur-[7px]"
        style={{ boxShadow: "0 12px 28px rgba(64,74,44,.16)" }}
      >
        {fields.map(([label, score], i) => (
          <div key={label} className={i ? "mt-3" : ""}>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10.5px] text-[#4a5533]">{label}</span>
              <span className="font-mono text-[10.5px] tabular-nums text-[#4a5533]/70">{score.toFixed(2)}</span>
            </div>
            <div className="mt-1.5 h-[6.5px] overflow-hidden rounded-full bg-[#15201a]/[.08]">
              <div className="h-full rounded-full" style={{ width: `${score * 100}%`, background: "linear-gradient(90deg,#8fae5c,#5f8b3e)" }} />
            </div>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 23 23" width={26} height={26} className="absolute right-1 bottom-6 z-10" fill="none" aria-hidden>
        <path d="M14.6 2.4l1.9 4.6 4.6 1.9-4.6 1.9-1.9 4.6-1.9-4.6-4.6-1.9 4.6-1.9z" fill="#eff4e6" stroke="#4f7433" strokeWidth="2.25" strokeLinejoin="round" />
        <path d="M6.4 12.1l1.2 2.9 2.9 1.2-2.9 1.2-1.2 2.9-1.2-2.9L2.3 16.2l2.9-1.2z" fill="#eff4e6" stroke="#4f7433" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Stage 3 - deliver. One endpoint fanning out to the systems the data lands
 *  in, each named rather than left as an anonymous node. */
function ArtDeliver() {
  const targets = ["ATS", "CRM", "Warehouse"];
  return (
    <div className="relative h-[150px]">
      <svg viewBox="0 0 300 150" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        <rect x="8" y="52" width="92" height="46" rx="12" fill="#fff" stroke="#171633" strokeOpacity=".16" strokeWidth="1.5" />
        <path d="M30 75h20M44 68.5l6.5 6.5-6.5 6.5" stroke="#171633" strokeOpacity=".6" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <text x="62" y="79" fill="#171633" fillOpacity=".62" style={{ font: "600 11px ui-monospace, monospace" }}>API</text>
        {[30, 75, 120].map((y, i) => (
          <path key={i} d={`M100 75 C 140 75, 150 ${y + 12}, 186 ${y + 12}`} stroke="#171633" strokeOpacity=".26" strokeWidth="1.5" strokeDasharray="4 5" strokeLinecap="round" />
        ))}
      </svg>
      <div className="absolute right-0 top-0 flex h-full flex-col justify-between py-1">
        {targets.map((t) => (
          <span
            key={t}
            className="inline-flex h-[30px] items-center rounded-full bg-white/92 px-4 text-[12px] font-medium tracking-[-0.018em] text-[#131313] backdrop-blur-[7px]"
            style={{ boxShadow: "0 0 0 3px rgba(0,0,0,.047)" }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Shared panel chrome ─────────────────────────────────────────────────────
   The Core Features cards work because each one contains a small working
   mock-up of the thing it describes and the heading sits underneath it. These
   are the same card: fixed height, content bottom-aligned, a radial gradient
   that saturates at the top and falls away to the neutral floor, and a real
   HTML mock-up floating in the upper half. Not an icon above a title.
   ────────────────────────────────────────────────────────────────────────────── */

const LIFT = { boxShadow: "0 8px 20px rgba(0,0,0,.05)" } as const;

function MockPanel({
  gradient,
  title,
  body,
  children,
}: {
  gradient: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <article
      className="relative flex h-[352px] flex-col justify-end overflow-hidden rounded-[20px] text-left"
      style={{ background: gradient, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
    >
      {children}
      <div className="relative z-[2] p-6">
        <h3 className="text-[1.05rem] font-semibold text-[#1e293b]">{title}</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#1e293b]/65">{body}</p>
      </div>
    </article>
  );
}

/** A white card floating in the upper half, as on the reference cards. */
function MockCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={"absolute left-6 right-6 rounded-xl bg-white p-4 " + (className ?? "top-7")}
      style={LIFT}
    >
      {children}
    </div>
  );
}

function MockPill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={
        "absolute inline-flex items-center gap-1.5 rounded-full border border-black bg-white px-3.5 py-[5px] text-[0.75rem] font-semibold text-[#1e293b] " +
        (className ?? "")
      }
      style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}
    >
      {children}
    </span>
  );
}

/** One extracted field with its score bar - the mock-up used by several panels. */
function MockField({ label, value, score }: { label: string; value: string; score: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10.5px] text-[#64748b]">{label}</span>
        <span className="font-mono text-[10.5px] tabular-nums text-[#94a3b8]">{score.toFixed(2)}</span>
      </div>
      <div className="mt-1 truncate text-[12.5px] font-medium text-[#1e293b]">{value}</div>
      <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-[#1e293b]/[0.07]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${score * 100}%`,
            background: score >= 0.9 ? "#5f8b3e" : score >= 0.8 ? "#c9920c" : "#c2410c",
          }}
        />
      </div>
    </div>
  );
}

/* ── Why it is more than a parser ────────────────────────────────────────── */

const G_LIME = "radial-gradient(circle at 50% 0%, #F9ED96 0%, #E2EBC9 32%, #F4F8F9 62%, #F4F8F9 100%)";
const G_PINK = "radial-gradient(circle at 50% 0%, #FFB347 0%, #F9D9E9 30%, #F4F8F9 60%, #F4F8F9 100%)";
const G_LILAC = "radial-gradient(circle at 50% 0%, #E5A1F5 0%, #CFCDEA 32%, #F4F8F9 62%, #F4F8F9 100%)";
const G_PEACH = "radial-gradient(circle at 50% 0%, #F8ACA0 0%, #FDEADB 32%, #F4F8F9 62%, #F4F8F9 100%)";
const G_SKY = "radial-gradient(circle at 50% 0%, #A9D3E8 0%, #CEDCE4 32%, #F4F8F9 62%, #F4F8F9 100%)";

function MoreThanParser() {
  return (
    <section id="why" className="bg-paper" aria-label="More than a parser">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <SectionHead
          title="Most parsers guess. This one admits what it does not know."
          lede="A generic model flattens a credential into word salad and fills the gaps with something plausible. Capture reads the documents your business actually runs on, and puts a number on its own certainty."
          centered
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <MockPanel
              gradient={G_LIME}
              title="Confidence on every field"
              body="Every value carries a number. Review the weak ones, ship the rest."
            >
              <MockCard>
                <div className="space-y-3">
                  <MockField label="profession" value="RN" score={1.0} />
                  <MockField label="specialty" value="Med Surg / Tele" score={0.94} />
                  <MockField label="facility" value="Fort Sanders Regional" score={0.82} />
                </div>
              </MockCard>
            </MockPanel>
          </Reveal>

          <Reveal delay={70}>
            <MockPanel
              gradient={G_PINK}
              title="Never fabricates"
              body="No value beats a wrong value. Unsure fields come back null, flagged."
            >
              <MockCard>
                <div className="space-y-2.5 font-mono text-[12px]">
                  {[
                    ["state", "TN", false],
                    ["licence_no", "null", true],
                    ["expires", "null", true],
                  ].map(([k, v, isNull]) => (
                    <div key={k as string} className="flex items-baseline justify-between gap-2">
                      <span className="text-[#64748b]">{k as string}</span>
                      <span className={isNull ? "font-semibold text-[#c2410c]" : "text-[#1e293b]"}>
                        {v as string}
                      </span>
                    </div>
                  ))}
                </div>
              </MockCard>
              <MockPill className="left-8 top-[186px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c2410c]" />2 flagged for review
              </MockPill>
            </MockPanel>
          </Reveal>

          <Reveal delay={140}>
            <MockPanel
              gradient={G_LILAC}
              title="Human-in-the-loop by design"
              body="Pick a threshold. Anything under it goes to a person. Everything over it just goes."
            >
              <MockCard>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10.5px] text-[#64748b]">threshold</span>
                  <span className="font-mono text-[11px] font-semibold text-[#1e293b]">0.85</span>
                </div>
                <div className="relative mt-3 h-[5px] rounded-full bg-[#1e293b]/[0.07]">
                  <div className="h-full w-[85%] rounded-full bg-[#6d28d9]" />
                  <span className="absolute -top-[5px] left-[85%] h-[15px] w-[15px] -translate-x-1/2 rounded-full border-2 border-[#6d28d9] bg-white" />
                </div>
                <div className="mt-4 flex items-center justify-between text-[11.5px]">
                  <span className="inline-flex items-center gap-1.5 text-[#64748b]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#94a3b8]" />
                    12 to review
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#1e293b]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5f8b3e]" />
                    488 auto
                  </span>
                </div>
              </MockCard>
            </MockPanel>
          </Reveal>

          <Reveal delay={210}>
            <MockPanel
              gradient={G_PEACH}
              title="Schema-validated output"
              body="JSON that matches your schema on arrival. Not a wall of text to untangle later."
            >
              <MockCard>
                <pre className="overflow-hidden font-mono text-[11px] leading-[1.7] text-[#475569]">
{`{
  "profession": "RN",
  "specialty_id": "88",
  "confidence": 0.94
}`}
                </pre>
              </MockCard>
              <MockPill className="left-8 top-[186px]">
                <svg viewBox="0 0 24 24" width={13} height={13} fill="none" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7" stroke="#5f8b3e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Schema valid
              </MockPill>
            </MockPanel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Trust & security ────────────────────────────────────────────────────── */

function Trust() {
  return (
    <section id="security" className="bg-surface" aria-label="Trust and security">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-28">
        <SectionHead
          title="These are real people's records. We treat them that way."
          lede="Clinical histories, signed agreements, salary lines. What you send us is not test data, and the handling reflects that."
          centered
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <MockPanel
              gradient={G_SKY}
              title="Encryption in transit"
              body="TLS on every request, authenticated by a per-workspace key you can rotate whenever you like."
            >
              <MockCard>
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#1e293b]/[0.05]">
                    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" aria-hidden>
                      <rect x="5" y="10.5" width="14" height="9" rx="2.5" stroke="#1e293b" strokeWidth="1.8" />
                      <path d="M8.5 10.5V8a3.5 3.5 0 1 1 7 0v2.5" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-[#64748b]">TLS 1.3</p>
                    <p className="truncate font-mono text-[11.5px] text-[#1e293b]">api.parsinglab.blue-iq.ai</p>
                  </div>
                </div>
                <div className="mt-3 truncate rounded-lg bg-[#1e293b]/[0.04] px-2.5 py-2 font-mono text-[11px] text-[#64748b]">
                  X-API-Key: rp_live_••••••••
                </div>
              </MockCard>
            </MockPanel>
          </Reveal>

          <Reveal delay={70}>
            <MockPanel
              gradient={G_LILAC}
              title="Workspace isolation"
              body="Documents and keys never leave their workspace. Role-based access and SSO on top."
            >
              <MockCard>
                <div className="grid grid-cols-2 gap-2.5">
                  {["acme", "globex"].map((w, i) => (
                    <div key={w} className="rounded-lg bg-[#1e293b]/[0.04] p-2.5">
                      <p className="font-mono text-[10.5px] text-[#64748b]">{w}</p>
                      <div className="mt-2 space-y-1.5">
                        <div className="h-[5px] w-full rounded-full bg-[#1e293b]/[0.1]" />
                        <div className="h-[5px] rounded-full bg-[#1e293b]/[0.1]" style={{ width: i ? "55%" : "70%" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center font-mono text-[10.5px] text-[#94a3b8]">no shared access</p>
              </MockCard>
            </MockPanel>
          </Reveal>

          <Reveal delay={140}>
            <MockPanel
              gradient={G_LIME}
              title="Zero-retention option"
              body="Switch on zero retention and the document is parsed in memory and gone. Nothing stored is nothing to leak."
            >
              <MockCard>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#64748b]">zero_retention</span>
                  <span className="relative inline-flex h-[18px] w-[32px] items-center rounded-full bg-[#5f8b3e]">
                    <span className="absolute right-[2px] h-[14px] w-[14px] rounded-full bg-white" />
                  </span>
                </div>
                <div className="mt-3.5 space-y-2">
                  {["parsed in memory", "returned to caller", "discarded"].map((t, i) => (
                    <div key={t} className="flex items-center gap-2 text-[11.5px] text-[#475569]">
                      <span className={"h-1.5 w-1.5 rounded-full " + (i === 2 ? "bg-[#5f8b3e]" : "bg-[#cbd5e1]")} />
                      {t}
                    </div>
                  ))}
                </div>
              </MockCard>
            </MockPanel>
          </Reveal>

          <Reveal delay={210}>
            <MockPanel
              gradient={G_PEACH}
              title="Content-free audit trail"
              body="We log that a parse happened, how long it took and what it cost. Never a word of what it said."
            >
              <MockCard>
                <div className="space-y-2.5 font-mono text-[11px]">
                  {[
                    ["duration", "22.7s"],
                    ["file_type", "pdf"],
                    ["tokens", "38,905"],
                    ["content", null],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex items-baseline justify-between gap-2">
                      <span className="text-[#64748b]">{k as string}</span>
                      {v ? (
                        <span className="text-[#1e293b]">{v as string}</span>
                      ) : (
                        <span className="h-[9px] w-[62px] rounded-full bg-[#1e293b]/[0.09]" />
                      )}
                    </div>
                  ))}
                </div>
              </MockCard>
              <MockPill className="left-8 top-[186px]">never logged</MockPill>
            </MockPanel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Closing CTA ─────────────────────────────────────────────────────────── */

function Cta() {
  return (
    <section id="demo" className="bg-paper" aria-label="Get started">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24">
        <Reveal>
          {/* Same card as the feature panels - radial gradient from the top,
              20px radius, ring instead of border - so the page closes in the
              language it spent the whole scroll establishing. Split rather than
              centred: the copy asks, the mock-up shows what the answer looks
              like. */}
          <div
            className="grid items-center gap-10 overflow-hidden rounded-[20px] px-8 py-14 sm:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-16"
            style={{
              background: G_LIME,
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
            }}
          >
            <div>
              <span
                className="inline-flex h-[30px] items-center rounded-full bg-white px-[14px] text-[12px] font-semibold text-[#1e293b]"
                style={{ boxShadow: "0 0 0 3px rgba(0,0,0,.047)" }}
              >
                Live, on your files
              </span>

              <h2 className="mt-5 font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.032em] text-[#15201a] sm:text-[2.5rem]">
                Send us your worst document.
              </h2>
              <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-[#1e2a1b]/75">
                The messy scan. The seven-page contract. The resume with three job titles crammed
                into one line. We will run it live and show you exactly what comes back.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={DEMO_URL}
                  className="group inline-flex items-center gap-2 rounded-lg bg-accent-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-800"
                >
                  Talk to us
                  <Arrow />
                </a>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#151515] transition-colors hover:bg-white/80"
                  style={{ boxShadow: "0 0 0 3px rgba(0,0,0,.047)" }}
                >
                  Read the docs
                </Link>
              </div>
            </div>

            {/* What "comes back" actually looks like - the same mock-up idiom
                the feature panels use, so the promise is shown, not just said. */}
            <div className="rounded-xl bg-white p-5" style={{ boxShadow: "0 8px 20px rgba(0,0,0,.05)" }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#64748b]">contract.pdf</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#5f8b3e]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5f8b3e]" />
                  completed
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <MockField label="counterparty" value="Fort Sanders Regional" score={0.96} />
                <MockField label="governing_law" value="Tennessee" score={0.91} />
                <MockField label="term_end" value="2027-06-30" score={0.88} />
                <MockField label="auto_renew" value="null" score={0.0} />
              </div>
              <p className="mt-4 font-mono text-[10.5px] text-[#94a3b8]">
                1 field flagged - nothing invented
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Section header (eyebrow + title + optional lede) ────────────────────── */

function SectionHead({ title, lede, centered }: { title: string; lede?: string; centered?: boolean }) {
  return (
    <Reveal>
      <div className={centered ? "mx-auto max-w-3xl" : "max-w-3xl"}>
        <h2 className="font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.032em] text-balance text-ink sm:text-[2.6rem]">
          {title}
        </h2>
        {lede && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lede}</p>}
      </div>
    </Reveal>
  );
}

/* ── Bits ────────────────────────────────────────────────────────────────── */


function K({ children }: { children: ReactNode }) {
  return <span className="text-[#7fb4ff]">{children}</span>;
}
function S({ children }: { children: ReactNode }) {
  return <span className="text-[#86efac]">{children}</span>;
}
function Arrow() {
  return (
    <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
