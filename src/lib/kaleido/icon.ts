export type IconCoeffs = {
  lam: number;
  a: number;
  b: number;
  g: number;
  w: number;
};

export type IconKind = "ring" | "cloak" | "sink";

export const ICON_N = 512;
export const ICON_BURN = 80;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function cpow(x: number, y: number, k: number) {
  let px = 1;
  let py = 0;
  for (let i = 0; i < k; i++) {
    const nx = px * x - py * y;
    const ny = px * y + py * x;
    px = nx;
    py = ny;
  }
  return { x: px, y: py };
}

export function iconStep(x: number, y: number, c: IconCoeffs, n: number) {
  const r2 = x * x + y * y;
  const zn = cpow(x, y, n);
  const zn1 = cpow(x, -y, Math.max(1, n - 1));
  const amp = c.lam + c.a * r2 + c.b * zn.x;
  let nx = amp * x - c.w * y + c.g * zn1.x;
  let ny = amp * y + c.w * x + c.g * zn1.y;
  const mag = nx * nx + ny * ny;
  if (mag > 8) {
    const s = 0.15 / Math.sqrt(Math.max(1e-8, x * x + y * y));
    return { x: x * s, y: y * s, escaped: true };
  }
  return { x: nx, y: ny, escaped: false };
}

export function nsAtOrigin(c: IconCoeffs) {
  const rho = Math.hypot(c.lam, c.w);
  const th = Math.atan2(c.w, c.lam);
  const strong = [1, 2, 3, 4].some((k) => {
    const a = Math.abs(((th * k) / (2 * Math.PI)) % 1);
    return Math.min(a, 1 - a) < 0.02;
  });
  return {
    rho,
    theta: th,
    isNS: Math.abs(rho - 1) < 0.04 && Math.abs(c.w) > 0.05 && !strong,
    strong,
  };
}

export function acceptIcon(c: IconCoeffs, n: number) {
  let x = 0.12;
  let y = 0.07;
  let esc = 0;
  for (let i = 0; i < 4096; i++) {
    const next = iconStep(x, y, c, n);
    x = next.x;
    y = next.y;
    if (next.escaped) esc++;
  }
  return esc / 4096 < 0.3;
}

function sampleKind(kind: IconKind): IconCoeffs {
  if (kind === "ring") {
    const rho = Math.random() < 0.55 ? rand(0.97, 1.04) : rand(1.04, 1.16);
    const th = rand(0.14, 0.34) * (Math.random() < 0.5 ? -1 : 1);
    return {
      lam: rho * Math.cos(th),
      a: rand(-0.8, -0.2),
      b: rand(-0.45, 0.45),
      g: rand(0.45, 1.05),
      w: rho * Math.sin(th),
    };
  }
  if (kind === "sink") {
    const rho = rand(0.55, 0.85);
    const th = rand(-0.2, 0.2);
    return {
      lam: rho * Math.cos(th),
      a: rand(-0.4, 0),
      b: rand(-0.35, 0.35),
      g: rand(0.4, 0.9),
      w: rho * Math.sin(th),
    };
  }
  return {
    lam: rand(-2.2, 2.2),
    a: rand(-1, 0.2),
    b: rand(-0.5, 0.5),
    g: rand(0.4, 1.2),
    w: Math.random() < 0.45 ? 0 : rand(-0.4, 0.4),
  };
}

export function sampleIcon(n: number): { coeffs: IconCoeffs; kind: IconKind } {
  const roll = Math.random();
  const preferred: IconKind = roll < 0.3 ? "ring" : roll < 0.6 ? "sink" : "cloak";
  const order: IconKind[] = [preferred, "cloak", "ring", "sink"];
  for (const kind of order) {
    const tries = kind === "ring" ? 24 : 12;
    for (let i = 0; i < tries; i++) {
      const coeffs = sampleKind(kind);
      const ns = nsAtOrigin(coeffs);
      if (ns.strong) continue;
      if (kind === "ring" && Math.abs(coeffs.w) < 0.08) continue;
      if (kind === "ring" && ns.rho < 0.96) continue;
      if (acceptIcon(coeffs, n)) return { coeffs, kind };
    }
  }
  return { coeffs: sampleKind("sink"), kind: "sink" };
}

export function classifyIcon(c: IconCoeffs): IconKind {
  const ns = nsAtOrigin(c);
  if (ns.isNS || (ns.rho > 1.02 && ns.rho < 1.2 && c.a < -0.15 && Math.abs(c.w) > 0.08)) {
    return "ring";
  }
  if (ns.rho < 0.9) return "sink";
  return "cloak";
}

export function isIconCoeffs(value: unknown): value is IconCoeffs {
  if (!value || typeof value !== "object") return false;
  const c = value as IconCoeffs;
  return [c.lam, c.a, c.b, c.g, c.w].every((n) => Number.isFinite(n));
}
