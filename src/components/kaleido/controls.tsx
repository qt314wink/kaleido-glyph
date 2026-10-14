import { useEffect, useRef, type ReactNode } from "react";
import {
  Aperture,
  Circle,
  Copy,
  Download,
  Ellipsis,
  Eraser,
  EyeOff,
  Film,
  Palette,
  Pause,
  Pin,
  Play,
  RotateCw,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Spline,
  Square,
  Timer,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  COLOR_MODES,
  COLOR_MOTIONS,
  FILL_MODES,
  FILL_RECIPES,
  LIGHT_ACTIVITIES,
  MACRO_SLOTS,
  PATH_MODES,
  RECORD_OPTIONS,
  SEG_MAX,
  SEG_MIN,
  cycleId,
  persistLabel,
  type DialId,
  type KaleidoLook,
  type KaleidoSettings,
  type LensLayout,
  type MacroBank,
  type MacroSlot,
  type RecordSeconds,
} from "@/lib/kaleido/types";
import { cn } from "@/lib/utils";

type ControlsProps = {
  settings: KaleidoSettings;
  exported: boolean;
  copied: boolean;
  clipState: "idle" | "recording" | "ready" | "unsupported";
  clipHeld: boolean;
  clipElapsed: number;
  clipMax: RecordSeconds;
  tuneOpen: boolean;
  dialOpen: boolean;
  helpOpen: boolean;
  moreOpen: boolean;
  recordEnabled: boolean;
  pinned: boolean;
  hiddenChrome: boolean;
  flower: boolean;
  lens: LensLayout;
  focusId: DialId;
  macros: MacroBank;
  macroSlot: MacroSlot | null;
  onChange: (patch: Partial<KaleidoSettings>) => void;
  onRandomize: () => void;
  onClear: () => void;
  onExport: () => void;
  onExportGif: () => void;
  onExportMp4: () => void;
  exportKind: "gif" | "mp4" | null;
  onCopy: () => void;
  onRecord: () => void;
  onDownloadClip: () => void;
  onRecordSeconds: (seconds: RecordSeconds) => void;
  onToggleTune: () => void;
  onToggleDial: () => void;
  onTogglePin: () => void;
  onToggleHelp: () => void;
  onToggleMore: () => void;
  onHideChrome: () => void;
  onCloseMenus: () => void;
  onTogglePark: () => void;
  onCycleLight: () => void;
  onRecallMacro: (slot: MacroSlot) => void;
  onSaveMacro: (slot: MacroSlot) => void;
  onChromeHeight: (height: number) => void;
  onFocusId: (id: DialId) => void;
};

function Chip({
  active,
  children,
  onClick,
  hint,
  testId,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  hint?: string;
  testId?: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      title={hint}
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-md px-3.5 text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96]",
        active ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function macroCaption(slot: MacroSlot, look: KaleidoLook | null) {
  if (!look) return `Save ${slot}`;
  const palette = COLOR_MODES.find((mode) => mode.id === look.colorMode)?.label ?? "Look";
  return `${slot} · ${palette}`;
}

function MacroChip({
  slot,
  look,
  active,
  onRecall,
  onSave,
}: {
  slot: MacroSlot;
  look: KaleidoLook | null;
  active: boolean;
  onRecall: () => void;
  onSave: () => void;
}) {
  const hold = useRef(0);
  const saved = useRef(false);
  const filled = Boolean(look);
  const caption = macroCaption(slot, look);
  return (
    <button
      type="button"
      data-testid={`btn-macro-${slot}`}
      title={filled ? `${caption} · tap recall · hold to save` : `${caption} · tap to program · hold to save`}
      onPointerDown={() => {
        saved.current = false;
        window.clearTimeout(hold.current);
        hold.current = window.setTimeout(() => {
          saved.current = true;
          onSave();
        }, 480);
      }}
      onPointerUp={() => window.clearTimeout(hold.current)}
      onPointerCancel={() => window.clearTimeout(hold.current)}
      onPointerLeave={() => window.clearTimeout(hold.current)}
      onClick={() => {
        if (saved.current) {
          saved.current = false;
          return;
        }
        onRecall();
      }}
      className={cn(
        "h-10 min-w-20 shrink-0 rounded-md px-3.5 text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96]",
        active ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      {caption}
    </button>
  );
}

type Petal = {
  id: DialId;
  label: string;
  testId: string;
  active?: boolean;
  sticky?: boolean;
  onClick: () => void;
  icon: ReactNode;
};

function placePetal(x: number, y: number, lens: LensLayout, hasLens: boolean) {
  if (!hasLens || typeof window === "undefined") return { x, y };
  const minY = 112;
  const maxY = Math.max(minY + 8, window.innerHeight - 84);
  const minX = 28;
  const maxX = Math.max(minX + 8, window.innerWidth - 28);
  const minDist = lens.radius + 36;
  let dx = x - lens.cx;
  let dy = y - lens.cy;
  let dist = Math.hypot(dx, dy) || 1;
  if (dist < minDist) {
    dx = (dx / dist) * minDist;
    dy = (dy / dist) * minDist;
    dist = minDist;
  }
  let px = lens.cx + dx;
  let py = lens.cy + dy;
  px = Math.min(maxX, Math.max(minX, px));
  py = Math.min(maxY, Math.max(minY, py));
  dx = px - lens.cx;
  dy = py - lens.cy;
  dist = Math.hypot(dx, dy) || 1;
  if (dist < minDist) {
    const ox = lens.cx + (dx / dist) * minDist;
    const oy = lens.cy + (dy / dist) * minDist;
    if (ox >= minX && ox <= maxX && oy >= minY && oy <= maxY) return { x: ox, y: oy };
  }
  return { x: px, y: py };
}

function fillRelation(
  settings: KaleidoSettings,
) {
  if (settings.fillMode === "off") return null;
  const light = LIGHT_ACTIVITIES.find((mode) => mode.id === settings.lightActivity)?.label ?? "the light";
  const mirror = settings.pathMode !== "rosette";
  if (settings.fillMode === "cells") {
    return settings.fillRecipe === "tide"
      ? `Closed loops · rim stays empty · breathes with ${light}`
      : "Closed loops · the rim stays empty";
  }
  const fold = mirror ? `${settings.segments} folds, mirrored` : `${settings.segments} folds, rotations only`;
  if (settings.fillRecipe === "tide") return `${fold} · breathes with ${light}`;
  if (settings.fillRecipe === "cloisonne") return `${fold} · one hue step per sector`;
  return `${fold} · rays are the walls`;
}

export function KaleidoControls({
  settings,
  exported,
  copied,
  clipState,
  clipHeld,
  clipElapsed,
  clipMax,
  tuneOpen,
  dialOpen,
  helpOpen,
  moreOpen,
  recordEnabled,
  pinned,
  hiddenChrome,
  flower: flowerChrome,
  lens,
  focusId,
  macros,
  macroSlot,
  onChange,
  onRandomize,
  onClear,
  onExport,
  onExportGif,
  onExportMp4,
  exportKind,
  onCopy,
  onRecord,
  onDownloadClip,
  onRecordSeconds,
  onToggleTune,
  onToggleDial,
  onTogglePin,
  onToggleHelp,
  onToggleMore,
  onHideChrome,
  onCloseMenus,
  onTogglePark,
  onCycleLight,
  onRecallMacro,
  onSaveMacro,
  onChromeHeight,
  onFocusId,
}: ControlsProps) {
  const chromeRef = useRef<HTMLDivElement>(null);
  const remain = Math.max(0, clipMax - clipElapsed);
  const recording = clipState === "recording";
  const parked = settings.persist >= 100;
  const path = PATH_MODES.find((mode) => mode.id === settings.pathMode);
  const color = COLOR_MODES.find((mode) => mode.id === settings.colorMode);

  useEffect(() => {
    const el = chromeRef.current;
    if (!el) {
      onChromeHeight(hiddenChrome ? 0 : 76);
      return;
    }
    const report = () => onChromeHeight(el.getBoundingClientRect().height);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hiddenChrome, tuneOpen, dialOpen, helpOpen, moreOpen, onChromeHeight]);

  const cyclePath = () => onChange({ pathMode: cycleId(PATH_MODES, settings.pathMode) });
  const cycleColor = () => onChange({ colorMode: cycleId(COLOR_MODES, settings.colorMode) });

  const petals: Petal[] = [
    {
      id: "freeze",
      label: settings.frozen ? "Live" : "Freeze",
      testId: "btn-freeze",
      active: settings.frozen,
      sticky: true,
      onClick: () => onChange({ frozen: !settings.frozen }),
      icon: settings.frozen ? <Play className="size-5" /> : <Pause className="size-5" />,
    },
    {
      id: "record",
      label: recording ? `${remain.toFixed(0)}s left` : clipState === "ready" ? "Download" : `Record ${clipMax}s`,
      testId: "btn-record",
      active: recording || clipState === "ready",
      onClick: clipState === "ready" ? onDownloadClip : onRecord,
      icon: clipState === "ready" ? (
        <Download className="size-5" />
      ) : recording ? (
        <Square className="size-4 fill-current" />
      ) : (
        <Circle className="size-4 fill-destructive text-destructive" />
      ),
    },
    {
      id: "random",
      label: "Random",
      testId: "btn-randomize",
      onClick: onRandomize,
      icon: <Shuffle className="size-5" />,
    },
    {
      id: "trail",
      label: parked ? "Parked" : "Park",
      testId: "btn-persist",
      active: parked,
      sticky: true,
      onClick: onTogglePark,
      icon: <Timer className="size-5" />,
    },
    {
      id: "pin",
      label: pinned ? "Unpin" : "Pin brush",
      testId: "btn-pin",
      active: pinned,
      sticky: true,
      onClick: onTogglePin,
      icon: <Pin className="size-5" />,
    },
    {
      id: "path",
      label: path?.label ?? "Path",
      testId: "btn-path",
      sticky: true,
      onClick: cyclePath,
      icon: <Spline className="size-5" />,
    },
    {
      id: "color",
      label: color?.label ?? "Color",
      testId: "btn-color",
      sticky: true,
      onClick: cycleColor,
      icon: <Palette className="size-5" />,
    },
    {
      id: "light",
      label: LIGHT_ACTIVITIES.find((mode) => mode.id === settings.lightActivity)?.label ?? "Light",
      testId: "btn-light",
      sticky: true,
      onClick: onCycleLight,
      icon: <Sparkles className="size-5" />,
    },
    {
      id: "tune",
      label: "Tune",
      testId: "btn-tune",
      active: tuneOpen,
      sticky: true,
      onClick: onToggleTune,
      icon: <SlidersHorizontal className="size-5" />,
    },
  ];

  const pick = (petal: Petal) => {
    if (petal.id === "record" && !recordEnabled && !recording) return;
    petal.onClick();
    if (!petal.sticky) onCloseMenus();
  };

  const focused = petals.find((petal) => petal.id === focusId);
  const showPetals = dialOpen && !tuneOpen && !hiddenChrome;
  const flower = showPetals && flowerChrome;
  const dock = showPetals && !flowerChrome;
  const hasLens = lens.radius > 40;

  if (hiddenChrome) {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          data-testid="btn-show-chrome"
          aria-label="Show controls"
          onClick={onHideChrome}
          className="pointer-events-auto flex size-11 items-center justify-center rounded-full bg-surface text-fg shadow-[var(--shadow-border)]"
        >
          <Aperture className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      {flower && focused ? (
        <p className="pointer-events-none absolute inset-x-0 top-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] z-20 text-center text-xs font-medium tracking-wide text-fg">
          {focused.label}
        </p>
      ) : null}

      {petals.map((petal, i) => {
        const gap = 72;
        const span = 360 - gap;
        const startDeg = 90 + gap / 2;
        const deg = startDeg + ((i + 0.5) / petals.length) * span;
        const orbit = hasLens ? lens.radius + 52 : 110;
        const ang = (deg * Math.PI) / 180;
        const placed = placePetal(
          hasLens ? lens.cx + Math.cos(ang) * orbit : Math.cos(ang) * orbit,
          hasLens ? lens.cy + Math.sin(ang) * orbit : Math.sin(ang) * orbit,
          lens,
          hasLens,
        );
        const x = placed.x;
        const y = placed.y;
        return (
          <button
            key={petal.id}
            type="button"
            data-testid={flower ? petal.testId : undefined}
            title={petal.label}
            aria-label={petal.label}
            aria-hidden={!flower}
            tabIndex={flower ? 0 : -1}
            disabled={petal.id === "record" && !recordEnabled && !recording}
            onClick={() => pick(petal)}
            onPointerEnter={() => onFocusId(petal.id)}
            onFocus={() => onFocusId(petal.id)}
            className={cn(
              "absolute z-20 flex size-11 items-center justify-center rounded-full shadow-[var(--shadow-border)] transition-[opacity,transform,box-shadow] duration-200 ease-smooth-out",
              petal.active ? "bg-fg text-bg" : "bg-surface text-fg",
              flower && focusId === petal.id && "ring-2 ring-ring",
              flower ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
            )}
            style={{
              left: hasLens ? x : "50%",
              top: hasLens ? y : "auto",
              bottom: hasLens ? "auto" : "1.25rem",
              transform: flower ? "translate(-50%, -50%)" : "translate(-50%, -50%) scale(0.85)",
            }}
          >
            {petal.icon}
          </button>
        );
      })}

      <div
        ref={chromeRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        {tuneOpen ? (
          <div className="pointer-events-auto flex max-h-[min(48dvh,26rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)]">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p className="text-sm font-medium text-fg">Tune</p>
              <button
                type="button"
                data-testid="btn-tune-close"
                aria-label="Close tune"
                onClick={onCloseMenus}
                className="flex size-9 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-4 pb-4">
            <div className="flex items-center gap-2">
              <label htmlFor="persist" className="w-14 shrink-0 text-xs font-medium text-muted">
                Decay
              </label>
              <Slider
                id="persist"
                data-testid="slider-persist"
                className="min-w-0 w-auto flex-1"
                min={0}
                max={100}
                step={1}
                value={[settings.persist]}
                onValueChange={(value) => onChange({ persist: value[0] ?? 88 })}
                aria-label="How long trails linger"
              />
              <span className="w-12 shrink-0 text-right text-xs font-medium tabular-nums text-fg">
                {persistLabel(settings.persist)}
              </span>
              <Chip active={parked} onClick={onTogglePark} hint="Hold the lines until decay moves">
                Park
              </Chip>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label htmlFor="segments" className="w-14 shrink-0 text-xs font-medium text-muted">
                Folds
              </label>
              <Slider
                id="segments"
                data-testid="slider-segments"
                className="min-w-0 w-auto flex-1"
                min={SEG_MIN}
                max={SEG_MAX}
                step={1}
                value={[settings.segments]}
                onValueChange={(value) => onChange({ segments: value[0] ?? 8 })}
                aria-label="Segment count"
              />
              <span className="w-8 shrink-0 text-right font-medium tabular-nums text-fg">{settings.segments}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1" role="radiogroup" aria-label="Path">
              <span className="w-14 shrink-0 text-xs font-medium text-muted">Path</span>
              {PATH_MODES.map((mode) => (
                <Chip
                  key={mode.id}
                  testId={`btn-path-${mode.id}`}
                  hint={mode.hint}
                  active={settings.pathMode === mode.id}
                  onClick={() => onChange({ pathMode: mode.id })}
                >
                  {mode.label}
                </Chip>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label htmlFor="brush" className="w-14 shrink-0 text-xs font-medium text-muted">
                Line
              </label>
              <Slider
                id="brush"
                className="min-w-0 w-auto flex-1"
                min={1}
                max={14}
                step={1}
                value={[settings.brush]}
                onValueChange={(value) => onChange({ brush: value[0] ?? 5 })}
                aria-label="Line thickness"
              />
              <span className="w-8 shrink-0 text-right font-medium tabular-nums text-fg">{settings.brush}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1" role="radiogroup" aria-label="Color">
              <span className="w-14 shrink-0 text-xs font-medium text-muted">Color</span>
              {COLOR_MODES.map((mode) => (
                <Chip
                  key={mode.id}
                  testId={`btn-palette-${mode.id}`}
                  active={settings.colorMode === mode.id}
                  onClick={() => onChange({ colorMode: mode.id })}
                >
                  {mode.label}
                </Chip>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1" role="radiogroup" aria-label="Color motion">
              <span className="w-14 shrink-0 text-xs font-medium text-muted">Motion</span>
              {COLOR_MOTIONS.map((mode) => (
                <Chip
                  key={mode.id}
                  hint={mode.hint}
                  active={settings.colorMotion === mode.id}
                  onClick={() => onChange({ colorMotion: mode.id })}
                >
                  {mode.label}
                </Chip>
              ))}
            </div>
            {settings.colorMotion === "hold" ? (
              <div className="mt-2 flex items-center gap-2">
                <label htmlFor="hue" className="w-14 shrink-0 text-xs font-medium text-muted">
                  Hue
                </label>
                <Slider
                  id="hue"
                  className="min-w-0 w-auto flex-1"
                  min={0}
                  max={359}
                  step={1}
                  value={[settings.hue]}
                  onValueChange={(value) => onChange({ hue: value[0] ?? 0 })}
                  aria-label="Hue"
                />
                <span className="w-8 shrink-0 text-right font-medium tabular-nums text-fg">{settings.hue}</span>
              </div>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-1" role="radiogroup" aria-label="Light activity">
              <span className="w-14 shrink-0 text-xs font-medium text-muted">Light</span>
              {LIGHT_ACTIVITIES.map((mode) => (
                <Chip
                  key={mode.id}
                  hint={mode.hint}
                  active={settings.lightActivity === mode.id}
                  onClick={() => onChange({ lightActivity: mode.id })}
                >
                  {mode.label}
                </Chip>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1" role="radiogroup" aria-label="Fill">
              <span className="w-14 shrink-0 text-xs font-medium text-muted">Fill</span>
              {FILL_MODES.map((mode) => (
                <Chip
                  key={mode.id}
                  testId={`btn-fill-${mode.id}`}
                  hint={mode.hint}
                  active={settings.fillMode === mode.id}
                  onClick={() => onChange({ fillMode: mode.id })}
                >
                  {mode.label}
                </Chip>
              ))}
            </div>
            {settings.fillMode !== "off" ? (
              <>
                <p className="mt-1 text-xs text-muted">{fillRelation(settings)}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1" role="radiogroup" aria-label="Fill recipe">
                  <span className="w-14 shrink-0 text-xs font-medium text-muted">Tone</span>
                  {FILL_RECIPES.map((mode) => (
                    <Chip
                      key={mode.id}
                      testId={`btn-recipe-${mode.id}`}
                      hint={mode.hint}
                      active={settings.fillRecipe === mode.id}
                      onClick={() => onChange({ fillRecipe: mode.id })}
                    >
                      {mode.label}
                    </Chip>
                  ))}
                </div>
              </>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-1" role="group" aria-label="Macro slots">
              <span className="w-14 shrink-0 text-xs font-medium text-muted">Slots</span>
              {MACRO_SLOTS.map((slot) => (
                <MacroChip
                  key={slot}
                  slot={slot}
                  look={macros[slot]}
                  active={macroSlot === slot}
                  onRecall={() => onRecallMacro(slot)}
                  onSave={() => onSaveMacro(slot)}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1" role="radiogroup" aria-label="Clip length">
              {RECORD_OPTIONS.map((seconds) => (
                <Chip
                  key={seconds}
                  active={clipMax === seconds}
                  onClick={() => onRecordSeconds(seconds)}
                  hint={`Record ${seconds} seconds`}
                >
                  {seconds}s
                </Chip>
              ))}
              {clipHeld && !recording ? (
                <Chip
                  testId="btn-download-clip-tune"
                  active={clipState === "ready"}
                  onClick={onDownloadClip}
                  hint="Save the clip to this computer"
                >
                  Download
                </Chip>
              ) : null}
              <Chip
                active={recording}
                onClick={onRecord}
                hint={recordEnabled ? "Record the lens" : "Recording isn’t available here"}
              >
                {recording ? `${remain.toFixed(0)}s` : "Record"}
              </Chip>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              <Button
                type="button"
                data-testid="btn-spin"
                size="sm"
                variant={settings.spin ? "active" : "secondary"}
                onClick={() => onChange({ spin: !settings.spin })}
                aria-pressed={settings.spin}
              >
                <RotateCw />
                Spin
              </Button>
              <Button type="button" data-testid="btn-clear" size="sm" variant="secondary" onClick={onClear}>
                <Eraser />
                Clear
              </Button>
              <Button type="button" data-testid="btn-export" size="sm" variant="secondary" onClick={onExport}>
                <Download />
                {exported ? "Saved" : "PNG"}
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={onHideChrome}>
                <EyeOff />
                Hide
              </Button>
            </div>
            <div className="mt-2">
              <Button
                type="button"
                data-testid="btn-more"
                size="sm"
                variant={moreOpen ? "active" : "secondary"}
                onClick={onToggleMore}
              >
                <Ellipsis />
                More
              </Button>
            </div>
            {moreOpen ? (
              <div className="mt-2 grid grid-cols-4 gap-2">
                <Button type="button" data-testid="btn-copy" size="sm" variant="secondary" onClick={onCopy}>
                  <Copy />
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  type="button"
                  data-testid="btn-social-gif"
                  size="sm"
                  variant="secondary"
                  title="Save a 3 second GIF of the lens"
                  disabled={exportKind !== null}
                  onClick={onExportGif}
                >
                  <Film />
                  {exportKind === "gif" ? "…" : "GIF"}
                </Button>
                <Button
                  type="button"
                  data-testid="btn-social-mp4"
                  size="sm"
                  variant="secondary"
                  title="Save a 3 second MP4 of the lens"
                  disabled={exportKind !== null}
                  onClick={onExportMp4}
                >
                  <Film />
                  {exportKind === "mp4" ? "…" : "MP4"}
                </Button>
                <Button
                  type="button"
                  data-testid="btn-help"
                  size="sm"
                  variant={helpOpen ? "active" : "secondary"}
                  onClick={onToggleHelp}
                >
                  Keys
                </Button>
              </div>
            ) : null}
            {moreOpen && helpOpen ? (
              <ul className="mt-3 space-y-1 text-xs leading-relaxed text-muted">
                <li>Space opens the dial · Arrows choose · Enter locks · Esc closes</li>
                <li>F freeze · V record · GIF and MP4 save a 3s loop · R random · E save · C clear · L decay</li>
                <li>WASD paint · Alt or right-drag a second brush · B pin</li>
                <li>H hide UI · P path · T tune · Wheel decay · 2–9 folds</li>
                <li>Tune · path follows the folds · fill follows the path · Tide follows the light</li>
                <li>1 and 0 recall macros · Shift+1 / Shift+0 overwrite · Hold slot to save</li>
                {settings.iconKind ? (
                  <li data-testid="icon-kind">Idle · {settings.iconKind}</li>
                ) : (
                  <li>Idle · hypotrochoid until Random</li>
                )}
              </ul>
            ) : (
              <p className="mt-3 hidden text-xs leading-relaxed text-pretty text-muted sm:block">
                Space opens the menu. Arrows pick a control, Enter locks it. Park holds the lines. Tide follows the light.
              </p>
            )}
            </div>
          </div>
        ) : (
          <>
            {dock ? (
              <div className="pointer-events-auto mb-2 w-full max-w-sm rounded-2xl bg-surface p-2 shadow-[var(--shadow-border)]">
                <div className="grid grid-cols-3 gap-1">
                  {petals.map((petal) => (
                    <button
                      key={petal.id}
                      type="button"
                      data-testid={petal.testId}
                      title={petal.label}
                      aria-label={petal.label}
                      disabled={petal.id === "record" && !recordEnabled && !recording}
                      onClick={() => pick(petal)}
                      onPointerEnter={() => onFocusId(petal.id)}
                      className={cn(
                        "flex h-14 flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96]",
                        petal.active ? "bg-fg text-bg" : "text-muted hover:bg-surface-2 hover:text-fg",
                        focusId === petal.id && "ring-2 ring-ring",
                      )}
                    >
                      {petal.icon}
                      <span className="max-w-full truncate px-0.5">{petal.label.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <button
              type="button"
              data-testid="btn-dial"
              aria-label={dialOpen ? "Close controls" : "Open controls"}
              aria-expanded={dialOpen}
              onClick={onToggleDial}
              className={cn(
                "pointer-events-auto relative flex size-14 items-center justify-center rounded-full bg-surface text-fg shadow-[var(--shadow-border)] transition-[transform,background-color] duration-150 ease-out active:scale-[0.96]",
                dialOpen && "bg-fg text-bg",
                recording && "ring-2 ring-destructive",
              )}
            >
              {recording ? (
                <span className="text-sm font-medium tabular-nums">{remain.toFixed(0)}</span>
              ) : (
                <Aperture className="size-5" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
