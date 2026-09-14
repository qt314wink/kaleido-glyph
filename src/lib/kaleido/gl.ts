export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
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

const ACT: Record<string, number> = {
  steady: 0,
  pulse: 1,
  blink: 2,
  chase: 3,
  firefly: 4,
  strobe: 5,
};

export type GLStroke = {
  xs: Float32Array;
  ys: Float32Array;
  len: number;
  width: number;
  seed: number;
  fade: number;
  rgb: [number, number, number];
};

export type GLIcon = {
  x: number;
  y: number;
  px: number;
  py: number;
  qx: number;
  qy: number;
  seed: number;
  rgb: [number, number, number];
  alpha: number;
  size: number;
};

export type GLFrame = {
  width: number;
  height: number;
  cx: number;
  cy: number;
  radius: number;
  dpr: number;
  spin: number;
  n: number;
  mirrors: boolean;
  activity: string;
  lightTime: number;
  boost: number;
  flash: number;
  pin: { x: number; y: number } | null;
  key: { x: number; y: number } | null;
  strokes: GLStroke[];
  icons: GLIcon[];
  iconRing: boolean;
};

const STROKE_VS = `#version 300 es
layout(location=0) in vec2 a_pos;
layout(location=1) in vec2 a_nrm;
layout(location=2) in float a_side;
layout(location=3) in float a_along;
uniform vec2 u_view;
uniform vec2 u_origin;
uniform int u_n;
uniform int u_mirrors;
uniform float u_spin;
uniform float u_half;
out float v_along;
out vec2 v_local;
void main() {
  int mirN = max(u_mirrors, 1);
  int sector = gl_InstanceID / mirN;
  int mir = gl_InstanceID % mirN;
  float slice = 6.28318530718 / float(max(u_n, 1));
  float a = float(sector) * slice + u_spin;
  float ca = cos(a);
  float sa = sin(a);
  vec2 p = a_pos + a_nrm * a_side * u_half;
  vec2 r = mir == 1
    ? vec2(p.x * ca + p.y * sa, p.x * sa - p.y * ca)
    : vec2(p.x * ca - p.y * sa, p.x * sa + p.y * ca);
  v_local = r;
  vec2 s = vec2(r.x + u_origin.x, r.y + u_origin.y);
  gl_Position = vec4(s.x / u_view.x * 2.0 - 1.0, 1.0 - s.y / u_view.y * 2.0, 0.0, 1.0);
  v_along = a_along;
}
`;

const STROKE_FS = `#version 300 es
precision highp float;
in float v_along;
in vec2 v_local;
uniform vec3 u_rgb;
uniform float u_alpha;
uniform float u_radius;
uniform int u_activity;
uniform float u_time;
uniform float u_seed;
uniform float u_boost;
out vec4 frag;
float activityAlpha() {
  float lift = 1.0 + 0.55 * u_boost;
  if (u_activity <= 0) {
    return (0.78 + 0.1 * sin(u_time * 1.6 + u_seed)) * lift;
  }
  if (u_activity == 1) {
    float wave = 0.5 + 0.5 * sin(u_time * 2.8 + u_seed);
    return (0.22 + 0.78 * wave) * lift;
  }
  if (u_activity == 2) {
    float beat = mod(u_time * 2.15 + u_seed * 0.15, 1.15);
    bool on = beat < 0.62 || (beat > 0.74 && beat < 0.88);
    return (on ? 0.95 : 0.05) * lift;
  }
  if (u_activity == 3) {
    float head = mod(u_time * 0.62 + u_seed, 1.0);
    float d = abs(v_along - head);
    float prox = min(d, 1.0 - d);
    bool hot = prox < 0.1;
    return (hot ? 1.0 : 0.1 + 0.16 * (1.0 - prox)) * lift;
  }
  if (u_activity == 4) {
    float tw = sin(u_time * 6.8 + v_along * 22.0 + u_seed * 11.0);
    bool lit = tw > 0.42;
    return (lit ? 0.2 + (tw - 0.42) * 1.6 : 0.08) * lift;
  }
  bool on = sin(u_time * 16.0 + u_seed * 4.0) > 0.15;
  return (on ? 1.0 : 0.04) * lift;
}
void main() {
  if (length(v_local) > u_radius) discard;
  float a = u_alpha * activityAlpha();
  if (a < 0.02) discard;
  frag = vec4(u_rgb, a);
}
`;

const POINT_VS = `#version 300 es
layout(location=0) in vec2 a_pos;
layout(location=1) in vec3 a_rgb;
layout(location=2) in float a_alpha;
layout(location=3) in float a_size;
uniform vec2 u_view;
uniform vec2 u_origin;
uniform float u_spin;
out vec3 v_rgb;
out float v_alpha;
out vec2 v_local;
void main() {
  float ca = cos(u_spin);
  float sa = sin(u_spin);
  vec2 r = vec2(a_pos.x * ca - a_pos.y * sa, a_pos.x * sa + a_pos.y * ca);
  v_local = r;
  vec2 s = vec2(r.x + u_origin.x, r.y + u_origin.y);
  gl_Position = vec4(s.x / u_view.x * 2.0 - 1.0, 1.0 - s.y / u_view.y * 2.0, 0.0, 1.0);
  gl_PointSize = max(1.0, a_size);
  v_rgb = a_rgb;
  v_alpha = a_alpha;
}
`;

const POINT_FS = `#version 300 es
precision highp float;
in vec3 v_rgb;
in float v_alpha;
in vec2 v_local;
uniform float u_radius;
out vec4 frag;
void main() {
  if (length(v_local) > u_radius) discard;
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = dot(p, p);
  if (d > 1.0) discard;
  frag = vec4(v_rgb, v_alpha * (1.0 - d * 0.35));
}
`;

const OVERLAY_VS = `#version 300 es
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const OVERLAY_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform vec2 u_view;
uniform vec2 u_origin;
uniform float u_radius;
uniform float u_dpr;
uniform float u_flash;
uniform vec2 u_mark;
uniform float u_markOn;
out vec4 frag;
void main() {
  vec2 s = vec2(v_uv.x * u_view.x, (1.0 - v_uv.y) * u_view.y);
  vec2 d = s - u_origin;
  float r = length(d);
  vec3 bg = vec3(8.0 / 255.0);
  if (r > u_radius + 1.5 * u_dpr) {
    frag = vec4(bg, 1.0);
    return;
  }
  float vig = smoothstep(u_radius * 0.5, u_radius, r) * 0.42;
  float rim = 1.0 - smoothstep(0.0, 1.2 * u_dpr, abs(r - u_radius));
  float inner = 1.0 - smoothstep(0.0, 3.0 * u_dpr, abs(r - (u_radius - 5.0 * u_dpr)));
  float flash = 0.0;
  if (u_flash > 0.02) {
    flash = (1.0 - smoothstep(0.0, 5.0 * u_dpr * u_flash, abs(r - (u_radius - 3.0 * u_dpr)))) * u_flash * 0.55;
  }
  float mark = 0.0;
  if (u_markOn > 0.5) {
    float md = abs(length(d - u_mark) - 3.5 * u_dpr);
    mark = (1.0 - smoothstep(0.0, 1.2 * u_dpr, md)) * 0.55;
  }
  vec3 rgb = bg;
  float a = vig;
  rgb = mix(rgb, vec3(197.0, 205.0, 216.0) / 255.0, max(rim * 0.22, inner * 0.06));
  a = max(a, max(rim * 0.22, inner * 0.06));
  rgb = mix(rgb, vec3(0.95), flash);
  a = max(a, flash);
  rgb = mix(rgb, vec3(197.0, 205.0, 216.0) / 255.0, mark);
  a = max(a, mark);
  frag = vec4(rgb, a);
}
`;

function compile(gl: WebGL2RenderingContext, vsSrc: string, fsSrc: string): WebGLProgram | null {
  const vs = gl.createShader(gl.VERTEX_SHADER);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  if (!vs || !fs) return null;
  gl.shaderSource(vs, vsSrc);
  gl.compileShader(vs);
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }
  gl.shaderSource(fs, fsSrc);
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

function loc(gl: WebGL2RenderingContext, prog: WebGLProgram, name: string) {
  return gl.getUniformLocation(prog, name);
}

export function webgl2Available() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    if (!gl) return false;
    const p = compile(gl, STROKE_VS, STROKE_FS);
    const q = compile(gl, POINT_VS, POINT_FS);
    const o = compile(gl, OVERLAY_VS, OVERLAY_FS);
    const ok = Boolean(p && q && o);
    if (p) gl.deleteProgram(p);
    if (q) gl.deleteProgram(q);
    if (o) gl.deleteProgram(o);
    return ok;
  } catch {
    return false;
  }
}

export class KaleidoGL {
  private gl: WebGL2RenderingContext;
  private strokeProg: WebGLProgram;
  private pointProg: WebGLProgram;
  private overlayProg: WebGLProgram;
  private strokeVao: WebGLVertexArrayObject;
  private strokeBuf: WebGLBuffer;
  private pointVao: WebGLVertexArrayObject;
  private pointBuf: WebGLBuffer;
  private overlayVao: WebGLVertexArrayObject;
  private packed = new Float32Array(72 * 2 * 6);
  private points = new Float32Array(512 * 7);
  private trailXs = new Float32Array(3);
  private trailYs = new Float32Array(3);

  constructor(gl: WebGL2RenderingContext, programs: [WebGLProgram, WebGLProgram, WebGLProgram]) {
    this.gl = gl;
    this.strokeProg = programs[0];
    this.pointProg = programs[1];
    this.overlayProg = programs[2];
    const strokeVao = gl.createVertexArray();
    const strokeBuf = gl.createBuffer();
    const pointVao = gl.createVertexArray();
    const pointBuf = gl.createBuffer();
    const overlayVao = gl.createVertexArray();
    if (!strokeVao || !strokeBuf || !pointVao || !pointBuf || !overlayVao) {
      throw new Error("WebGL buffers failed");
    }
    this.strokeVao = strokeVao;
    this.strokeBuf = strokeBuf;
    this.pointVao = pointVao;
    this.pointBuf = pointBuf;
    this.overlayVao = overlayVao;

    gl.bindVertexArray(strokeVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, strokeBuf);
    const stride = 24;
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 8);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 16);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 1, gl.FLOAT, false, stride, 20);

    gl.bindVertexArray(pointVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
    const ps = 28;
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, ps, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, ps, 8);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, ps, 20);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 1, gl.FLOAT, false, ps, 24);

    gl.bindVertexArray(overlayVao);
    const q = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, q);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  static attach(canvas: HTMLCanvasElement): KaleidoGL | null {
    if (!webgl2Available()) return null;
    let gl: WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: true,
        preserveDrawingBuffer: true,
        colorSpace: "srgb",
      } as WebGLContextAttributes);
    } catch {
      gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: true,
        preserveDrawingBuffer: true,
      });
    }
    if (!gl) return null;
    const stroke = compile(gl, STROKE_VS, STROKE_FS);
    const point = compile(gl, POINT_VS, POINT_FS);
    const overlay = compile(gl, OVERLAY_VS, OVERLAY_FS);
    if (!stroke || !point || !overlay) return null;
    try {
      return new KaleidoGL(gl, [stroke, point, overlay]);
    } catch {
      return null;
    }
  }

  draw(frame: GLFrame) {
    const gl = this.gl;
    const { width: w, height: h } = frame;
    if (w < 2 || h < 2) return;
    gl.viewport(0, 0, w, h);
    gl.clearColor(8 / 255, 8 / 255, 11 / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const spin = frame.spin;
    const origin: [number, number] = [frame.cx, frame.cy];
    const view: [number, number] = [w, h];
    const activity = ACT[frame.activity] ?? 1;
    const instances = frame.n * (frame.mirrors ? 2 : 1);

    this.drawIcons(frame, view, origin, spin);
    this.drawStrokes(frame, view, origin, spin, activity, instances);
    this.drawOverlay(frame, view, origin);
  }

  private drawStrokes(
    frame: GLFrame,
    view: [number, number],
    origin: [number, number],
    spin: number,
    activity: number,
    instances: number,
  ) {
    const gl = this.gl;
    const prog = this.strokeProg;
    gl.useProgram(prog);
    gl.bindVertexArray(this.strokeVao);
    gl.uniform2f(loc(gl, prog, "u_view"), view[0], view[1]);
    gl.uniform2f(loc(gl, prog, "u_origin"), origin[0], origin[1]);
    gl.uniform1i(loc(gl, prog, "u_n"), frame.n);
    gl.uniform1i(loc(gl, prog, "u_mirrors"), frame.mirrors ? 2 : 1);
    gl.uniform1f(loc(gl, prog, "u_spin"), spin);
    gl.uniform1f(loc(gl, prog, "u_radius"), frame.radius);
    gl.uniform1i(loc(gl, prog, "u_activity"), activity);
    gl.uniform1f(loc(gl, prog, "u_time"), frame.lightTime);
    gl.uniform1f(loc(gl, prog, "u_boost"), frame.boost);

    for (const s of frame.strokes) {
      if (s.len < 2 || s.fade < 0.02) continue;
      const verts = this.packStroke(s);
      if (verts < 4) continue;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.strokeBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.packed.subarray(0, verts * 6), gl.STREAM_DRAW);
      gl.uniform1f(loc(gl, prog, "u_seed"), s.seed);
      gl.uniform3f(loc(gl, prog, "u_rgb"), s.rgb[0], s.rgb[1], s.rgb[2]);
      const half = Math.max(0.45, s.width * 0.22 * frame.dpr * 0.5);
      gl.uniform1f(loc(gl, prog, "u_half"), half * 2.1);
      gl.uniform1f(loc(gl, prog, "u_alpha"), 0.28 * s.fade);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, verts, instances);
      gl.uniform1f(loc(gl, prog, "u_half"), half);
      gl.uniform1f(loc(gl, prog, "u_alpha"), 0.92 * s.fade);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, verts, instances);
    }
  }

  private packStroke(s: GLStroke) {
    const n = s.len;
    const need = n * 2 * 6;
    if (this.packed.length < need) this.packed = new Float32Array(need);
    const out = this.packed;
    let o = 0;
    for (let i = 0; i < n; i++) {
      const x = s.xs[i] ?? 0;
      const y = s.ys[i] ?? 0;
      const x0 = s.xs[Math.max(0, i - 1)] ?? x;
      const y0 = s.ys[Math.max(0, i - 1)] ?? y;
      const x1 = s.xs[Math.min(n - 1, i + 1)] ?? x;
      const y1 = s.ys[Math.min(n - 1, i + 1)] ?? y;
      let tx = x1 - x0;
      let ty = y1 - y0;
      const m = Math.hypot(tx, ty) || 1;
      tx /= m;
      ty /= m;
      const nx = -ty;
      const ny = tx;
      const along = n <= 1 ? 0 : i / (n - 1);
      out[o++] = x;
      out[o++] = y;
      out[o++] = nx;
      out[o++] = ny;
      out[o++] = 1;
      out[o++] = along;
      out[o++] = x;
      out[o++] = y;
      out[o++] = nx;
      out[o++] = ny;
      out[o++] = -1;
      out[o++] = along;
    }
    return n * 2;
  }

  private drawIcons(frame: GLFrame, view: [number, number], origin: [number, number], spin: number) {
    const icons = frame.icons;
    if (icons.length === 0) return;
    const gl = this.gl;
    const count = icons.length;
    if (this.points.length < count * 7) this.points = new Float32Array(count * 7);
    const p = this.points;
    for (let i = 0; i < count; i++) {
      const ic = icons[i];
      if (!ic) continue;
      const o = i * 7;
      p[o] = ic.x;
      p[o + 1] = ic.y;
      p[o + 2] = ic.rgb[0];
      p[o + 3] = ic.rgb[1];
      p[o + 4] = ic.rgb[2];
      p[o + 5] = ic.alpha;
      p[o + 6] = ic.size;
    }
    const prog = this.pointProg;
    gl.useProgram(prog);
    gl.bindVertexArray(this.pointVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuf);
    gl.bufferData(gl.ARRAY_BUFFER, p.subarray(0, count * 7), gl.STREAM_DRAW);
    gl.uniform2f(loc(gl, prog, "u_view"), view[0], view[1]);
    gl.uniform2f(loc(gl, prog, "u_origin"), origin[0], origin[1]);
    gl.uniform1f(loc(gl, prog, "u_spin"), spin);
    gl.uniform1f(loc(gl, prog, "u_radius"), frame.radius);
    gl.drawArrays(gl.POINTS, 0, count);

    if (!frame.iconRing) return;
    const stroke = this.strokeProg;
    gl.useProgram(stroke);
    gl.bindVertexArray(this.strokeVao);
    const trail: GLStroke = {
      xs: this.trailXs,
      ys: this.trailYs,
      len: 3,
      width: 1.4,
      seed: 0,
      fade: 0.55,
      rgb: [1, 1, 1],
    };
    gl.uniform2f(loc(gl, stroke, "u_view"), view[0], view[1]);
    gl.uniform2f(loc(gl, stroke, "u_origin"), origin[0], origin[1]);
    gl.uniform1i(loc(gl, stroke, "u_n"), 1);
    gl.uniform1i(loc(gl, stroke, "u_mirrors"), 1);
    gl.uniform1f(loc(gl, stroke, "u_spin"), spin);
    gl.uniform1f(loc(gl, stroke, "u_radius"), frame.radius);
    gl.uniform1i(loc(gl, stroke, "u_activity"), 0);
    gl.uniform1f(loc(gl, stroke, "u_time"), frame.lightTime);
    gl.uniform1f(loc(gl, stroke, "u_boost"), frame.boost);
    gl.uniform1f(loc(gl, stroke, "u_half"), Math.max(0.4, 0.35 * frame.dpr));
    for (const ic of icons) {
      trail.xs[0] = ic.qx;
      trail.ys[0] = ic.qy;
      trail.xs[1] = ic.px;
      trail.ys[1] = ic.py;
      trail.xs[2] = ic.x;
      trail.ys[2] = ic.y;
      trail.rgb = ic.rgb;
      trail.seed = ic.seed;
      trail.fade = ic.alpha;
      const verts = this.packStroke(trail);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.strokeBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.packed.subarray(0, verts * 6), gl.STREAM_DRAW);
      gl.uniform1f(loc(gl, stroke, "u_seed"), ic.seed);
      gl.uniform3f(loc(gl, stroke, "u_rgb"), ic.rgb[0], ic.rgb[1], ic.rgb[2]);
      gl.uniform1f(loc(gl, stroke, "u_alpha"), 0.45 * ic.alpha);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, verts, 1);
    }
  }

  private drawOverlay(frame: GLFrame, view: [number, number], origin: [number, number]) {
    const gl = this.gl;
    const prog = this.overlayProg;
    gl.useProgram(prog);
    gl.bindVertexArray(this.overlayVao);
    gl.uniform2f(loc(gl, prog, "u_view"), view[0], view[1]);
    gl.uniform2f(loc(gl, prog, "u_origin"), origin[0], origin[1]);
    gl.uniform1f(loc(gl, prog, "u_radius"), frame.radius);
    gl.uniform1f(loc(gl, prog, "u_dpr"), frame.dpr);
    gl.uniform1f(loc(gl, prog, "u_flash"), frame.flash);
    const mark = frame.key ?? frame.pin;
    gl.uniform2f(loc(gl, prog, "u_mark"), mark?.x ?? 0, mark?.y ?? 0);
    gl.uniform1f(loc(gl, prog, "u_markOn"), mark ? 1 : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
