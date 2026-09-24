import { ImageResponse } from "next/og";

// The share card for every route that does not define its own. Built from
// code at build time (statically optimised), in the site's card language: the
// brand glow falling onto the pale floor, the headline, and three of the
// black-outlined field pills - including the null one.

export const alt = "Blue-IQ Capture: resume parsing API with a confidence score on every field";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FIELDS: { k: string; v: string; s: string; flag?: boolean }[] = [
  { k: "full_name", v: "Jane A. Smith", s: "0.99" },
  { k: "license", v: "RN, Tennessee, multistate", s: "0.97" },
  { k: "bls_expires", v: "null", s: "review", flag: true },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 64,
          background: "radial-gradient(circle at 50% 0%, #7fb2ff 0%, #c6e8ff 32%, #f4f8f9 62%, #f4f8f9 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="52" height="53" viewBox="0 0 40 41">
              <path
                d="M33.724 37.0809C37.7426 33.0622 40.0003 27.6118 40.0003 21.9286C40.0003 16.2454 37.7426 10.7949 33.724 6.77629C29.7054 2.75765 24.2549 0.5 18.5717 0.5C12.8885 0.5 7.43807 2.75764 3.41943 6.77628L10.4905 13.8473C11.6063 14.9631 13.4081 14.9074 14.8276 14.2181C15.9836 13.6568 17.2622 13.3571 18.5717 13.3571C20.845 13.3571 23.0252 14.2602 24.6326 15.8677C26.2401 17.4751 27.1431 19.6553 27.1431 21.9286C27.1431 23.2381 26.8435 24.5167 26.2822 25.6727C25.5929 27.0922 25.5372 28.894 26.6529 30.0098L33.724 37.0809Z"
                fill="#297AFF"
              />
              <path d="M30 40.5H19.5098C17.9943 40.5 16.5408 39.898 15.4692 38.8263L1.67368 25.0308C0.60204 23.9592 0 22.5057 0 20.9902V10.5L30 40.5Z" fill="#34C2FF" />
              <path d="M10.7143 40.4999H4.28571C1.91878 40.4999 0 38.5812 0 36.2142V29.7856L10.7143 40.4999Z" fill="#34C2FF" />
            </svg>
            <span style={{ fontSize: 34, fontWeight: 700, color: "#0f172a", letterSpacing: -0.5 }}>Blue-IQ Capture</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 600, color: "#0f172a", letterSpacing: -2 }}>
              Resume parsing that scores every field it returns.
            </div>
            <div style={{ marginTop: 22, fontSize: 26, lineHeight: 1.4, color: "#475569" }}>
              Structured JSON from resumes, licenses and certifications. Null instead of guesses.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, marginLeft: "auto", width: 400 }}>
          {FIELDS.map((f) => (
            <div
              key={f.k}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderRadius: 28,
                border: "2px solid #000",
                background: f.flag ? "#ffd25e" : "#ffffff",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 18, color: "#475569", fontFamily: "monospace" }}>{f.k}</span>
                <span style={{ fontSize: 24, fontWeight: 600, color: "#0f172a" }}>{f.v}</span>
              </div>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>{f.s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
