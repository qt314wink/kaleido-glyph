import { RECORD_SECONDS } from "./types";

function pickMime(): string {
  const types = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

export function canRecord(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof MediaRecorder === "undefined") return false;
  const proto = HTMLCanvasElement.prototype as HTMLCanvasElement & {
    captureStream?: (fps?: number) => MediaStream;
  };
  return typeof proto.captureStream === "function" && pickMime() !== "";
}

export function clipExtension(): "mp4" | "webm" {
  return pickMime().includes("mp4") ? "mp4" : "webm";
}

export function clipFilename(mime: string, when = new Date()) {
  const stamp = when.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const ext = mime.includes("mp4") ? "mp4" : "webm";
  return `kaleido-clip-${stamp}.${ext}`;
}

export type ClipRecorderHandlers = {
  onTick?: (elapsed: number, max: number) => void;
  onStop?: (blob: Blob | null) => void;
};

export class ClipRecorder {
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private raf = 0;
  private startedAt = 0;
  private maxMs = RECORD_SECONDS * 1000;
  private handlers: ClipRecorderHandlers = {};
  private mime = "";
  private stream: MediaStream | null = null;
  private settled = false;

  get active() {
    return this.recorder !== null && this.recorder.state === "recording";
  }

  start(canvas: HTMLCanvasElement, handlers: ClipRecorderHandlers = {}, seconds = RECORD_SECONDS) {
    if (!canRecord()) {
      handlers.onStop?.(null);
      return false;
    }
    if (this.active) this.stop();

    const capture = (
      canvas as HTMLCanvasElement & { captureStream: (fps?: number) => MediaStream }
    ).captureStream(30);
    this.stream = capture;
    this.mime = pickMime();
    this.chunks = [];
    this.handlers = handlers;
    this.maxMs = seconds * 1000;
    this.startedAt = performance.now();
    this.settled = false;

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(capture, {
        mimeType: this.mime,
        videoBitsPerSecond: 5_000_000,
      });
    } catch {
      handlers.onStop?.(null);
      this.cleanupStream();
      return false;
    }

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) this.chunks.push(event.data);
    };
    recorder.onerror = () => {
      this.finish(null);
    };
    recorder.onstop = () => {
      const blob =
        this.chunks.length > 0 ? new Blob(this.chunks, { type: this.mime || "video/webm" }) : null;
      this.finish(blob);
    };

    this.recorder = recorder;
    recorder.start(200);
    this.tick();
    return true;
  }

  stop() {
    const recorder = this.recorder;
    if (!recorder || recorder.state !== "recording") return;
    try {
      recorder.requestData();
    } catch {
      // The final dataavailable from stop() still carries the buffer.
    }
    try {
      recorder.stop();
    } catch {
      this.finish(null);
    }
  }

  private tick = () => {
    if (!this.active) return;
    const elapsed = performance.now() - this.startedAt;
    this.handlers.onTick?.(elapsed / 1000, this.maxMs / 1000);
    if (elapsed >= this.maxMs) {
      this.stop();
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  private finish(blob: Blob | null) {
    if (this.settled) return;
    this.settled = true;
    cancelAnimationFrame(this.raf);
    const onStop = this.handlers.onStop;
    this.handlers = {};
    this.recorder = null;
    this.chunks = [];
    this.cleanupStream();
    onStop?.(blob);
  }

  private cleanupStream() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }
}

type ClipWritable = {
  write: (data: Blob) => Promise<void>;
  close: () => Promise<void>;
};

export type ClipFileHandle = {
  createWritable: () => Promise<ClipWritable>;
};

type SavePicker = (options?: {
  suggestedName?: string;
  types?: { description?: string; accept: Record<string, string[]> }[];
}) => Promise<ClipFileHandle>;

function savePicker(): SavePicker | null {
  if (typeof window === "undefined" || window.parent !== window) return null;
  const picker = (window as Window & { showSaveFilePicker?: SavePicker }).showSaveFilePicker;
  return typeof picker === "function" ? picker : null;
}

function pickerTypes(ext: "mp4" | "webm" | "gif" | "png") {
  const mime =
    ext === "mp4" ? "video/mp4" : ext === "gif" ? "image/gif" : ext === "png" ? "image/png" : "video/webm";
  const description =
    ext === "mp4" ? "MP4 video" : ext === "gif" ? "GIF" : ext === "png" ? "PNG image" : "WebM video";
  return { description, accept: { [mime]: [`.${ext}`] } as Record<string, string[]> };
}

/** Ask where a file should go. `later` if this browser cannot show a save dialog. */
export async function chooseSaveFile(
  filename: string,
  ext: "mp4" | "webm" | "gif" | "png",
): Promise<ClipFileHandle | "later" | "cancel"> {
  const picker = savePicker();
  if (!picker) return "later";
  const spec = pickerTypes(ext);
  try {
    return await picker({
      suggestedName: filename,
      types: [{ description: spec.description, accept: spec.accept }],
    });
  } catch (err) {
    if (isAbort(err)) return "cancel";
    return "later";
  }
}

export function chooseClipFile(): Promise<ClipFileHandle | "later" | "cancel"> {
  const ext = clipExtension();
  return chooseSaveFile(`kaleido-clip.${ext}`, ext);
}

export async function writeClipFile(handle: ClipFileHandle, blob: Blob) {
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}

function isAbort(err: unknown) {
  return err instanceof DOMException && err.name === "AbortError";
}

/**
 * Save a finished clip from a fresh click.
 * Share sheet on a phone, a save dialog on a desktop tab, otherwise a file download.
 * AbortError means the person dismissed that dialog — the clip is still held.
 */
export async function saveClip(blob: Blob, filename: string): Promise<"shared" | "saved" | "downloaded"> {
  const file = new File([blob], filename, { type: blob.type || "video/webm" });
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const nav = typeof navigator !== "undefined" ? navigator : null;
  if (coarse && nav && typeof nav.share === "function" && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "Kaleido" });
      return "shared";
    } catch (err) {
      if (isAbort(err)) throw err;
    }
  }

  const picker = savePicker();
  if (picker) {
    const ext = filename.endsWith(".gif")
      ? "gif"
      : filename.endsWith(".png")
        ? "png"
        : filename.endsWith(".mp4")
          ? "mp4"
          : "webm";
    const spec = pickerTypes(ext);
    try {
      const handle = await picker({
        suggestedName: filename,
        types: [{ description: spec.description, accept: spec.accept }],
      });
      await writeClipFile(handle, blob);
      return "saved";
    } catch (err) {
      if (isAbort(err)) throw err;
    }
  }

  downloadBlob(blob, filename);
  return "downloaded";
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoking in this turn cancels the download. Keep the URL until the browser has started it.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function stampedName(prefix: string, ext: string) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const dot = ext.startsWith(".") ? ext : `.${ext}`;
  return `${prefix}-${stamp}${dot}`;
}

/** Best video type this browser can actually record. */
export function videoExportMime(): { mime: string; ext: "mp4" | "webm" } {
  const types = ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm"];
  if (typeof MediaRecorder === "undefined") return { mime: "video/webm", ext: "webm" };
  for (const mime of types) {
    try {
      if (MediaRecorder.isTypeSupported(mime)) {
        return { mime, ext: mime.includes("mp4") ? "mp4" : "webm" };
      }
    } catch {
      // ignore unsupported type strings
    }
  }
  return { mime: "video/webm", ext: "webm" };
}

/** Record the live canvas for a few seconds. Independent of the main clip recorder. */
export function recordCanvas(canvas: HTMLCanvasElement, seconds: number, mime: string): Promise<Blob> {
  const capture = (
    canvas as HTMLCanvasElement & { captureStream?: (fps?: number) => MediaStream }
  ).captureStream;
  if (typeof capture !== "function" || typeof MediaRecorder === "undefined") {
    return Promise.reject(new Error("Recording isn’t available"));
  }
  const stream = capture.call(canvas, 30);
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (blob: Blob | null, err?: Error) => {
      if (settled) return;
      settled = true;
      stream.getTracks().forEach((track) => track.stop());
      if (blob && blob.size > 0) resolve(blob);
      else reject(err ?? new Error("Empty video"));
    };
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
    } catch (err) {
      finish(null, err instanceof Error ? err : new Error("Could not record"));
      return;
    }
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunks.push(event.data);
    };
    recorder.onerror = () => finish(null, new Error("Recording failed"));
    recorder.onstop = () => {
      const blob = chunks.length > 0 ? new Blob(chunks, { type: mime || "video/webm" }) : null;
      finish(blob, blob ? undefined : new Error("Empty video"));
    };
    try {
      recorder.start(200);
    } catch (err) {
      finish(null, err instanceof Error ? err : new Error("Recording failed"));
      return;
    }
    window.setTimeout(() => {
      try {
        if (recorder.state === "recording") {
          try {
            recorder.requestData();
          } catch {
            // The final stop still flushes whatever the browser kept.
          }
          recorder.stop();
        }
      } catch (err) {
        finish(null, err instanceof Error ? err : new Error("Recording failed"));
      }
    }, Math.max(250, seconds * 1000));
  });
}
