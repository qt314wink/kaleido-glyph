import type { ColorMode, ColorMotion, KaleidoSettings, LensLayout, LightActivity } from "./types";

const BG = "rgb(8, 8, 11)";
const TAU = Math.PI * 2;
const ARROWS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);
const WASD = new Set(["KeyA", "KeyD", "KeyW", "KeyS"]);
const MAX_STROKES = 90;
const MAX_PTS = 72;

type RGBA = { h: number; s: number; l: number; a: number };

type Brush = {
  x: number;
  y: number;
  sx: number;
  sy: number;
  armed: boolean;
  pressure: number;
};

type Stroke = {
  xs: Float32Array;
  ys: Float32Array;
  len: number;
  born: number;
  pinned: boolean;
  seed: number;
  width: number;
};

function colorAt(
  mode: ColorMode,
  motion: ColorMotion,
  hue: number,
  time: number,
  x: number,
  y: number,
  radius: number,
): RGBA {
  const u = Math.min(1, Math.hypot(x, y) / Math.max(1, radius));
  const ang = Math.atan2(y, x);
  const t = motion === "hold" ? 0 : time;
  const off = hue;
  switch (mode) {
    case "spectrum":
      return { h: (t * 46 + u * 150 + off) % 360, s: 84, l: 58, a: 1 };
    case "prism":
      return { h: (((ang * 180) / Math.PI + 360 + t * 10 + off) % 360 + 360) % 360, s: 80, l: 60, a: 1 };
    case "aurora":
      return { h: (150 + Math.sin(t * 0.65 + u * 5) * 78 + off + 360) % 360, s: 74, l: 56, a: 1 };
    case "ember":
      return { h: (16 + Math.sin(t * 1.05 + u * 6) * 16 + off + 360) % 360, s: 90, l: 56, a: 1 };
    case "ice":
      return { h: (196 + Math.sin(t * 0.7 + u * 4) * 24 + off + 360) % 360, s: 70, l: 62, a: 1 };
    case "pearl":
      return { h: (36 + Math.sin(t * 0.5) * 10 + off + 360) % 360, s: 16, l: 78, a: 1 };
  }
}

function activityAt(kind: LightActivity, time: number, along: number, seed: number) {
  switch (kind) {
    case "steady":
      return { a: 0.78 + 0.1 * Math.sin(time * 1.6 + seed), h: 0, w: 1 };
    case "pulse": {
      const wave = 0.5 + 0.5 * Math.sin(time * 2.8 + seed);
      return { a: 0.22 + 0.78 * wave, h: 0, w: 0.82 + 0.28 * wave };
    }
    case "blink": {
      const beat = (time * 2.15 + seed * 0.15) % 1.15;
      const on = beat < 0.62 || (beat > 0.74 && beat < 0.88);
      return { a: on ? 0.95 : 0.05, h: 0, w: on ? 1 : 0.7 };
    }
    case "chase": {
      const head = (time * 0.62 + seed) % 1;
      const d = Math.abs(along - head);
      const prox = Math.min(d, 1 - d);
      const hot = prox < 0.1;
      return { a: hot ? 1 : 0.1 + 0.16 * (1 - prox), h: along * 50, w: hot ? 1.45 : 0.7 };
    }
    case "firefly": {
      const tw = Math.sin(time * 6.8 + along * 22 + seed * 11);
      const lit = tw > 0.42;
      return { a: lit ? 0.2 + (tw - 0.42) * 1.6 : 0.08, h: lit ? 24 : 0, w: lit ? 1.25 : 0.72 };
    }
    case "strobe": {
      const on = Math.sin(time * 16 + seed * 4) > 0.15;
      return { a: on ? 1 : 0.04, h: on ? 10 : 0, w: on ? 1.12 : 0.75 };
    }
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function pointerPressure(e: PointerEvent) {
  if (e.pointerType === "pen" && e.pressure > 0) return e.pressure;
  if (e.pointerType === "touch" && e.pressure > 0 && e.pressure !== 0.5) return e.pressure;
  return 0.62;
}

function hsla(c: RGBA, a: number) {
  return `hsla(${((c.h % 360) + 360) % 360}, ${c.s}%, ${c.l}%, ${Math.max(0, Math.min(1, a))})`;
}

export class KaleidoEngine {
  private display: HTMLCanvasElement;
  private root: HTMLElement;
  private dctx: CanvasRenderingContext2D;
  private dpr = 1;
  private width = 0;
  private height = 0;
  private cx = 0;
  private cy = 0;
  private radius = 0;
  private bottomInset = 0;
  private rimPad = 0;
  private settings: KaleidoSettings;
  private time = 0;
  private spinAngle = 0;
  private raf = 0;
  private lastTs = 0;
  private running = false;
  private destroyed = false;
  private cos = new Float64Array(8);
  private sin = new Float64Array(8);
  private brushes = new Map<string, Brush>();
  private echoes = new Map<string, { x: number; y: number; t: number }[]>();
  private keys = new Set<string>();
  private keyX = 0;
  private keyY = 0;
  private keyInited = false;
  private idleT = 0;
  private idleR = 0;
  private idleD = 0;
  private idleRatio = 0;
  private idleA = 0;
  private lastIdleX = 0;
  private lastIdleY = 0;
  private hasIdle = false;
  private resumeIdleAt = 0;
  private reduced = false;
  private observers: ResizeObserver | null = null;
  private pin: { x: number; y: number } | null = null;
  private pinAcc = 0;
  private rightHeld = false;
  private altHeld = false;
  private lastPX = 0;
  private lastPY = 0;
  private flash = 0;
  private downs = new Map<number, { x: number; y: number; t: number }>();
  private layoutCb: ((layout: LensLayout) => void) | null = null;
  private pinCb: ((on: boolean) => void) | null = null;
  private strokes: Stroke[] = [];
  private live = new Map<string, Stroke>();
  private menuOpen = false;

  constructor(display: HTMLCanvasElement, root: HTMLElement, settings: KaleidoSettings) {
    const dctx = display.getContext("2d", { alpha: false });
    if (!dctx) throw new Error("Canvas 2D is not available");
    this.display = display;
    this.root = root;
    this.dctx = dctx;
    this.settings = { ...settings };
    this.rebuildTrig();
    this.reseedIdle();
    this.reduced = prefersReducedMotion();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.layout();
    this.bind();
    this.burst(true);
    this.lastTs = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  destroy() {
    this.destroyed = true;
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.unbind();
    this.observers?.disconnect();
    this.observers = null;
  }

  setSettings(next: KaleidoSettings) {
    const segsChanged = next.segments !== this.settings.segments;
    const froze = next.frozen && !this.settings.frozen;
    this.settings = { ...next };
    if (segsChanged) this.rebuildTrig();
    if (next.frozen) this.brushes.clear();
    if (froze) this.pulse();
    this.present();
  }

  setMenuOpen(open: boolean) {
    this.menuOpen = open;
    if (open) {
      for (const code of ARROWS) this.keys.delete(code);
    }
  }

  setBottomInset(cssPx: number) {
    if (Math.abs(cssPx - this.bottomInset) < 0.5) return;
    this.bottomInset = cssPx;
    this.layout(true);
  }

  setRimPad(cssPx: number) {
    if (Math.abs(cssPx - this.rimPad) < 0.5) return;
    this.rimPad = cssPx;
    this.layout(true);
  }

  setLayoutHandler(cb: ((layout: LensLayout) => void) | null) {
    this.layoutCb = cb;
    if (cb) cb(this.getLayout());
  }

  setPinHandler(cb: ((on: boolean) => void) | null) {
    this.pinCb = cb;
  }

  getLayout(): LensLayout {
    const rect = this.display.getBoundingClientRect();
    const sx = rect.width / Math.max(1, this.width);
    const sy = rect.height / Math.max(1, this.height);
    return {
      cx: this.cx * sx,
      cy: this.cy * sy,
      radius: this.radius * sx,
    };
  }

  canvas() {
    return this.display;
  }

  pinned() {
    return this.pin !== null || this.rightHeld || this.altHeld;
  }

  pinAt(x?: number, y?: number) {
    const px = x ?? this.lastPX;
    const py = y ?? this.lastPY;
    this.pin = { x: px, y: py };
    this.pinCb?.(true);
  }

  unpin() {
    this.pin = null;
    this.rightHeld = false;
    this.releaseBrush("pin");
    this.pinCb?.(false);
  }

  togglePin() {
    if (this.pin || this.rightHeld || this.altHeld) {
      this.unpin();
      return false;
    }
    this.pinAt();
    return true;
  }

  pulse() {
    this.flash = 1;
  }

  clear() {
    this.strokes = [];
    this.live.clear();
    this.hasIdle = false;
    this.brushes.clear();
    this.echoes.clear();
    this.unpin();
    this.resumeIdleAt = Number.POSITIVE_INFINITY;
    this.present();
  }

  burst(seed = false) {
    this.reseedIdle();
    const steps = seed ? 220 : 160;
    const t0 = Math.random() * TAU;
    const dt = 0.05 + Math.random() * 0.014;
    const s = this.allocStroke(false, this.settings.brush * 0.9);
    let prevX = 0;
    let prevY = 0;
    for (let i = 0; i < steps; i++) {
      const t = t0 + i * dt;
      const p = this.hypotrochoid(t);
      if (i === 0) this.pushPoint(s, p.x, p.y);
      else this.strokeTo(s, prevX, prevY, p.x, p.y);
      prevX = p.x;
      prevY = p.y;
    }
    this.lastIdleX = prevX;
    this.lastIdleY = prevY;
    this.hasIdle = true;
    this.idleT = t0 + steps * dt;
    this.resumeIdleAt = this.time;
    this.present();
  }

  exportPng(): Promise<void> {
    return this.exportBlob().then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      a.href = url;
      a.download = `kaleido-${stamp}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  exportBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.present();
      this.display.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Could not export image"));
          return;
        }
        resolve(blob);
      }, "image/png");
    });
  }

  async copyPng(): Promise<boolean> {
    try {
      const blob = await this.exportBlob();
      if (!navigator.clipboard || typeof ClipboardItem === "undefined") return false;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      return true;
    } catch {
      return false;
    }
  }

  private bind() {
    this.display.addEventListener("pointerdown", this.onPointerDown);
    this.display.addEventListener("pointermove", this.onPointerMove);
    this.display.addEventListener("pointerup", this.onPointerUp);
    this.display.addEventListener("pointercancel", this.onPointerUp);
    this.display.addEventListener("pointerleave", this.onPointerLeave);
    this.display.addEventListener("contextmenu", this.onContextMenu);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.observers = new ResizeObserver(() => this.layout());
    this.observers.observe(this.root);
  }

  private unbind() {
    this.display.removeEventListener("pointerdown", this.onPointerDown);
    this.display.removeEventListener("pointermove", this.onPointerMove);
    this.display.removeEventListener("pointerup", this.onPointerUp);
    this.display.removeEventListener("pointercancel", this.onPointerUp);
    this.display.removeEventListener("pointerleave", this.onPointerLeave);
    this.display.removeEventListener("contextmenu", this.onContextMenu);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }

  private onContextMenu = (e: Event) => {
    e.preventDefault();
  };

  private onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf);
      this.lastTs = 0;
      this.keys.clear();
    } else if (this.running && !this.destroyed) {
      this.lastTs = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  };

  private onBlur = () => {
    this.keys.clear();
    this.altHeld = false;
  };

  private isSecondary(e: PointerEvent) {
    if (e.button === 2) return true;
    if (this.rightHeld) return true;
    if (this.altHeld || e.altKey) return true;
    if (e.pointerType === "mouse" && (e.buttons & 2) !== 0) return true;
    return false;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") e.preventDefault();
    if (e.key === "Alt") {
      this.altHeld = true;
      e.preventDefault();
      return;
    }
    if (e.shiftKey) return;
    const isArrow = ARROWS.has(e.code);
    const isWasd = WASD.has(e.code);
    if (!isArrow && !isWasd) return;
    if (isArrow && this.menuOpen) return;
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    e.preventDefault();
    this.keys.add(e.code);
    this.resumeIdleAt = Number.POSITIVE_INFINITY;
    if (!this.keyInited) {
      this.keyX = this.radius * 0.38;
      this.keyY = 0;
      this.keyInited = true;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Alt") {
      this.altHeld = false;
      const b = this.brushes.get("pin");
      if (b && !this.rightHeld) {
        this.pinAt(b.sx, b.sy);
        this.releaseBrush("pin");
      }
      return;
    }
    this.keys.delete(e.code);
    if (![...this.keys].some((code) => ARROWS.has(code) || WASD.has(code))) {
      const b = this.brushes.get("key");
      if (b) {
        this.pinAt(b.sx, b.sy);
        this.releaseBrush("key");
      }
    }
  };

  private inDock(e: PointerEvent) {
    const rect = this.display.getBoundingClientRect();
    const zone = Math.max(72, this.bottomInset);
    const inBottom = e.clientY > rect.bottom - zone;
    if (this.bottomInset > 120) return inBottom;
    const mid = rect.left + rect.width / 2;
    return inBottom && Math.abs(e.clientX - mid) < 52;
  }

  private eventToLocal(e: PointerEvent) {
    const rect = this.display.getBoundingClientRect();
    const scaleX = this.display.width / Math.max(1, rect.width);
    const scaleY = this.display.height / Math.max(1, rect.height);
    return {
      x: (e.clientX - rect.left) * scaleX - this.cx,
      y: (e.clientY - rect.top) * scaleY - this.cy,
    };
  }

  private pointerId(e: PointerEvent) {
    return `p:${e.pointerId}`;
  }

  private onPointerDown = (e: PointerEvent) => {
    if (this.settings.frozen) return;
    if (this.inDock(e)) return;
    const p = this.eventToLocal(e);
    this.lastPX = p.x;
    this.lastPY = p.y;
    this.downs.set(e.pointerId, { x: p.x, y: p.y, t: performance.now() });
    if (this.isSecondary(e)) {
      try {
        this.display.setPointerCapture(e.pointerId);
      } catch {
        /* capture not required */
      }
      this.rightHeld = e.button === 2 || (e.buttons & 2) !== 0;
      this.pin = null;
      this.armBrush("pin", p.x, p.y, pointerPressure(e));
      this.pinCb?.(true);
      this.resumeIdleAt = Number.POSITIVE_INFINITY;
      return;
    }
    if (e.button !== 0 && e.pointerType === "mouse") return;
    try {
      this.display.setPointerCapture(e.pointerId);
    } catch {
      /* capture not required */
    }
    this.armBrush(this.pointerId(e), p.x, p.y, pointerPressure(e));
    this.resumeIdleAt = Number.POSITIVE_INFINITY;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.settings.frozen) return;
    if (this.inDock(e)) return;
    const p = this.eventToLocal(e);
    this.lastPX = p.x;
    this.lastPY = p.y;
    const pressure = pointerPressure(e);

    if (this.isSecondary(e)) {
      const b = this.brushes.get("pin");
      if (!b) this.armBrush("pin", p.x, p.y, pressure);
      else {
        b.x = p.x;
        b.y = p.y;
        b.pressure = pressure;
      }
      this.resumeIdleAt = Number.POSITIVE_INFINITY;
      return;
    }

    if (e.pointerType === "mouse" && e.buttons !== 0 && (e.buttons & 1) === 0) return;
    const isTouch = e.pointerType === "touch" || e.pointerType === "pen";
    if (isTouch && e.buttons === 0 && e.pressure === 0 && !this.brushes.has(this.pointerId(e))) {
      return;
    }
    const id = this.pointerId(e);
    if (!this.brushes.has(id)) this.armBrush(id, p.x, p.y, pressure);
    else {
      const b = this.brushes.get(id);
      if (b) {
        b.x = p.x;
        b.y = p.y;
        b.pressure = pressure;
      }
    }
    this.resumeIdleAt = Number.POSITIVE_INFINITY;
  };

  private onPointerUp = (e: PointerEvent) => {
    try {
      if (this.display.hasPointerCapture(e.pointerId)) {
        this.display.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* already released */
    }
    const down = this.downs.get(e.pointerId);
    this.downs.delete(e.pointerId);
    const p = this.eventToLocal(e);

    if (e.button === 2 || this.rightHeld || (this.altHeld && e.button === 0 && down)) {
      const b = this.brushes.get("pin");
      if (b) this.pinAt(b.sx, b.sy);
      this.releaseBrush("pin");
      this.rightHeld = false;
      return;
    }

    if (down && !this.settings.frozen) {
      const dt = performance.now() - down.t;
      const dist = Math.hypot(p.x - down.x, p.y - down.y);
      if (dt < 240 && dist < 14 * this.dpr) this.spark(p.x, p.y);
    }

    this.releaseBrush(this.pointerId(e));
  };

  private onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (this.rightHeld || this.altHeld) return;
    this.releaseBrush(this.pointerId(e));
  };

  private spark(x: number, y: number) {
    const r = Math.max(6, this.settings.brush * this.dpr * 1.6);
    const s = this.allocStroke(false, this.settings.brush);
    for (let i = 0; i <= 18; i++) {
      const a = (i / 18) * TAU;
      this.pushPoint(s, x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
  }

  private armBrush(id: string, x: number, y: number, pressure = 0.62) {
    this.brushes.set(id, { x, y, sx: x, sy: y, armed: false, pressure });
  }

  private releaseBrush(id: string) {
    this.brushes.delete(id);
    this.echoes.delete(id);
    for (const key of [`${id}:main`, `${id}:twin`, `${id}:orbit`, `${id}:echo`]) {
      this.live.delete(key);
    }
  }

  private rebuildTrig() {
    const n = this.settings.segments;
    this.cos = new Float64Array(n);
    this.sin = new Float64Array(n);
    const slice = TAU / n;
    for (let i = 0; i < n; i++) {
      this.cos[i] = Math.cos(i * slice);
      this.sin[i] = Math.sin(i * slice);
    }
  }

  private reseedIdle() {
    const R = Math.max(80, this.radius * 0.64);
    const segs = this.settings.segments;
    const r = R / (segs * 0.28 + 2.4);
    this.idleR = R;
    this.idleA = R - r;
    this.idleD = r * (1.15 + Math.random() * 0.9);
    this.idleRatio = this.idleA / Math.max(0.001, r);
    this.idleT = Math.random() * TAU;
  }

  private hypotrochoid(t: number) {
    const a = this.idleA || this.radius * 0.5;
    const d = this.idleD || a * 0.4;
    const ratio = this.idleRatio || 3;
    return {
      x: a * Math.cos(t) + d * Math.cos(ratio * t),
      y: a * Math.sin(t) - d * Math.sin(ratio * t),
    };
  }

  private pickDpr() {
    const raw = window.devicePixelRatio || 1;
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.deviceMemory ?? 8) <= 2 || (navigator.hardwareConcurrency || 4) <= 2) return 1;
    if (window.matchMedia("(pointer: coarse)").matches) return Math.min(1.5, raw);
    return Math.min(2, raw);
  }

  private layout(force = false) {
    const rect = this.root.getBoundingClientRect();
    const dpr = this.pickDpr();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (!force && w === this.width && h === this.height && dpr === this.dpr) {
      this.layoutCb?.(this.getLayout());
      return;
    }

    this.dpr = dpr;
    this.width = w;
    this.height = h;
    this.display.width = w;
    this.display.height = h;
    const bottom = this.bottomInset * dpr;
    const pad = this.rimPad * dpr;
    const usableH = Math.max(1, h - bottom);
    this.cx = w / 2;
    this.cy = usableH / 2;
    this.radius = Math.max(24, Math.min(this.cx, this.cy) - 16 * dpr - pad);
    if (!Number.isFinite(this.radius) || this.radius < 24) this.radius = 24;

    this.reseedIdle();
    this.present();
    this.layoutCb?.(this.getLayout());
  }

  private lifetime() {
    const t = this.settings.persist / 100;
    return 0.45 + t * t * 10.5;
  }

  private parkedGlobal() {
    return this.settings.persist >= 100;
  }

  private allocStroke(pinned: boolean, width: number) {
    while (this.strokes.length >= MAX_STROKES) {
      const idx = this.strokes.findIndex((s) => !s.pinned);
      this.strokes.splice(idx === -1 ? 0 : idx, 1);
    }
    const s: Stroke = {
      xs: new Float32Array(MAX_PTS),
      ys: new Float32Array(MAX_PTS),
      len: 0,
      born: this.time,
      pinned,
      seed: Math.random() * TAU,
      width: Math.max(0.7, width),
    };
    this.strokes.push(s);
    return s;
  }

  private pushPoint(s: Stroke, x: number, y: number) {
    if (s.len >= MAX_PTS) {
      s.xs.copyWithin(0, 8);
      s.ys.copyWithin(0, 8);
      s.len = MAX_PTS - 8;
    }
    s.xs[s.len] = x;
    s.ys[s.len] = y;
    s.len += 1;
  }

  private strokeTo(s: Stroke, x0: number, y0: number, x1: number, y1: number) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const spacing = Math.max(2.2 * this.dpr, s.width * this.dpr * 0.35);
    const steps = Math.min(8, Math.max(1, Math.ceil(dist / spacing)));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      this.pushPoint(s, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
    }
  }

  private liveStroke(key: string, pinned: boolean, width: number) {
    let s = this.live.get(key);
    if (!s || s.len >= MAX_PTS - 1) {
      s = this.allocStroke(pinned, width);
      this.live.set(key, s);
    }
    s.pinned = pinned;
    return s;
  }

  private appendPair(id: string, x0: number, y0: number, x1: number, y1: number, pressure: number, pinned: boolean) {
    const width = this.settings.brush * (0.45 + 0.4 * pressure);
    const main = this.liveStroke(`${id}:main`, pinned, width);
    if (main.len === 0) this.pushPoint(main, x0, y0);
    this.strokeTo(main, x0, y0, x1, y1);

    const mode = this.settings.pathMode;
    if (mode === "twin") {
      const twin = this.liveStroke(`${id}:twin`, pinned, width * 0.92);
      if (twin.len === 0) this.pushPoint(twin, -x0, -y0);
      this.strokeTo(twin, -x0, -y0, -x1, -y1);
    } else if (mode === "orbit") {
      const a = this.time * 1.25;
      const c = Math.cos(a);
      const s = Math.sin(a);
      const ox0 = x0 * c - y0 * s;
      const oy0 = x0 * s + y0 * c;
      const ox1 = x1 * c - y1 * s;
      const oy1 = x1 * s + y1 * c;
      const orbit = this.liveStroke(`${id}:orbit`, pinned, width * 0.9);
      if (orbit.len === 0) this.pushPoint(orbit, ox0, oy0);
      this.strokeTo(orbit, ox0, oy0, ox1, oy1);
    }
  }

  private feedEcho(id: string, x: number, y: number, pressure: number, pinned: boolean) {
    if (this.settings.pathMode !== "echo") return;
    let buf = this.echoes.get(id);
    if (!buf) {
      buf = [];
      this.echoes.set(id, buf);
    }
    buf.push({ x, y, t: this.time });
    const horizon = this.time - 0.55;
    while (buf.length > 2 && (buf[1]?.t ?? 0) < horizon) buf.shift();
    const ghost = buf[0];
    if (ghost && this.time - ghost.t >= 0.45) {
      const next = buf[1] ?? ghost;
      const width = this.settings.brush * (0.4 + 0.3 * pressure);
      const s = this.liveStroke(`${id}:echo`, pinned, width);
      if (s.len === 0) this.pushPoint(s, ghost.x, ghost.y);
      this.strokeTo(s, ghost.x, ghost.y, next.x, next.y);
    }
  }

  private cullStrokes() {
    if (this.parkedGlobal()) return;
    const life = this.lifetime();
    const pinOn = this.pin !== null;
    this.strokes = this.strokes.filter((s) => {
      if (s.pinned && pinOn) return true;
      if (s.pinned && !pinOn) s.pinned = false;
      return this.time - s.born < life;
    });
  }

  private fadeOf(s: Stroke) {
    if (this.parkedGlobal() || (s.pinned && this.pin !== null)) return 1;
    const life = this.lifetime();
    const age = this.time - s.born;
    const t = Math.max(0, 1 - age / life);
    return t * t;
  }

  private needsAlong() {
    const a = this.settings.lightActivity;
    return a === "chase" || a === "firefly";
  }

  private drawPolyline(
    ctx: CanvasRenderingContext2D,
    s: Stroke,
    ca: number,
    sa: number,
    mirror: boolean,
    color: RGBA,
    fade: number,
  ) {
    const actKind = this.settings.lightActivity;
    const w = Math.max(0.85, s.width * 0.32 * this.dpr);
    const alongNeeded = this.needsAlong();

    const tx = (x: number, y: number) => {
      if (mirror) return { x: x * ca + y * sa, y: x * sa - y * ca };
      return { x: x * ca - y * sa, y: x * sa + y * ca };
    };

    if (!alongNeeded) {
      const act = activityAt(actKind, this.time, 0.5, s.seed);
      if (act.a * fade < 0.02) return;
      ctx.beginPath();
      for (let i = 0; i < s.len; i++) {
        const p = tx(s.xs[i] ?? 0, s.ys[i] ?? 0);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = hsla({ ...color, h: color.h + act.h }, 0.28 * act.a * fade);
      ctx.lineWidth = w * 2.1 * act.w;
      ctx.stroke();
      ctx.strokeStyle = hsla({ ...color, h: color.h + act.h, l: Math.min(78, color.l + 8) }, 0.92 * act.a * fade);
      ctx.lineWidth = w * act.w;
      ctx.stroke();
      return;
    }

    for (let i = 1; i < s.len; i++) {
      const along = i / Math.max(1, s.len - 1);
      const act = activityAt(actKind, this.time, along, s.seed);
      if (act.a * fade < 0.03) continue;
      const a = tx(s.xs[i - 1] ?? 0, s.ys[i - 1] ?? 0);
      const b = tx(s.xs[i] ?? 0, s.ys[i] ?? 0);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = hsla({ ...color, h: color.h + act.h, l: Math.min(78, color.l + 6) }, 0.95 * act.a * fade);
      ctx.lineWidth = w * act.w;
      ctx.stroke();
    }
  }

  private present() {
    const ctx = this.dctx;
    const { width: w, height: h, cx, cy, radius } = this;
    if (!w || !h || !Number.isFinite(cx) || !Number.isFinite(cy) || !Number.isFinite(radius) || radius < 1) {
      return;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(8, radius), 0, TAU);
    ctx.clip();
    ctx.translate(cx, cy);
    if (this.settings.spin) ctx.rotate(this.spinAngle);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = "source-over";

    const n = this.settings.segments;
    for (const s of this.strokes) {
      if (s.len < 2) continue;
      const fade = this.fadeOf(s);
      if (fade < 0.02) continue;
      const mid = Math.max(0, (s.len >> 1) - 1);
      const color = colorAt(
        this.settings.colorMode,
        this.settings.colorMotion,
        this.settings.hue,
        this.time,
        s.xs[mid] ?? 0,
        s.ys[mid] ?? 0,
        this.radius,
      );
      for (let i = 0; i < n; i++) {
        const ca = this.cos[i] ?? 1;
        const sa = this.sin[i] ?? 0;
        this.drawPolyline(ctx, s, ca, sa, false, color, fade);
        this.drawPolyline(ctx, s, ca, sa, true, color, fade);
      }
    }
    ctx.restore();

    const vig = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius);
    vig.addColorStop(0, "rgba(8, 8, 11, 0)");
    vig.addColorStop(1, "rgba(8, 8, 11, 0.42)");
    ctx.fillStyle = vig;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.strokeStyle = "rgba(197, 205, 216, 0.22)";
    ctx.lineWidth = Math.max(1, this.dpr);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(4, radius - 5 * this.dpr), 0, TAU);
    ctx.strokeStyle = "rgba(197, 205, 216, 0.06)";
    ctx.lineWidth = Math.max(1, 3 * this.dpr);
    ctx.stroke();

    if (this.flash > 0.02) {
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(8, radius - 3 * this.dpr), 0, TAU);
      ctx.strokeStyle = `rgba(243, 243, 245, ${this.flash * 0.55})`;
      ctx.lineWidth = Math.max(1, 5 * this.dpr * this.flash);
      ctx.stroke();
    }

    const showKey = this.keyInited && [...this.keys].some((code) => WASD.has(code) || ARROWS.has(code));
    if (showKey) {
      ctx.beginPath();
      ctx.arc(cx + this.keyX, cy + this.keyY, 4 * this.dpr, 0, TAU);
      ctx.strokeStyle = "rgba(197, 205, 216, 0.7)";
      ctx.lineWidth = Math.max(1, this.dpr);
      ctx.stroke();
    } else if (this.pin && !this.settings.frozen) {
      ctx.beginPath();
      ctx.arc(cx + this.pin.x, cy + this.pin.y, 3.5 * this.dpr, 0, TAU);
      ctx.strokeStyle = "rgba(197, 205, 216, 0.45)";
      ctx.lineWidth = Math.max(1, this.dpr);
      ctx.stroke();
    }
  }

  private stepBrushes(dt: number) {
    const k = 1 - Math.exp(-18 * dt);
    const pinnedId = "pin";
    for (const [id, b] of this.brushes) {
      if (!b.armed) {
        b.sx = b.x;
        b.sy = b.y;
        b.armed = true;
        continue;
      }
      const nx = b.sx + (b.x - b.sx) * k;
      const ny = b.sy + (b.y - b.sy) * k;
      const pinned = id === pinnedId || id === "key";
      this.appendPair(id, b.sx, b.sy, nx, ny, b.pressure, pinned);
      this.feedEcho(id, nx, ny, b.pressure, pinned);
      b.sx = nx;
      b.sy = ny;
    }
  }

  private stepPin(dt: number) {
    if (!this.pin || this.settings.frozen || this.rightHeld || this.altHeld) return;
    this.pinAcc += dt;
    if (this.pinAcc < 0.05) return;
    this.pinAcc = 0;
    const { x, y } = this.pin;
    this.appendPair("pin", x, y, x + 0.35, y + 0.35, 0.5, true);
  }

  private stepKeys(dt: number) {
    let kdx = 0;
    let kdy = 0;
    if (this.keys.has("KeyA") || (!this.menuOpen && this.keys.has("ArrowLeft"))) kdx -= 1;
    if (this.keys.has("KeyD") || (!this.menuOpen && this.keys.has("ArrowRight"))) kdx += 1;
    if (this.keys.has("KeyW") || (!this.menuOpen && this.keys.has("ArrowUp"))) kdy -= 1;
    if (this.keys.has("KeyS") || (!this.menuOpen && this.keys.has("ArrowDown"))) kdy += 1;
    if (!kdx && !kdy) return false;
    if (!this.keyInited) {
      this.keyX = this.radius * 0.38;
      this.keyY = 0;
      this.keyInited = true;
    }
    if (this.pin) this.pin = null;
    const m = Math.hypot(kdx, kdy) || 1;
    const speed = 260 * this.dpr;
    this.keyX += (kdx / m) * speed * dt;
    this.keyY += (kdy / m) * speed * dt;
    const r = Math.hypot(this.keyX, this.keyY);
    const maxR = this.radius * 0.92;
    if (r > maxR) {
      this.keyX *= maxR / r;
      this.keyY *= maxR / r;
    }
    const brush = this.brushes.get("key");
    if (!brush) this.armBrush("key", this.keyX, this.keyY, 0.7);
    else {
      brush.x = this.keyX;
      brush.y = this.keyY;
    }
    return true;
  }

  private anyPainting() {
    return this.brushes.size > 0 || this.pin !== null;
  }

  private frame = (now: number) => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.frame);
    const dt = this.lastTs ? Math.min(0.1, (now - this.lastTs) / 1000) : 0.016;
    this.lastTs = now;

    if (this.flash > 0.01) this.flash = Math.max(0, this.flash - dt * 3.2);

    if (this.settings.frozen) {
      if (this.settings.spin && !this.reduced) this.spinAngle += 0.07 * dt;
      this.present();
      return;
    }

    this.time += dt;
    this.cullStrokes();

    if (this.settings.spin && !this.reduced) {
      this.spinAngle += 0.07 * dt;
    }

    const usingKeys = this.stepKeys(dt);
    this.stepBrushes(dt);
    this.stepPin(dt);

    if (!this.anyPainting() && !usingKeys && !this.reduced && this.time >= this.resumeIdleAt) {
      if (!this.hasIdle) {
        const p = this.hypotrochoid(this.idleT);
        this.lastIdleX = p.x;
        this.lastIdleY = p.y;
        this.hasIdle = true;
      }
      this.idleT += dt * 0.42;
      const p = this.hypotrochoid(this.idleT);
      this.appendPair("idle", this.lastIdleX, this.lastIdleY, p.x, p.y, 0.45, false);
      this.lastIdleX = p.x;
      this.lastIdleY = p.y;
    }

    this.present();
  };
}
