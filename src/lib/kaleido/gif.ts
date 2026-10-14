import { GIFEncoder, applyPalette, quantize } from "gifenc/dist/gifenc.esm.js";
import { recordCanvas } from "./recorder";

export const LOOP_SECONDS = 3;
const GIF_FPS = 8;
const GIF_EDGE = 360;
const VIDEO_EDGE = 720;

export type LensPixels = { cx: number; cy: number; radius: number };

let scratch: HTMLCanvasElement | null = null;

function lensRect(canvas: HTMLCanvasElement, lens: LensPixels | null) {
  if (!lens || lens.radius < 8) return null;
  const pad = Math.max(2, lens.radius * 0.06);
  const side = Math.min(canvas.width, canvas.height, (lens.radius + pad) * 2);
  if (side < 8) return null;
  const x = Math.max(0, Math.min(canvas.width - side, lens.cx - side / 2));
  const y = Math.max(0, Math.min(canvas.height - side, lens.cy - side / 2));
  return { x, y, side };
}

function snap(source: HTMLCanvasElement, lens: LensPixels | null, edge: number): ImageData {
  const box = lensRect(source, lens);
  const side = edge - (edge % 2);
  if (!scratch) scratch = document.createElement("canvas");
  if (scratch.width !== side) scratch.width = side;
  if (scratch.height !== side) scratch.height = side;
  const ctx = scratch.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not read the lens");
  if (box) ctx.drawImage(source, box.x, box.y, box.side, box.side, 0, 0, side, side);
  else ctx.drawImage(source, 0, 0, side, side);
  return ctx.getImageData(0, 0, side, side);
}

function encodeGif(frames: ImageData[], delayMs: number): Promise<Blob> {
  const gif = GIFEncoder();
  return frames
    .reduce<Promise<void>>(async (prev, frame) => {
      await prev;
      const palette = quantize(frame.data, 256);
      const index = applyPalette(frame.data, palette);
      gif.writeFrame(index, frame.width, frame.height, { palette, delay: delayMs });
      await new Promise((resolve) => setTimeout(resolve, 0));
    }, Promise.resolve())
    .then(() => {
      gif.finish();
      return new Blob([gif.bytes()], { type: "image/gif" });
    });
}

/** A short looping GIF of the lens, not the empty margin around it. */
export async function captureGif(
  canvas: HTMLCanvasElement,
  lens: () => LensPixels | null,
): Promise<Blob> {
  if (canvas.width < 2 || canvas.height < 2) throw new Error("Lens isn’t ready");
  const count = Math.round(LOOP_SECONDS * GIF_FPS);
  const gap = 1000 / GIF_FPS;
  const frames: ImageData[] = [];
  let last = 0;
  while (frames.length < count) {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    const now = performance.now();
    if (frames.length === 0 || now - last >= gap - 5) {
      frames.push(snap(canvas, lens(), GIF_EDGE));
      last = now;
    }
  }
  const blob = await encodeGif(frames, gap);
  if (blob.size < 32) throw new Error("Empty GIF");
  return blob;
}

/** MP4 (or WebM) of the lens, cropped square so the folds fill the frame. */
export async function captureVideo(
  canvas: HTMLCanvasElement,
  lens: () => LensPixels | null,
  seconds: number,
  mime: string,
): Promise<Blob> {
  const edge = VIDEO_EDGE;
  const out = document.createElement("canvas");
  out.width = edge;
  out.height = edge;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Could not record");
  let live = true;
  const draw = () => {
    if (!live) return;
    const box = lensRect(canvas, lens());
    if (box) ctx.drawImage(canvas, box.x, box.y, box.side, box.side, 0, 0, edge, edge);
    else ctx.drawImage(canvas, 0, 0, edge, edge);
    requestAnimationFrame(draw);
  };
  draw();
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
  try {
    return await recordCanvas(out, seconds, mime);
  } finally {
    live = false;
  }
}
