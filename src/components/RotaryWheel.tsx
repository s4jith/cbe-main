"use client";

import { useEffect, useRef } from "react";

/**
 * The Rotary International emblem, turned in 3D on a canvas.
 *
 * Painted once, face-on, into an offscreen texture — the 24 cogs, six spokes
 * and their open windows, the keyed hub, and ROTARY / INTERNATIONAL set into
 * the band — then spun in its own plane and foreshortened by the tilt, with
 * darker copies stacked behind it for thickness.
 *
 * Painting the lettering flat and rotating the finished artwork is what keeps
 * the words true: placing glyphs one at a time inside a projected 3D scene
 * distorts them, and the type is the part people recognise.
 */

const TEX = 1200; // texture resolution — built once
const TEETH = 24;

// Radii as a fraction of the texture, so 0.5 is the edge.
const R_TIP = 0.5; // cog tip
const R_ROOT = 0.432; // cog root / outer edge of the lettered band
const R_BAND = 0.312; // inner edge of the band
const R_HUB = 0.155; // outer edge of the centre hub
const R_BORE = 0.068; // the hole through the middle

const SPOKES = 6;
const SPOKE_HALF = 0.115; // half the angular width of a spoke, in radians
const LAYERS = 7; // stacked copies that give the wheel its thickness

/** Radius of the cog at an angle: a clamped raised cosine — flat tips, square roots. */
function cogRadius(theta: number): number {
  const shaped = Math.max(-1, Math.min(1, Math.cos(theta * TEETH) * 2.1));
  return R_ROOT + (R_TIP - R_ROOT) * (shaped * 0.5 + 0.5);
}

/**
 * Walk a circular arc, continuing the current subpath unless `move` is set.
 *
 * The `move` flag is the whole point. An arc helper that always begins with
 * moveTo cannot build a closed sector — each call breaks off a new subpath,
 * and the sector collapses into two thin slivers.
 */
function arc(
  ctx: CanvasRenderingContext2D,
  r: number,
  from: number,
  to: number,
  steps: number,
  move: boolean,
) {
  for (let i = 0; i <= steps; i++) {
    const a = from + ((to - from) * i) / steps;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0 && move) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
}

/**
 * Set a string along a circular arc.
 *
 * Along the bottom the glyphs are walked the other way round *and* turned over.
 * Doing only one of the two leaves the word mirrored — LANOITANRETNI.
 */
function arcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  radius: number,
  centreAngle: number,
  spread: number,
  bottom: boolean,
) {
  const chars = [...text];
  const stepAngle = spread / Math.max(1, chars.length - 1);
  const dir = bottom ? -1 : 1;
  const start = centreAngle - (dir * spread) / 2;

  chars.forEach((ch, i) => {
    const a = start + dir * stepAngle * i;
    ctx.save();
    ctx.translate(Math.cos(a) * radius, Math.sin(a) * radius);
    ctx.rotate(bottom ? a - Math.PI / 2 : a + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
}

/** Paint the emblem once, face-on, centred in a TEX x TEX canvas. */
function buildTexture(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TEX;
  c.height = TEX;
  const ctx = c.getContext("2d")!;
  const S = TEX;
  ctx.translate(S / 2, S / 2);

  // --- the solid wheel, every opening punched by the even-odd rule --------
  ctx.beginPath();

  const rim = TEETH * 30;
  for (let i = 0; i < rim; i++) {
    const a = (i / rim) * Math.PI * 2;
    const r = cogRadius(a) * S;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Six open windows. The spokes are what is left between them — sitting at
  // 0, 60, 120 … so a pair runs horizontally, anchoring the band on the two
  // sides the lettering leaves empty.
  const step = (Math.PI * 2) / SPOKES;
  for (let k = 0; k < SPOKES; k++) {
    const from = k * step + SPOKE_HALF;
    const to = (k + 1) * step - SPOKE_HALF;
    arc(ctx, R_BAND * S, from, to, 36, true);
    arc(ctx, R_HUB * S, to, from, 24, false);
    ctx.closePath();
  }

  // The bore, and the keyway at the top that makes it a Rotary wheel rather
  // than a plain gear.
  const kw = 0.023 * S;
  const bore = R_BORE * S;
  const phi = Math.asin(kw / bore);
  const top = -Math.PI / 2;
  ctx.moveTo(Math.cos(top + phi) * bore, Math.sin(top + phi) * bore);
  arc(ctx, bore, top + phi, top - phi + Math.PI * 2, 72, false);
  ctx.lineTo(-kw, -(R_HUB - 0.028) * S);
  ctx.lineTo(kw, -(R_HUB - 0.028) * S);
  ctx.closePath();

  // A raking gradient so the face reads as struck metal rather than flat ink.
  const grad = ctx.createLinearGradient(-S * 0.38, -S * 0.44, S * 0.4, S * 0.46);
  grad.addColorStop(0, "#ffd970");
  grad.addColorStop(0.4, "#f5b312");
  grad.addColorStop(1, "#c07f08");
  ctx.fillStyle = grad;
  ctx.fill("evenodd");

  // --- the lettering, cut clean through the band --------------------------
  // Knocking the words out rather than painting them in a background colour
  // keeps the emblem transparent wherever the page shows behind it.
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const band = ((R_ROOT + R_BAND) / 2) * S;
  const face = '"Inter", "Helvetica Neue", Arial, sans-serif';

  ctx.font = `900 ${0.072 * S}px ${face}`;
  arcText(ctx, "ROTARY", band, -Math.PI / 2, 1.24, false);

  ctx.font = `900 ${0.051 * S}px ${face}`;
  arcText(ctx, "INTERNATIONAL", band, Math.PI / 2, 2.18, true);

  ctx.globalCompositeOperation = "source-over";
  return c;
}

export default function RotaryWheel({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    const canvas: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let texture = buildTexture();

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let lastTime = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let alive = true;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === width && rect.height === height) return;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr());
      canvas.height = Math.round(height * dpr());
      // Resizing clears the backing store, so repaint at once — a paused wheel
      // (reduced motion, or a hidden tab, which gets no frames at all) would
      // otherwise be wiped blank by a resize it never redraws from.
      draw(lastTime);
    }

    function draw(time: number) {
      lastTime = time;
      ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      const cx = width / 2;
      const cy = height / 2;
      // Room for the stacked depth copies and the tilt, so the cogs are never
      // clipped by the edge of the canvas.
      const size = Math.min(width, height) * 0.8;

      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;

      // A slow rock rather than a full revolution: text fixed to a wheel turns
      // with it, so a continuous spin leaves ROTARY upside down half the time.
      const spin = Math.sin(time * 0.00019) * 0.22;
      const ry = 0.62 + Math.sin(time * 0.00011) * 0.1 + tiltY;
      const rx = -0.3 + Math.cos(time * 0.00009) * 0.06 + tiltX;

      // A disc tilted about an axis foreshortens along it, so the tilt angles
      // become the two scale factors; the spin stays inside them, in-plane.
      const sx = Math.cos(ry);
      const sy = Math.cos(rx);

      // Thickness runs along the wheel's own normal, which the tilt points off
      // to one side — so the stack of copies leans that way.
      const stepX = Math.sin(ry) * size * 0.016;
      const stepY = -Math.sin(rx) * size * 0.016;

      const paint = (offX: number, offY: number, tint: string | null) => {
        ctx.save();
        ctx.translate(cx + offX, cy + offY);
        ctx.scale(sx, sy);
        ctx.rotate(spin);
        ctx.drawImage(texture, -size / 2, -size / 2, size, size);
        if (tint) {
          // Darken this copy in place, clipped to the artwork's own alpha.
          ctx.globalCompositeOperation = "source-atop";
          ctx.fillStyle = tint;
          ctx.fillRect(-size / 2, -size / 2, size, size);
          ctx.globalCompositeOperation = "source-over";
        }
        ctx.restore();
      };

      // Back to front. The tint is a deep amber rather than black, so the
      // milled edge stays metal instead of turning into a drop shadow.
      for (let i = LAYERS; i >= 1; i--) {
        const t = i / LAYERS;
        paint(stepX * i, stepY * i, `rgba(58, 32, 2, ${(0.42 + t * 0.4).toFixed(3)})`);
      }
      paint(0, 0, null);

      // A soft bloom so the wheel sits in light rather than on flat ground.
      const glow = ctx.createRadialGradient(cx, cy, size * 0.28, cx, cy, size * 0.86);
      glow.addColorStop(0, "rgba(245, 179, 18, 0.11)");
      glow.addColorStop(1, "rgba(245, 179, 18, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.86, 0, Math.PI * 2);
      ctx.fill();
    }

    function loop(time: number) {
      draw(time);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (raf || reduced) return;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    // A ResizeObserver rather than a measure at mount: the hero is still being
    // transformed by the intro curtain when this first runs, so a one-shot
    // measurement reads zero and the wheel never gets a backing store.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (!reduced) start();

    // The texture is struck once, and at that moment the webfont may not have
    // arrived — canvas falls back silently and the lettering is set in the
    // wrong face. Strike it again once the fonts are in.
    document.fonts.ready.then(() => {
      if (!alive) return;
      texture = buildTexture();
      draw(lastTime);
    });

    const onPointer = (e: PointerEvent) => {
      if (reduced || e.pointerType !== "mouse") return;
      targetTiltY = (e.clientX / window.innerWidth - 0.5) * 0.5;
      targetTiltX = (e.clientY / window.innerHeight - 0.5) * 0.34;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Stop drawing when off-screen or the tab is hidden — no point repainting a
    // canvas nobody is looking at.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden || !visible) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
