import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { KaleidoEngine } from "@/lib/kaleido/engine";
import { ClipRecorder, canRecord, downloadBlob, type ClipRecorderHandlers } from "@/lib/kaleido/recorder";
import type { KaleidoSettings, LensLayout, RecordSeconds } from "@/lib/kaleido/types";

export type KaleidoStageHandle = {
  clear: () => void;
  burst: () => void;
  exportPng: () => Promise<void>;
  copyPng: () => Promise<boolean>;
  setBottomInset: (px: number) => void;
  setRimPad: (px: number) => void;
  setTopInset: (px: number) => void;
  startClip: (handlers: ClipRecorderHandlers, seconds: RecordSeconds) => boolean;
  stopClip: () => void;
  recording: () => boolean;
  togglePin: () => boolean;
  pinned: () => boolean;
  getLayout: () => LensLayout;
};

type StageProps = {
  settings: KaleidoSettings;
  bottomInset: number;
  rimPad: number;
  topInset: number;
  menuOpen: boolean;
  onInteract: () => void;
  onFreeze: () => void;
  onMiddleClick: () => void;
  onWheel: (delta: number) => void;
  onLayout: (layout: LensLayout) => void;
  onPinChange: (on: boolean) => void;
};

export const KaleidoStage = forwardRef<KaleidoStageHandle, StageProps>(
  function KaleidoStage(
    { settings, bottomInset, rimPad, topInset, menuOpen, onInteract, onFreeze, onMiddleClick, onWheel, onLayout, onPinChange },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<KaleidoEngine | null>(null);
    const recorderRef = useRef(new ClipRecorder());
    const settingsRef = useRef(settings);
    const onWheelRef = useRef(onWheel);
    const onFreezeRef = useRef(onFreeze);
    const onLayoutRef = useRef(onLayout);
    const onPinRef = useRef(onPinChange);
    const insetRef = useRef(bottomInset);
    const rimRef = useRef(rimPad);
    const topRef = useRef(topInset);
    const pressRef = useRef<{ x: number; y: number; timer: number } | null>(null);
    const [failed, setFailed] = useState(false);
    settingsRef.current = settings;
    onWheelRef.current = onWheel;
    onFreezeRef.current = onFreeze;
    onLayoutRef.current = onLayout;
    onPinRef.current = onPinChange;
    insetRef.current = bottomInset;
    rimRef.current = rimPad;
    topRef.current = topInset;

    useImperativeHandle(ref, () => ({
      clear: () => engineRef.current?.clear(),
      burst: () => engineRef.current?.burst(),
      exportPng: () => engineRef.current?.exportPng() ?? Promise.resolve(),
      copyPng: () => engineRef.current?.copyPng() ?? Promise.resolve(false),
      setBottomInset: (px: number) => engineRef.current?.setBottomInset(px),
      setRimPad: (px: number) => engineRef.current?.setRimPad(px),
      setTopInset: (px: number) => engineRef.current?.setTopInset(px),
      startClip: (handlers, seconds) => {
        const canvas = engineRef.current?.canvas();
        if (!canvas || !canRecord()) return false;
        return recorderRef.current.start(
          canvas,
          {
            ...handlers,
            onStop: (blob) => {
              if (blob && blob.size > 0) {
                const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
                const ext = blob.type.includes("mp4") ? "mp4" : "webm";
                downloadBlob(blob, `kaleido-clip-${stamp}.${ext}`);
              }
              handlers.onStop?.(blob);
            },
          },
          seconds,
        );
      },
      stopClip: () => recorderRef.current.stop(),
      recording: () => recorderRef.current.active,
      togglePin: () => engineRef.current?.togglePin() ?? false,
      pinned: () => engineRef.current?.pinned() ?? false,
      getLayout: () => engineRef.current?.getLayout() ?? { cx: 0, cy: 0, radius: 0 },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      const root = rootRef.current;
      if (!canvas || !root) return;
      try {
        const engine = new KaleidoEngine(canvas, root, settingsRef.current);
        engine.setLayoutHandler((layout) => onLayoutRef.current(layout));
        engine.setPinHandler((on) => onPinRef.current(on));
        engineRef.current = engine;
        engine.start();
        engine.setBottomInset(insetRef.current);
        engine.setRimPad(rimRef.current);
        engine.setTopInset(topRef.current);
      } catch {
        setFailed(true);
        return;
      }
      return () => {
        recorderRef.current.stop();
        engineRef.current?.destroy();
        engineRef.current = null;
      };
    }, []);

    useEffect(() => {
      engineRef.current?.setSettings(settings);
    }, [settings]);

    useEffect(() => {
      engineRef.current?.setBottomInset(bottomInset);
      engineRef.current?.setRimPad(rimPad);
      engineRef.current?.setTopInset(topInset);
    }, [bottomInset, rimPad, topInset]);

    useEffect(() => {
      engineRef.current?.setMenuOpen(menuOpen);
    }, [menuOpen]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const handler = (event: WheelEvent) => {
        event.preventDefault();
        onWheelRef.current(event.deltaY);
      };
      canvas.addEventListener("wheel", handler, { passive: false });
      return () => canvas.removeEventListener("wheel", handler);
    }, []);

    const clearPress = () => {
      if (pressRef.current) {
        window.clearTimeout(pressRef.current.timer);
        pressRef.current = null;
      }
    };

    if (failed) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-bg p-8 text-center">
          <div className="max-w-sm">
            <p className="font-display text-2xl text-fg">Kaleido</p>
            <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">
              This lens needs a current browser with canvas. If you are on an older phone or tablet,
              send the device make, model, year, and OS so a fallback can be built for it.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div ref={rootRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          data-testid="kaleido-canvas"
          className="absolute inset-0 size-full cursor-crosshair touch-none select-none"
          aria-label="Kaleidoscope canvas. Move to paint. Two fingers work. Arrow keys or right-drag park a second brush. Long-press or Space freezes. Scroll changes trail."
          onPointerDown={(event) => {
            if (event.button === 0) onInteract();
            if (event.button !== 0) return;
            if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
            clearPress();
            const timer = window.setTimeout(() => {
              pressRef.current = null;
              onFreezeRef.current();
            }, 480);
            pressRef.current = { x: event.clientX, y: event.clientY, timer };
          }}
          onPointerMove={(event) => {
            const press = pressRef.current;
            if (!press) return;
            const dist = Math.hypot(event.clientX - press.x, event.clientY - press.y);
            if (dist > 14) clearPress();
          }}
          onPointerUp={clearPress}
          onPointerCancel={clearPress}
          onContextMenu={(event) => {
            event.preventDefault();
          }}
          onAuxClick={(event) => {
            if (event.button === 1) {
              event.preventDefault();
              onMiddleClick();
            }
          }}
        />
      </div>
    );
  },
);
