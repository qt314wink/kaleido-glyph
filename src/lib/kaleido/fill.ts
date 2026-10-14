function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hh = ((h % 360) + 360) % 360;
  const ss = s / 100;
  const ll = l / 100;
  const a = ss * Math.min(ll, 1 - ll);
  const f = (n: number) => {
    const k = (n + hh / 30) % 12;
    return ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [f(0), f(8), f(4)];
}
import type { FillRecipe } from "./types";

export type FillStroke = {
  xs: Float32Array;
  ys: Float32Array;
  len: number;
  width: number;
};

export type FillRoom = {
  cx: number;
  cy: number;
  area: number;
  veinX: number;
  veinY: number;
  seed: number;
};

export type FillMap = {
  size: number;
  radius: number;
  n: number;
  mirrors: boolean;
  labels: Uint16Array;
  rooms: FillRoom[];
};

export type FillSample = { h: number; s: number; l: number };

const MAX_ROOMS = 32;
const MIN_AREA = 24;
const ALPHA_CAP = 0.28;

export function fillMaskSize(coarse: boolean) {
  return coarse ? 256 : 384;
}

type Kept = {
  start: number;
  end: number;
  area: number;
  sx: number;
  sy: number;
  vein: number;
};

export class FillStencil {
  private size = 0;
  private axis = new Float64Array(0);
  private axisR = 0;

  private prepareAxis(radius: number) {
    if (this.axis.length === this.size && this.axisR === radius) return;
    this.axisR = radius;
    const S = this.size;
    const axis = new Float64Array(S);
    const diam = 2 * radius;
    for (let i = 0; i < S; i++) axis[i] = ((i + 0.5) / S - 0.5) * diam;
    this.axis = axis;
  }
  private radius = 1;
  private mask = new Uint8Array(0);
  private wallId = new Uint16Array(0);
  private labels = new Uint16Array(0);
  private pix = new Int32Array(0);
  private qq = new Int32Array(0);

  build(input: {
    size: number;
    radius: number;
    n: number;
    mirrors: boolean;
    wedges: boolean;
    strokes: FillStroke[];
  }): FillMap {
    const size = input.size;
    const radius = Math.max(8, input.radius);
    const n = Math.max(1, input.n | 0);
    this.ensure(size);
    this.radius = radius;
    this.prepareAxis(radius);
    this.mask.fill(0);
    this.wallId.fill(0);
    this.labels.fill(0);

    const rr = radius * radius;
    const S = size;
    const axis = this.axis;
    for (let j = 0; j < S; j++) {
      const yy = (axis[j] ?? 0) * (axis[j] ?? 0);
      const row = j * S;
      for (let i = 0; i < S; i++) {
        if ((axis[i] ?? 0) * (axis[i] ?? 0) + yy > rr) this.mask[row + i] = 2;
      }
    }

    const slice = (Math.PI * 2) / n;
    const cos = new Float64Array(n);
    const sin = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      cos[i] = Math.cos(i * slice);
      sin[i] = Math.sin(i * slice);
    }

    const strokes = input.strokes;
    for (let s = 0; s < strokes.length; s++) {
      const stroke = strokes[s];
      if (!stroke || stroke.len < 2) continue;
      this.strokeWall(stroke, s + 1, n, input.mirrors, cos, sin);
    }

    if (input.wedges) {
      for (let i = 0; i < n; i++) {
        const ca = cos[i] ?? 1;
        const sa = sin[i] ?? 0;
        this.seg(0, 0, ca * radius * 1.2, sa * radius * 1.2, 0, true);
      }
      const mid = (S / 2) | 0;
      this.plot(mid, mid, 0, true);
    }

    const rooms = this.flood(input.wedges, radius, strokes);
    return {
      size,
      radius,
      n,
      mirrors: input.mirrors,
      labels: this.labels,
      rooms,
    };
  }

  private ensure(size: number) {
    if (this.size === size && this.mask.length === size * size) return;
    const n = size * size;
    this.size = size;
    this.mask = new Uint8Array(n);
    this.wallId = new Uint16Array(n);
    this.labels = new Uint16Array(n);
    this.pix = new Int32Array(n);
    this.qq = new Int32Array(n);
  }

  private strokeWall(
    s: FillStroke,
    id: number,
    n: number,
    mirrors: boolean,
    cos: Float64Array,
    sin: Float64Array,
  ) {
    const thick = s.width * (this.size / (2 * this.radius)) >= 2.4;
    const x0 = s.xs[0] ?? 0;
    const y0 = s.ys[0] ?? 0;
    const x1 = s.xs[s.len - 1] ?? x0;
    const y1 = s.ys[s.len - 1] ?? y0;
    const gap = Math.hypot(x1 - x0, y1 - y0);
    const close = gap > 0.4 && gap <= s.width * 1.35 + 2;
    for (let i = 0; i < n; i++) {
      const ca = cos[i] ?? 1;
      const sa = sin[i] ?? 0;
      this.poly(s, ca, sa, false, id, thick, close);
      if (mirrors) this.poly(s, ca, sa, true, id, thick, close);
    }
  }

  private poly(
    s: FillStroke,
    ca: number,
    sa: number,
    mirror: boolean,
    id: number,
    thick: boolean,
    close: boolean,
  ) {
    let px = 0;
    let py = 0;
    for (let i = 0; i < s.len; i++) {
      const x = s.xs[i] ?? 0;
      const y = s.ys[i] ?? 0;
      const tx = mirror ? x * ca + y * sa : x * ca - y * sa;
      const ty = mirror ? x * sa - y * ca : x * sa + y * ca;
      if (i > 0) this.seg(px, py, tx, ty, id, thick);
      px = tx;
      py = ty;
    }
    if (close && s.len > 2) {
      const x = s.xs[0] ?? 0;
      const y = s.ys[0] ?? 0;
      const tx = mirror ? x * ca + y * sa : x * ca - y * sa;
      const ty = mirror ? x * sa - y * ca : x * sa + y * ca;
      this.seg(px, py, tx, ty, id, thick);
    }
  }

  private seg(x0: number, y0: number, x1: number, y1: number, id: number, thick: boolean) {
    const S = this.size;
    const r = this.radius;
    const ax = (x0 / r + 1) * 0.5 * S;
    const ay = (y0 / r + 1) * 0.5 * S;
    const bx = (x1 / r + 1) * 0.5 * S;
    const by = (y1 / r + 1) * 0.5 * S;
    const clipped = clipBox(ax, ay, bx, by, -1, S);
    if (!clipped) return;
    this.supercover(clipped[0], clipped[1], clipped[2], clipped[3], id, thick);
  }

  private supercover(x0: number, y0: number, x1: number, y1: number, id: number, thick: boolean) {
    const S = this.size;
    const mask = this.mask;
    const wallId = this.wallId;
    const stamp = (i: number, j: number) => {
      if ((i | j) < 0 || i >= S || j >= S) return;
      const k = j * S + i;
      mask[k] = 1;
      if (id > 0) wallId[k] = id;
    };
    let x = Math.round(x0);
    let y = Math.round(y0);
    const xe = Math.round(x1);
    const ye = Math.round(y1);
    const dx = Math.abs(xe - x);
    const dy = Math.abs(ye - y);
    const sx = x < xe ? 1 : -1;
    const sy = y < ye ? 1 : -1;
    let err = dx - dy;
    const guard = dx + dy + 4;
    for (let k = 0; k < guard; k++) {
      stamp(x, y);
      if (thick) {
        stamp(x - 1, y);
        stamp(x + 1, y);
        stamp(x, y - 1);
        stamp(x, y + 1);
      }
      if (x === xe && y === ye) return;
      const e2 = 2 * err;
      if (e2 > -dy && e2 < dx) {
        stamp(x + sx, y);
        stamp(x, y + sy);
      }
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  private plot(i: number, j: number, id: number, thick: boolean) {
    this.stamp(i, j, id);
    if (!thick) return;
    this.stamp(i - 1, j, id);
    this.stamp(i + 1, j, id);
    this.stamp(i, j - 1, id);
    this.stamp(i, j + 1, id);
  }

  private stamp(i: number, j: number, id: number) {
    const S = this.size;
    if (i < 0 || j < 0 || i >= S || j >= S) return;
    const k = j * S + i;
    this.mask[k] = 1;
    if (id > 0) this.wallId[k] = id;
  }

  private flood(wedges: boolean, radius: number, strokes: FillStroke[]) {
    const S = this.size;
    const N = S * S;
    const rim2 = radius * 0.972 * (radius * 0.972);
    const kept: Kept[] = [];
    let pcursor = 0;
    const qq = this.qq;
    const mask = this.mask;
    const wallId = this.wallId;
    const pix = this.pix;
    const axis = this.axis;
    let vein = 0;

    const walk = (k: number, qh: number) => {
      const m = mask[k];
      if (m === 1) {
        const id = wallId[k] ?? 0;
        if (id > 0 && vein === 0) vein = id;
        return qh;
      }
      if (m !== 0) return qh;
      mask[k] = 3;
      qq[qh] = k;
      return qh + 1;
    };

    for (let start = 0; start < N; start++) {
      if (mask[start] !== 0) continue;
      let qh = 1;
      let qt = 0;
      qq[0] = start;
      mask[start] = 3;
      let area = 0;
      let sx = 0;
      let sy = 0;
      vein = 0;
      let sky = false;
      const pixStart = pcursor;
      let recording = true;

      while (qt < qh) {
        const k = qq[qt++] ?? 0;
        const row = (k / S) | 0;
        const col = k - row * S;
        area++;
        const wx = axis[col] ?? 0;
        const wy = axis[row] ?? 0;
        sx += wx;
        sy += wy;
        if (!wedges && wx * wx + wy * wy >= rim2) {
          sky = true;
          if (recording) {
            recording = false;
            pcursor = pixStart;
          }
        } else if (recording) pix[pcursor++] = k;

        if (col > 0) qh = walk(k - 1, qh);
        if (col + 1 < S) qh = walk(k + 1, qh);
        if (row > 0) qh = walk(k - S, qh);
        if (row + 1 < S) qh = walk(k + S, qh);
      }

      if (sky || area < MIN_AREA) {
        pcursor = pixStart;
        continue;
      }
      kept.push({ start: pixStart, end: pcursor, area, sx, sy, vein });
    }

    if (kept.length > MAX_ROOMS) {
      kept.sort((a, b) => b.area - a.area);
      kept.length = MAX_ROOMS;
    }

    const rooms: FillRoom[] = [];
    for (let i = 0; i < kept.length; i++) {
      const room = kept[i];
      if (!room) continue;
      const id = i + 1;
      for (let p = room.start; p < room.end; p++) this.labels[pix[p] ?? 0] = id;
      const cx = room.sx / room.area;
      const cy = room.sy / room.area;
      let veinX = cx;
      let veinY = cy;
      if (room.vein > 0) {
        const stroke = strokes[room.vein - 1];
        if (stroke && stroke.len > 0) {
          const m = Math.max(0, (stroke.len >> 1) - 1);
          veinX = stroke.xs[m] ?? cx;
          veinY = stroke.ys[m] ?? cy;
        }
      }
      rooms.push({
        cx,
        cy,
        area: room.area,
        veinX,
        veinY,
        seed: (room.vein * 1.7 + room.area * 0.013) % 19,
      });
    }
    return rooms;
  }
}

function clipBox(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  min: number,
  max: number,
): [number, number, number, number] | null {
  let t0 = 0;
  let t1 = 1;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const p = [-dx, dx, -dy, dy];
  const q = [x0 - min, max - x0, y0 - min, max - y0];
  for (let i = 0; i < 4; i++) {
    const pi = p[i] ?? 0;
    const qi = q[i] ?? 0;
    if (pi === 0) {
      if (qi < 0) return null;
      continue;
    }
    const t = qi / pi;
    if (pi < 0) {
      if (t > t1) return null;
      if (t > t0) t0 = t;
    } else {
      if (t < t0) return null;
      if (t < t1) t1 = t;
    }
  }
  if (t1 < t0) return null;
  return [x0 + t0 * dx, y0 + t0 * dy, x0 + t1 * dx, y0 + t1 * dy];
}

function fold(x: number, y: number, n: number, mirrors: boolean) {
  const r = Math.hypot(x, y);
  let ang = Math.atan2(y, x);
  if (ang < 0) ang += Math.PI * 2;
  const slice = (Math.PI * 2) / Math.max(1, n);
  let sector = Math.floor(ang / slice);
  if (sector < 0) sector = 0;
  if (sector >= n) sector = n - 1;
  let local = ang - sector * slice;
  if (mirrors && local > slice * 0.5) local = slice - local;
  return { x: Math.cos(local) * r, y: Math.sin(local) * r, sector, r };
}

function hashCell(x: number, y: number, radius: number) {
  const g = Math.max(4, radius * 0.09);
  const ix = Math.round(x / g);
  const iy = Math.round(y / g);
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h >>> 0) % 6;
}

function sectorOf(x: number, y: number, n: number) {
  let ang = Math.atan2(y, x);
  if (ang < 0) ang += Math.PI * 2;
  const sector = Math.floor(ang / ((Math.PI * 2) / Math.max(1, n)));
  if (sector < 0) return 0;
  if (sector >= n) return n - 1;
  return sector;
}

let paintLut = new Float32Array(33 * 8);

export function paintFill(
  map: FillMap,
  out: Uint8ClampedArray,
  opts: {
    recipe: FillRecipe;
    reduced: boolean;
    sample: (x: number, y: number) => FillSample;
    activity: (seed: number) => number;
  },
) {
  out.fill(0);
  const rooms = map.rooms;
  if (rooms.length === 0) return;
  const recipe = opts.recipe === "tide" && opts.reduced ? "wash" : opts.recipe;
  const well = recipe === "well";
  const pixWorld = (2 * map.radius) / map.size;
  const need = (rooms.length + 1) * 8;
  if (paintLut.length < need) paintLut = new Float32Array(need);
  const lut = paintLut;

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    if (!room) continue;
    const base =
      recipe === "vein"
        ? opts.sample(room.veinX, room.veinY)
        : recipe === "cloisonne"
          ? opts.sample(fold(room.cx, room.cy, map.n, map.mirrors).x, fold(room.cx, room.cy, map.n, map.mirrors).y)
          : opts.sample(room.cx, room.cy);
    let h = base.h;
    let s = base.s;
    let l = Math.min(70, base.l);
    let a = 0.24;
    if (recipe === "vein") a = 0.26;
    if (recipe === "tide") {
      const act = Math.max(0, Math.min(1.2, opts.activity(room.seed)));
      a = Math.min(ALPHA_CAP, 0.26 * Math.min(1, act));
    }
    if (recipe === "cloisonne") {
      const folded = fold(room.cx, room.cy, map.n, map.mirrors);
      const step = sectorOf(room.cx, room.cy, map.n) * (360 / map.n);
      h = (step + hashCell(folded.x, folded.y, map.radius) * 16 + Math.round(base.h / 36) * 6) % 360;
      s = Math.min(86, Math.max(48, base.s));
      l = 56;
      a = 0.26;
    }
    if (recipe === "well") a = ALPHA_CAP;
    a = Math.min(ALPHA_CAP, Math.max(0, a));
    const [r, g, b] = hslToRgb(h, s, l);
    const o = (i + 1) * 8;
    lut[o] = r;
    lut[o + 1] = g;
    lut[o + 2] = b;
    lut[o + 3] = a;
    lut[o + 4] = room.cx;
    lut[o + 5] = room.cy;
    const roomR = Math.max(4, Math.sqrt(room.area / Math.PI) * pixWorld);
    lut[o + 6] = 1 / (roomR * roomR);
    lut[o + 7] = well ? 1 : 0;
  }

  const labels = map.labels;
  const S = map.size;
  const radius = map.radius;
  const n = S * S;
  for (let k = 0; k < n; k++) {
    const id = labels[k] ?? 0;
    if (id === 0) continue;
    const o = id * 8;
    let a = lut[o + 3] ?? 0;
    let shade = 1;
    if ((lut[o + 7] ?? 0) > 0) {
      const col = k - ((k / S) | 0) * S;
      const row = (k / S) | 0;
      const wx = ((col + 0.5) / S - 0.5) * 2 * radius;
      const wy = ((row + 0.5) / S - 0.5) * 2 * radius;
      const dx = wx - (lut[o + 4] ?? 0);
      const dy = wy - (lut[o + 5] ?? 0);
      const inv = lut[o + 6] ?? 1;
      const t = Math.min(1, (dx * dx + dy * dy) * inv);
      a = Math.min(ALPHA_CAP, ALPHA_CAP * (1 - 0.62 * t));
      shade = 1 - 0.22 * t;
    }
    if (a < 0.004) continue;
    const p = k * 4;
    out[p] = (lut[o] ?? 0) * shade * 255;
    out[p + 1] = (lut[o + 1] ?? 0) * shade * 255;
    out[p + 2] = (lut[o + 2] ?? 0) * shade * 255;
    out[p + 3] = a * 255;
  }
}
