import { ICON_BURN, ICON_N, iconStep, type IconCoeffs } from "./icon";
import { FillStencil, fillMaskSize, paintFill, type FillMap, type FillStroke } from "./fill";
import { KaleidoGL, hslToRgb, type GLFrame, type GLIcon, type GLStroke } from "./gl";
import { downloadBlob } from "./recorder";
import type { ColorMode, ColorMotion, KaleidoSettings, LensLayout, LightActivity } from "./types";

const BG = "rgb(8, 8, 11)";
const TAU = Math.PI * 2;
const ARROWS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);
const WASD = new Set(["KeyA", "KeyD", "KeyW", "KeyS"]);
const MAX_PTS = 72;
const FIELD_N = 24;

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

type IconPt = { x: number; y: number; px: number; py: number; qx: number; qy: number; seed: number };

const COLOR: RGBA = { h: 0, s: 0, l: 0, a: 1 };
const ACT = { a: 1, h: 0, w: 1 };

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
  COLOR.a = 1;
  switch (mode) {
    case "spectrum":
      COLOR.h = (t * 46 + u * 150 + off) % 360;
      COLOR.s = 84;
      COLOR.l = 58;
      break;
    case "prism":
      COLOR.h = (((ang * 180) / Math.PI + 360 + t * 10 + off) % 360 + 360) % 360;
      COLOR.s = 80;
      COLOR.l = 60;
      break;
    case "aurora":
      COLOR.h = (150 + Math.sin(t * 0.65 + u * 5) * 78 + off + 360) % 360;
      COLOR.s = 74;
      COLOR.l = 56;
      break;
    case "ember":
      COLOR.h = (16 + Math.sin(t * 1.05 + u * 6) * 16 + off + 360) % 360;
      COLOR.s = 90;
      COLOR.l = 56;
      break;
    case "ice":
      COLOR.h = (196 + Math.sin(t * 0.7 + u * 4) * 24 + off + 360) % 360;
      COLOR.s = 70;
      COLOR.l = 62;
      break;
    case "pearl":
      COLOR.h = (36 + Math.sin(t * 0.5) * 10 + off + 360) % 360;
      COLOR.s = 16;
      COLOR.l = 78;
      break;
  }
  return COLOR;
}

function activityAt(kind: LightActivity, time: number, along: number, seed: number, boost: number) {
  const lift = 1 + 0.55 * boost;
  switch (kind) {
    case "steady":
      ACT.a = (0.78 + 0.1 * Math.sin(time * 1.6 + seed)) * lift;
      ACT.h = 0;
      ACT.w = 1;
      break;
    case "pulse": {
      const wave = 0.5 + 0.5 * Math.sin(time * 2.8 + seed);
      ACT.a = (0.22 + 0.78 * wave) * lift;
      ACT.h = 0;
      ACT.w = 0.82 + 0.28 * wave + 0.2 * boost;
      break;
    }
    case "blink": {
      const beat = (time * 2.15 + seed * 0.15) % 1.15;
      const on = beat < 0.62 || (beat > 0.74 && beat < 0.88);
      ACT.a = (on ? 0.95 : 0.05) * lift;
      ACT.h = 0;
      ACT.w = on ? 1 : 0.7;
      break;
    }
    case "chase": {
      const head = (time * 0.62 + seed) % 1;
      const d = Math.abs(along - head);
      const prox = Math.min(d, 1 - d);
      const hot = prox < 0.1;
      ACT.a = (hot ? 1 : 0.1 + 0.16 * (1 - prox)) * lift;
      ACT.h = along * 50;
      ACT.w = hot ? 1.45 : 0.7;
      break;
    }
    case "firefly": {
      const tw = Math.sin(time * 6.8 + along * 22 + seed * 11);
      const lit = tw > 0.42;
      ACT.a = (lit ? 0.2 + (tw - 0.42) * 1.6 : 0.08) * lift;
      ACT.h = lit ? 24 : 0;
      ACT.w = lit ? 1.25 : 0.72;
      break;
    }
    case "strobe": {
      const on = Math.sin(time * 16 + seed * 4) > 0.15;
      ACT.a = (on ? 1 : 0.04) * lift;
      ACT.h = on ? 10 : 0;
      ACT.w = on ? 1.12 : 0.75;
      break;
    }
  }
  return ACT;
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

function isCoarse() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export class KaleidoEngine {
  private display: HTMLCanvasElement;
  private root: HTMLElement;
  private dctx: CanvasRenderingContext2D | null = null;
  private gl: KaleidoGL | null = null;
  private dpr = 1;
  private width = 0;
  private height = 0;
  private cx = 0;
  private cy = 0;
  private radius = 0;
  private bottomInset = 0;
  private topInset = 0;
  private rimPad = 0;
  private settings: KaleidoSettings;
  private inkTime = 0;
  private lightTime = 0;
  private aliveTime = 0;
  private spinAngle = 0;
  private raf = 0;
  private lastTs = 0;
  private running = false;
  private destroyed = false;
  private cos = new Float64Array(8);
  private sin = new Float64Array(8);
  private brushes = new Map<string, Brush>();
  private echoes = new Map<string, { x: number; y: number; t: number }[]>();
  private fieldEcho = new Map<string, { x: number; y: number }>();
  private field = new Float32Array(FIELD_N * FIELD_N);
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
  private icons: IconPt[] = [];
  private iconK = 0;
  private stencil: FillStencil | null = null;
  private fillMap: FillMap | null = null;
  private fillSig = "";
  private fillPaintKey = "";
  private fillRGBA: Uint8ClampedArray | null = null;
  private fillCanvas: HTMLCanvasElement | null = null;
  private fillCtx: CanvasRenderingContext2D | null = null;
  private fillImage: ImageData | null = null;
  private fillRooms = 0;
  private fillRev = 0;
  private fillBlitRev = -1;
  private iconPool: GLIcon[] = [];
  private strokePool: GLStroke[] = [];

  constructor(display: HTMLCanvasElement, root: HTMLElement, settings: KaleidoSettings) {
    this.display = display;
    this.root = root;
    this.gl = KaleidoGL.attach(display);
    if (!this.gl) {
      const dctx = display.getContext("2d", {
        alpha: false,
        colorSpace: "srgb",
      } as CanvasRenderingContext2DSettings);
      if (!dctx) throw new Error("Canvas 2D is not available");
      this.dctx = dctx;
    }
    this.settings = { ...settings };
    this.rebuildTrig();
    this.reseedIdle();
    this.rebuildField(0);
    this.reduced = prefersReducedMotion();
    this.expose();
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
    const iconChanged = next.icon !== this.settings.icon;
    const froze = next.frozen && !this.settings.frozen;
    this.settings = { ...next };
    if (segsChanged) this.rebuildTrig();
    if (next.frozen) this.brushes.clear();
    if (froze) this.pulse();
    if ((iconChanged || segsChanged) && next.icon) this.seedIcons(next.icon, next.segments);
    if (!next.icon) this.icons = [];
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

  setTopInset(cssPx: number) {
    if (Math.abs(cssPx - this.topInset) < 0.5) return;
    this.topInset = cssPx;
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

  /** Lens center and radius in canvas pixels, for cropping an export. */
  lensPixels() {
    return { cx: this.cx, cy: this.cy, radius: this.radius };
  }

  private expose() {
    const el = this.display as HTMLCanvasElement & {
      __kaleido?: Record<string, unknown>;
    };
    el.__kaleido = {
      clocks: () => ({
        ink: this.inkTime,
        light: this.lightTime,
        spin: this.spinAngle,
        k: this.iconK,
        alive: this.aliveTime,
        frozen: this.settings.frozen,
        persist: this.settings.persist,
        path: this.settings.pathMode,
        n: this.settings.segments,
        kind: this.settings.iconKind,
        strokeN: this.strokes.length,
        renderer: this.gl ? "gl" : "2d",
        fill: this.settings.fillMode,
        recipe: this.settings.fillRecipe,
        rooms: this.fillRooms,
        layout: this.getLayout(),
      }),
    };
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
    this.icons = [];
    this.hasIdle = false;
    this.brushes.clear();
    this.echoes.clear();
    this.fieldEcho.clear();
    this.unpin();
    this.resumeIdleAt = Number.POSITIVE_INFINITY;
    this.present();
  }

  burst(seed = false) {
    this.reseedIdle();
    if (this.settings.icon) {
      this.seedIcons(this.settings.icon, this.settings.segments);
      this.resumeIdleAt = this.inkTime;
      this.present();
      return;
    }
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
    this.resumeIdleAt = this.inkTime;
    this.present();
  }

  exportPng(): Promise<void> {
    return this.exportBlob().then((blob) => {
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      downloadBlob(blob, `kaleido-${stamp}.png`);
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

  private strokeCap() {
    return isCoarse() ? 40 : 64;
  }

  private strokeWeight() {
    let w = 0;
    const parked = this.parkedGlobal();
    for (const s of this.strokes) w += parked || s.pinned ? 2 : 1;
    return w;
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
    this.fieldEcho.delete(id);
    for (const key of [`${id}:main`, `${id}:twin`, `${id}:orbit`, `${id}:echo`, `${id}:field`]) {
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

  private rebuildField(t: number) {
    const bx = this.lastPX / Math.max(1, this.radius);
    const by = this.lastPY / Math.max(1, this.radius);
    for (let j = 0; j < FIELD_N; j++) {
      for (let i = 0; i < FIELD_N; i++) {
        const u = i / FIELD_N - 0.5;
        const v = j / FIELD_N - 0.5;
        this.field[j * FIELD_N + i] = Math.atan2(
          Math.sin((u + 0.15) * 6 + t * 0.18) + v * 1.4 + by * 0.35,
          Math.cos((v - 0.1) * 6 - t * 0.14) - u * 1.4 + bx * 0.35,
        );
      }
    }
  }

  private fieldAngle(x: number, y: number) {
    const n = FIELD_N;
    const gx = ((x / Math.max(1, this.radius) + 1) * 0.5) * (n - 1);
    const gy = ((y / Math.max(1, this.radius) + 1) * 0.5) * (n - 1);
    const i = Math.max(0, Math.min(n - 2, Math.floor(gx)));
    const j = Math.max(0, Math.min(n - 2, Math.floor(gy)));
    return this.field[j * n + i] ?? 0;
  }

  private seedIcons(c: IconCoeffs, n: number) {
    const pts: IconPt[] = [];
    for (let i = 0; i < ICON_N; i++) {
      const ang = (i / ICON_N) * TAU;
      const r = 0.08 + (i % 17) * 0.011;
      let x = Math.cos(ang) * r;
      let y = Math.sin(ang) * r;
      for (let k = 0; k < ICON_BURN; k++) {
        const next = iconStep(x, y, c, n);
        x = next.x;
        y = next.y;
      }
      pts.push({ x, y, px: x, py: y, qx: x, qy: y, seed: i * 0.137 });
    }
    this.icons = pts;
    this.iconK = ICON_BURN;
  }

  private stepIcons() {
    const c = this.settings.icon;
    if (!c || this.icons.length === 0) return;
    const n = this.settings.segments;
    const ring = this.settings.iconKind === "ring";
    const steps = ring ? 3 : 1;
    for (const p of this.icons) {
      p.qx = p.px;
      p.qy = p.py;
      p.px = p.x;
      p.py = p.y;
      for (let k = 0; k < steps; k++) {
        const next = iconStep(p.x, p.y, c, n);
        p.x = next.x;
        p.y = next.y;
      }
    }
    this.iconK += steps;
  }

  private pickDpr() {
    const raw = window.devicePixelRatio || 1;
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.deviceMemory ?? 8) <= 2 || (navigator.hardwareConcurrency || 4) <= 2) return 1;
    if (isCoarse()) return Math.min(1.5, raw);
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
    const top = this.topInset * dpr;
    const bottom = this.bottomInset * dpr;
    const pad = this.rimPad * dpr;
    const usableH = Math.max(1, h - bottom - top);
    this.cx = w / 2;
    this.cy = top + usableH / 2;
    this.radius = Math.max(24, Math.min(this.cx, usableH / 2) - 16 * dpr - pad);
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
    const cap = this.strokeCap();
    while (this.strokeWeight() >= cap) {
      const idx = this.strokes.findIndex((s) => !s.pinned);
      this.strokes.splice(idx === -1 ? 0 : idx, 1);
    }
    const s: Stroke = {
      xs: new Float32Array(MAX_PTS),
      ys: new Float32Array(MAX_PTS),
      len: 0,
      born: this.inkTime,
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
      const a = this.lightTime * 1.25;
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
    buf.push({ x, y, t: this.inkTime });
    const horizon = this.inkTime - 0.28;
    while (buf.length > 2 && (buf[1]?.t ?? 0) < horizon) buf.shift();
    const ghost = buf[0];
    if (ghost && this.inkTime - ghost.t >= 0.18) {
      const next = buf[1] ?? ghost;
      const width = this.settings.brush * (0.4 + 0.3 * pressure);
      const s = this.liveStroke(`${id}:echo`, pinned, width);
      if (s.len === 0) this.pushPoint(s, ghost.x, ghost.y);
      this.strokeTo(s, ghost.x, ghost.y, next.x, next.y);
    }
  }

  private feedField(id: string, x: number, y: number, dt: number, pressure: number, pinned: boolean) {
    if (this.settings.pathMode !== "field") return;
    let buf = this.echoes.get(id);
    if (!buf) {
      buf = [];
      this.echoes.set(id, buf);
    }
    buf.push({ x, y, t: this.inkTime });
    const horizon = this.inkTime - 0.28;
    while (buf.length > 2 && (buf[1]?.t ?? 0) < horizon) buf.shift();
    const ghost = buf[0];
    if (!ghost || this.inkTime - ghost.t < 0.18) return;

    let p = this.fieldEcho.get(id);
    if (!p) {
      p = { x: ghost.x, y: ghost.y };
      this.fieldEcho.set(id, p);
    }
    const ang = this.fieldAngle(p.x, p.y);
    const step = 0.012 * this.radius * Math.min(2.2, dt * 60);
    const nx = p.x + Math.cos(ang) * step + (ghost.x - p.x) * 0.04;
    const ny = p.y + Math.sin(ang) * step + (ghost.y - p.y) * 0.04;
    const width = this.settings.brush * (0.38 + 0.28 * pressure);
    const s = this.liveStroke(`${id}:field`, pinned, width);
    if (s.len === 0) this.pushPoint(s, p.x, p.y);
    this.strokeTo(s, p.x, p.y, nx, ny);
    p.x = nx;
    p.y = ny;
  }

  private cullStrokes() {
    if (this.parkedGlobal()) return;
    const life = this.lifetime();
    const pinOn = this.pin !== null;
    this.strokes = this.strokes.filter((s) => {
      if (s.pinned && pinOn) return true;
      if (s.pinned && !pinOn) s.pinned = false;
      return this.inkTime - s.born < life;
    });
  }

  private fadeOf(s: Stroke) {
    if (this.parkedGlobal() || (s.pinned && this.pin !== null)) return 1;
    const life = this.lifetime();
    const age = this.inkTime - s.born;
    const t = Math.max(0, 1 - age / life);
    return t * t;
  }

  private needsAlong() {
    const a = this.settings.lightActivity;
    return a === "chase" || a === "firefly";
  }

  private idleBoost() {
    if (this.reduced) return 0;
    return Math.max(0, 1 - this.aliveTime / 2);
  }

  private mirrors(): boolean {
    return this.settings.pathMode !== "rosette";
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
    const w = Math.max(0.7, s.width * 0.22 * this.dpr);
    const alongNeeded = this.needsAlong();
    const boost = this.idleBoost();

    const tx = (x: number, y: number) => {
      if (mirror) return { x: x * ca + y * sa, y: x * sa - y * ca };
      return { x: x * ca - y * sa, y: x * sa + y * ca };
    };

    if (!alongNeeded) {
      const act = activityAt(actKind, this.lightTime, 0.5, s.seed, boost);
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
      const act = activityAt(actKind, this.lightTime, along, s.seed, boost);
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

  private drawIcons(ctx: CanvasRenderingContext2D) {
    if (this.icons.length === 0) return;
    const scale = this.radius * 0.92;
    const ring = this.settings.iconKind === "ring";
    const boost = this.idleBoost();
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    for (const p of this.icons) {
      const x = p.x * scale;
      const y = p.y * scale;
      const ang = Math.atan2(p.y - p.py, p.x - p.px);
      const color = colorAt(
        this.settings.colorMode,
        this.settings.colorMotion,
        this.settings.hue + (ang * 180) / Math.PI,
        this.lightTime,
        x,
        y,
        this.radius,
      );
      const act = activityAt(this.settings.lightActivity, this.lightTime, (p.seed % 1), p.seed, boost);
      ctx.fillStyle = hsla(color, 0.72 * act.a);
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.7, 1.15 * this.dpr * act.w), 0, TAU);
      ctx.fill();
      if (ring) {
        ctx.strokeStyle = hsla(color, 0.45 * act.a);
        ctx.lineWidth = Math.max(0.6, 0.7 * this.dpr);
        ctx.beginPath();
        ctx.moveTo(p.qx * scale, p.qy * scale);
        ctx.lineTo(p.px * scale, p.py * scale);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  private fillSignature(size: number) {
    const q = (2 * Math.max(8, this.radius)) / Math.max(8, size);
    const qi = (v: number) => Math.round(v / q);
    let count = 0;
    let width = 0;
    let h = 2166136261;
    for (const s of this.strokes) {
      if (s.len < 2 || this.fadeOf(s) < 0.15) continue;
      count++;
      width += s.width;
      let px = qi(s.xs[0] ?? 0);
      let py = qi(s.ys[0] ?? 0);
      h = Math.imul(h ^ (px + 4096), 16777619);
      h = Math.imul(h ^ (py + 4096), 16777619);
      for (let i = 1; i < s.len; i++) {
        const x = qi(s.xs[i] ?? 0);
        const y = qi(s.ys[i] ?? 0);
        const dx = x - px;
        const dy = y - py;
        if (dx === 0 && dy === 0) continue;
        h = Math.imul(h ^ (dx + 256), 16777619);
        h = Math.imul(h ^ (dy + 256), 16777619);
        px = x;
        py = y;
      }
    }
    const bucket = Math.round(this.radius / 12);
    return `${this.settings.fillMode}|${size}|${this.settings.segments}|${this.settings.pathMode}|${bucket}|${count}|${h >>> 0}|${Math.round(width * 4)}`;
  }

  private syncFill(): { rgba: Uint8ClampedArray; size: number; rev: number } | null {
    if (this.settings.fillMode === "off") {
      this.fillRooms = 0;
      this.fillPaintKey = "";
      return null;
    }
    const size = fillMaskSize(isCoarse());
    const sig = this.fillSignature(size);
    if (sig !== this.fillSig) {
      this.fillSig = sig;
      this.fillPaintKey = "";
      if (!this.stencil) this.stencil = new FillStencil();
      const strokes: FillStroke[] = [];
      for (const s of this.strokes) {
        if (s.len < 2 || this.fadeOf(s) < 0.15) continue;
        strokes.push({
          xs: s.xs,
          ys: s.ys,
          len: s.len,
          width: Math.max(1.5, s.width * 0.22 * this.dpr),
        });
      }
      try {
        this.fillMap = this.stencil.build({
          size,
          radius: this.radius,
          n: this.settings.segments,
          mirrors: this.mirrors(),
          wedges: this.settings.fillMode === "wedges",
          strokes,
        });
      } catch {
        this.fillMap = null;
        this.fillRooms = 0;
        return null;
      }
    }
    const map = this.fillMap;
    if (!map || map.rooms.length === 0) {
      this.fillRooms = 0;
      return null;
    }
    this.fillRooms = map.rooms.length;
    const recipe = this.settings.fillRecipe;
    const boost = this.idleBoost();
    const key = `${sig}|${recipe}|${this.settings.colorMode}|${this.settings.colorMotion}|${this.settings.hue}|${this.settings.lightActivity}|${this.lightTime.toFixed(2)}|${boost.toFixed(2)}|${this.reduced ? 1 : 0}`;
    const need = size * size * 4;
    if (!this.fillRGBA || this.fillRGBA.length !== need) {
      this.fillRGBA = new Uint8ClampedArray(need);
      this.fillPaintKey = "";
    }
    if (key !== this.fillPaintKey && this.fillRGBA) {
      this.fillPaintKey = key;
      paintFill(map, this.fillRGBA, {
        recipe,
        reduced: this.reduced,
        sample: (x, y) =>
          colorAt(
            this.settings.colorMode,
            this.settings.colorMotion,
            this.settings.hue,
            this.lightTime,
            x,
            y,
            this.radius,
          ),
        activity: (seed) =>
          activityAt(this.settings.lightActivity, this.lightTime, 0.5, seed, boost).a,
      });
      this.fillRev++;
    }
    return this.fillRGBA ? { rgba: this.fillRGBA, size, rev: this.fillRev } : null;
  }

  private drawFill(ctx: CanvasRenderingContext2D) {
    const fill = this.syncFill();
    if (!fill) return;
    if (!this.fillCanvas) {
      this.fillCanvas = document.createElement("canvas");
      this.fillCtx = this.fillCanvas.getContext("2d", { alpha: true });
    }
    const canvas = this.fillCanvas;
    const ictx = this.fillCtx;
    if (!ictx) return;
    if (canvas.width !== fill.size || canvas.height !== fill.size) {
      canvas.width = fill.size;
      canvas.height = fill.size;
      this.fillImage = null;
    }
    if (!this.fillImage || this.fillImage.width !== fill.size) {
      this.fillImage = ictx.createImageData(fill.size, fill.size);
      this.fillBlitRev = -1;
    }
    if (this.fillBlitRev !== fill.rev) {
      this.fillImage.data.set(fill.rgba);
      ictx.putImageData(this.fillImage, 0, 0);
      this.fillBlitRev = fill.rev;
    }
    ctx.imageSmoothingEnabled = true;
    const r = this.radius;
    ctx.drawImage(canvas, -r, -r, r * 2, r * 2);
  }

  private present() {
    if (this.gl) {
      this.presentGL();
      return;
    }
    this.presentCanvas();
  }

  private presentGL() {
    const { width: w, height: h, cx, cy, radius } = this;
    if (!w || !h || !Number.isFinite(cx) || !Number.isFinite(cy) || !Number.isFinite(radius) || radius < 1) {
      return;
    }
    const boost = this.idleBoost();
    const scale = radius * 0.92;
    const icons = this.iconPool;
    const iconN = this.icons.length;
    while (icons.length < iconN) {
      icons.push({
        x: 0,
        y: 0,
        px: 0,
        py: 0,
        qx: 0,
        qy: 0,
        seed: 0,
        rgb: [0, 0, 0],
        alpha: 0,
        size: 1,
      });
    }
    if (icons.length !== iconN) icons.length = iconN;
    for (let i = 0; i < iconN; i++) {
      const p = this.icons[i];
      const ic = icons[i];
      if (!p || !ic) continue;
      const x = p.x * scale;
      const y = p.y * scale;
      const ang = Math.atan2(p.y - p.py, p.x - p.px);
      const color = colorAt(
        this.settings.colorMode,
        this.settings.colorMotion,
        this.settings.hue + (ang * 180) / Math.PI,
        this.lightTime,
        x,
        y,
        this.radius,
      );
      const hue = color.h;
      const sat = color.s;
      const lit = color.l;
      const act = activityAt(this.settings.lightActivity, this.lightTime, p.seed % 1, p.seed, boost);
      ic.x = x;
      ic.y = y;
      ic.px = p.px * scale;
      ic.py = p.py * scale;
      ic.qx = p.qx * scale;
      ic.qy = p.qy * scale;
      ic.seed = p.seed;
      hslToRgb(hue, sat, lit, ic.rgb);
      ic.alpha = 0.72 * act.a;
      ic.size = Math.max(1.2, 2.3 * this.dpr * act.w);
    }
    const strokes = this.strokePool;
    let strokeN = 0;
    for (const s of this.strokes) {
      if (s.len < 2) continue;
      const fade = this.fadeOf(s);
      if (fade < 0.02) continue;
      let slot = strokes[strokeN];
      if (!slot) {
        slot = {
          xs: s.xs,
          ys: s.ys,
          len: s.len,
          width: s.width,
          seed: s.seed,
          fade,
          rgb: [0, 0, 0],
        };
        strokes[strokeN] = slot;
      }
      const mid = Math.max(0, (s.len >> 1) - 1);
      const color = colorAt(
        this.settings.colorMode,
        this.settings.colorMotion,
        this.settings.hue,
        this.lightTime,
        s.xs[mid] ?? 0,
        s.ys[mid] ?? 0,
        this.radius,
      );
      slot.xs = s.xs;
      slot.ys = s.ys;
      slot.len = s.len;
      slot.width = s.width;
      slot.seed = s.seed;
      slot.fade = fade;
      hslToRgb(color.h, color.s, Math.min(78, color.l + 8), slot.rgb);
      strokeN++;
    }
    if (strokes.length !== strokeN) strokes.length = strokeN;
    const showKey = this.keyInited && [...this.keys].some((code) => WASD.has(code) || ARROWS.has(code));
    const frame: GLFrame = {
      width: w,
      height: h,
      cx,
      cy,
      radius,
      dpr: this.dpr,
      spin: this.settings.spin ? this.spinAngle : 0,
      n: this.settings.segments,
      mirrors: this.mirrors(),
      activity: this.settings.lightActivity,
      lightTime: this.lightTime,
      boost,
      flash: this.flash,
      pin: !showKey && this.pin && !this.settings.frozen ? this.pin : null,
      key: showKey ? { x: this.keyX, y: this.keyY } : null,
      strokes,
      icons,
      iconRing: this.settings.iconKind === "ring",
      fill: this.syncFill(),
    };
    this.gl?.draw(frame);
  }

  private presentCanvas() {
    const ctx = this.dctx;
    if (!ctx) return;
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

    this.drawFill(ctx);
    this.drawIcons(ctx);

    const n = this.settings.segments;
    const mirrors = this.mirrors();
    for (const s of this.strokes) {
      if (s.len < 2) continue;
      const fade = this.fadeOf(s);
      if (fade < 0.02) continue;
      const mid = Math.max(0, (s.len >> 1) - 1);
      const color = colorAt(
        this.settings.colorMode,
        this.settings.colorMotion,
        this.settings.hue,
        this.lightTime,
        s.xs[mid] ?? 0,
        s.ys[mid] ?? 0,
        this.radius,
      );
      for (let i = 0; i < n; i++) {
        const ca = this.cos[i] ?? 1;
        const sa = this.sin[i] ?? 0;
        this.drawPolyline(ctx, s, ca, sa, false, color, fade);
        if (mirrors) this.drawPolyline(ctx, s, ca, sa, true, color, fade);
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
      this.feedField(id, nx, ny, dt, b.pressure, pinned);
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
      this.present();
      return;
    }

    this.inkTime += dt;
    this.lightTime += dt;
    this.aliveTime += dt;
    this.cullStrokes();

    if (this.settings.spin && !this.reduced) {
      this.spinAngle += 0.07 * dt;
    }

    if (this.settings.pathMode === "field") this.rebuildField(this.lightTime);

    const usingKeys = this.stepKeys(dt);
    this.stepBrushes(dt);
    this.stepPin(dt);
    if (!this.reduced) this.stepIcons();

    if (!this.settings.icon && !this.anyPainting() && !usingKeys && !this.reduced && this.inkTime >= this.resumeIdleAt) {
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
