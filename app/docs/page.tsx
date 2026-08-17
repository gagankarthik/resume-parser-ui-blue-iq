import Link from "next/link";
import type { ReactNode } from "react";

import { BackButton } from "@/components/BackButton";
import {
  Logo,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table as UITable,
  TableWrap,
} from "@/components/ui";
import { API_BASE } from "@/lib/config";

export const metadata = {
  title: "API documentation",
  description:
    "Blue-IQ Capture API reference: authenticate with an API key, submit a document, poll the job to completion, and read the structured, confidence-scored JSON. Includes webhook delivery and error codes.",
  keywords: [
    "Blue-IQ Capture API",
    "document parsing API",
    "resume parsing API",
    "structured data extraction",
    "API documentation",
    "webhook delivery",
  ],
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "API documentation - Blue-IQ Capture",
    description:
      "Authenticate, submit a document, poll for structured JSON. The full Blue-IQ Capture API reference.",
    url: "/docs",
    type: "article",
  },
};

const SECTIONS = [
  { id: "quickstart", label: "Quickstart" },
  { id: "auth", label: "Authentication" },
  { id: "parse", label: "Parse a document" },
  { id: "poll", label: "Poll the job" },
  { id: "output", label: "The parsed record" },
  { id: "large", label: "Large files" },
  { id: "batch", label: "Batch" },
  { id: "webhooks", label: "Webhooks" },
  { id: "retry", label: "Retry & feedback" },
  { id: "errors", label: "Errors" },
  { id: "limits", label: "Limits" },
];

const ENDPOINTS: string[][] = [
  ["POST /resume/parse", "Submit one document. Returns a job_id."],
  ["GET /resume/job/{job_id}", "Poll a job until it reaches a terminal status."],
  ["POST /resume/upload-url", "Get a presigned URL for a direct upload."],
  ["POST /resume/parse-uploaded", "Parse a file already uploaded via that URL."],
  ["POST /resume/batch", "Submit up to 200 documents in one request."],
  ["GET /resume/batch/{batch_id}", "Poll a batch."],
  ["POST /resume/{job_id}/retry", "Re-run a parse."],
  ["POST /resume/{job_id}/feedback", "Send corrections back."],
  ["POST /webhooks", "Register a delivery endpoint."],
  ["GET /webhooks", "List your endpoints."],
  ["DELETE /webhooks/{webhook_id}", "Remove one."],
  ["GET /health", "Service and dependency status."],
];

const ERRORS: string[][] = [
  ["MISSING_API_KEY", "401", "No X-API-Key header on the request."],
  ["INVALID_API_KEY", "401", "The key is not recognised."],
  ["REVOKED_API_KEY", "401", "The key was revoked in the dashboard."],
  ["ACCOUNT_DEACTIVATED", "403", "The workspace is disabled."],
  ["FILE_TOO_LARGE", "413", "Over the 10 MB per-file limit."],
  ["UNSUPPORTED_FILE_TYPE", "415", "Not a PDF, DOCX, RTF, PNG, JPG or TIFF."],
  ["CORRUPTED_FILE", "422", "The bytes did not match the declared type."],
  ["EMPTY_BATCH", "422", "A batch request with no files."],
  ["BATCH_TOO_LARGE", "413", "Over 200 files or 60 MB in one batch."],
  ["JOB_NOT_FOUND", "404", "Unknown job_id, or the result has expired."],
  ["BATCH_NOT_FOUND", "404", "Unknown batch_id."],
  ["WEBHOOK_NOT_FOUND", "404", "Unknown webhook_id."],
  ["RETRY_LIMIT_REACHED", "429", "This job has been retried too many times."],
  ["EXTRACTION_FAILED", "422", "No text could be read from the file."],
  ["OCR_FAILED", "422", "OCR could not read the scan."],
  ["PARSE_FAILED", "500", "The parse stage failed after extraction."],
  ["VALIDATION_ERROR", "422", "A field on the request did not validate."],
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link href="/"><Logo className="h-7 w-auto" /></Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/dashboard" className="rounded-lg px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink">
              Dashboard
            </Link>
            <Link href="/signup" className="rounded-lg bg-accent-700 px-4 py-2 text-sm font-medium text-[var(--surface)] transition-colors hover:bg-accent-800">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-6">
        <BackButton />
      </div>

      <div className="mx-auto flex max-w-6xl gap-12 px-5 pb-10 pt-4 sm:px-6 lg:pb-14">
        {/* TOC */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1 text-sm">
            <p className="label-caps mb-3 text-ink-soft">On this page</p>
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink"
              >
                <span className="font-mono text-xs text-accent-600/70">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="min-w-0 flex-1 space-y-14">
          <div>
            <h1 className="font-display text-[2.4rem] font-extrabold leading-[1.1] tracking-[-0.032em] text-ink">
              Blue-IQ Capture API
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
              Send a document, get back structured JSON with a confidence score on every field.
              One flow for every file: submit, then poll or take a webhook. Nothing parses on the
              request path, so a call never blocks and never trips a gateway timeout.
            </p>
            <div className="mt-6 max-w-2xl">
              <BaseUrl />
            </div>
            <div className="mt-6">
              <Table head={["Endpoint", "What it does"]} rows={ENDPOINTS} />
            </div>
          </div>

          <Section n="01" id="quickstart" title="Quickstart">
            <P>Three calls: get a key, submit a file, poll until it is done.</P>
            <Code>{`# 1. Submit
curl -X POST "${API_BASE}/api/v1/resume/parse" \\
  -H "X-API-Key: rp_live_your_key" \\
  -F "file=@resume.pdf"

# -> { "job_id": "01J3K...", "status": "processing",
#      "poll_url": "/api/v1/resume/job/01J3K..." }

# 2. Poll until status is terminal
curl "${API_BASE}/api/v1/resume/job/01J3K..." \\
  -H "X-API-Key: rp_live_your_key"`}</Code>
            <P>
              Generate a key in the{" "}
              <Link href="/dashboard/keys" className="font-medium text-accent-700 hover:underline">dashboard</Link>.
              It is shown once, so copy it then. Use it only from your server.
            </P>
          </Section>

          <Section n="02" id="auth" title="Authentication">
            <P>
              Every request carries your key in the <Mono>X-API-Key</Mono> header. There are no
              other auth schemes on the parsing endpoints.
            </P>
            <Code>{`X-API-Key: rp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</Code>
            <Table
              head={["Code", "Meaning"]}
              rows={[
                ["MISSING_API_KEY", "No X-API-Key header was sent."],
                ["INVALID_API_KEY", "The key is not recognised."],
                ["REVOKED_API_KEY", "The key was revoked in the dashboard."],
                ["ACCOUNT_DEACTIVATED", "The workspace is disabled."],
              ]}
            />
          </Section>

          <Section n="03" id="parse" title="Parse a document">
            <P>
              <Mono>POST /api/v1/resume/parse</Mono> with <Mono>multipart/form-data</Mono> and one{" "}
              <Mono>file</Mono> field. Accepts PDF, DOCX, RTF, PNG, JPG and TIFF up to 10 MB.
            </P>
            <Code>{`curl -X POST "${API_BASE}/api/v1/resume/parse" \\
  -H "X-API-Key: rp_live_your_key" \\
  -F "file=@resume.pdf" \\
  -F "force_textract=false"`}</Code>
            <Table
              head={["Field", "Meaning"]}
              rows={[
                ["file", "The document. Required."],
                ["force_textract", "Skip Tesseract and use AWS Textract for any OCR this file needs. Higher accuracy on hard scans, higher cost. Default false."],
              ]}
            />
            <P>The response is immediate and never contains the parsed record:</P>
            <Code>{`{
  "job_id":   "01J3K5M2N4P6Q8R0S2T4U6V8W0",
  "status":   "processing",
  "poll_url": "/api/v1/resume/job/01J3K5M2N4P6Q8R0S2T4U6V8W0"
}`}</Code>
            <Callout>
              <b>Every parse is asynchronous.</b> This endpoint used to return the record inline for
              digital PDFs and DOCX. It no longer does, for any file type. If your integration reads{" "}
              <Mono>data</Mono> from the POST response, switch it to polling or a webhook. The old{" "}
              <Mono>async_only</Mono> flag is ignored.
            </Callout>
          </Section>

          <Section n="04" id="poll" title="Poll the job">
            <P>
              <Mono>GET /api/v1/resume/job/&#123;job_id&#125;</Mono> until <Mono>status</Mono> is
              terminal. A sensible loop polls every 2 seconds and gives up after a couple of minutes.
            </P>
            <Table
              head={["Status", "Meaning"]}
              rows={[
                ["processing", "Still working. The only non-terminal status. Poll again."],
                ["completed", "Done. data and confidence are populated."],
                ["partial", "Degraded. Some data recovered; check warnings before trusting it."],
                ["failed", "Could not parse. error explains why."],
              ]}
            />
            <Callout>
              <b>One request is not a poll loop.</b> A typical parse takes 10-30 seconds, so a single
              poll straight after submitting will correctly say <Mono>processing</Mono> — that is not
              a failure and not an end state. Loop until you see a terminal status, and treat any
              status you do not recognise as non-terminal rather than as an end state.
            </Callout>
            <Callout>
              <b>Results expire after an hour.</b> The jobs table carries a TTL, so a{" "}
              <Mono>job_id</Mono> is not a permanent handle and an old one returns{" "}
              <Mono>JOB_NOT_FOUND</Mono> — the document has to be submitted again. Persist the
              record on your side as soon as you receive it.
            </Callout>
          </Section>

          <Section n="05" id="output" title="The parsed record">
            <P>
              A completed job returns the record under <Mono>data</Mono>, per-section scores under{" "}
              <Mono>confidence</Mono>, and any caveats under <Mono>warnings</Mono>.
            </P>
            <Code>{`{
  "job_id": "01J3K...",
  "status": "completed",
  "data": {
    "personal_info": { "full_name": "Jane Smith", "email": "jane@example.com",
                       "phone": "865-541-1111", "credentials": ["RN", "BSN"] },
    "experience": [
      { "company": "Fort Sanders Regional Medical Center",
        "role": "RN - Med Surg/Tele",
        "start_date": "01/2022", "end_date": "Present",
        "city": "Knoxville", "state": "TN", "state_id": "42",
        "profession": "RN", "profession_id": "1",
        "specialties": [
          { "name": "Med Surg/Tele", "specialty_id": "88", "confidence": 1.0 }
        ],
        "description": ["Charge nurse on a 30-bed telemetry unit"] }
    ],
    "education":      [{ "institution": "University of Tennessee",
                         "degree": "BSN", "graduation_year": 2021 }],
    "certifications": [{ "name": "BLS", "issued_date": "01/2024" }],
    "licenses":       [{ "license_type": "RN", "state": "TN", "is_compact": true }]
  },
  "confidence": { "overall": 0.9, "experience": 1.0, "catalog_mapping": 0.8 },
  "partial": false,
  "warnings": []
}`}</Code>
            <H3>Reading the scores</H3>
            <P>
              Each specialty, profession and location resolves to a platform id with its own
              confidence. An unresolved id comes back <Mono>null</Mono> rather than a guess, so
              routing on <Mono>specialty_id === null</Mono> is a reliable review trigger.
            </P>
            <Table
              head={["Field", "What it holds"]}
              rows={[
                ["data", "The record. Every section is present; empty ones are empty, not missing."],
                ["confidence.overall", "0-1 across the whole record."],
                ["confidence.catalog_mapping", "How much of the record resolved to platform ids."],
                ["partial", "true when the parse degraded. Treat the record as reviewable."],
                ["warnings", "Human-readable caveats, e.g. a duty list that looks short."],
              ]}
            />
          </Section>

          <Section n="06" id="large" title="Large files">
            <P>
              For anything near the request limit, upload straight to storage and hand back the key.
              Two calls: ask for a presigned URL, PUT the bytes, then parse it.
            </P>
            <Code>{`# 1. Ask for somewhere to put it
curl -X POST "${API_BASE}/api/v1/resume/upload-url" \\
  -H "X-API-Key: rp_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"filename":"scan.pdf"}'

# 2. PUT the bytes at the returned URL, then:
curl -X POST "${API_BASE}/api/v1/resume/parse-uploaded" \\
  -H "X-API-Key: rp_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"upload_id":"..."}'`}</Code>
          </Section>

          <Section n="07" id="batch" title="Batch">
            <P>
              <Mono>POST /api/v1/resume/batch</Mono> takes up to 200 files, or 60 MB across the whole
              request, whichever comes first. It returns <Mono>202</Mono> with a{" "}
              <Mono>batch_id</Mono>; poll <Mono>GET /api/v1/resume/batch/&#123;batch_id&#125;</Mono>{" "}
              for per-file status.
            </P>
            <Code>{`curl -X POST "${API_BASE}/api/v1/resume/batch" \\
  -H "X-API-Key: rp_live_your_key" \\
  -F "files=@one.pdf" -F "files=@two.docx"`}</Code>
          </Section>

          <Section n="08" id="webhooks" title="Webhooks">
            <P>
              Register an endpoint and skip polling entirely. <Mono>events</Mono> is required and
              must list at least one event. The response includes <Mono>hmac_secret</Mono>{" "}
              <b>once</b> — it is never retrievable afterwards and there is no rotate endpoint, so
              store it before you close the response.
            </P>
            <Code>{`curl -X POST "${API_BASE}/api/v1/webhooks" \\
  -H "X-API-Key: rp_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://your-app.example.com/hooks/capture",
       "events":["parse.completed","parse.failed"]}'`}</Code>
            <Table
              head={["Event", "Fires when"]}
              rows={[
                ["parse.completed", "A single parse finished successfully."],
                ["parse.failed", "A single parse failed."],
                ["batch.completed", "Every file in a batch reached a terminal status."],
              ]}
            />
            <Callout>
              <b>Register each endpoint once.</b> The secret belongs to the{" "}
              <b>registration</b>, not to your account. Every active registration receives every
              event it subscribes to, each signed with <i>its own</i> secret — so if the same URL is
              registered twice, the secret you saved verifies only one of the two and the other
              fails every time. List your registrations with <Mono>GET /api/v1/webhooks</Mono> and
              delete strays with <Mono>DELETE /api/v1/webhooks/&#123;webhook_id&#125;</Mono>.
            </Callout>
            <H3>Verifying a delivery</H3>
            <P>Each request carries three headers:</P>
            <Table
              head={["Header", "Value"]}
              rows={[
                ["X-Signature", "sha256=<hex> - see the signed message below. Not the body alone."],
                ["X-Timestamp", "Unix seconds at send time. Part of the signed message."],
                ["X-Event", "The event name from the table above."],
              ]}
            />
            <P>
              The signed message is the timestamp, a literal dot, then the raw body —{" "}
              <Mono>HMAC_SHA256(secret, X-Timestamp + &quot;.&quot; + raw_body)</Mono>. Two details
              decide whether this works, and each one on its own causes every delivery to fail:
            </P>
            <Table
              head={["Detail", "Why it matters"]}
              rows={[
                ["Include the timestamp prefix", "Signing the body alone never matches. The timestamp is what makes a captured delivery unreplayable."],
                ["Use the RAW body bytes", "Capture the body before any JSON middleware touches it. Re-serialising a parsed object changes the bytes (separators, key order), so the digest changes even with the correct secret."],
              ]}
            />
            <Code>{`// Node / Express - note express.raw, NOT express.json
const crypto = require("crypto");

app.post("/hooks/capture",
  express.raw({ type: "application/json" }),   // req.body stays a Buffer
  (req, res) => {
    const ts  = req.get("X-Timestamp");
    const sig = req.get("X-Signature");

    if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return res.sendStatus(400);

    const expected = "sha256=" + crypto
      .createHmac("sha256", process.env.BLUEIQ_WEBHOOK_SECRET)
      .update(ts + ".")           // <-- the timestamp prefix
      .update(req.body)           // <-- the RAW bytes
      .digest("hex");

    const ok = expected.length === sig.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
    if (!ok) return res.sendStatus(401);

    const event = JSON.parse(req.body.toString());   // parse AFTER verifying
    res.sendStatus(202);                             // ack fast, work async
  });`}</Code>
            <Code>{`# Python / FastAPI
import hashlib, hmac, time

@app.post("/hooks/capture")
async def capture(request: Request):
    raw = await request.body()               # raw bytes, before any parsing
    ts  = request.headers["X-Timestamp"]
    if abs(time.time() - int(ts)) > 300:
        raise HTTPException(400, "stale delivery")

    message  = f"{ts}.".encode() + raw
    expected = "sha256=" + hmac.new(
        SECRET.encode(), message, hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(expected, request.headers["X-Signature"]):
        raise HTTPException(401, "invalid signature")

    event = json.loads(raw)
    return Response(status_code=202)`}</Code>
            <Callout>
              <b>A 4xx is never retried.</b> We treat any non-5xx reply as delivered, so a{" "}
              <Mono>401</Mono> from a signature mismatch <b>discards that event permanently</b> —
              nothing is queued for later. Alert on rejections rather than only logging them, and
              keep a reconcile pass that polls for any <Mono>job_id</Mono> you never got a delivery
              for. Return <Mono>5xx</Mono> if you do want a retry (≈2s, 5s, 10s).
            </Callout>
            <Callout>
              <b>Deliveries can arrive before your own bookkeeping settles</b>, and the same event
              can arrive more than once. Persist the <Mono>job_id</Mono> from the submit response
              first, make the handler idempotent on <Mono>job_id</Mono>, and tolerate an unknown{" "}
              <Mono>job_id</Mono> (upsert, or buffer and retry the lookup) instead of dropping it.
              Retries of one event reuse a single timestamp and signature, so the signature is a
              usable dedupe key.
            </Callout>
          </Section>

          <Section n="09" id="retry" title="Retry & feedback">
            <P>
              <Mono>POST /api/v1/resume/&#123;job_id&#125;/retry</Mono> re-runs a parse, for a job
              that failed on something transient. Repeated retries return{" "}
              <Mono>RETRY_LIMIT_REACHED</Mono>.
            </P>
            <P>
              <Mono>POST /api/v1/resume/&#123;job_id&#125;/feedback</Mono> sends corrections back and
              returns <Mono>202</Mono>. Corrections a reviewer makes are what improve extraction over
              time, so it is worth wiring up if you have a review step.
            </P>
          </Section>

          <Section n="10" id="errors" title="Errors">
            <P>
              Every error returns the same shape, with a stable machine-readable{" "}
              <Mono>code</Mono>. Branch on the code, not the message.
            </P>
            <Code>{`{
  "error": {
    "code": "UNSUPPORTED_FILE_TYPE",
    "detail": "Only PDF, DOCX, RTF, PNG, JPG and TIFF are accepted."
  }
}`}</Code>
            <Table head={["Code", "HTTP", "Meaning"]} rows={ERRORS} />
          </Section>

          <Section n="11" id="limits" title="Limits">
            <Table
              head={["Limit", "Value"]}
              rows={[
                ["File size", "10 MB per document"],
                ["Batch size", "200 files per request"],
                ["Batch payload", "60 MB per request"],
                ["Formats", "PDF, DOCX, RTF, PNG, JPG, TIFF"],
                ["Job results", "Expire on a TTL - store what you need"],
              ]}
            />
            <P>
              <Mono>GET /api/v1/health</Mono> reports service status and dependency health
              (DynamoDB, S3, the async worker) if you want to monitor it.
            </P>
          </Section>
        </article>
      </div>
    </div>
  );
}

/* -- bits -- */

function BaseUrl() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <span className="label-caps shrink-0 text-ink-soft">Base URL</span>
      <code className="overflow-x-auto font-mono text-sm text-ink">{API_BASE}</code>
    </div>
  );
}

function Section({ n, id, title, children }: { n: string; id: string; title: string; children: ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-lg font-semibold italic text-accent-700/80">{n}</span>
        <h2 id={id} className="scroll-mt-24 font-display text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      <hr className="rule mt-3 mb-5" />
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="label-caps mt-6 text-ink-soft">{children}</h3>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-ink-soft">{children}</p>;
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-accent-200 bg-accent-50/60 px-4 py-3 text-[15px] leading-relaxed text-ink-soft">
      {children}
    </div>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-accent-50 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-800 ring-1 ring-inset ring-accent-100">{children}</code>;
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-line bg-[#0b1220] p-4 font-mono text-[13px] leading-relaxed text-[#dbe4f5]">
      <code>{children}</code>
    </pre>
  );
}

/** Reference table for the docs prose - the first column is the identifier
 *  (field/param/code), so it wears mono ink while the rest stays secondary. */
function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <TableWrap className="rounded-xl">
      <UITable className="min-w-[22rem]">
        <THead>
          <TR>
            {head.map((h) => (
              <TH key={h}>{h}</TH>
            ))}
          </TR>
        </THead>
        <TBody>
          {rows.map((r, i) => (
            <TR key={i}>
              {r.map((c, j) => (
                <TD key={j} className={j === 0 ? "font-mono text-xs" : "text-ink-soft"}>
                  {c}
                </TD>
              ))}
            </TR>
          ))}
        </TBody>
      </UITable>
    </TableWrap>
  );
}
