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
    if (!this.recorder) return;
    if (this.recorder.state === "recording") {
      try {
        this.recorder.stop();
      } catch {
        this.finish(null);
      }
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

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
