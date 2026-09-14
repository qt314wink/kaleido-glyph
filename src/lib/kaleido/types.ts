export const COLOR_MODES = [
  { id: "spectrum", label: "Spectrum" },
  { id: "prism", label: "Prism" },
  { id: "aurora", label: "Aurora" },
  { id: "ember", label: "Ember" },
  { id: "ice", label: "Ice" },
  { id: "pearl", label: "Pearl" },
] as const;

export type ColorMode = (typeof COLOR_MODES)[number]["id"];

export const PATH_MODES = [
  { id: "solo", label: "Solo", hint: "One brush" },
  { id: "twin", label: "Twin", hint: "Opposite brush — desktop stand-in for two fingers" },
  { id: "orbit", label: "Orbit", hint: "Rotating companion" },
  { id: "echo", label: "Echo", hint: "Delayed ghost" },
] as const;

export type PathMode = (typeof PATH_MODES)[number]["id"];

export const COLOR_MOTIONS = [
  { id: "drift", label: "Drift", hint: "Hue travels with time" },
  { id: "hold", label: "Hold", hint: "Lock hue, shift with Shift+arrows" },
] as const;

export type ColorMotion = (typeof COLOR_MOTIONS)[number]["id"];

export const LIGHT_ACTIVITIES = [
  { id: "steady", label: "Steady", hint: "Even line, slight shimmer" },
  { id: "pulse", label: "Pulse", hint: "Breathe brighter and dimmer" },
  { id: "blink", label: "Blink", hint: "On / off in a slow beat" },
  { id: "chase", label: "Chase", hint: "A bead of light runs the line" },
  { id: "firefly", label: "Firefly", hint: "Random twinkles along the stroke" },
  { id: "strobe", label: "Strobe", hint: "Fast flash" },
] as const;

export type LightActivity = (typeof LIGHT_ACTIVITIES)[number]["id"];

export const DIAL_IDS = [
  "freeze",
  "record",
  "random",
  "trail",
  "pin",
  "path",
  "color",
  "light",
  "tune",
] as const;

export type DialId = (typeof DIAL_IDS)[number];

export const RECORD_OPTIONS = [15, 30] as const;
export type RecordSeconds = (typeof RECORD_OPTIONS)[number];
export const RECORD_SECONDS: RecordSeconds = 15;

export const PERSIST_STOPS = [
  { value: 18, label: "Short" },
  { value: 50, label: "Medium" },
  { value: 82, label: "Long" },
  { value: 100, label: "Park" },
] as const;

export type LensLayout = {
  cx: number;
  cy: number;
  radius: number;
};

export type KaleidoSettings = {
  segments: number;
  colorMode: ColorMode;
  brush: number;
  persist: number;
  pathMode: PathMode;
  colorMotion: ColorMotion;
  lightActivity: LightActivity;
  hue: number;
  spin: boolean;
  frozen: boolean;
};

export const DEFAULT_SETTINGS: KaleidoSettings = {
  segments: 8,
  colorMode: "spectrum",
  brush: 5,
  persist: 58,
  pathMode: "solo",
  colorMotion: "drift",
  lightActivity: "pulse",
  hue: 0,
  spin: true,
  frozen: false,
};

export const SEG_MIN = 2;
export const SEG_MAX = 16;
export const STORAGE_KEY = "kaleido.settings.v4";

export const MACRO_SLOTS = ["1", "0"] as const;
export type MacroSlot = (typeof MACRO_SLOTS)[number];
export const MACRO_KEY = "kaleido.macros.v1";

export type KaleidoLook = Omit<KaleidoSettings, "frozen">;
export type MacroBank = Record<MacroSlot, KaleidoLook | null>;

export function isColorMode(value: unknown): value is ColorMode {
  return COLOR_MODES.some((mode) => mode.id === value);
}

export function isPathMode(value: unknown): value is PathMode {
  return PATH_MODES.some((mode) => mode.id === value);
}

export function isColorMotion(value: unknown): value is ColorMotion {
  return COLOR_MOTIONS.some((mode) => mode.id === value);
}

export function isLightActivity(value: unknown): value is LightActivity {
  return LIGHT_ACTIVITIES.some((mode) => mode.id === value);
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function clampSegments(n: number) {
  return clamp(Math.round(n), SEG_MIN, SEG_MAX);
}

export function lookFrom(settings: KaleidoSettings): KaleidoLook {
  const { frozen: _frozen, ...rest } = settings;
  return rest;
}

export function applyLook(look: KaleidoLook, frozen: boolean): KaleidoSettings {
  return {
    segments: clampSegments(look.segments),
    colorMode: isColorMode(look.colorMode) ? look.colorMode : "spectrum",
    brush: clamp(Number(look.brush) || 5, 1, 14),
    persist: clamp(Number(look.persist) || 58, 0, 100),
    pathMode: isPathMode(look.pathMode) ? look.pathMode : "solo",
    colorMotion: isColorMotion(look.colorMotion) ? look.colorMotion : "drift",
    lightActivity: isLightActivity(look.lightActivity) ? look.lightActivity : "pulse",
    hue: clamp(Number(look.hue) || 0, 0, 359),
    spin: look.spin !== false,
    frozen,
  };
}

export function emptyMacros(): MacroBank {
  return { "1": null, "0": null };
}

export function loadMacros(): MacroBank {
  if (typeof localStorage === "undefined") return emptyMacros();
  try {
    const raw = localStorage.getItem(MACRO_KEY);
    if (!raw) return emptyMacros();
    const parsed = JSON.parse(raw) as Partial<Record<MacroSlot, KaleidoLook | null>>;
    const bank = emptyMacros();
    for (const slot of MACRO_SLOTS) {
      const look = parsed[slot];
      if (look && typeof look === "object") bank[slot] = lookFrom(applyLook(look, false));
    }
    return bank;
  } catch {
    return emptyMacros();
  }
}

export function saveMacros(bank: MacroBank) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(MACRO_KEY, JSON.stringify(bank));
  } catch {
    /* ignore quota / private mode */
  }
}

export function persistLabel(persist: number) {
  if (persist >= 100) return "Park";
  if (persist >= 70) return "Long";
  if (persist >= 40) return "Medium";
  return "Short";
}

export function cyclePersist(value: number) {
  const next = PERSIST_STOPS.find((stop) => stop.value > value + 3);
  return next?.value ?? PERSIST_STOPS[0].value;
}

export function cycleId<T extends { id: string }>(list: readonly T[], id: T["id"]): T["id"] {
  const idx = list.findIndex((item) => item.id === id);
  const next = list[(idx + 1) % list.length];
  return next?.id ?? list[0].id;
}

export function loadSettings(): KaleidoSettings {
  if (typeof localStorage === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem("kaleido.settings.v3") ??
      localStorage.getItem("kaleido.settings.v2");
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<KaleidoSettings> & { brush?: number };
    const oldBrush = Number(parsed.brush);
    const brush = Number.isFinite(oldBrush)
      ? oldBrush > 14
        ? 5
        : clamp(oldBrush, 1, 14)
      : 5;
    return {
      segments: clampSegments(Number(parsed.segments) || 8),
      colorMode: isColorMode(parsed.colorMode) ? parsed.colorMode : "spectrum",
      brush,
      persist: clamp(Number(parsed.persist ?? 58), 0, 100),
      pathMode: isPathMode(parsed.pathMode) ? parsed.pathMode : "solo",
      colorMotion: isColorMotion(parsed.colorMotion) ? parsed.colorMotion : "drift",
      lightActivity: isLightActivity(parsed.lightActivity) ? parsed.lightActivity : "pulse",
      hue: clamp(Number(parsed.hue) || 0, 0, 359),
      spin: parsed.spin !== false,
      frozen: false,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: KaleidoSettings) {
  if (typeof localStorage === "undefined") return;
  try {
    const { frozen: _frozen, ...rest } = settings;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    /* ignore quota / private mode */
  }
}

export function randomSettings(): KaleidoSettings {
  const segmentChoices = [2, 3, 4, 5, 6, 8, 10, 12, 16];
  const modes = COLOR_MODES.map((mode) => mode.id);
  const paths = PATH_MODES.map((mode) => mode.id);
  const lights = LIGHT_ACTIVITIES.map((mode) => mode.id);
  return {
    segments: segmentChoices[Math.floor(Math.random() * segmentChoices.length)] ?? 8,
    colorMode: modes[Math.floor(Math.random() * modes.length)] ?? "spectrum",
    brush: Math.round(3 + Math.random() * 7),
    persist: Math.round(40 + Math.random() * 50),
    pathMode: paths[Math.floor(Math.random() * paths.length)] ?? "solo",
    colorMotion: Math.random() > 0.35 ? "drift" : "hold",
    lightActivity: lights[Math.floor(Math.random() * lights.length)] ?? "pulse",
    hue: Math.floor(Math.random() * 360),
    spin: Math.random() > 0.35,
    frozen: false,
  };
}
