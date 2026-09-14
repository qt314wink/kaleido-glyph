import { useEffect, useRef, type ReactNode } from "react";
import {
  Aperture,
  Circle,
  Copy,
  Download,
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
  LIGHT_ACTIVITIES,
  MACRO_SLOTS,
  PATH_MODES,
  RECORD_OPTIONS,
  SEG_MAX,
  SEG_MIN,
  cycleId,
  persistLabel,
  type DialId,
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
  clipState: "idle" | "recording" | "saved" | "unsupported";
  clipElapsed: number;
  clipMax: RecordSeconds;
  tuneOpen: boolean;
  dialOpen: boolean;
  helpOpen: boolean;
  recordEnabled: boolean;
  pinned: boolean;
  hiddenChrome: boolean;
  wide: boolean;
  lens: LensLayout;
  focusId: DialId;
  macros: MacroBank;
  macroSlot: MacroSlot | null;
  onChange: (patch: Partial<KaleidoSettings>) => void;
  onRandomize: () => void;
  onClear: () => void;
  onExport: () => void;
  onCopy: () => void;
  onRecord: () => void;
  onRecordSeconds: (seconds: RecordSeconds) => void;
  onToggleTune: () => void;
  onToggleDial: () => void;
  onTogglePin: () => void;
  onToggleHelp: () => void;
  onHideChrome: () => void;
  onCloseMenus: () => void;
  onCyclePersist: () => void;
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
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
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

function MacroChip({
  slot,
  filled,
  active,
  onRecall,
  onSave,
}: {
  slot: MacroSlot;
  filled: boolean;
  active: boolean;
  onRecall: () => void;
  onSave: () => void;
}) {
  const hold = useRef(0);
  const saved = useRef(false);
  return (
    <button
      type="button"
      data-testid={`btn-macro-${slot}`}
      title={filled ? `Slot ${slot} · tap recall · hold to save` : `Slot ${slot} empty · tap to program · hold to save`}
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
        "h-10 shrink-0 rounded-md px-3.5 text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96]",
        active ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      {slot}
      <span className="ml-1.5 text-[10px] font-medium tracking-wide opacity-70">{filled ? "set" : "empty"}</span>
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

function downloadAsset(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function KaleidoControls({
  settings,
  exported,
  copied,
  clipState,
  clipElapsed,
  clipMax,
  tuneOpen,
  dialOpen,
  helpOpen,
  recordEnabled,
  pinned,
  hiddenChrome,
  wide,
  lens,
  focusId,
  macros,
  macroSlot,
  onChange,
  onRandomize,
  onClear,
  onExport,
  onCopy,
  onRecord,
  onRecordSeconds,
  onToggleTune,
  onToggleDial,
  onTogglePin,
  onToggleHelp,
  onHideChrome,
  onCloseMenus,
  onCyclePersist,
  onCycleLight,
  onRecallMacro,
  onSaveMacro,
  onChromeHeight,
  onFocusId,
}: ControlsProps) {
  const chromeRef = useRef<HTMLDivElement>(null);
  const remain = Math.max(0, clipMax - clipElapsed);
  const recording = clipState === "recording";
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
  }, [hiddenChrome, tuneOpen, dialOpen, helpOpen, onChromeHeight]);

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
      label: recording ? `${remain.toFixed(0)}s left` : clipState === "saved" ? "Saved" : `Record ${clipMax}s`,
      testId: "btn-record",
      active: recording,
      onClick: onRecord,
      icon: recording ? (
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
      label: `Trail ${persistLabel(settings.persist)}`,
      testId: "btn-persist",
      sticky: true,
      onClick: onCyclePersist,
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
  const flower = showPetals && wide;
  const dock = showPetals && !wide;
  const hasLens = lens.radius > 40;
  const petalR = hasLens
    ? Math.max(72, Math.min(lens.radius + 36, lens.cx - 28, Math.max(72, lens.cy - 72)))
    : 110;

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
        const ang = (deg * Math.PI) / 180;
        const x = hasLens ? lens.cx + Math.cos(ang) * petalR : Math.cos(ang) * petalR;
        const y = hasLens ? lens.cy + Math.sin(ang) * petalR : Math.sin(ang) * petalR;
        return (
          <button
            key={petal.id}
            type="button"
            data-testid={wide ? petal.testId : undefined}
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
          <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <div className="mb-3 flex items-center justify-between">
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
            <div className="flex items-center gap-3">
              <label htmlFor="persist" className="w-16 shrink-0 text-xs font-medium text-muted">
                Decay
              </label>
              <Slider
                id="persist"
                data-testid="slider-persist"
                min={0}
                max={100}
                step={1}
                value={[settings.persist]}
                onValueChange={(value) => onChange({ persist: value[0] ?? 88 })}
                aria-label="How long trails linger"
              />
              <span className="w-12 text-right text-xs font-medium tabular-nums text-fg">
                {persistLabel(settings.persist)}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <label htmlFor="segments" className="w-16 shrink-0 text-xs font-medium text-muted">
                Folds
              </label>
              <Slider
                id="segments"
                data-testid="slider-segments"
                min={SEG_MIN}
                max={SEG_MAX}
                step={1}
                value={[settings.segments]}
                onValueChange={(value) => onChange({ segments: value[0] ?? 8 })}
                aria-label="Segment count"
              />
              <span className="w-8 text-right font-medium tabular-nums text-fg">{settings.segments}</span>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <label htmlFor="brush" className="w-16 shrink-0 text-xs font-medium text-muted">
                Line
              </label>
              <Slider
                id="brush"
                min={1}
                max={14}
                step={1}
                value={[settings.brush]}
                onValueChange={(value) => onChange({ brush: value[0] ?? 5 })}
                aria-label="Line thickness"
              />
              <span className="w-8 text-right font-medium tabular-nums text-fg">{settings.brush}</span>
            </div>
            <div className="mt-3 flex gap-1 overflow-x-auto" role="radiogroup" aria-label="Color motion">
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
              <Chip active={settings.persist >= 100} onClick={() => onChange({ persist: 100 })} hint="Lines stay until you change the decay">
                Park
              </Chip>
            </div>
            <div className="mt-2 flex flex-nowrap gap-1 overflow-x-auto" role="radiogroup" aria-label="Light activity">
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
            <div className="mt-2 flex flex-nowrap items-center gap-1 overflow-x-auto" role="group" aria-label="Macro slots">
              <span className="w-16 shrink-0 text-xs font-medium text-muted">Slots</span>
              {MACRO_SLOTS.map((slot) => (
                <MacroChip
                  key={slot}
                  slot={slot}
                  filled={Boolean(macros[slot])}
                  active={macroSlot === slot}
                  onRecall={() => onRecallMacro(slot)}
                  onSave={() => onSaveMacro(slot)}
                />
              ))}
            </div>
            {settings.colorMotion === "hold" ? (
              <div className="mt-2 flex items-center gap-3">
                <label htmlFor="hue" className="w-16 shrink-0 text-xs font-medium text-muted">
                  Hue
                </label>
                <Slider
                  id="hue"
                  min={0}
                  max={359}
                  step={1}
                  value={[settings.hue]}
                  onValueChange={(value) => onChange({ hue: value[0] ?? 0 })}
                  aria-label="Hue"
                />
                <span className="w-8 text-right font-medium tabular-nums text-fg">{settings.hue}</span>
              </div>
            ) : null}
            <div className="mt-3 flex gap-1 overflow-x-auto" role="radiogroup" aria-label="Clip length">
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
              <Chip
                active={recording}
                onClick={onRecord}
                hint={recordEnabled ? "Record the lens" : "Recording isn’t available here"}
              >
                {recording ? `${remain.toFixed(0)}s` : clipState === "saved" ? "Saved" : "Record"}
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
              <Button type="button" data-testid="btn-copy" size="sm" variant="secondary" onClick={onCopy}>
                <Copy />
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button type="button" data-testid="btn-export" size="sm" variant="secondary" onClick={onExport}>
                <Download />
                {exported ? "Saved" : "PNG"}
              </Button>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              <Button
                type="button"
                data-testid="btn-social-gif"
                size="sm"
                variant="secondary"
                onClick={() => downloadAsset("/kaleido.gif", "kaleido.gif")}
              >
                <Film />
                GIF
              </Button>
              <Button
                type="button"
                data-testid="btn-social-mp4"
                size="sm"
                variant="secondary"
                onClick={() => downloadAsset("/kaleido-loop.mp4", "kaleido-loop.mp4")}
              >
                <Film />
                MP4
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={onHideChrome}>
                <EyeOff />
                Hide
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
            {helpOpen ? (
              <ul className="mt-3 space-y-1 text-xs leading-relaxed text-muted">
                <li>Space opens the dial · Arrows choose · Enter locks · Esc closes</li>
                <li>F freeze · V record · R random · E save · C clear · L decay</li>
                <li>WASD paint · Alt or right-drag a second brush · B pin</li>
                <li>H hide UI · P path · T tune · Wheel decay · 2–9 folds</li>
                <li>1 and 0 recall macros · Shift+1 / Shift+0 overwrite · Hold slot to save</li>
              </ul>
            ) : (
              <p className="mt-3 hidden text-xs leading-relaxed text-pretty text-muted sm:block">
                Space opens the menu. Arrows pick a control, Enter locks it. Lines decay unless Park is on.
              </p>
            )}
          </div>
        ) : (
          <>
            {dock ? (
              <div className="pointer-events-auto mb-2 w-full max-w-sm rounded-2xl bg-surface p-2 shadow-[var(--shadow-border)]">
                <div className="mb-1 flex items-center gap-2 px-1">
                  <span className="w-10 shrink-0 text-xs font-medium text-muted">Decay</span>
                  <Slider
                    data-testid="slider-persist-dock"
                    min={0}
                    max={100}
                    step={1}
                    value={[settings.persist]}
                    onValueChange={(value) => onChange({ persist: value[0] ?? 88 })}
                    aria-label="How long trails linger"
                  />
                  <span className="w-10 text-right text-xs font-medium tabular-nums text-fg">
                    {persistLabel(settings.persist)}
                  </span>
                </div>
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
