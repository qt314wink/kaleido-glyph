import { useCallback, useEffect, useRef, useState } from "react";
import { KaleidoControls } from "@/components/kaleido/controls";
import { KaleidoStage, type KaleidoStageHandle } from "@/components/kaleido/stage";
import { canRecord } from "@/lib/kaleido/recorder";
import {
  DIAL_IDS,
  DEFAULT_SETTINGS,
  LIGHT_ACTIVITIES,
  PATH_MODES,
  COLOR_MODES,
  RECORD_SECONDS,
  SEG_MIN,
  applyLook,
  clamp,
  clampSegments,
  cycleId,
  cyclePersist,
  emptyMacros,
  loadMacros,
  loadSettings,
  lookFrom,
  randomSettings,
  saveMacros,
  saveSettings,
  type DialId,
  type KaleidoSettings,
  type LensLayout,
  type MacroBank,
  type MacroSlot,
  type RecordSeconds,
} from "@/lib/kaleido/types";
import { cn } from "@/lib/utils";

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return wide;
}

export function KaleidoApp() {
  const [settings, setSettings] = useState<KaleidoSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [hint, setHint] = useState(true);
  const [exported, setExported] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tuneOpen, setTuneOpen] = useState(false);
  const [dialOpen, setDialOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [hiddenChrome, setHiddenChrome] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [clipState, setClipState] = useState<"idle" | "recording" | "saved" | "unsupported">("idle");
  const [clipElapsed, setClipElapsed] = useState(0);
  const [clipMax, setClipMax] = useState<RecordSeconds>(RECORD_SECONDS);
  const [recordEnabled, setRecordEnabled] = useState(true);
  const [lens, setLens] = useState<LensLayout>({ cx: 0, cy: 0, radius: 0 });
  const [chromeH, setChromeH] = useState(76);
  const [focusId, setFocusId] = useState<DialId>("freeze");
  const [macros, setMacros] = useState<MacroBank>(emptyMacros);
  const [macroSlot, setMacroSlot] = useState<MacroSlot | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const stageRef = useRef<KaleidoStageHandle>(null);
  const noticeTimer = useRef(0);
  const burstOnce = useRef(false);
  const wide = useWide();

  useEffect(() => {
    setSettings(loadSettings());
    setMacros(loadMacros());
    setReady(true);
    setRecordEnabled(canRecord());
  }, []);

  const bottomInset = hiddenChrome
    ? 0
    : Math.max(chromeH, tuneOpen ? 348 : dialOpen && !wide ? 228 : 76);
  const rimPad = !hiddenChrome && dialOpen && !tuneOpen && wide ? 88 : 0;

  useEffect(() => {
    if (!ready) return;
    saveSettings(settings);
  }, [ready, settings]);

  const flash = useCallback((msg: string) => {
    setNotice(msg);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 1500);
  }, []);

  const writeMacros = useCallback((bank: MacroBank) => {
    setMacros(bank);
    saveMacros(bank);
  }, []);

  const patch = useCallback((next: Partial<KaleidoSettings>) => {
    setSettings((prev) => ({ ...prev, ...next }));
  }, []);

  const saveMacroSlot = useCallback(
    (slot: MacroSlot, settingsNow: KaleidoSettings) => {
      const next = { ...macros, [slot]: lookFrom(settingsNow) };
      writeMacros(next);
      setMacroSlot(slot);
      flash(`Slot ${slot} saved`);
    },
    [flash, macros, writeMacros],
  );

  const recallMacroSlot = useCallback(
    (slot: MacroSlot) => {
      setSettings((prev) => {
        const stored = macros[slot];
        if (!stored) {
          const next = { ...macros, [slot]: lookFrom(prev) };
          writeMacros(next);
          setMacroSlot(slot);
          flash(`Slot ${slot} programmed`);
          return prev;
        }
        setMacroSlot(slot);
        flash(`Slot ${slot}`);
        return applyLook(stored, prev.frozen);
      });
    },
    [flash, macros, writeMacros],
  );

  const closeMenus = useCallback(() => {
    setDialOpen(false);
    setTuneOpen(false);
    setHelpOpen(false);
  }, []);

  const onRandomize = useCallback(() => {
    burstOnce.current = true;
    setHint(false);
    closeMenus();
    setSettings(randomSettings());
  }, [closeMenus]);

  useEffect(() => {
    if (!burstOnce.current) return;
    burstOnce.current = false;
    stageRef.current?.clear();
    stageRef.current?.burst();
  }, [settings]);

  const onClear = useCallback(() => {
    stageRef.current?.clear();
    setPinned(false);
  }, []);

  const onExport = useCallback(async () => {
    try {
      await stageRef.current?.exportPng();
      setExported(true);
      window.setTimeout(() => setExported(false), 1600);
    } catch {
      setExported(false);
    }
  }, []);

  const onCopy = useCallback(async () => {
    const ok = await stageRef.current?.copyPng();
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } else {
      await onExport();
    }
  }, [onExport]);

  const onRecord = useCallback(() => {
    if (stageRef.current?.recording()) {
      stageRef.current.stopClip();
      return;
    }
    if (!recordEnabled) {
      setClipState("unsupported");
      window.setTimeout(() => setClipState("idle"), 1800);
      return;
    }
    setSettings((prev) => (prev.frozen ? { ...prev, frozen: false } : prev));
    setClipElapsed(0);
    const ok = stageRef.current?.startClip(
      {
        onTick: (elapsed) => setClipElapsed(elapsed),
        onStop: (blob) => {
          setClipState(blob && blob.size > 0 ? "saved" : "idle");
          setClipElapsed(0);
          window.setTimeout(() => setClipState("idle"), 1600);
        },
      },
      clipMax,
    );
    if (ok) setClipState("recording");
    else {
      setClipState("unsupported");
      window.setTimeout(() => setClipState("idle"), 1800);
    }
  }, [recordEnabled, clipMax]);

  const cyclePath = useCallback(() => {
    setSettings((prev) => ({ ...prev, pathMode: cycleId(PATH_MODES, prev.pathMode) }));
  }, []);

  const onCyclePersist = useCallback(() => {
    setSettings((prev) => ({ ...prev, persist: cyclePersist(prev.persist) }));
  }, []);

  const onCycleLight = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      lightActivity: cycleId(LIGHT_ACTIVITIES, prev.lightActivity),
    }));
  }, []);

  const onCycleColor = useCallback(() => {
    setSettings((prev) => ({ ...prev, colorMode: cycleId(COLOR_MODES, prev.colorMode) }));
  }, []);

  const onTogglePin = useCallback(() => {
    const on = stageRef.current?.togglePin() ?? false;
    setPinned(on);
  }, []);

  const openDial = useCallback(() => {
    setHiddenChrome(false);
    setTuneOpen(false);
    setHelpOpen(false);
    setDialOpen(true);
  }, []);

  const activateFocus = useCallback(
    (id: DialId) => {
      switch (id) {
        case "freeze":
          setSettings((prev) => ({ ...prev, frozen: !prev.frozen }));
          break;
        case "record":
          onRecord();
          closeMenus();
          break;
        case "random":
          onRandomize();
          break;
        case "trail":
          onCyclePersist();
          break;
        case "pin":
          onTogglePin();
          break;
        case "path":
          cyclePath();
          break;
        case "color":
          onCycleColor();
          break;
        case "light":
          onCycleLight();
          break;
        case "tune":
          setHiddenChrome(false);
          setDialOpen(true);
          setTuneOpen((open) => !open);
          break;
      }
    },
    [closeMenus, cyclePath, onCycleColor, onCycleLight, onCyclePersist, onRandomize, onRecord, onTogglePin],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (tuneOpen || dialOpen) {
          closeMenus();
        } else {
          openDial();
        }
        return;
      }
      if (e.code === "Enter") {
        if (dialOpen && !tuneOpen) {
          e.preventDefault();
          activateFocus(focusId);
        }
        return;
      }
      if (e.code === "KeyF") {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, frozen: !prev.frozen }));
        return;
      }
      if (e.code === "KeyV") {
        e.preventDefault();
        onRecord();
        return;
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        onRandomize();
        return;
      }
      if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        void onExport();
        return;
      }
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        onClear();
        return;
      }
      if (e.code === "KeyL") {
        e.preventDefault();
        onCyclePersist();
        return;
      }
      if (e.code === "KeyB") {
        e.preventDefault();
        onTogglePin();
        return;
      }
      if (e.code === "KeyH") {
        e.preventDefault();
        closeMenus();
        setHiddenChrome((hidden) => !hidden);
        return;
      }
      if (e.key === "?" || (e.shiftKey && e.code === "Slash")) {
        e.preventDefault();
        setDialOpen(true);
        setTuneOpen(true);
        setHelpOpen(true);
        return;
      }
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setHiddenChrome(false);
        setDialOpen(true);
        setTuneOpen((open) => !open);
        return;
      }
      if (e.code === "Escape") {
        if (hiddenChrome) {
          setHiddenChrome(false);
          return;
        }
        closeMenus();
        return;
      }
      if (e.key === "[") {
        setSettings((prev) => ({ ...prev, segments: clampSegments(prev.segments - 1) }));
        return;
      }
      if (e.key === "]") {
        setSettings((prev) => ({ ...prev, segments: clampSegments(prev.segments + 1) }));
        return;
      }
      if (e.shiftKey && e.code === "ArrowLeft") {
        e.preventDefault();
        setSettings((prev) => ({
          ...prev,
          colorMotion: "hold",
          hue: (prev.hue + 360 - 8) % 360,
        }));
        return;
      }
      if (e.shiftKey && e.code === "ArrowRight") {
        e.preventDefault();
        setSettings((prev) => ({
          ...prev,
          colorMotion: "hold",
          hue: (prev.hue + 8) % 360,
        }));
        return;
      }
      if (e.shiftKey && e.code === "ArrowUp") {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, persist: clamp(prev.persist + 8, 0, 100) }));
        return;
      }
      if (e.shiftKey && e.code === "ArrowDown") {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, persist: clamp(prev.persist - 8, 0, 100) }));
        return;
      }
      if (dialOpen && !tuneOpen && (e.code.startsWith("Arrow"))) {
        e.preventDefault();
        const idx = DIAL_IDS.indexOf(focusId);
        const n = DIAL_IDS.length;
        const dir = e.code === "ArrowLeft" || e.code === "ArrowUp" ? -1 : 1;
        const next = DIAL_IDS[(idx + dir + n) % n];
        if (next) setFocusId(next);
        return;
      }
      if (e.code === "KeyP") {
        e.preventDefault();
        cyclePath();
        return;
      }
      const digit = e.code.match(/^(?:Digit|Numpad)([0-9])$/);
      if (digit) {
        e.preventDefault();
        const n = digit[1] as string;
        if (n === "1" || n === "0") {
          if (e.shiftKey) {
            setSettings((prev) => {
              saveMacroSlot(n, prev);
              return prev;
            });
          } else {
            recallMacroSlot(n);
          }
          return;
        }
        const folds = Number(n);
        if (folds >= SEG_MIN && folds <= 9) {
          setSettings((prev) => ({ ...prev, segments: folds }));
          flash(`${folds} folds`);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    activateFocus,
    closeMenus,
    cyclePath,
    dialOpen,
    focusId,
    flash,
    hiddenChrome,
    onClear,
    onCyclePersist,
    onExport,
    onRandomize,
    onRecord,
    onTogglePin,
    openDial,
    recallMacroSlot,
    saveMacroSlot,
    tuneOpen,
  ]);

  const status =
    notice ??
    (clipState === "recording"
      ? `Recording ${Math.max(0, clipMax - clipElapsed).toFixed(0)}s`
      : clipState === "unsupported"
        ? "Recording isn’t available here"
        : copied
          ? "Copied"
          : settings.frozen
            ? "Frozen"
            : pinned
              ? "Pin parked"
              : macroSlot
                ? `Slot ${macroSlot}`
                : settings.pathMode !== "solo"
                ? settings.pathMode === "twin"
                  ? "Twin brush"
                  : settings.pathMode === "orbit"
                    ? "Orbit"
                    : "Echo"
                : null);

  return (
    <main className="relative h-screen h-dvh w-full select-none overflow-hidden bg-bg text-fg">
      <KaleidoStage
        ref={stageRef}
        settings={settings}
        bottomInset={bottomInset}
        rimPad={rimPad}
        menuOpen={dialOpen || tuneOpen}
        onInteract={() => {
          setHint(false);
          closeMenus();
        }}
        onFreeze={() => {
          setHint(false);
          setSettings((prev) => ({ ...prev, frozen: !prev.frozen }));
        }}
        onMiddleClick={cyclePath}
        onWheel={(delta) => {
          setSettings((prev) => ({
            ...prev,
            persist: clamp(prev.persist + (delta > 0 ? -4 : 4), 0, 100),
          }));
        }}
        onLayout={setLens}
        onPinChange={setPinned}
      />

      {!hiddenChrome ? (
        <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6">
          <div>
            <h1 className="font-display text-3xl leading-tight tracking-[-0.03em] text-fg sm:text-4xl">
              Kaleido
            </h1>
            <p
              className={cn(
                "mt-1 max-w-xs text-sm text-muted transition-opacity duration-300 ease-out sm:max-w-md",
                hint ? "opacity-100" : "opacity-0",
              )}
            >
              <span className="sm:hidden">Tap the aperture. Two fingers paint. Trail sets how fast lines fade.</span>
              <span className="hidden sm:inline">
                Paint · 2–9 folds · 1 and 0 macros · Space opens the dial
              </span>
            </p>
          </div>
          {status ? (
            <span className="rounded-md bg-surface px-3 py-1.5 text-xs font-medium tracking-wide text-fg shadow-[var(--shadow-border)]">
              {status}
            </span>
          ) : null}
        </header>
      ) : null}

      <KaleidoControls
        settings={settings}
        exported={exported}
        copied={copied}
        clipState={clipState}
        clipElapsed={clipElapsed}
        clipMax={clipMax}
        tuneOpen={tuneOpen}
        dialOpen={dialOpen}
        helpOpen={helpOpen}
        recordEnabled={recordEnabled}
        pinned={pinned}
        hiddenChrome={hiddenChrome}
        wide={wide}
        lens={lens}
        focusId={focusId}
        macros={macros}
        macroSlot={macroSlot}
        onChange={patch}
        onRandomize={onRandomize}
        onClear={onClear}
        onExport={() => void onExport()}
        onCopy={() => void onCopy()}
        onRecord={onRecord}
        onRecordSeconds={setClipMax}
        onToggleTune={() => {
          setHiddenChrome(false);
          setDialOpen(true);
          setTuneOpen((open) => !open);
        }}
        onToggleDial={() => {
          setHiddenChrome(false);
          setDialOpen((open) => {
            if (open) {
              setTuneOpen(false);
              setHelpOpen(false);
            }
            return !open;
          });
        }}
        onTogglePin={onTogglePin}
        onToggleHelp={() => setHelpOpen((open) => !open)}
        onHideChrome={() => {
          closeMenus();
          setHiddenChrome((hidden) => !hidden);
        }}
        onCloseMenus={closeMenus}
        onCyclePersist={onCyclePersist}
        onCycleLight={onCycleLight}
        onRecallMacro={recallMacroSlot}
        onSaveMacro={(slot) => saveMacroSlot(slot, settings)}
        onChromeHeight={setChromeH}
        onFocusId={setFocusId}
      />
    </main>
  );
}
