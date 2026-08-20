"use client";

import { useEffect, useRef } from "react";

/**
 * A rotating wireframe globe, drawn in 3D on a canvas.
 *
 * Latitude rings and longitude meridians are projected each frame with a steady
 * spin plus a slow wobble, and the pointer nudges the tilt so the globe leans
 * toward the cursor. Lines fade with depth, so the far side reads as behind the
 * near side rather than tangled with it.
 *
 * Hand-rolled against the 2D context instead of three.js — the shape is simple
 * and the hero already carries the intro's budget; a WebGL globe plugin would be
 * hundreds of kilobytes for this one flourish.
 */

const LAT_LINES = 13; // parallels
const LON_LINES = 24; // meridians
const SEG = 64; // points per line

type V3 = { x: number; y: number; z: number };

/** Build the sphere's line set once in model space. */
function buildGlobe(): V3[][] {
  const lines: V3[][] = [];

  // Parallels: constant latitude, sweep longitude.
  for (let i = 1; i < LAT_LINES; i++) {
    const phi = (i / LAT_LINES) * Math.PI - Math.PI / 2;
    const ring: V3[] = [];
    for (let j = 0; j <= SEG; j++) {
      const theta = (j / SEG) * Math.PI * 2;
      ring.push({
        x: Math.cos(phi) * Math.cos(theta),
        y: Math.sin(phi),
        z: Math.cos(phi) * Math.sin(theta),
      });
    }
    lines.push(ring);
  }

  // Meridians: constant longitude, sweep latitude pole to pole.
  for (let i = 0; i < LON_LINES; i++) {
    const theta = (i / LON_LINES) * Math.PI * 2;
    const meridian: V3[] = [];
    for (let j = 0; j <= SEG; j++) {
      const phi = (j / SEG) * Math.PI - Math.PI / 2;
      meridian.push({
        x: Math.cos(phi) * Math.cos(theta),
        y: Math.sin(phi),
        z: Math.cos(phi) * Math.sin(theta),
      });
    }
    lines.push(meridian);
  }

  return lines;
}

type Spike = { x: number; y: number; z: number; len: number; seg: boolean };

/**
 * The white rays firing out of the globe in the reference. Each is a point on
 * the sphere plus an outward length; a mix of solid streaks and shorter tick
 * marks keeps them from reading as a uniform hedgehog.
 */
function buildSpikes(count = 90): Spike[] {
  const spikes: Spike[] = [];
  let seed = 1337;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    // Even-ish distribution over the sphere.
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    const long = i % 3 === 0;
    spikes.push({
      x: r * Math.cos(theta),
      y: u,
      z: r * Math.sin(theta),
      len: long ? 0.35 + rand() * 0.85 : 0.06 + rand() * 0.14,
      seg: long,
    });
  }
  return spikes;
}

export default function HeroOrbit({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    const canvas: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = buildGlobe();
    const spikes = buildSpikes();

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr());
      canvas.height = Math.round(height * dpr());
      ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
    }

    function draw(time: number) {
      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.42;
      const depth = 3;

      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;

      // Continuous spin about the vertical axis, plus a gentle nodding wobble.
      const ry = time * 0.00022 + tiltY;
      const rx = 0.42 + Math.sin(time * 0.00013) * 0.08 + tiltX;

      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);

      for (const line of lines) {
        ctx.beginPath();
        let started = false;
        let prevAlpha = 0;

        for (const p of line) {
          // rotate about Y, then X.
          const x1 = p.x * cosY - p.z * sinY;
          const z1 = p.x * sinY + p.z * cosY;
          const y2 = p.y * cosX - z1 * sinX;
          const z2 = p.y * sinX + z1 * cosX;

          const k = depth / (depth - z2);
          const sx = cx + x1 * radius * k;
          const sy = cy + y2 * radius * k;

          // Depth → opacity. z2 runs roughly [-1, 1]; front is brighter.
          const alpha = 0.12 + ((z2 + 1) / 2) * 0.5;

          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else {
            // Stroke each segment at the mean depth of its endpoints so the far
            // side genuinely recedes rather than drawing at one flat opacity.
            ctx.lineTo(sx, sy);
          }
          prevAlpha = alpha;
        }

        ctx.strokeStyle = `rgba(230, 51, 41, ${prevAlpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // --- radiating streaks ------------------------------------------
      for (const sp of spikes) {
        const bx = sp.x * cosY - sp.z * sinY;
        const bz = sp.x * sinY + sp.z * cosY;
        const by2 = sp.y * cosX - bz * sinX;
        const bz2 = sp.y * sinX + bz * cosX;

        // Tip is the same direction pushed outward past the surface.
        const scaleTip = 1 + sp.len;
        const tx = bx * scaleTip;
        const tyv = by2 * scaleTip;
        const tz2 = bz2 * scaleTip;

        const kb = depth / (depth - bz2);
        const kt = depth / (depth - tz2);
        const bxs = cx + bx * radius * kb;
        const bys = cy + by2 * radius * kb;
        const txs = cx + tx * radius * kt;
        const tys = cy + tyv * radius * kt;

        // Only streaks on the near face read; the far ones are hidden by the
        // globe in front of them anyway.
        const facing = (bz2 + 1) / 2;
        const alpha = Math.max(0, facing - 0.35) * (sp.seg ? 0.85 : 0.55);
        if (alpha <= 0.02) continue;

        ctx.beginPath();
        ctx.moveTo(bxs, bys);
        ctx.lineTo(txs, tys);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx.lineWidth = sp.seg ? 1 : 1.4;
        ctx.stroke();
      }

      // A brighter core glow where the meridians bunch, echoing the reference.
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.7);
      glow.addColorStop(0, "rgba(230, 51, 41, 0.10)");
      glow.addColorStop(1, "rgba(230, 51, 41, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.7, 0, Math.PI * 2);
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

    resize();
    if (reduced) draw(0);
    else start();

    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };
    window.addEventListener("resize", onResize);

    const onPointer = (e: PointerEvent) => {
      if (reduced || e.pointerType !== "mouse") return;
      targetTiltY = (e.clientX / window.innerWidth - 0.5) * 0.8;
      targetTiltX = (e.clientY / window.innerHeight - 0.5) * 0.5;
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
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
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
