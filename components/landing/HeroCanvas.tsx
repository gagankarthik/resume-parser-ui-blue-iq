"use client";

// Live hero background: streams of light flowing across a deep brand navy, in
// the logo's blues and cyan - data moving through the parser. Particles follow
// a slowly shifting flow field and leave long fading trails; where streams
// overlap they add up and glow. Two soft brand-colour lights drift behind
// them, and the pointer bends and brightens the flow around it.
//
// Budget and manners:
//  - One 2D canvas; particle count scales with the area (capped) and the DPR
//    is capped at 1.5, so a 4K screen does not cost 4x.
//  - Pauses when the hero scrolls out of view or the tab is hidden.
//  - prefers-reduced-motion: draws one settled still frame and stops; the
//    drifting lights stay put (see globals.css).
//  - Streams are dimmer on the left, behind the headline, so the white text
//    keeps its contrast.
//  - Decorative: aria-hidden, pointer-events none (it listens on window).

import { useEffect, useRef } from "react";

type P = { x: number; y: number; px: number; py: number; life: number; hue: number; sat: number; spark: boolean };

const DPR_CAP = 1.5;
const PER_PIXEL = 1 / 850; // particles per CSS pixel of area
const MAX_PARTICLES = 1500;
const POINTER_R = 200;

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let parts: P[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, active: false };
    // Where the hero's text block ends, in canvas pixels: below it the streams
    // run at full strength. Measured from the DOM so it follows the layout.
    let textBottom = 600;

    const spawn = (p: P, anywhere: boolean) => {
      p.x = anywhere ? Math.random() * w : -10 - Math.random() * 80;
      p.y = Math.random() * h;
      p.px = p.x;
      p.py = p.y;
      p.life = 260 + Math.random() * 620;
      // One in twenty is a white spark; the rest span logo cyan to deep blue.
      p.spark = Math.random() < 0.05;
      p.hue = 192 + Math.random() * 34;
      p.sat = p.spark ? 30 : 100;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(MAX_PARTICLES, Math.round(w * h * PER_PIXEL));
      parts = Array.from({ length: n }, () => {
        const p: P = { x: 0, y: 0, px: 0, py: 0, life: 0, hue: 0, sat: 0, spark: false };
        spawn(p, true);
        return p;
      });
      const block = canvas.closest("section")?.querySelector<HTMLElement>("[data-hero-text]");
      if (block) textBottom = block.getBoundingClientRect().bottom - rect.top;
      ctx.clearRect(0, 0, w, h);
    };

    // A cheap, smooth flow field: layered sines drifting with time, kept
    // within about +/-50 degrees of horizontal so the streams read as ribbons
    // flowing *through* the hero (left to right), braiding as they go - not
    // falling like rain.
    const angle = (x: number, y: number, t: number) =>
      (Math.sin(x * 0.0021 + t * 0.00024) * 0.5 +
        Math.cos(y * 0.0032 - t * 0.0002) * 0.42 +
        Math.sin((x - y) * 0.0014 + t * 0.00011) * 0.3) *
      0.72;

    const step = (t: number) => {
      // Fade the previous frame's trails; the CSS background shows through.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.055)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (const p of parts) {
        let a = angle(p.x, p.y, t);
        let boost = 0;
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < POINTER_R * POINTER_R) {
            const k = 1 - Math.sqrt(d2) / POINTER_R;
            a += k * 3.2; // swirl
            boost = k * 0.5; // and glow
          }
        }
        const speed = p.spark ? 2.6 : 1.7;
        p.px = p.x;
        p.py = p.y;
        p.x += Math.cos(a) * speed + 0.35;
        p.y += Math.sin(a) * speed;
        p.life -= 1;

        // Quiet behind the text block (headline, copy, buttons: the upper-left
        // area), full strength to its right and below it.
        const fx = Math.min(1, Math.max(0, (p.x / w - 0.42) / 0.3));
        const fy = Math.min(1, Math.max(0, (p.y - textBottom) / 120));
        // On narrow screens the text spans the full width, so only below it.
        const open = w < 768 ? fy : Math.max(fx, fy);
        const alpha = Math.min(1, (p.spark ? 0.25 : 0.05) + (p.spark ? 0.7 : 0.6) * open + boost);
        ctx.lineWidth = p.spark ? 1.6 : 1.25;
        ctx.strokeStyle = `hsla(${p.hue}, ${p.sat}%, ${p.spark ? 92 : 64}%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (p.life <= 0 || p.x > w + 10 || p.y < -20 || p.y > h + 20) spawn(p, false);
      }
    };

    const loop = (t: number) => {
      step(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const still = () => {
      for (let i = 0; i < 220; i++) step(i * 16);
    };

    resize();
    if (reduced) still();
    else start();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) still();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.y >= 0 && pointer.y <= r.height;
    };
    const onLeave = () => (pointer.active = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#06112b]">
      {/* Base: deep brand navy deepening toward the bottom. */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #06112b 0%, #081a42 55%, #0a2466 100%)" }} />
      {/* Two soft brand lights drifting slowly behind the streams. */}
      <div
        className="hero-orb absolute -right-[10%] top-[8%] h-[70%] w-[60%] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(41,122,255,0.45), rgba(41,122,255,0))", animationDuration: "22s" }}
      />
      <div
        className="hero-orb absolute bottom-[-20%] left-[30%] h-[65%] w-[55%] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(52,194,255,0.28), rgba(52,194,255,0))", animationDuration: "28s", animationDirection: "reverse" }}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      {/* A faint vignette keeps the edges deep and the centre luminous. */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 60% 40%, transparent 55%, rgba(3,9,24,0.55) 100%)" }} />
    </div>
  );
}
