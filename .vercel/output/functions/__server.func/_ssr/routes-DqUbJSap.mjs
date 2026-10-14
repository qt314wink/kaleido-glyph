import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Ellipsis, a as Spline, b as Circle, c as Shuffle, d as Pin, f as Pause, g as Eraser, h as EyeOff, i as Square, l as RotateCw, m as Film, o as Sparkles, p as Palette, r as Timer, s as SlidersHorizontal, t as X, u as Play, v as Download, x as Aperture, y as Copy } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as ct, r as nt, t as H } from "../_libs/gifenc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DqUbJSap.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg shadow-[var(--shadow-border)] hover:bg-accent/90",
			secondary: "bg-surface-2 text-fg shadow-[var(--shadow-border)] hover:bg-surface-2/80",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-surface-2",
			ghost: "text-muted hover:bg-surface-2 hover:text-fg",
			active: "bg-fg text-bg shadow-[var(--shadow-border)]"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11",
			pill: "h-10 px-3.5"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Slider = import_react.forwardRef(({ className, value, defaultValue, min = 0, max = 100, ...props }, ref) => {
	const [mounted, setMounted] = import_react.useState(false);
	import_react.useEffect(() => setMounted(true), []);
	const current = (value ?? defaultValue ?? [min])[0] ?? min;
	const pct = (Number(current) - Number(min)) / Math.max(1, Number(max) - Number(min)) * 100;
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative flex h-9 w-full items-center", className),
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-fg/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-accent",
				style: { width: `${pct}%` }
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		ref,
		className: cn("relative flex w-full touch-none select-none items-center py-2", className),
		value,
		defaultValue,
		min,
		max,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-fg/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "relative block size-5 rounded-full bg-fg shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out after:absolute after:left-1/2 after:top-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40" })]
	});
});
Slider.displayName = Slider$1.displayName;
function rand(min, max) {
	return min + Math.random() * (max - min);
}
function cpow(x, y, k) {
	let px = 1;
	let py = 0;
	for (let i = 0; i < k; i++) {
		const nx = px * x - py * y;
		const ny = px * y + py * x;
		px = nx;
		py = ny;
	}
	return {
		x: px,
		y: py
	};
}
function iconStep(x, y, c, n) {
	const r2 = x * x + y * y;
	const zn = cpow(x, y, n);
	const zn1 = cpow(x, -y, Math.max(1, n - 1));
	const amp = c.lam + c.a * r2 + c.b * zn.x;
	let nx = amp * x - c.w * y + c.g * zn1.x;
	let ny = amp * y + c.w * x + c.g * zn1.y;
	if (nx * nx + ny * ny > 8) {
		const s = .15 / Math.sqrt(Math.max(1e-8, x * x + y * y));
		return {
			x: x * s,
			y: y * s,
			escaped: true
		};
	}
	return {
		x: nx,
		y: ny,
		escaped: false
	};
}
function nsAtOrigin(c) {
	const rho = Math.hypot(c.lam, c.w);
	const th = Math.atan2(c.w, c.lam);
	const strong = [
		1,
		2,
		3,
		4
	].some((k) => {
		const a = Math.abs(th * k / (2 * Math.PI) % 1);
		return Math.min(a, 1 - a) < .02;
	});
	return {
		rho,
		theta: th,
		isNS: Math.abs(rho - 1) < .04 && Math.abs(c.w) > .05 && !strong,
		strong
	};
}
function acceptIcon(c, n) {
	let x = .12;
	let y = .07;
	let esc = 0;
	for (let i = 0; i < 4096; i++) {
		const next = iconStep(x, y, c, n);
		x = next.x;
		y = next.y;
		if (next.escaped) esc++;
	}
	return esc / 4096 < .3;
}
function sampleKind(kind) {
	if (kind === "ring") {
		const rho = Math.random() < .55 ? rand(.97, 1.04) : rand(1.04, 1.16);
		const th = rand(.14, .34) * (Math.random() < .5 ? -1 : 1);
		return {
			lam: rho * Math.cos(th),
			a: rand(-.8, -.2),
			b: rand(-.45, .45),
			g: rand(.45, 1.05),
			w: rho * Math.sin(th)
		};
	}
	if (kind === "sink") {
		const rho = rand(.55, .85);
		const th = rand(-.2, .2);
		return {
			lam: rho * Math.cos(th),
			a: rand(-.4, 0),
			b: rand(-.35, .35),
			g: rand(.4, .9),
			w: rho * Math.sin(th)
		};
	}
	return {
		lam: rand(-2.2, 2.2),
		a: rand(-1, .2),
		b: rand(-.5, .5),
		g: rand(.4, 1.2),
		w: Math.random() < .45 ? 0 : rand(-.4, .4)
	};
}
function sampleIcon(n) {
	const roll = Math.random();
	const order = [
		roll < .3 ? "ring" : roll < .6 ? "sink" : "cloak",
		"cloak",
		"ring",
		"sink"
	];
	for (const kind of order) {
		const tries = kind === "ring" ? 24 : 12;
		for (let i = 0; i < tries; i++) {
			const coeffs = sampleKind(kind);
			const ns = nsAtOrigin(coeffs);
			if (ns.strong) continue;
			if (kind === "ring" && Math.abs(coeffs.w) < .08) continue;
			if (kind === "ring" && ns.rho < .96) continue;
			if (acceptIcon(coeffs, n)) return {
				coeffs,
				kind
			};
		}
	}
	return {
		coeffs: sampleKind("sink"),
		kind: "sink"
	};
}
function classifyIcon(c) {
	const ns = nsAtOrigin(c);
	if (ns.isNS || ns.rho > 1.02 && ns.rho < 1.2 && c.a < -.15 && Math.abs(c.w) > .08) return "ring";
	if (ns.rho < .9) return "sink";
	return "cloak";
}
function isIconCoeffs(value) {
	if (!value || typeof value !== "object") return false;
	const c = value;
	return [
		c.lam,
		c.a,
		c.b,
		c.g,
		c.w
	].every((n) => Number.isFinite(n));
}
var COLOR_MODES = [
	{
		id: "spectrum",
		label: "Spectrum"
	},
	{
		id: "prism",
		label: "Prism"
	},
	{
		id: "aurora",
		label: "Aurora"
	},
	{
		id: "ember",
		label: "Ember"
	},
	{
		id: "ice",
		label: "Ice"
	},
	{
		id: "pearl",
		label: "Pearl"
	}
];
var PATH_MODES = [
	{
		id: "solo",
		label: "Solo",
		hint: "One brush"
	},
	{
		id: "twin",
		label: "Twin",
		hint: "Opposite brush — desktop stand-in for two fingers"
	},
	{
		id: "orbit",
		label: "Orbit",
		hint: "Rotating companion"
	},
	{
		id: "echo",
		label: "Echo",
		hint: "Delayed ghost"
	},
	{
		id: "rosette",
		label: "Rosette",
		hint: "Rotations only — no mirrors"
	},
	{
		id: "field",
		label: "Field",
		hint: "A companion drifts on a curl"
	}
];
var COLOR_MOTIONS = [{
	id: "drift",
	label: "Drift",
	hint: "Hue travels with time"
}, {
	id: "hold",
	label: "Hold",
	hint: "Lock hue, shift with Shift+arrows"
}];
var LIGHT_ACTIVITIES = [
	{
		id: "steady",
		label: "Steady",
		hint: "Even line, slight shimmer"
	},
	{
		id: "pulse",
		label: "Pulse",
		hint: "Breathe brighter and dimmer"
	},
	{
		id: "blink",
		label: "Blink",
		hint: "On / off in a slow beat"
	},
	{
		id: "chase",
		label: "Chase",
		hint: "A bead of light runs the line"
	},
	{
		id: "firefly",
		label: "Firefly",
		hint: "Random twinkles along the stroke"
	},
	{
		id: "strobe",
		label: "Strobe",
		hint: "Fast flash"
	}
];
var FILL_MODES = [
	{
		id: "off",
		label: "Off",
		hint: "No room color"
	},
	{
		id: "cells",
		label: "Cells",
		hint: "Fill closed loops. The rim stays empty."
	},
	{
		id: "wedges",
		label: "Wedges",
		hint: "Fold rays make a room of every sector."
	}
];
var FILL_RECIPES = [
	{
		id: "wash",
		label: "Wash",
		hint: "One hue across the room"
	},
	{
		id: "vein",
		label: "Vein",
		hint: "Hue taken from the wall that closed it"
	},
	{
		id: "well",
		label: "Well",
		hint: "Brighter in the middle of the room"
	},
	{
		id: "tide",
		label: "Tide",
		hint: "Rooms breathe with the light"
	},
	{
		id: "cloisonne",
		label: "Cloisonné",
		hint: "Stepped hues around the fold"
	}
];
var DIAL_IDS = [
	"freeze",
	"record",
	"random",
	"trail",
	"pin",
	"path",
	"color",
	"light",
	"tune"
];
var RECORD_OPTIONS = [15, 30];
var PERSIST_STOPS = [
	{
		value: 18,
		label: "Short"
	},
	{
		value: 50,
		label: "Medium"
	},
	{
		value: 82,
		label: "Long"
	},
	{
		value: 100,
		label: "Park"
	}
];
var DEFAULT_SETTINGS = {
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
	icon: null,
	iconKind: null,
	fillMode: "off",
	fillRecipe: "wash"
};
var STORAGE_KEY = "kaleido.settings.v5";
var MACRO_SLOTS = ["1", "0"];
var MACRO_KEY = "kaleido.macros.v2";
function isColorMode(value) {
	return COLOR_MODES.some((mode) => mode.id === value);
}
function isPathMode(value) {
	return PATH_MODES.some((mode) => mode.id === value);
}
function isColorMotion(value) {
	return COLOR_MOTIONS.some((mode) => mode.id === value);
}
function isLightActivity(value) {
	return LIGHT_ACTIVITIES.some((mode) => mode.id === value);
}
function isFillMode(value) {
	return FILL_MODES.some((mode) => mode.id === value);
}
function isFillRecipe(value) {
	return FILL_RECIPES.some((mode) => mode.id === value);
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function clampSegments(n) {
	return clamp(Math.round(n), 2, 16);
}
function lookFrom(settings) {
	const { frozen: _frozen, ...rest } = settings;
	return rest;
}
function applyLook(look, frozen) {
	const icon = isIconCoeffs(look.icon) ? look.icon : null;
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
		icon,
		iconKind: icon ? look.iconKind ?? classifyIcon(icon) : null,
		fillMode: isFillMode(look.fillMode) ? look.fillMode : "off",
		fillRecipe: isFillRecipe(look.fillRecipe) ? look.fillRecipe : "wash"
	};
}
function emptyMacros() {
	return {
		"1": null,
		"0": null
	};
}
function loadMacros() {
	if (typeof localStorage === "undefined") return emptyMacros();
	try {
		const raw = localStorage.getItem("kaleido.macros.v2") ?? localStorage.getItem("kaleido.macros.v1");
		if (!raw) return emptyMacros();
		const parsed = JSON.parse(raw);
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
function saveMacros(bank) {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(MACRO_KEY, JSON.stringify(bank));
	} catch {}
}
function persistLabel(persist) {
	if (persist >= 100) return "Park";
	if (persist >= 70) return "Long";
	if (persist >= 40) return "Medium";
	return "Short";
}
function cyclePersist(value) {
	return PERSIST_STOPS.find((stop) => stop.value > value + 3)?.value ?? PERSIST_STOPS[0].value;
}
function togglePark(value) {
	return value >= 100 ? 58 : 100;
}
function cycleId(list, id) {
	return list[(list.findIndex((item) => item.id === id) + 1) % list.length]?.id ?? list[0].id;
}
function loadSettings() {
	if (typeof localStorage === "undefined") return { ...DEFAULT_SETTINGS };
	try {
		const raw = localStorage.getItem("kaleido.settings.v5") ?? localStorage.getItem("kaleido.settings.v4") ?? localStorage.getItem("kaleido.settings.v3") ?? localStorage.getItem("kaleido.settings.v2");
		if (!raw) return { ...DEFAULT_SETTINGS };
		const parsed = JSON.parse(raw);
		const oldBrush = Number(parsed.brush);
		const brush = Number.isFinite(oldBrush) ? oldBrush > 14 ? 5 : clamp(oldBrush, 1, 14) : 5;
		const icon = isIconCoeffs(parsed.icon) ? parsed.icon : null;
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
			icon,
			iconKind: icon ? parsed.iconKind ?? classifyIcon(icon) : null,
			fillMode: isFillMode(parsed.fillMode) ? parsed.fillMode : "off",
			fillRecipe: isFillRecipe(parsed.fillRecipe) ? parsed.fillRecipe : "wash"
		};
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}
function saveSettings(settings) {
	if (typeof localStorage === "undefined") return;
	try {
		const { frozen: _frozen, ...rest } = settings;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
	} catch {}
}
function randomSettings() {
	const segmentChoices = [
		2,
		3,
		4,
		5,
		6,
		8,
		10,
		12,
		16
	];
	const modes = COLOR_MODES.map((mode) => mode.id);
	const paths = PATH_MODES.map((mode) => mode.id);
	const lights = LIGHT_ACTIVITIES.map((mode) => mode.id);
	const recipes = FILL_RECIPES.map((mode) => mode.id);
	const segments = segmentChoices[Math.floor(Math.random() * segmentChoices.length)] ?? 8;
	const sampled = sampleIcon(segments);
	const ring = sampled.kind === "ring";
	const fillRoll = Math.random();
	return {
		segments,
		colorMode: modes[Math.floor(Math.random() * modes.length)] ?? "spectrum",
		brush: Math.round(3 + Math.random() * 7),
		persist: Math.round(40 + Math.random() * 50),
		pathMode: ring ? "rosette" : paths[Math.floor(Math.random() * paths.length)] ?? "solo",
		colorMotion: Math.random() > .35 ? "drift" : "hold",
		lightActivity: lights[Math.floor(Math.random() * lights.length)] ?? "pulse",
		hue: Math.floor(Math.random() * 360),
		spin: Math.random() > .35,
		frozen: false,
		icon: sampled.coeffs,
		iconKind: sampled.kind,
		fillMode: fillRoll < .22 ? "cells" : fillRoll < .34 ? "wedges" : "off",
		fillRecipe: recipes[Math.floor(Math.random() * recipes.length)] ?? "wash"
	};
}
function Chip({ active, children, onClick, hint, testId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-testid": testId,
		title: hint,
		onClick,
		className: cn("h-10 shrink-0 rounded-md px-3.5 text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96]", active ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
		children
	});
}
function macroCaption(slot, look) {
	if (!look) return `Save ${slot}`;
	return `${slot} · ${COLOR_MODES.find((mode) => mode.id === look.colorMode)?.label ?? "Look"}`;
}
function MacroChip({ slot, look, active, onRecall, onSave }) {
	const hold = (0, import_react.useRef)(0);
	const saved = (0, import_react.useRef)(false);
	const filled = Boolean(look);
	const caption = macroCaption(slot, look);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-testid": `btn-macro-${slot}`,
		title: filled ? `${caption} · tap recall · hold to save` : `${caption} · tap to program · hold to save`,
		onPointerDown: () => {
			saved.current = false;
			window.clearTimeout(hold.current);
			hold.current = window.setTimeout(() => {
				saved.current = true;
				onSave();
			}, 480);
		},
		onPointerUp: () => window.clearTimeout(hold.current),
		onPointerCancel: () => window.clearTimeout(hold.current),
		onPointerLeave: () => window.clearTimeout(hold.current),
		onClick: () => {
			if (saved.current) {
				saved.current = false;
				return;
			}
			onRecall();
		},
		className: cn("h-10 min-w-20 shrink-0 rounded-md px-3.5 text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96]", active ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
		children: caption
	});
}
function placePetal(x, y, lens, hasLens) {
	if (!hasLens || typeof window === "undefined") return {
		x,
		y
	};
	const minY = 112;
	const maxY = Math.max(120, window.innerHeight - 84);
	const minX = 28;
	const maxX = Math.max(36, window.innerWidth - 28);
	const minDist = lens.radius + 36;
	let dx = x - lens.cx;
	let dy = y - lens.cy;
	let dist = Math.hypot(dx, dy) || 1;
	if (dist < minDist) {
		dx = dx / dist * minDist;
		dy = dy / dist * minDist;
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
		const ox = lens.cx + dx / dist * minDist;
		const oy = lens.cy + dy / dist * minDist;
		if (ox >= minX && ox <= maxX && oy >= minY && oy <= maxY) return {
			x: ox,
			y: oy
		};
	}
	return {
		x: px,
		y: py
	};
}
function fillRelation(settings) {
	if (settings.fillMode === "off") return null;
	const light = LIGHT_ACTIVITIES.find((mode) => mode.id === settings.lightActivity)?.label ?? "the light";
	const mirror = settings.pathMode !== "rosette";
	if (settings.fillMode === "cells") return settings.fillRecipe === "tide" ? `Closed loops · rim stays empty · breathes with ${light}` : "Closed loops · the rim stays empty";
	const fold = mirror ? `${settings.segments} folds, mirrored` : `${settings.segments} folds, rotations only`;
	if (settings.fillRecipe === "tide") return `${fold} · breathes with ${light}`;
	if (settings.fillRecipe === "cloisonne") return `${fold} · one hue step per sector`;
	return `${fold} · rays are the walls`;
}
function KaleidoControls({ settings, exported, copied, clipState, clipHeld, clipElapsed, clipMax, tuneOpen, dialOpen, helpOpen, moreOpen, recordEnabled, pinned, hiddenChrome, flower: flowerChrome, lens, focusId, macros, macroSlot, onChange, onRandomize, onClear, onExport, onExportGif, onExportMp4, exportKind, onCopy, onRecord, onDownloadClip, onRecordSeconds, onToggleTune, onToggleDial, onTogglePin, onToggleHelp, onToggleMore, onHideChrome, onCloseMenus, onTogglePark, onCycleLight, onRecallMacro, onSaveMacro, onChromeHeight, onFocusId }) {
	const chromeRef = (0, import_react.useRef)(null);
	const remain = Math.max(0, clipMax - clipElapsed);
	const recording = clipState === "recording";
	const parked = settings.persist >= 100;
	const path = PATH_MODES.find((mode) => mode.id === settings.pathMode);
	const color = COLOR_MODES.find((mode) => mode.id === settings.colorMode);
	(0, import_react.useEffect)(() => {
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
	}, [
		hiddenChrome,
		tuneOpen,
		dialOpen,
		helpOpen,
		moreOpen,
		onChromeHeight
	]);
	const cyclePath = () => onChange({ pathMode: cycleId(PATH_MODES, settings.pathMode) });
	const cycleColor = () => onChange({ colorMode: cycleId(COLOR_MODES, settings.colorMode) });
	const petals = [
		{
			id: "freeze",
			label: settings.frozen ? "Live" : "Freeze",
			testId: "btn-freeze",
			active: settings.frozen,
			sticky: true,
			onClick: () => onChange({ frozen: !settings.frozen }),
			icon: settings.frozen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" })
		},
		{
			id: "record",
			label: recording ? `${remain.toFixed(0)}s left` : clipState === "ready" ? "Download" : `Record ${clipMax}s`,
			testId: "btn-record",
			active: recording || clipState === "ready",
			onClick: clipState === "ready" ? onDownloadClip : onRecord,
			icon: clipState === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-5" }) : recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-4 fill-destructive text-destructive" })
		},
		{
			id: "random",
			label: "Random",
			testId: "btn-randomize",
			onClick: onRandomize,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-5" })
		},
		{
			id: "trail",
			label: parked ? "Parked" : "Park",
			testId: "btn-persist",
			active: parked,
			sticky: true,
			onClick: onTogglePark,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "size-5" })
		},
		{
			id: "pin",
			label: pinned ? "Unpin" : "Pin brush",
			testId: "btn-pin",
			active: pinned,
			sticky: true,
			onClick: onTogglePin,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-5" })
		},
		{
			id: "path",
			label: path?.label ?? "Path",
			testId: "btn-path",
			sticky: true,
			onClick: cyclePath,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spline, { className: "size-5" })
		},
		{
			id: "color",
			label: color?.label ?? "Color",
			testId: "btn-color",
			sticky: true,
			onClick: cycleColor,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "size-5" })
		},
		{
			id: "light",
			label: LIGHT_ACTIVITIES.find((mode) => mode.id === settings.lightActivity)?.label ?? "Light",
			testId: "btn-light",
			sticky: true,
			onClick: onCycleLight,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" })
		},
		{
			id: "tune",
			label: "Tune",
			testId: "btn-tune",
			active: tuneOpen,
			sticky: true,
			onClick: onToggleTune,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-5" })
		}
	];
	const pick = (petal) => {
		if (petal.id === "record" && !recordEnabled && !recording) return;
		petal.onClick();
		if (!petal.sticky) onCloseMenus();
	};
	const focused = petals.find((petal) => petal.id === focusId);
	const showPetals = dialOpen && !tuneOpen && !hiddenChrome;
	const flower = showPetals && flowerChrome;
	const dock = showPetals && !flowerChrome;
	const hasLens = lens.radius > 40;
	if (hiddenChrome) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"data-testid": "btn-show-chrome",
			"aria-label": "Show controls",
			onClick: onHideChrome,
			className: "pointer-events-auto flex size-11 items-center justify-center rounded-full bg-surface text-fg shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aperture, { className: "size-4" })
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0",
		children: [
			flower && focused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute inset-x-0 top-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] z-20 text-center text-xs font-medium tracking-wide text-fg",
				children: focused.label
			}) : null,
			petals.map((petal, i) => {
				const deg = 126 + (i + .5) / petals.length * 288;
				const orbit = hasLens ? lens.radius + 52 : 110;
				const ang = deg * Math.PI / 180;
				const placed = placePetal(hasLens ? lens.cx + Math.cos(ang) * orbit : Math.cos(ang) * orbit, hasLens ? lens.cy + Math.sin(ang) * orbit : Math.sin(ang) * orbit, lens, hasLens);
				const x = placed.x;
				const y = placed.y;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": flower ? petal.testId : void 0,
					title: petal.label,
					"aria-label": petal.label,
					"aria-hidden": !flower,
					tabIndex: flower ? 0 : -1,
					disabled: petal.id === "record" && !recordEnabled && !recording,
					onClick: () => pick(petal),
					onPointerEnter: () => onFocusId(petal.id),
					onFocus: () => onFocusId(petal.id),
					className: cn("absolute z-20 flex size-11 items-center justify-center rounded-full shadow-[var(--shadow-border)] transition-[opacity,transform,box-shadow] duration-200 ease-smooth-out", petal.active ? "bg-fg text-bg" : "bg-surface text-fg", flower && focusId === petal.id && "ring-2 ring-ring", flower ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"),
					style: {
						left: hasLens ? x : "50%",
						top: hasLens ? y : "auto",
						bottom: hasLens ? "auto" : "1.25rem",
						transform: flower ? "translate(-50%, -50%)" : "translate(-50%, -50%) scale(0.85)"
					},
					children: petal.icon
				}, petal.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: chromeRef,
				className: "pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
				children: tuneOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto flex max-h-[min(48dvh,26rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 pt-4 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-fg",
							children: "Tune"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-testid": "btn-tune-close",
							"aria-label": "Close tune",
							onClick: onCloseMenus,
							className: "flex size-9 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-y-auto px-4 pb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "persist",
										className: "w-14 shrink-0 text-xs font-medium text-muted",
										children: "Decay"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										id: "persist",
										"data-testid": "slider-persist",
										className: "min-w-0 w-auto flex-1",
										min: 0,
										max: 100,
										step: 1,
										value: [settings.persist],
										onValueChange: (value) => onChange({ persist: value[0] ?? 88 }),
										"aria-label": "How long trails linger"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-12 shrink-0 text-right text-xs font-medium tabular-nums text-fg",
										children: persistLabel(settings.persist)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
										active: parked,
										onClick: onTogglePark,
										hint: "Hold the lines until decay moves",
										children: "Park"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "segments",
										className: "w-14 shrink-0 text-xs font-medium text-muted",
										children: "Folds"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										id: "segments",
										"data-testid": "slider-segments",
										className: "min-w-0 w-auto flex-1",
										min: 2,
										max: 16,
										step: 1,
										value: [settings.segments],
										onValueChange: (value) => onChange({ segments: value[0] ?? 8 }),
										"aria-label": "Segment count"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-8 shrink-0 text-right font-medium tabular-nums text-fg",
										children: settings.segments
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap items-center gap-1",
								role: "radiogroup",
								"aria-label": "Path",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-14 shrink-0 text-xs font-medium text-muted",
									children: "Path"
								}), PATH_MODES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									testId: `btn-path-${mode.id}`,
									hint: mode.hint,
									active: settings.pathMode === mode.id,
									onClick: () => onChange({ pathMode: mode.id }),
									children: mode.label
								}, mode.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "brush",
										className: "w-14 shrink-0 text-xs font-medium text-muted",
										children: "Line"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										id: "brush",
										className: "min-w-0 w-auto flex-1",
										min: 1,
										max: 14,
										step: 1,
										value: [settings.brush],
										onValueChange: (value) => onChange({ brush: value[0] ?? 5 }),
										"aria-label": "Line thickness"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-8 shrink-0 text-right font-medium tabular-nums text-fg",
										children: settings.brush
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-1",
								role: "radiogroup",
								"aria-label": "Color",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-14 shrink-0 text-xs font-medium text-muted",
									children: "Color"
								}), COLOR_MODES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									testId: `btn-palette-${mode.id}`,
									active: settings.colorMode === mode.id,
									onClick: () => onChange({ colorMode: mode.id }),
									children: mode.label
								}, mode.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap items-center gap-1",
								role: "radiogroup",
								"aria-label": "Color motion",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-14 shrink-0 text-xs font-medium text-muted",
									children: "Motion"
								}), COLOR_MOTIONS.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									hint: mode.hint,
									active: settings.colorMotion === mode.id,
									onClick: () => onChange({ colorMotion: mode.id }),
									children: mode.label
								}, mode.id))]
							}),
							settings.colorMotion === "hold" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "hue",
										className: "w-14 shrink-0 text-xs font-medium text-muted",
										children: "Hue"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										id: "hue",
										className: "min-w-0 w-auto flex-1",
										min: 0,
										max: 359,
										step: 1,
										value: [settings.hue],
										onValueChange: (value) => onChange({ hue: value[0] ?? 0 }),
										"aria-label": "Hue"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-8 shrink-0 text-right font-medium tabular-nums text-fg",
										children: settings.hue
									})
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap items-center gap-1",
								role: "radiogroup",
								"aria-label": "Light activity",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-14 shrink-0 text-xs font-medium text-muted",
									children: "Light"
								}), LIGHT_ACTIVITIES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									hint: mode.hint,
									active: settings.lightActivity === mode.id,
									onClick: () => onChange({ lightActivity: mode.id }),
									children: mode.label
								}, mode.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-1",
								role: "radiogroup",
								"aria-label": "Fill",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-14 shrink-0 text-xs font-medium text-muted",
									children: "Fill"
								}), FILL_MODES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									testId: `btn-fill-${mode.id}`,
									hint: mode.hint,
									active: settings.fillMode === mode.id,
									onClick: () => onChange({ fillMode: mode.id }),
									children: mode.label
								}, mode.id))]
							}),
							settings.fillMode !== "off" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: fillRelation(settings)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-1",
								role: "radiogroup",
								"aria-label": "Fill recipe",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-14 shrink-0 text-xs font-medium text-muted",
									children: "Tone"
								}), FILL_RECIPES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									testId: `btn-recipe-${mode.id}`,
									hint: mode.hint,
									active: settings.fillRecipe === mode.id,
									onClick: () => onChange({ fillRecipe: mode.id }),
									children: mode.label
								}, mode.id))]
							})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap items-center gap-1",
								role: "group",
								"aria-label": "Macro slots",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-14 shrink-0 text-xs font-medium text-muted",
									children: "Slots"
								}), MACRO_SLOTS.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroChip, {
									slot,
									look: macros[slot],
									active: macroSlot === slot,
									onRecall: () => onRecallMacro(slot),
									onSave: () => onSaveMacro(slot)
								}, slot))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-1",
								role: "radiogroup",
								"aria-label": "Clip length",
								children: [
									RECORD_OPTIONS.map((seconds) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
										active: clipMax === seconds,
										onClick: () => onRecordSeconds(seconds),
										hint: `Record ${seconds} seconds`,
										children: [seconds, "s"]
									}, seconds)),
									clipHeld && !recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
										testId: "btn-download-clip-tune",
										active: clipState === "ready",
										onClick: onDownloadClip,
										hint: "Save the clip to this computer",
										children: "Download"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
										active: recording,
										onClick: onRecord,
										hint: recordEnabled ? "Record the lens" : "Recording isn’t available here",
										children: recording ? `${remain.toFixed(0)}s` : "Record"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-4 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										"data-testid": "btn-spin",
										size: "sm",
										variant: settings.spin ? "active" : "secondary",
										onClick: () => onChange({ spin: !settings.spin }),
										"aria-pressed": settings.spin,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, {}), "Spin"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										"data-testid": "btn-clear",
										size: "sm",
										variant: "secondary",
										onClick: onClear,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, {}), "Clear"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										"data-testid": "btn-export",
										size: "sm",
										variant: "secondary",
										onClick: onExport,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), exported ? "Saved" : "PNG"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: "secondary",
										onClick: onHideChrome,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {}), "Hide"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									"data-testid": "btn-more",
									size: "sm",
									variant: moreOpen ? "active" : "secondary",
									onClick: onToggleMore,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, {}), "More"]
								})
							}),
							moreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid grid-cols-4 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										"data-testid": "btn-copy",
										size: "sm",
										variant: "secondary",
										onClick: onCopy,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? "Copied" : "Copy"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										"data-testid": "btn-social-gif",
										size: "sm",
										variant: "secondary",
										title: "Save a 3 second GIF of the lens",
										disabled: exportKind !== null,
										onClick: onExportGif,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {}), exportKind === "gif" ? "…" : "GIF"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										"data-testid": "btn-social-mp4",
										size: "sm",
										variant: "secondary",
										title: "Save a 3 second MP4 of the lens",
										disabled: exportKind !== null,
										onClick: onExportMp4,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {}), exportKind === "mp4" ? "…" : "MP4"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										"data-testid": "btn-help",
										size: "sm",
										variant: helpOpen ? "active" : "secondary",
										onClick: onToggleHelp,
										children: "Keys"
									})
								]
							}) : null,
							moreOpen && helpOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-1 text-xs leading-relaxed text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Space opens the dial · Arrows choose · Enter locks · Esc closes" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "F freeze · V record · GIF and MP4 save a 3s loop · R random · E save · C clear · L decay" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "WASD paint · Alt or right-drag a second brush · B pin" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "H hide UI · P path · T tune · Wheel decay · 2–9 folds" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tune · path follows the folds · fill follows the path · Tide follows the light" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1 and 0 recall macros · Shift+1 / Shift+0 overwrite · Hold slot to save" }),
									settings.iconKind ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										"data-testid": "icon-kind",
										children: ["Idle · ", settings.iconKind]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Idle · hypotrochoid until Random" })
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 hidden text-xs leading-relaxed text-pretty text-muted sm:block",
								children: "Space opens the menu. Arrows pick a control, Enter locks it. Park holds the lines. Tide follows the light."
							})
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [dock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-auto mb-2 w-full max-w-sm rounded-2xl bg-surface p-2 shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1",
						children: petals.map((petal) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": petal.testId,
							title: petal.label,
							"aria-label": petal.label,
							disabled: petal.id === "record" && !recordEnabled && !recording,
							onClick: () => pick(petal),
							onPointerEnter: () => onFocusId(petal.id),
							className: cn("flex h-14 flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96]", petal.active ? "bg-fg text-bg" : "text-muted hover:bg-surface-2 hover:text-fg", focusId === petal.id && "ring-2 ring-ring"),
							children: [petal.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-w-full truncate px-0.5",
								children: petal.label.split(" ")[0]
							})]
						}, petal.id))
					})
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": "btn-dial",
					"aria-label": dialOpen ? "Close controls" : "Open controls",
					"aria-expanded": dialOpen,
					onClick: onToggleDial,
					className: cn("pointer-events-auto relative flex size-14 items-center justify-center rounded-full bg-surface text-fg shadow-[var(--shadow-border)] transition-[transform,background-color] duration-150 ease-out active:scale-[0.96]", dialOpen && "bg-fg text-bg", recording && "ring-2 ring-destructive"),
					children: recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium tabular-nums",
						children: remain.toFixed(0)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aperture, { className: "size-5" })
				})] })
			})
		]
	});
}
function hslToRgb$1(h, s, l) {
	const hh = (h % 360 + 360) % 360;
	const ss = s / 100;
	const ll = l / 100;
	const a = ss * Math.min(ll, 1 - ll);
	const f = (n) => {
		const k = (n + hh / 30) % 12;
		return ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	};
	return [
		f(0),
		f(8),
		f(4)
	];
}
var MAX_ROOMS = 32;
var MIN_AREA = 24;
var ALPHA_CAP = .28;
function fillMaskSize(coarse) {
	return coarse ? 256 : 384;
}
var FillStencil = class {
	size = 0;
	axis = /* @__PURE__ */ new Float64Array(0);
	axisR = 0;
	prepareAxis(radius) {
		if (this.axis.length === this.size && this.axisR === radius) return;
		this.axisR = radius;
		const S = this.size;
		const axis = new Float64Array(S);
		const diam = 2 * radius;
		for (let i = 0; i < S; i++) axis[i] = ((i + .5) / S - .5) * diam;
		this.axis = axis;
	}
	radius = 1;
	mask = /* @__PURE__ */ new Uint8Array(0);
	wallId = /* @__PURE__ */ new Uint16Array(0);
	labels = /* @__PURE__ */ new Uint16Array(0);
	pix = /* @__PURE__ */ new Int32Array(0);
	qq = /* @__PURE__ */ new Int32Array(0);
	build(input) {
		const size = input.size;
		const radius = Math.max(8, input.radius);
		const n = Math.max(1, input.n | 0);
		this.ensure(size);
		this.radius = radius;
		this.prepareAxis(radius);
		this.mask.fill(0);
		this.wallId.fill(0);
		this.labels.fill(0);
		const rr = radius * radius;
		const S = size;
		const axis = this.axis;
		for (let j = 0; j < S; j++) {
			const yy = (axis[j] ?? 0) * (axis[j] ?? 0);
			const row = j * S;
			for (let i = 0; i < S; i++) if ((axis[i] ?? 0) * (axis[i] ?? 0) + yy > rr) this.mask[row + i] = 2;
		}
		const slice = Math.PI * 2 / n;
		const cos = new Float64Array(n);
		const sin = new Float64Array(n);
		for (let i = 0; i < n; i++) {
			cos[i] = Math.cos(i * slice);
			sin[i] = Math.sin(i * slice);
		}
		const strokes = input.strokes;
		for (let s = 0; s < strokes.length; s++) {
			const stroke = strokes[s];
			if (!stroke || stroke.len < 2) continue;
			this.strokeWall(stroke, s + 1, n, input.mirrors, cos, sin);
		}
		if (input.wedges) {
			for (let i = 0; i < n; i++) {
				const ca = cos[i] ?? 1;
				const sa = sin[i] ?? 0;
				this.seg(0, 0, ca * radius * 1.2, sa * radius * 1.2, 0, true);
			}
			const mid = S / 2 | 0;
			this.plot(mid, mid, 0, true);
		}
		const rooms = this.flood(input.wedges, radius, strokes);
		return {
			size,
			radius,
			n,
			mirrors: input.mirrors,
			labels: this.labels,
			rooms
		};
	}
	ensure(size) {
		if (this.size === size && this.mask.length === size * size) return;
		const n = size * size;
		this.size = size;
		this.mask = new Uint8Array(n);
		this.wallId = new Uint16Array(n);
		this.labels = new Uint16Array(n);
		this.pix = new Int32Array(n);
		this.qq = new Int32Array(n);
	}
	strokeWall(s, id, n, mirrors, cos, sin) {
		const thick = s.width * (this.size / (2 * this.radius)) >= 2.4;
		const x0 = s.xs[0] ?? 0;
		const y0 = s.ys[0] ?? 0;
		const x1 = s.xs[s.len - 1] ?? x0;
		const y1 = s.ys[s.len - 1] ?? y0;
		const gap = Math.hypot(x1 - x0, y1 - y0);
		const close = gap > .4 && gap <= s.width * 1.35 + 2;
		for (let i = 0; i < n; i++) {
			const ca = cos[i] ?? 1;
			const sa = sin[i] ?? 0;
			this.poly(s, ca, sa, false, id, thick, close);
			if (mirrors) this.poly(s, ca, sa, true, id, thick, close);
		}
	}
	poly(s, ca, sa, mirror, id, thick, close) {
		let px = 0;
		let py = 0;
		for (let i = 0; i < s.len; i++) {
			const x = s.xs[i] ?? 0;
			const y = s.ys[i] ?? 0;
			const tx = mirror ? x * ca + y * sa : x * ca - y * sa;
			const ty = mirror ? x * sa - y * ca : x * sa + y * ca;
			if (i > 0) this.seg(px, py, tx, ty, id, thick);
			px = tx;
			py = ty;
		}
		if (close && s.len > 2) {
			const x = s.xs[0] ?? 0;
			const y = s.ys[0] ?? 0;
			const tx = mirror ? x * ca + y * sa : x * ca - y * sa;
			const ty = mirror ? x * sa - y * ca : x * sa + y * ca;
			this.seg(px, py, tx, ty, id, thick);
		}
	}
	seg(x0, y0, x1, y1, id, thick) {
		const S = this.size;
		const r = this.radius;
		const clipped = clipBox((x0 / r + 1) * .5 * S, (y0 / r + 1) * .5 * S, (x1 / r + 1) * .5 * S, (y1 / r + 1) * .5 * S, -1, S);
		if (!clipped) return;
		this.supercover(clipped[0], clipped[1], clipped[2], clipped[3], id, thick);
	}
	supercover(x0, y0, x1, y1, id, thick) {
		const S = this.size;
		const mask = this.mask;
		const wallId = this.wallId;
		const stamp = (i, j) => {
			if ((i | j) < 0 || i >= S || j >= S) return;
			const k = j * S + i;
			mask[k] = 1;
			if (id > 0) wallId[k] = id;
		};
		let x = Math.round(x0);
		let y = Math.round(y0);
		const xe = Math.round(x1);
		const ye = Math.round(y1);
		const dx = Math.abs(xe - x);
		const dy = Math.abs(ye - y);
		const sx = x < xe ? 1 : -1;
		const sy = y < ye ? 1 : -1;
		let err = dx - dy;
		const guard = dx + dy + 4;
		for (let k = 0; k < guard; k++) {
			stamp(x, y);
			if (thick) {
				stamp(x - 1, y);
				stamp(x + 1, y);
				stamp(x, y - 1);
				stamp(x, y + 1);
			}
			if (x === xe && y === ye) return;
			const e2 = 2 * err;
			if (e2 > -dy && e2 < dx) {
				stamp(x + sx, y);
				stamp(x, y + sy);
			}
			if (e2 > -dy) {
				err -= dy;
				x += sx;
			}
			if (e2 < dx) {
				err += dx;
				y += sy;
			}
		}
	}
	plot(i, j, id, thick) {
		this.stamp(i, j, id);
		if (!thick) return;
		this.stamp(i - 1, j, id);
		this.stamp(i + 1, j, id);
		this.stamp(i, j - 1, id);
		this.stamp(i, j + 1, id);
	}
	stamp(i, j, id) {
		const S = this.size;
		if (i < 0 || j < 0 || i >= S || j >= S) return;
		const k = j * S + i;
		this.mask[k] = 1;
		if (id > 0) this.wallId[k] = id;
	}
	flood(wedges, radius, strokes) {
		const S = this.size;
		const N = S * S;
		const rim2 = radius * .972 * (radius * .972);
		const kept = [];
		let pcursor = 0;
		const qq = this.qq;
		const mask = this.mask;
		const wallId = this.wallId;
		const pix = this.pix;
		const axis = this.axis;
		let vein = 0;
		const walk = (k, qh) => {
			const m = mask[k];
			if (m === 1) {
				const id = wallId[k] ?? 0;
				if (id > 0 && vein === 0) vein = id;
				return qh;
			}
			if (m !== 0) return qh;
			mask[k] = 3;
			qq[qh] = k;
			return qh + 1;
		};
		for (let start = 0; start < N; start++) {
			if (mask[start] !== 0) continue;
			let qh = 1;
			let qt = 0;
			qq[0] = start;
			mask[start] = 3;
			let area = 0;
			let sx = 0;
			let sy = 0;
			vein = 0;
			let sky = false;
			const pixStart = pcursor;
			let recording = true;
			while (qt < qh) {
				const k = qq[qt++] ?? 0;
				const row = k / S | 0;
				const col = k - row * S;
				area++;
				const wx = axis[col] ?? 0;
				const wy = axis[row] ?? 0;
				sx += wx;
				sy += wy;
				if (!wedges && wx * wx + wy * wy >= rim2) {
					sky = true;
					if (recording) {
						recording = false;
						pcursor = pixStart;
					}
				} else if (recording) pix[pcursor++] = k;
				if (col > 0) qh = walk(k - 1, qh);
				if (col + 1 < S) qh = walk(k + 1, qh);
				if (row > 0) qh = walk(k - S, qh);
				if (row + 1 < S) qh = walk(k + S, qh);
			}
			if (sky || area < MIN_AREA) {
				pcursor = pixStart;
				continue;
			}
			kept.push({
				start: pixStart,
				end: pcursor,
				area,
				sx,
				sy,
				vein
			});
		}
		if (kept.length > MAX_ROOMS) {
			kept.sort((a, b) => b.area - a.area);
			kept.length = MAX_ROOMS;
		}
		const rooms = [];
		for (let i = 0; i < kept.length; i++) {
			const room = kept[i];
			if (!room) continue;
			const id = i + 1;
			for (let p = room.start; p < room.end; p++) this.labels[pix[p] ?? 0] = id;
			const cx = room.sx / room.area;
			const cy = room.sy / room.area;
			let veinX = cx;
			let veinY = cy;
			if (room.vein > 0) {
				const stroke = strokes[room.vein - 1];
				if (stroke && stroke.len > 0) {
					const m = Math.max(0, (stroke.len >> 1) - 1);
					veinX = stroke.xs[m] ?? cx;
					veinY = stroke.ys[m] ?? cy;
				}
			}
			rooms.push({
				cx,
				cy,
				area: room.area,
				veinX,
				veinY,
				seed: (room.vein * 1.7 + room.area * .013) % 19
			});
		}
		return rooms;
	}
};
function clipBox(x0, y0, x1, y1, min, max) {
	let t0 = 0;
	let t1 = 1;
	const dx = x1 - x0;
	const dy = y1 - y0;
	const p = [
		-dx,
		dx,
		-dy,
		dy
	];
	const q = [
		x0 - min,
		max - x0,
		y0 - min,
		max - y0
	];
	for (let i = 0; i < 4; i++) {
		const pi = p[i] ?? 0;
		const qi = q[i] ?? 0;
		if (pi === 0) {
			if (qi < 0) return null;
			continue;
		}
		const t = qi / pi;
		if (pi < 0) {
			if (t > t1) return null;
			if (t > t0) t0 = t;
		} else {
			if (t < t0) return null;
			if (t < t1) t1 = t;
		}
	}
	if (t1 < t0) return null;
	return [
		x0 + t0 * dx,
		y0 + t0 * dy,
		x0 + t1 * dx,
		y0 + t1 * dy
	];
}
function fold(x, y, n, mirrors) {
	const r = Math.hypot(x, y);
	let ang = Math.atan2(y, x);
	if (ang < 0) ang += Math.PI * 2;
	const slice = Math.PI * 2 / Math.max(1, n);
	let sector = Math.floor(ang / slice);
	if (sector < 0) sector = 0;
	if (sector >= n) sector = n - 1;
	let local = ang - sector * slice;
	if (mirrors && local > slice * .5) local = slice - local;
	return {
		x: Math.cos(local) * r,
		y: Math.sin(local) * r,
		sector,
		r
	};
}
function hashCell(x, y, radius) {
	const g = Math.max(4, radius * .09);
	const ix = Math.round(x / g);
	const iy = Math.round(y / g);
	let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263);
	h = Math.imul(h ^ h >>> 13, 1274126177);
	return (h >>> 0) % 6;
}
function sectorOf(x, y, n) {
	let ang = Math.atan2(y, x);
	if (ang < 0) ang += Math.PI * 2;
	const sector = Math.floor(ang / (Math.PI * 2 / Math.max(1, n)));
	if (sector < 0) return 0;
	if (sector >= n) return n - 1;
	return sector;
}
var paintLut = /* @__PURE__ */ new Float32Array(264);
function paintFill(map, out, opts) {
	out.fill(0);
	const rooms = map.rooms;
	if (rooms.length === 0) return;
	const recipe = opts.recipe === "tide" && opts.reduced ? "wash" : opts.recipe;
	const well = recipe === "well";
	const pixWorld = 2 * map.radius / map.size;
	const need = (rooms.length + 1) * 8;
	if (paintLut.length < need) paintLut = new Float32Array(need);
	const lut = paintLut;
	for (let i = 0; i < rooms.length; i++) {
		const room = rooms[i];
		if (!room) continue;
		const base = recipe === "vein" ? opts.sample(room.veinX, room.veinY) : recipe === "cloisonne" ? opts.sample(fold(room.cx, room.cy, map.n, map.mirrors).x, fold(room.cx, room.cy, map.n, map.mirrors).y) : opts.sample(room.cx, room.cy);
		let h = base.h;
		let s = base.s;
		let l = Math.min(70, base.l);
		let a = .24;
		if (recipe === "vein") a = .26;
		if (recipe === "tide") {
			const act = Math.max(0, Math.min(1.2, opts.activity(room.seed)));
			a = Math.min(ALPHA_CAP, .26 * Math.min(1, act));
		}
		if (recipe === "cloisonne") {
			const folded = fold(room.cx, room.cy, map.n, map.mirrors);
			h = (sectorOf(room.cx, room.cy, map.n) * (360 / map.n) + hashCell(folded.x, folded.y, map.radius) * 16 + Math.round(base.h / 36) * 6) % 360;
			s = Math.min(86, Math.max(48, base.s));
			l = 56;
			a = .26;
		}
		if (recipe === "well") a = ALPHA_CAP;
		a = Math.min(ALPHA_CAP, Math.max(0, a));
		const [r, g, b] = hslToRgb$1(h, s, l);
		const o = (i + 1) * 8;
		lut[o] = r;
		lut[o + 1] = g;
		lut[o + 2] = b;
		lut[o + 3] = a;
		lut[o + 4] = room.cx;
		lut[o + 5] = room.cy;
		const roomR = Math.max(4, Math.sqrt(room.area / Math.PI) * pixWorld);
		lut[o + 6] = 1 / (roomR * roomR);
		lut[o + 7] = well ? 1 : 0;
	}
	const labels = map.labels;
	const S = map.size;
	const radius = map.radius;
	const n = S * S;
	for (let k = 0; k < n; k++) {
		const id = labels[k] ?? 0;
		if (id === 0) continue;
		const o = id * 8;
		let a = lut[o + 3] ?? 0;
		let shade = 1;
		if ((lut[o + 7] ?? 0) > 0) {
			const col = k - (k / S | 0) * S;
			const row = k / S | 0;
			const wx = ((col + .5) / S - .5) * 2 * radius;
			const wy = ((row + .5) / S - .5) * 2 * radius;
			const dx = wx - (lut[o + 4] ?? 0);
			const dy = wy - (lut[o + 5] ?? 0);
			const inv = lut[o + 6] ?? 1;
			const t = Math.min(1, (dx * dx + dy * dy) * inv);
			a = Math.min(ALPHA_CAP, ALPHA_CAP * (1 - .62 * t));
			shade = 1 - .22 * t;
		}
		if (a < .004) continue;
		const p = k * 4;
		out[p] = (lut[o] ?? 0) * shade * 255;
		out[p + 1] = (lut[o + 1] ?? 0) * shade * 255;
		out[p + 2] = (lut[o + 2] ?? 0) * shade * 255;
		out[p + 3] = a * 255;
	}
}
function hslToRgb(h, s, l, out) {
	const hh = (h % 360 + 360) % 360;
	const ss = s / 100;
	const ll = l / 100;
	const a = ss * Math.min(ll, 1 - ll);
	const f = (n) => {
		const k = (n + hh / 30) % 12;
		return ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	};
	const r = f(0);
	const g = f(8);
	const b = f(4);
	if (out) {
		out[0] = r;
		out[1] = g;
		out[2] = b;
		return out;
	}
	return [
		r,
		g,
		b
	];
}
var ACT$1 = {
	steady: 0,
	pulse: 1,
	blink: 2,
	chase: 3,
	firefly: 4,
	strobe: 5
};
var STROKE_VS = `#version 300 es
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
var STROKE_FS = `#version 300 es
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
var POINT_VS = `#version 300 es
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
var POINT_FS = `#version 300 es
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
var OVERLAY_VS = `#version 300 es
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;
var OVERLAY_FS = `#version 300 es
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
var FILL_VS = `#version 300 es
layout(location=0) in vec2 a_pos;
uniform vec2 u_view;
uniform vec2 u_origin;
uniform float u_spin;
uniform float u_radius;
out vec2 v_uv;
out vec2 v_local;
void main() {
  vec2 p = a_pos * u_radius;
  float ca = cos(u_spin);
  float sa = sin(u_spin);
  vec2 r = vec2(p.x * ca - p.y * sa, p.x * sa + p.y * ca);
  v_local = r;
  vec2 s = vec2(r.x + u_origin.x, r.y + u_origin.y);
  gl_Position = vec4(s.x / u_view.x * 2.0 - 1.0, 1.0 - s.y / u_view.y * 2.0, 0.0, 1.0);
  v_uv = a_pos * 0.5 + 0.5;
}
`;
var FILL_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
in vec2 v_local;
uniform sampler2D u_tex;
uniform float u_radius;
out vec4 frag;
void main() {
  if (length(v_local) > u_radius) discard;
  vec4 c = texture(u_tex, v_uv);
  if (c.a < 0.004) discard;
  frag = c;
}
`;
function compile(gl, vsSrc, fsSrc) {
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
function loc(gl, prog, name) {
	return gl.getUniformLocation(prog, name);
}
function webgl2Available() {
	try {
		const gl = document.createElement("canvas").getContext("webgl2");
		if (!gl) return false;
		const p = compile(gl, STROKE_VS, STROKE_FS);
		const q = compile(gl, POINT_VS, POINT_FS);
		const o = compile(gl, OVERLAY_VS, OVERLAY_FS);
		const f = compile(gl, FILL_VS, FILL_FS);
		const ok = Boolean(p && q && o && f);
		if (p) gl.deleteProgram(p);
		if (q) gl.deleteProgram(q);
		if (o) gl.deleteProgram(o);
		if (f) gl.deleteProgram(f);
		return ok;
	} catch {
		return false;
	}
}
var KaleidoGL = class KaleidoGL {
	gl;
	strokeProg;
	pointProg;
	overlayProg;
	fillProg;
	fillTex;
	fillSize = 0;
	fillRev = -1;
	strokeVao;
	strokeBuf;
	pointVao;
	pointBuf;
	overlayVao;
	packed = /* @__PURE__ */ new Float32Array(864);
	points = /* @__PURE__ */ new Float32Array(3584);
	trailXs = /* @__PURE__ */ new Float32Array(3);
	trailYs = /* @__PURE__ */ new Float32Array(3);
	constructor(gl, programs) {
		this.gl = gl;
		this.strokeProg = programs[0];
		this.pointProg = programs[1];
		this.overlayProg = programs[2];
		this.fillProg = programs[3];
		const strokeVao = gl.createVertexArray();
		const strokeBuf = gl.createBuffer();
		const pointVao = gl.createVertexArray();
		const pointBuf = gl.createBuffer();
		const overlayVao = gl.createVertexArray();
		const fillTex = gl.createTexture();
		if (!strokeVao || !strokeBuf || !pointVao || !pointBuf || !overlayVao || !fillTex) throw new Error("WebGL buffers failed");
		this.fillTex = fillTex;
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
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			1,
			-1,
			-1,
			1,
			1,
			1
		]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		gl.bindVertexArray(null);
		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
	static attach(canvas) {
		if (!webgl2Available()) return null;
		let gl = null;
		try {
			gl = canvas.getContext("webgl2", {
				alpha: false,
				antialias: true,
				preserveDrawingBuffer: true,
				colorSpace: "srgb"
			});
		} catch {
			gl = canvas.getContext("webgl2", {
				alpha: false,
				antialias: true,
				preserveDrawingBuffer: true
			});
		}
		if (!gl) return null;
		const stroke = compile(gl, STROKE_VS, STROKE_FS);
		const point = compile(gl, POINT_VS, POINT_FS);
		const overlay = compile(gl, OVERLAY_VS, OVERLAY_FS);
		const fill = compile(gl, FILL_VS, FILL_FS);
		if (!stroke || !point || !overlay || !fill) return null;
		try {
			return new KaleidoGL(gl, [
				stroke,
				point,
				overlay,
				fill
			]);
		} catch {
			return null;
		}
	}
	draw(frame) {
		const gl = this.gl;
		const { width: w, height: h } = frame;
		if (w < 2 || h < 2) return;
		gl.viewport(0, 0, w, h);
		gl.clearColor(8 / 255, 8 / 255, 11 / 255, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		const spin = frame.spin;
		const origin = [frame.cx, frame.cy];
		const view = [w, h];
		const activity = ACT$1[frame.activity] ?? 1;
		const instances = frame.n * (frame.mirrors ? 2 : 1);
		this.drawFill(frame, view, origin, spin);
		this.drawIcons(frame, view, origin, spin);
		this.drawStrokes(frame, view, origin, spin, activity, instances);
		this.drawOverlay(frame, view, origin);
	}
	drawFill(frame, view, origin, spin) {
		const fill = frame.fill;
		if (!fill || fill.size < 2) return;
		const gl = this.gl;
		gl.bindTexture(gl.TEXTURE_2D, this.fillTex);
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
		if (this.fillSize !== fill.size) {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fill.size, fill.size, 0, gl.RGBA, gl.UNSIGNED_BYTE, fill.rgba);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			this.fillSize = fill.size;
			this.fillRev = fill.rev;
		} else if (this.fillRev !== fill.rev) {
			gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, fill.size, fill.size, gl.RGBA, gl.UNSIGNED_BYTE, fill.rgba);
			this.fillRev = fill.rev;
		}
		const prog = this.fillProg;
		gl.useProgram(prog);
		gl.bindVertexArray(this.overlayVao);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.fillTex);
		gl.uniform1i(loc(gl, prog, "u_tex"), 0);
		gl.uniform2f(loc(gl, prog, "u_view"), view[0], view[1]);
		gl.uniform2f(loc(gl, prog, "u_origin"), origin[0], origin[1]);
		gl.uniform1f(loc(gl, prog, "u_spin"), spin);
		gl.uniform1f(loc(gl, prog, "u_radius"), frame.radius);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
	drawStrokes(frame, view, origin, spin, activity, instances) {
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
			if (s.len < 2 || s.fade < .02) continue;
			const verts = this.packStroke(s);
			if (verts < 4) continue;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.strokeBuf);
			gl.bufferData(gl.ARRAY_BUFFER, this.packed.subarray(0, verts * 6), gl.STREAM_DRAW);
			gl.uniform1f(loc(gl, prog, "u_seed"), s.seed);
			gl.uniform3f(loc(gl, prog, "u_rgb"), s.rgb[0], s.rgb[1], s.rgb[2]);
			const half = Math.max(.45, s.width * .22 * frame.dpr * .5);
			gl.uniform1f(loc(gl, prog, "u_half"), half * 2.1);
			gl.uniform1f(loc(gl, prog, "u_alpha"), .28 * s.fade);
			gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, verts, instances);
			gl.uniform1f(loc(gl, prog, "u_half"), half);
			gl.uniform1f(loc(gl, prog, "u_alpha"), .92 * s.fade);
			gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, verts, instances);
		}
	}
	packStroke(s) {
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
	drawIcons(frame, view, origin, spin) {
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
		const trail = {
			xs: this.trailXs,
			ys: this.trailYs,
			len: 3,
			width: 1.4,
			seed: 0,
			fade: .55,
			rgb: [
				1,
				1,
				1
			]
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
		gl.uniform1f(loc(gl, stroke, "u_half"), Math.max(.4, .35 * frame.dpr));
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
			gl.uniform1f(loc(gl, stroke, "u_alpha"), .45 * ic.alpha);
			gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, verts, 1);
		}
	}
	drawOverlay(frame, view, origin) {
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
};
function pickMime() {
	for (const type of [
		"video/webm;codecs=vp9",
		"video/webm;codecs=vp8",
		"video/webm",
		"video/mp4"
	]) if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) return type;
	return "";
}
function canRecord() {
	if (typeof window === "undefined") return false;
	if (typeof MediaRecorder === "undefined") return false;
	return typeof HTMLCanvasElement.prototype.captureStream === "function" && pickMime() !== "";
}
function clipExtension() {
	return pickMime().includes("mp4") ? "mp4" : "webm";
}
function clipFilename(mime, when = /* @__PURE__ */ new Date()) {
	return `kaleido-clip-${when.toISOString().replace(/[:.]/g, "-").slice(0, 19)}.${mime.includes("mp4") ? "mp4" : "webm"}`;
}
var ClipRecorder = class {
	recorder = null;
	chunks = [];
	raf = 0;
	startedAt = 0;
	maxMs = 15e3;
	handlers = {};
	mime = "";
	stream = null;
	settled = false;
	get active() {
		return this.recorder !== null && this.recorder.state === "recording";
	}
	start(canvas, handlers = {}, seconds = 15) {
		if (!canRecord()) {
			handlers.onStop?.(null);
			return false;
		}
		if (this.active) this.stop();
		const capture = canvas.captureStream(30);
		this.stream = capture;
		this.mime = pickMime();
		this.chunks = [];
		this.handlers = handlers;
		this.maxMs = seconds * 1e3;
		this.startedAt = performance.now();
		this.settled = false;
		let recorder;
		try {
			recorder = new MediaRecorder(capture, {
				mimeType: this.mime,
				videoBitsPerSecond: 5e6
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
			const blob = this.chunks.length > 0 ? new Blob(this.chunks, { type: this.mime || "video/webm" }) : null;
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
		} catch {}
		try {
			recorder.stop();
		} catch {
			this.finish(null);
		}
	}
	tick = () => {
		if (!this.active) return;
		const elapsed = performance.now() - this.startedAt;
		this.handlers.onTick?.(elapsed / 1e3, this.maxMs / 1e3);
		if (elapsed >= this.maxMs) {
			this.stop();
			return;
		}
		this.raf = requestAnimationFrame(this.tick);
	};
	finish(blob) {
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
	cleanupStream() {
		this.stream?.getTracks().forEach((track) => track.stop());
		this.stream = null;
	}
};
function savePicker() {
	if (typeof window === "undefined" || window.parent !== window) return null;
	const picker = window.showSaveFilePicker;
	return typeof picker === "function" ? picker : null;
}
function pickerTypes(ext) {
	return {
		description: ext === "mp4" ? "MP4 video" : ext === "gif" ? "GIF" : ext === "png" ? "PNG image" : "WebM video",
		accept: { [ext === "mp4" ? "video/mp4" : ext === "gif" ? "image/gif" : ext === "png" ? "image/png" : "video/webm"]: [`.${ext}`] }
	};
}
/** Ask where a file should go. `later` if this browser cannot show a save dialog. */
async function chooseSaveFile(filename, ext) {
	const picker = savePicker();
	if (!picker) return "later";
	const spec = pickerTypes(ext);
	try {
		return await picker({
			suggestedName: filename,
			types: [{
				description: spec.description,
				accept: spec.accept
			}]
		});
	} catch (err) {
		if (isAbort(err)) return "cancel";
		return "later";
	}
}
function chooseClipFile() {
	const ext = clipExtension();
	return chooseSaveFile(`kaleido-clip.${ext}`, ext);
}
async function writeClipFile(handle, blob) {
	const writable = await handle.createWritable();
	await writable.write(blob);
	await writable.close();
}
function isAbort(err) {
	return err instanceof DOMException && err.name === "AbortError";
}
/**
* Save a finished clip from a fresh click.
* Share sheet on a phone, a save dialog on a desktop tab, otherwise a file download.
* AbortError means the person dismissed that dialog — the clip is still held.
*/
async function saveClip(blob, filename) {
	const file = new File([blob], filename, { type: blob.type || "video/webm" });
	const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
	const nav = typeof navigator !== "undefined" ? navigator : null;
	if (coarse && nav && typeof nav.share === "function" && nav.canShare?.({ files: [file] })) try {
		await nav.share({
			files: [file],
			title: "Kaleido"
		});
		return "shared";
	} catch (err) {
		if (isAbort(err)) throw err;
	}
	const picker = savePicker();
	if (picker) {
		const spec = pickerTypes(filename.endsWith(".gif") ? "gif" : filename.endsWith(".png") ? "png" : filename.endsWith(".mp4") ? "mp4" : "webm");
		try {
			await writeClipFile(await picker({
				suggestedName: filename,
				types: [{
					description: spec.description,
					accept: spec.accept
				}]
			}), blob);
			return "saved";
		} catch (err) {
			if (isAbort(err)) throw err;
		}
	}
	downloadBlob(blob, filename);
	return "downloaded";
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 6e4);
}
function stampedName(prefix, ext) {
	return `${prefix}-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19)}${ext.startsWith(".") ? ext : `.${ext}`}`;
}
/** Best video type this browser can actually record. */
function videoExportMime() {
	const types = [
		"video/mp4;codecs=avc1",
		"video/mp4",
		"video/webm;codecs=vp9",
		"video/webm"
	];
	if (typeof MediaRecorder === "undefined") return {
		mime: "video/webm",
		ext: "webm"
	};
	for (const mime of types) try {
		if (MediaRecorder.isTypeSupported(mime)) return {
			mime,
			ext: mime.includes("mp4") ? "mp4" : "webm"
		};
	} catch {}
	return {
		mime: "video/webm",
		ext: "webm"
	};
}
/** Record the live canvas for a few seconds. Independent of the main clip recorder. */
function recordCanvas(canvas, seconds, mime) {
	const capture = canvas.captureStream;
	if (typeof capture !== "function" || typeof MediaRecorder === "undefined") return Promise.reject(/* @__PURE__ */ new Error("Recording isn’t available"));
	const stream = capture.call(canvas, 30);
	return new Promise((resolve, reject) => {
		let settled = false;
		const finish = (blob, err) => {
			if (settled) return;
			settled = true;
			stream.getTracks().forEach((track) => track.stop());
			if (blob && blob.size > 0) resolve(blob);
			else reject(err ?? /* @__PURE__ */ new Error("Empty video"));
		};
		let recorder;
		try {
			recorder = new MediaRecorder(stream, {
				mimeType: mime,
				videoBitsPerSecond: 4e6
			});
		} catch (err) {
			finish(null, err instanceof Error ? err : /* @__PURE__ */ new Error("Could not record"));
			return;
		}
		const chunks = [];
		recorder.ondataavailable = (event) => {
			if (event.data && event.data.size > 0) chunks.push(event.data);
		};
		recorder.onerror = () => finish(null, /* @__PURE__ */ new Error("Recording failed"));
		recorder.onstop = () => {
			const blob = chunks.length > 0 ? new Blob(chunks, { type: mime || "video/webm" }) : null;
			finish(blob, blob ? void 0 : /* @__PURE__ */ new Error("Empty video"));
		};
		try {
			recorder.start(200);
		} catch (err) {
			finish(null, err instanceof Error ? err : /* @__PURE__ */ new Error("Recording failed"));
			return;
		}
		window.setTimeout(() => {
			try {
				if (recorder.state === "recording") {
					try {
						recorder.requestData();
					} catch {}
					recorder.stop();
				}
			} catch (err) {
				finish(null, err instanceof Error ? err : /* @__PURE__ */ new Error("Recording failed"));
			}
		}, Math.max(250, seconds * 1e3));
	});
}
var BG = "rgb(8, 8, 11)";
var TAU = Math.PI * 2;
var ARROWS = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown"
]);
var WASD = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyD",
	"KeyW",
	"KeyS"
]);
var MAX_PTS = 72;
var FIELD_N = 24;
var COLOR = {
	h: 0,
	s: 0,
	l: 0,
	a: 1
};
var ACT = {
	a: 1,
	h: 0,
	w: 1
};
function colorAt(mode, motion, hue, time, x, y, radius) {
	const u = Math.min(1, Math.hypot(x, y) / Math.max(1, radius));
	const ang = Math.atan2(y, x);
	const t = motion === "hold" ? 0 : time;
	const off = hue;
	COLOR.a = 1;
	switch (mode) {
		case "spectrum":
			COLOR.h = (t * 46 + u * 150 + off) % 360;
			COLOR.s = 84;
			COLOR.l = 58;
			break;
		case "prism":
			COLOR.h = ((ang * 180 / Math.PI + 360 + t * 10 + off) % 360 + 360) % 360;
			COLOR.s = 80;
			COLOR.l = 60;
			break;
		case "aurora":
			COLOR.h = (150 + Math.sin(t * .65 + u * 5) * 78 + off + 360) % 360;
			COLOR.s = 74;
			COLOR.l = 56;
			break;
		case "ember":
			COLOR.h = (16 + Math.sin(t * 1.05 + u * 6) * 16 + off + 360) % 360;
			COLOR.s = 90;
			COLOR.l = 56;
			break;
		case "ice":
			COLOR.h = (196 + Math.sin(t * .7 + u * 4) * 24 + off + 360) % 360;
			COLOR.s = 70;
			COLOR.l = 62;
			break;
		case "pearl":
			COLOR.h = (36 + Math.sin(t * .5) * 10 + off + 360) % 360;
			COLOR.s = 16;
			COLOR.l = 78;
	}
	return COLOR;
}
function activityAt(kind, time, along, seed, boost) {
	const lift = 1 + .55 * boost;
	switch (kind) {
		case "steady":
			ACT.a = (.78 + .1 * Math.sin(time * 1.6 + seed)) * lift;
			ACT.h = 0;
			ACT.w = 1;
			break;
		case "pulse": {
			const wave = .5 + .5 * Math.sin(time * 2.8 + seed);
			ACT.a = (.22 + .78 * wave) * lift;
			ACT.h = 0;
			ACT.w = .82 + .28 * wave + .2 * boost;
			break;
		}
		case "blink": {
			const beat = (time * 2.15 + seed * .15) % 1.15;
			const on = beat < .62 || beat > .74 && beat < .88;
			ACT.a = (on ? .95 : .05) * lift;
			ACT.h = 0;
			ACT.w = on ? 1 : .7;
			break;
		}
		case "chase": {
			const head = (time * .62 + seed) % 1;
			const d = Math.abs(along - head);
			const prox = Math.min(d, 1 - d);
			const hot = prox < .1;
			ACT.a = (hot ? 1 : .1 + .16 * (1 - prox)) * lift;
			ACT.h = along * 50;
			ACT.w = hot ? 1.45 : .7;
			break;
		}
		case "firefly": {
			const tw = Math.sin(time * 6.8 + along * 22 + seed * 11);
			const lit = tw > .42;
			ACT.a = (lit ? .2 + (tw - .42) * 1.6 : .08) * lift;
			ACT.h = lit ? 24 : 0;
			ACT.w = lit ? 1.25 : .72;
			break;
		}
		case "strobe": {
			const on = Math.sin(time * 16 + seed * 4) > .15;
			ACT.a = (on ? 1 : .04) * lift;
			ACT.h = on ? 10 : 0;
			ACT.w = on ? 1.12 : .75;
			break;
		}
	}
	return ACT;
}
function prefersReducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function pointerPressure(e) {
	if (e.pointerType === "pen" && e.pressure > 0) return e.pressure;
	if (e.pointerType === "touch" && e.pressure > 0 && e.pressure !== .5) return e.pressure;
	return .62;
}
function hsla(c, a) {
	return `hsla(${(c.h % 360 + 360) % 360}, ${c.s}%, ${c.l}%, ${Math.max(0, Math.min(1, a))})`;
}
function isCoarse() {
	return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}
var KaleidoEngine = class {
	display;
	root;
	dctx = null;
	gl = null;
	dpr = 1;
	width = 0;
	height = 0;
	cx = 0;
	cy = 0;
	radius = 0;
	bottomInset = 0;
	topInset = 0;
	rimPad = 0;
	settings;
	inkTime = 0;
	lightTime = 0;
	aliveTime = 0;
	spinAngle = 0;
	raf = 0;
	lastTs = 0;
	running = false;
	destroyed = false;
	cos = /* @__PURE__ */ new Float64Array(8);
	sin = /* @__PURE__ */ new Float64Array(8);
	brushes = /* @__PURE__ */ new Map();
	echoes = /* @__PURE__ */ new Map();
	fieldEcho = /* @__PURE__ */ new Map();
	field = /* @__PURE__ */ new Float32Array(576);
	keys = /* @__PURE__ */ new Set();
	keyX = 0;
	keyY = 0;
	keyInited = false;
	idleT = 0;
	idleR = 0;
	idleD = 0;
	idleRatio = 0;
	idleA = 0;
	lastIdleX = 0;
	lastIdleY = 0;
	hasIdle = false;
	resumeIdleAt = 0;
	reduced = false;
	observers = null;
	pin = null;
	pinAcc = 0;
	rightHeld = false;
	altHeld = false;
	lastPX = 0;
	lastPY = 0;
	flash = 0;
	downs = /* @__PURE__ */ new Map();
	layoutCb = null;
	pinCb = null;
	strokes = [];
	live = /* @__PURE__ */ new Map();
	menuOpen = false;
	icons = [];
	iconK = 0;
	stencil = null;
	fillMap = null;
	fillSig = "";
	fillPaintKey = "";
	fillRGBA = null;
	fillCanvas = null;
	fillCtx = null;
	fillImage = null;
	fillRooms = 0;
	fillRev = 0;
	fillBlitRev = -1;
	iconPool = [];
	strokePool = [];
	constructor(display, root, settings) {
		this.display = display;
		this.root = root;
		this.gl = KaleidoGL.attach(display);
		if (!this.gl) {
			const dctx = display.getContext("2d", {
				alpha: false,
				colorSpace: "srgb"
			});
			if (!dctx) throw new Error("Canvas 2D is not available");
			this.dctx = dctx;
		}
		this.settings = { ...settings };
		this.rebuildTrig();
		this.reseedIdle();
		this.rebuildField(0);
		this.reduced = prefersReducedMotion();
		this.expose();
	}
	start() {
		if (this.running) return;
		this.running = true;
		this.layout();
		this.bind();
		this.burst(true);
		this.lastTs = performance.now();
		this.raf = requestAnimationFrame(this.frame);
	}
	destroy() {
		this.destroyed = true;
		this.running = false;
		cancelAnimationFrame(this.raf);
		this.unbind();
		this.observers?.disconnect();
		this.observers = null;
	}
	setSettings(next) {
		const segsChanged = next.segments !== this.settings.segments;
		const iconChanged = next.icon !== this.settings.icon;
		const froze = next.frozen && !this.settings.frozen;
		this.settings = { ...next };
		if (segsChanged) this.rebuildTrig();
		if (next.frozen) this.brushes.clear();
		if (froze) this.pulse();
		if ((iconChanged || segsChanged) && next.icon) this.seedIcons(next.icon, next.segments);
		if (!next.icon) this.icons = [];
		this.present();
	}
	setMenuOpen(open) {
		this.menuOpen = open;
		if (open) for (const code of ARROWS) this.keys.delete(code);
	}
	setBottomInset(cssPx) {
		if (Math.abs(cssPx - this.bottomInset) < .5) return;
		this.bottomInset = cssPx;
		this.layout(true);
	}
	setRimPad(cssPx) {
		if (Math.abs(cssPx - this.rimPad) < .5) return;
		this.rimPad = cssPx;
		this.layout(true);
	}
	setTopInset(cssPx) {
		if (Math.abs(cssPx - this.topInset) < .5) return;
		this.topInset = cssPx;
		this.layout(true);
	}
	setLayoutHandler(cb) {
		this.layoutCb = cb;
		if (cb) cb(this.getLayout());
	}
	setPinHandler(cb) {
		this.pinCb = cb;
	}
	getLayout() {
		const rect = this.display.getBoundingClientRect();
		const sx = rect.width / Math.max(1, this.width);
		const sy = rect.height / Math.max(1, this.height);
		return {
			cx: this.cx * sx,
			cy: this.cy * sy,
			radius: this.radius * sx
		};
	}
	canvas() {
		return this.display;
	}
	/** Lens center and radius in canvas pixels, for cropping an export. */
	lensPixels() {
		return {
			cx: this.cx,
			cy: this.cy,
			radius: this.radius
		};
	}
	expose() {
		const el = this.display;
		el.__kaleido = { clocks: () => ({
			ink: this.inkTime,
			light: this.lightTime,
			spin: this.spinAngle,
			k: this.iconK,
			alive: this.aliveTime,
			frozen: this.settings.frozen,
			persist: this.settings.persist,
			path: this.settings.pathMode,
			n: this.settings.segments,
			kind: this.settings.iconKind,
			strokeN: this.strokes.length,
			renderer: this.gl ? "gl" : "2d",
			fill: this.settings.fillMode,
			recipe: this.settings.fillRecipe,
			rooms: this.fillRooms,
			layout: this.getLayout()
		}) };
	}
	pinned() {
		return this.pin !== null || this.rightHeld || this.altHeld;
	}
	pinAt(x, y) {
		const px = x ?? this.lastPX;
		const py = y ?? this.lastPY;
		this.pin = {
			x: px,
			y: py
		};
		this.pinCb?.(true);
	}
	unpin() {
		this.pin = null;
		this.rightHeld = false;
		this.releaseBrush("pin");
		this.pinCb?.(false);
	}
	togglePin() {
		if (this.pin || this.rightHeld || this.altHeld) {
			this.unpin();
			return false;
		}
		this.pinAt();
		return true;
	}
	pulse() {
		this.flash = 1;
	}
	clear() {
		this.strokes = [];
		this.live.clear();
		this.icons = [];
		this.hasIdle = false;
		this.brushes.clear();
		this.echoes.clear();
		this.fieldEcho.clear();
		this.unpin();
		this.resumeIdleAt = Number.POSITIVE_INFINITY;
		this.present();
	}
	burst(seed = false) {
		this.reseedIdle();
		if (this.settings.icon) {
			this.seedIcons(this.settings.icon, this.settings.segments);
			this.resumeIdleAt = this.inkTime;
			this.present();
			return;
		}
		const steps = seed ? 220 : 160;
		const t0 = Math.random() * TAU;
		const dt = .05 + Math.random() * .014;
		const s = this.allocStroke(false, this.settings.brush * .9);
		let prevX = 0;
		let prevY = 0;
		for (let i = 0; i < steps; i++) {
			const t = t0 + i * dt;
			const p = this.hypotrochoid(t);
			if (i === 0) this.pushPoint(s, p.x, p.y);
			else this.strokeTo(s, prevX, prevY, p.x, p.y);
			prevX = p.x;
			prevY = p.y;
		}
		this.lastIdleX = prevX;
		this.lastIdleY = prevY;
		this.hasIdle = true;
		this.idleT = t0 + steps * dt;
		this.resumeIdleAt = this.inkTime;
		this.present();
	}
	exportPng() {
		return this.exportBlob().then((blob) => {
			downloadBlob(blob, `kaleido-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19)}.png`);
		});
	}
	exportBlob() {
		return new Promise((resolve, reject) => {
			this.present();
			this.display.toBlob((blob) => {
				if (!blob) {
					reject(/* @__PURE__ */ new Error("Could not export image"));
					return;
				}
				resolve(blob);
			}, "image/png");
		});
	}
	async copyPng() {
		try {
			const blob = await this.exportBlob();
			if (!navigator.clipboard || typeof ClipboardItem === "undefined") return false;
			await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
			return true;
		} catch {
			return false;
		}
	}
	strokeCap() {
		return isCoarse() ? 40 : 64;
	}
	strokeWeight() {
		let w = 0;
		const parked = this.parkedGlobal();
		for (const s of this.strokes) w += parked || s.pinned ? 2 : 1;
		return w;
	}
	bind() {
		this.display.addEventListener("pointerdown", this.onPointerDown);
		this.display.addEventListener("pointermove", this.onPointerMove);
		this.display.addEventListener("pointerup", this.onPointerUp);
		this.display.addEventListener("pointercancel", this.onPointerUp);
		this.display.addEventListener("pointerleave", this.onPointerLeave);
		this.display.addEventListener("contextmenu", this.onContextMenu);
		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);
		window.addEventListener("blur", this.onBlur);
		document.addEventListener("visibilitychange", this.onVisibility);
		this.observers = new ResizeObserver(() => this.layout());
		this.observers.observe(this.root);
	}
	unbind() {
		this.display.removeEventListener("pointerdown", this.onPointerDown);
		this.display.removeEventListener("pointermove", this.onPointerMove);
		this.display.removeEventListener("pointerup", this.onPointerUp);
		this.display.removeEventListener("pointercancel", this.onPointerUp);
		this.display.removeEventListener("pointerleave", this.onPointerLeave);
		this.display.removeEventListener("contextmenu", this.onContextMenu);
		window.removeEventListener("keydown", this.onKeyDown);
		window.removeEventListener("keyup", this.onKeyUp);
		window.removeEventListener("blur", this.onBlur);
		document.removeEventListener("visibilitychange", this.onVisibility);
	}
	onContextMenu = (e) => {
		e.preventDefault();
	};
	onVisibility = () => {
		if (document.hidden) {
			cancelAnimationFrame(this.raf);
			this.lastTs = 0;
			this.keys.clear();
		} else if (this.running && !this.destroyed) {
			this.lastTs = performance.now();
			this.raf = requestAnimationFrame(this.frame);
		}
	};
	onBlur = () => {
		this.keys.clear();
		this.altHeld = false;
	};
	isSecondary(e) {
		if (e.button === 2) return true;
		if (this.rightHeld) return true;
		if (this.altHeld || e.altKey) return true;
		if (e.pointerType === "mouse" && (e.buttons & 2) !== 0) return true;
		return false;
	}
	onKeyDown = (e) => {
		if (e.code === "Space") e.preventDefault();
		if (e.key === "Alt") {
			this.altHeld = true;
			e.preventDefault();
			return;
		}
		if (e.shiftKey) return;
		const isArrow = ARROWS.has(e.code);
		const isWasd = WASD.has(e.code);
		if (!isArrow && !isWasd) return;
		if (isArrow && this.menuOpen) return;
		const tag = e.target?.tagName;
		if (tag === "INPUT" || tag === "TEXTAREA") return;
		e.preventDefault();
		this.keys.add(e.code);
		this.resumeIdleAt = Number.POSITIVE_INFINITY;
		if (!this.keyInited) {
			this.keyX = this.radius * .38;
			this.keyY = 0;
			this.keyInited = true;
		}
	};
	onKeyUp = (e) => {
		if (e.key === "Alt") {
			this.altHeld = false;
			const b = this.brushes.get("pin");
			if (b && !this.rightHeld) {
				this.pinAt(b.sx, b.sy);
				this.releaseBrush("pin");
			}
			return;
		}
		this.keys.delete(e.code);
		if (![...this.keys].some((code) => ARROWS.has(code) || WASD.has(code))) {
			const b = this.brushes.get("key");
			if (b) {
				this.pinAt(b.sx, b.sy);
				this.releaseBrush("key");
			}
		}
	};
	inDock(e) {
		const rect = this.display.getBoundingClientRect();
		const zone = Math.max(72, this.bottomInset);
		const inBottom = e.clientY > rect.bottom - zone;
		if (this.bottomInset > 120) return inBottom;
		const mid = rect.left + rect.width / 2;
		return inBottom && Math.abs(e.clientX - mid) < 52;
	}
	eventToLocal(e) {
		const rect = this.display.getBoundingClientRect();
		const scaleX = this.display.width / Math.max(1, rect.width);
		const scaleY = this.display.height / Math.max(1, rect.height);
		return {
			x: (e.clientX - rect.left) * scaleX - this.cx,
			y: (e.clientY - rect.top) * scaleY - this.cy
		};
	}
	pointerId(e) {
		return `p:${e.pointerId}`;
	}
	onPointerDown = (e) => {
		if (this.settings.frozen) return;
		if (this.inDock(e)) return;
		const p = this.eventToLocal(e);
		this.lastPX = p.x;
		this.lastPY = p.y;
		this.downs.set(e.pointerId, {
			x: p.x,
			y: p.y,
			t: performance.now()
		});
		if (this.isSecondary(e)) {
			try {
				this.display.setPointerCapture(e.pointerId);
			} catch {}
			this.rightHeld = e.button === 2 || (e.buttons & 2) !== 0;
			this.pin = null;
			this.armBrush("pin", p.x, p.y, pointerPressure(e));
			this.pinCb?.(true);
			this.resumeIdleAt = Number.POSITIVE_INFINITY;
			return;
		}
		if (e.button !== 0 && e.pointerType === "mouse") return;
		try {
			this.display.setPointerCapture(e.pointerId);
		} catch {}
		this.armBrush(this.pointerId(e), p.x, p.y, pointerPressure(e));
		this.resumeIdleAt = Number.POSITIVE_INFINITY;
	};
	onPointerMove = (e) => {
		if (this.settings.frozen) return;
		if (this.inDock(e)) return;
		const p = this.eventToLocal(e);
		this.lastPX = p.x;
		this.lastPY = p.y;
		const pressure = pointerPressure(e);
		if (this.isSecondary(e)) {
			const b = this.brushes.get("pin");
			if (!b) this.armBrush("pin", p.x, p.y, pressure);
			else {
				b.x = p.x;
				b.y = p.y;
				b.pressure = pressure;
			}
			this.resumeIdleAt = Number.POSITIVE_INFINITY;
			return;
		}
		if (e.pointerType === "mouse" && e.buttons !== 0 && (e.buttons & 1) === 0) return;
		if ((e.pointerType === "touch" || e.pointerType === "pen") && e.buttons === 0 && e.pressure === 0 && !this.brushes.has(this.pointerId(e))) return;
		const id = this.pointerId(e);
		if (!this.brushes.has(id)) this.armBrush(id, p.x, p.y, pressure);
		else {
			const b = this.brushes.get(id);
			if (b) {
				b.x = p.x;
				b.y = p.y;
				b.pressure = pressure;
			}
		}
		this.resumeIdleAt = Number.POSITIVE_INFINITY;
	};
	onPointerUp = (e) => {
		try {
			if (this.display.hasPointerCapture(e.pointerId)) this.display.releasePointerCapture(e.pointerId);
		} catch {}
		const down = this.downs.get(e.pointerId);
		this.downs.delete(e.pointerId);
		const p = this.eventToLocal(e);
		if (e.button === 2 || this.rightHeld || this.altHeld && e.button === 0 && down) {
			const b = this.brushes.get("pin");
			if (b) this.pinAt(b.sx, b.sy);
			this.releaseBrush("pin");
			this.rightHeld = false;
			return;
		}
		if (down && !this.settings.frozen) {
			const dt = performance.now() - down.t;
			const dist = Math.hypot(p.x - down.x, p.y - down.y);
			if (dt < 240 && dist < 14 * this.dpr) this.spark(p.x, p.y);
		}
		this.releaseBrush(this.pointerId(e));
	};
	onPointerLeave = (e) => {
		if (e.pointerType !== "mouse") return;
		if (this.rightHeld || this.altHeld) return;
		this.releaseBrush(this.pointerId(e));
	};
	spark(x, y) {
		const r = Math.max(6, this.settings.brush * this.dpr * 1.6);
		const s = this.allocStroke(false, this.settings.brush);
		for (let i = 0; i <= 18; i++) {
			const a = i / 18 * TAU;
			this.pushPoint(s, x + Math.cos(a) * r, y + Math.sin(a) * r);
		}
	}
	armBrush(id, x, y, pressure = .62) {
		this.brushes.set(id, {
			x,
			y,
			sx: x,
			sy: y,
			armed: false,
			pressure
		});
	}
	releaseBrush(id) {
		this.brushes.delete(id);
		this.echoes.delete(id);
		this.fieldEcho.delete(id);
		for (const key of [
			`${id}:main`,
			`${id}:twin`,
			`${id}:orbit`,
			`${id}:echo`,
			`${id}:field`
		]) this.live.delete(key);
	}
	rebuildTrig() {
		const n = this.settings.segments;
		this.cos = new Float64Array(n);
		this.sin = new Float64Array(n);
		const slice = TAU / n;
		for (let i = 0; i < n; i++) {
			this.cos[i] = Math.cos(i * slice);
			this.sin[i] = Math.sin(i * slice);
		}
	}
	reseedIdle() {
		const R = Math.max(80, this.radius * .64);
		const r = R / (this.settings.segments * .28 + 2.4);
		this.idleR = R;
		this.idleA = R - r;
		this.idleD = r * (1.15 + Math.random() * .9);
		this.idleRatio = this.idleA / Math.max(.001, r);
		this.idleT = Math.random() * TAU;
	}
	hypotrochoid(t) {
		const a = this.idleA || this.radius * .5;
		const d = this.idleD || a * .4;
		const ratio = this.idleRatio || 3;
		return {
			x: a * Math.cos(t) + d * Math.cos(ratio * t),
			y: a * Math.sin(t) - d * Math.sin(ratio * t)
		};
	}
	rebuildField(t) {
		const bx = this.lastPX / Math.max(1, this.radius);
		const by = this.lastPY / Math.max(1, this.radius);
		for (let j = 0; j < FIELD_N; j++) for (let i = 0; i < FIELD_N; i++) {
			const u = i / FIELD_N - .5;
			const v = j / FIELD_N - .5;
			this.field[j * FIELD_N + i] = Math.atan2(Math.sin((u + .15) * 6 + t * .18) + v * 1.4 + by * .35, Math.cos((v - .1) * 6 - t * .14) - u * 1.4 + bx * .35);
		}
	}
	fieldAngle(x, y) {
		const n = FIELD_N;
		const gx = (x / Math.max(1, this.radius) + 1) * .5 * 23;
		const gy = (y / Math.max(1, this.radius) + 1) * .5 * 23;
		const i = Math.max(0, Math.min(22, Math.floor(gx)));
		const j = Math.max(0, Math.min(22, Math.floor(gy)));
		return this.field[j * n + i] ?? 0;
	}
	seedIcons(c, n) {
		const pts = [];
		for (let i = 0; i < 512; i++) {
			const ang = i / 512 * TAU;
			const r = .08 + i % 17 * .011;
			let x = Math.cos(ang) * r;
			let y = Math.sin(ang) * r;
			for (let k = 0; k < 80; k++) {
				const next = iconStep(x, y, c, n);
				x = next.x;
				y = next.y;
			}
			pts.push({
				x,
				y,
				px: x,
				py: y,
				qx: x,
				qy: y,
				seed: i * .137
			});
		}
		this.icons = pts;
		this.iconK = 80;
	}
	stepIcons() {
		const c = this.settings.icon;
		if (!c || this.icons.length === 0) return;
		const n = this.settings.segments;
		const steps = this.settings.iconKind === "ring" ? 3 : 1;
		for (const p of this.icons) {
			p.qx = p.px;
			p.qy = p.py;
			p.px = p.x;
			p.py = p.y;
			for (let k = 0; k < steps; k++) {
				const next = iconStep(p.x, p.y, c, n);
				p.x = next.x;
				p.y = next.y;
			}
		}
		this.iconK += steps;
	}
	pickDpr() {
		const raw = window.devicePixelRatio || 1;
		if ((navigator.deviceMemory ?? 8) <= 2 || (navigator.hardwareConcurrency || 4) <= 2) return 1;
		if (isCoarse()) return Math.min(1.5, raw);
		return Math.min(2, raw);
	}
	layout(force = false) {
		const rect = this.root.getBoundingClientRect();
		const dpr = this.pickDpr();
		const w = Math.max(1, Math.round(rect.width * dpr));
		const h = Math.max(1, Math.round(rect.height * dpr));
		if (!force && w === this.width && h === this.height && dpr === this.dpr) {
			this.layoutCb?.(this.getLayout());
			return;
		}
		this.dpr = dpr;
		this.width = w;
		this.height = h;
		this.display.width = w;
		this.display.height = h;
		const top = this.topInset * dpr;
		const bottom = this.bottomInset * dpr;
		const pad = this.rimPad * dpr;
		const usableH = Math.max(1, h - bottom - top);
		this.cx = w / 2;
		this.cy = top + usableH / 2;
		this.radius = Math.max(24, Math.min(this.cx, usableH / 2) - 16 * dpr - pad);
		if (!Number.isFinite(this.radius) || this.radius < 24) this.radius = 24;
		this.reseedIdle();
		this.present();
		this.layoutCb?.(this.getLayout());
	}
	lifetime() {
		const t = this.settings.persist / 100;
		return .45 + t * t * 10.5;
	}
	parkedGlobal() {
		return this.settings.persist >= 100;
	}
	allocStroke(pinned, width) {
		const cap = this.strokeCap();
		while (this.strokeWeight() >= cap) {
			const idx = this.strokes.findIndex((s) => !s.pinned);
			this.strokes.splice(idx === -1 ? 0 : idx, 1);
		}
		const s = {
			xs: new Float32Array(MAX_PTS),
			ys: new Float32Array(MAX_PTS),
			len: 0,
			born: this.inkTime,
			pinned,
			seed: Math.random() * TAU,
			width: Math.max(.7, width)
		};
		this.strokes.push(s);
		return s;
	}
	pushPoint(s, x, y) {
		if (s.len >= MAX_PTS) {
			s.xs.copyWithin(0, 8);
			s.ys.copyWithin(0, 8);
			s.len = 64;
		}
		s.xs[s.len] = x;
		s.ys[s.len] = y;
		s.len += 1;
	}
	strokeTo(s, x0, y0, x1, y1) {
		const dist = Math.hypot(x1 - x0, y1 - y0);
		const spacing = Math.max(2.2 * this.dpr, s.width * this.dpr * .35);
		const steps = Math.min(8, Math.max(1, Math.ceil(dist / spacing)));
		for (let i = 1; i <= steps; i++) {
			const t = i / steps;
			this.pushPoint(s, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
		}
	}
	liveStroke(key, pinned, width) {
		let s = this.live.get(key);
		if (!s || s.len >= 71) {
			s = this.allocStroke(pinned, width);
			this.live.set(key, s);
		}
		s.pinned = pinned;
		return s;
	}
	appendPair(id, x0, y0, x1, y1, pressure, pinned) {
		const width = this.settings.brush * (.45 + .4 * pressure);
		const main = this.liveStroke(`${id}:main`, pinned, width);
		if (main.len === 0) this.pushPoint(main, x0, y0);
		this.strokeTo(main, x0, y0, x1, y1);
		const mode = this.settings.pathMode;
		if (mode === "twin") {
			const twin = this.liveStroke(`${id}:twin`, pinned, width * .92);
			if (twin.len === 0) this.pushPoint(twin, -x0, -y0);
			this.strokeTo(twin, -x0, -y0, -x1, -y1);
		} else if (mode === "orbit") {
			const a = this.lightTime * 1.25;
			const c = Math.cos(a);
			const s = Math.sin(a);
			const ox0 = x0 * c - y0 * s;
			const oy0 = x0 * s + y0 * c;
			const ox1 = x1 * c - y1 * s;
			const oy1 = x1 * s + y1 * c;
			const orbit = this.liveStroke(`${id}:orbit`, pinned, width * .9);
			if (orbit.len === 0) this.pushPoint(orbit, ox0, oy0);
			this.strokeTo(orbit, ox0, oy0, ox1, oy1);
		}
	}
	feedEcho(id, x, y, pressure, pinned) {
		if (this.settings.pathMode !== "echo") return;
		let buf = this.echoes.get(id);
		if (!buf) {
			buf = [];
			this.echoes.set(id, buf);
		}
		buf.push({
			x,
			y,
			t: this.inkTime
		});
		const horizon = this.inkTime - .28;
		while (buf.length > 2 && (buf[1]?.t ?? 0) < horizon) buf.shift();
		const ghost = buf[0];
		if (ghost && this.inkTime - ghost.t >= .18) {
			const next = buf[1] ?? ghost;
			const width = this.settings.brush * (.4 + .3 * pressure);
			const s = this.liveStroke(`${id}:echo`, pinned, width);
			if (s.len === 0) this.pushPoint(s, ghost.x, ghost.y);
			this.strokeTo(s, ghost.x, ghost.y, next.x, next.y);
		}
	}
	feedField(id, x, y, dt, pressure, pinned) {
		if (this.settings.pathMode !== "field") return;
		let buf = this.echoes.get(id);
		if (!buf) {
			buf = [];
			this.echoes.set(id, buf);
		}
		buf.push({
			x,
			y,
			t: this.inkTime
		});
		const horizon = this.inkTime - .28;
		while (buf.length > 2 && (buf[1]?.t ?? 0) < horizon) buf.shift();
		const ghost = buf[0];
		if (!ghost || this.inkTime - ghost.t < .18) return;
		let p = this.fieldEcho.get(id);
		if (!p) {
			p = {
				x: ghost.x,
				y: ghost.y
			};
			this.fieldEcho.set(id, p);
		}
		const ang = this.fieldAngle(p.x, p.y);
		const step = .012 * this.radius * Math.min(2.2, dt * 60);
		const nx = p.x + Math.cos(ang) * step + (ghost.x - p.x) * .04;
		const ny = p.y + Math.sin(ang) * step + (ghost.y - p.y) * .04;
		const width = this.settings.brush * (.38 + .28 * pressure);
		const s = this.liveStroke(`${id}:field`, pinned, width);
		if (s.len === 0) this.pushPoint(s, p.x, p.y);
		this.strokeTo(s, p.x, p.y, nx, ny);
		p.x = nx;
		p.y = ny;
	}
	cullStrokes() {
		if (this.parkedGlobal()) return;
		const life = this.lifetime();
		const pinOn = this.pin !== null;
		this.strokes = this.strokes.filter((s) => {
			if (s.pinned && pinOn) return true;
			if (s.pinned && !pinOn) s.pinned = false;
			return this.inkTime - s.born < life;
		});
	}
	fadeOf(s) {
		if (this.parkedGlobal() || s.pinned && this.pin !== null) return 1;
		const life = this.lifetime();
		const age = this.inkTime - s.born;
		const t = Math.max(0, 1 - age / life);
		return t * t;
	}
	needsAlong() {
		const a = this.settings.lightActivity;
		return a === "chase" || a === "firefly";
	}
	idleBoost() {
		if (this.reduced) return 0;
		return Math.max(0, 1 - this.aliveTime / 2);
	}
	mirrors() {
		return this.settings.pathMode !== "rosette";
	}
	drawPolyline(ctx, s, ca, sa, mirror, color, fade) {
		const actKind = this.settings.lightActivity;
		const w = Math.max(.7, s.width * .22 * this.dpr);
		const alongNeeded = this.needsAlong();
		const boost = this.idleBoost();
		const tx = (x, y) => {
			if (mirror) return {
				x: x * ca + y * sa,
				y: x * sa - y * ca
			};
			return {
				x: x * ca - y * sa,
				y: x * sa + y * ca
			};
		};
		if (!alongNeeded) {
			const act = activityAt(actKind, this.lightTime, .5, s.seed, boost);
			if (act.a * fade < .02) return;
			ctx.beginPath();
			for (let i = 0; i < s.len; i++) {
				const p = tx(s.xs[i] ?? 0, s.ys[i] ?? 0);
				if (i === 0) ctx.moveTo(p.x, p.y);
				else ctx.lineTo(p.x, p.y);
			}
			ctx.strokeStyle = hsla({
				...color,
				h: color.h + act.h
			}, .28 * act.a * fade);
			ctx.lineWidth = w * 2.1 * act.w;
			ctx.stroke();
			ctx.strokeStyle = hsla({
				...color,
				h: color.h + act.h,
				l: Math.min(78, color.l + 8)
			}, .92 * act.a * fade);
			ctx.lineWidth = w * act.w;
			ctx.stroke();
			return;
		}
		for (let i = 1; i < s.len; i++) {
			const along = i / Math.max(1, s.len - 1);
			const act = activityAt(actKind, this.lightTime, along, s.seed, boost);
			if (act.a * fade < .03) continue;
			const a = tx(s.xs[i - 1] ?? 0, s.ys[i - 1] ?? 0);
			const b = tx(s.xs[i] ?? 0, s.ys[i] ?? 0);
			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.strokeStyle = hsla({
				...color,
				h: color.h + act.h,
				l: Math.min(78, color.l + 6)
			}, .95 * act.a * fade);
			ctx.lineWidth = w * act.w;
			ctx.stroke();
		}
	}
	drawIcons(ctx) {
		if (this.icons.length === 0) return;
		const scale = this.radius * .92;
		const ring = this.settings.iconKind === "ring";
		const boost = this.idleBoost();
		ctx.save();
		ctx.globalCompositeOperation = "source-over";
		for (const p of this.icons) {
			const x = p.x * scale;
			const y = p.y * scale;
			const ang = Math.atan2(p.y - p.py, p.x - p.px);
			const color = colorAt(this.settings.colorMode, this.settings.colorMotion, this.settings.hue + ang * 180 / Math.PI, this.lightTime, x, y, this.radius);
			const act = activityAt(this.settings.lightActivity, this.lightTime, p.seed % 1, p.seed, boost);
			ctx.fillStyle = hsla(color, .72 * act.a);
			ctx.beginPath();
			ctx.arc(x, y, Math.max(.7, 1.15 * this.dpr * act.w), 0, TAU);
			ctx.fill();
			if (ring) {
				ctx.strokeStyle = hsla(color, .45 * act.a);
				ctx.lineWidth = Math.max(.6, .7 * this.dpr);
				ctx.beginPath();
				ctx.moveTo(p.qx * scale, p.qy * scale);
				ctx.lineTo(p.px * scale, p.py * scale);
				ctx.lineTo(x, y);
				ctx.stroke();
			}
		}
		ctx.restore();
	}
	fillSignature(size) {
		const q = 2 * Math.max(8, this.radius) / Math.max(8, size);
		const qi = (v) => Math.round(v / q);
		let count = 0;
		let width = 0;
		let h = 2166136261;
		for (const s of this.strokes) {
			if (s.len < 2 || this.fadeOf(s) < .15) continue;
			count++;
			width += s.width;
			let px = qi(s.xs[0] ?? 0);
			let py = qi(s.ys[0] ?? 0);
			h = Math.imul(h ^ px + 4096, 16777619);
			h = Math.imul(h ^ py + 4096, 16777619);
			for (let i = 1; i < s.len; i++) {
				const x = qi(s.xs[i] ?? 0);
				const y = qi(s.ys[i] ?? 0);
				const dx = x - px;
				const dy = y - py;
				if (dx === 0 && dy === 0) continue;
				h = Math.imul(h ^ dx + 256, 16777619);
				h = Math.imul(h ^ dy + 256, 16777619);
				px = x;
				py = y;
			}
		}
		const bucket = Math.round(this.radius / 12);
		return `${this.settings.fillMode}|${size}|${this.settings.segments}|${this.settings.pathMode}|${bucket}|${count}|${h >>> 0}|${Math.round(width * 4)}`;
	}
	syncFill() {
		if (this.settings.fillMode === "off") {
			this.fillRooms = 0;
			this.fillPaintKey = "";
			return null;
		}
		const size = fillMaskSize(isCoarse());
		const sig = this.fillSignature(size);
		if (sig !== this.fillSig) {
			this.fillSig = sig;
			this.fillPaintKey = "";
			if (!this.stencil) this.stencil = new FillStencil();
			const strokes = [];
			for (const s of this.strokes) {
				if (s.len < 2 || this.fadeOf(s) < .15) continue;
				strokes.push({
					xs: s.xs,
					ys: s.ys,
					len: s.len,
					width: Math.max(1.5, s.width * .22 * this.dpr)
				});
			}
			try {
				this.fillMap = this.stencil.build({
					size,
					radius: this.radius,
					n: this.settings.segments,
					mirrors: this.mirrors(),
					wedges: this.settings.fillMode === "wedges",
					strokes
				});
			} catch {
				this.fillMap = null;
				this.fillRooms = 0;
				return null;
			}
		}
		const map = this.fillMap;
		if (!map || map.rooms.length === 0) {
			this.fillRooms = 0;
			return null;
		}
		this.fillRooms = map.rooms.length;
		const recipe = this.settings.fillRecipe;
		const boost = this.idleBoost();
		const key = `${sig}|${recipe}|${this.settings.colorMode}|${this.settings.colorMotion}|${this.settings.hue}|${this.settings.lightActivity}|${this.lightTime.toFixed(2)}|${boost.toFixed(2)}|${this.reduced ? 1 : 0}`;
		const need = size * size * 4;
		if (!this.fillRGBA || this.fillRGBA.length !== need) {
			this.fillRGBA = new Uint8ClampedArray(need);
			this.fillPaintKey = "";
		}
		if (key !== this.fillPaintKey && this.fillRGBA) {
			this.fillPaintKey = key;
			paintFill(map, this.fillRGBA, {
				recipe,
				reduced: this.reduced,
				sample: (x, y) => colorAt(this.settings.colorMode, this.settings.colorMotion, this.settings.hue, this.lightTime, x, y, this.radius),
				activity: (seed) => activityAt(this.settings.lightActivity, this.lightTime, .5, seed, boost).a
			});
			this.fillRev++;
		}
		return this.fillRGBA ? {
			rgba: this.fillRGBA,
			size,
			rev: this.fillRev
		} : null;
	}
	drawFill(ctx) {
		const fill = this.syncFill();
		if (!fill) return;
		if (!this.fillCanvas) {
			this.fillCanvas = document.createElement("canvas");
			this.fillCtx = this.fillCanvas.getContext("2d", { alpha: true });
		}
		const canvas = this.fillCanvas;
		const ictx = this.fillCtx;
		if (!ictx) return;
		if (canvas.width !== fill.size || canvas.height !== fill.size) {
			canvas.width = fill.size;
			canvas.height = fill.size;
			this.fillImage = null;
		}
		if (!this.fillImage || this.fillImage.width !== fill.size) {
			this.fillImage = ictx.createImageData(fill.size, fill.size);
			this.fillBlitRev = -1;
		}
		if (this.fillBlitRev !== fill.rev) {
			this.fillImage.data.set(fill.rgba);
			ictx.putImageData(this.fillImage, 0, 0);
			this.fillBlitRev = fill.rev;
		}
		ctx.imageSmoothingEnabled = true;
		const r = this.radius;
		ctx.drawImage(canvas, -r, -r, r * 2, r * 2);
	}
	present() {
		if (this.gl) {
			this.presentGL();
			return;
		}
		this.presentCanvas();
	}
	presentGL() {
		const { width: w, height: h, cx, cy, radius } = this;
		if (!w || !h || !Number.isFinite(cx) || !Number.isFinite(cy) || !Number.isFinite(radius) || radius < 1) return;
		const boost = this.idleBoost();
		const scale = radius * .92;
		const icons = this.iconPool;
		const iconN = this.icons.length;
		while (icons.length < iconN) icons.push({
			x: 0,
			y: 0,
			px: 0,
			py: 0,
			qx: 0,
			qy: 0,
			seed: 0,
			rgb: [
				0,
				0,
				0
			],
			alpha: 0,
			size: 1
		});
		if (icons.length !== iconN) icons.length = iconN;
		for (let i = 0; i < iconN; i++) {
			const p = this.icons[i];
			const ic = icons[i];
			if (!p || !ic) continue;
			const x = p.x * scale;
			const y = p.y * scale;
			const ang = Math.atan2(p.y - p.py, p.x - p.px);
			const color = colorAt(this.settings.colorMode, this.settings.colorMotion, this.settings.hue + ang * 180 / Math.PI, this.lightTime, x, y, this.radius);
			const hue = color.h;
			const sat = color.s;
			const lit = color.l;
			const act = activityAt(this.settings.lightActivity, this.lightTime, p.seed % 1, p.seed, boost);
			ic.x = x;
			ic.y = y;
			ic.px = p.px * scale;
			ic.py = p.py * scale;
			ic.qx = p.qx * scale;
			ic.qy = p.qy * scale;
			ic.seed = p.seed;
			hslToRgb(hue, sat, lit, ic.rgb);
			ic.alpha = .72 * act.a;
			ic.size = Math.max(1.2, 2.3 * this.dpr * act.w);
		}
		const strokes = this.strokePool;
		let strokeN = 0;
		for (const s of this.strokes) {
			if (s.len < 2) continue;
			const fade = this.fadeOf(s);
			if (fade < .02) continue;
			let slot = strokes[strokeN];
			if (!slot) {
				slot = {
					xs: s.xs,
					ys: s.ys,
					len: s.len,
					width: s.width,
					seed: s.seed,
					fade,
					rgb: [
						0,
						0,
						0
					]
				};
				strokes[strokeN] = slot;
			}
			const mid = Math.max(0, (s.len >> 1) - 1);
			const color = colorAt(this.settings.colorMode, this.settings.colorMotion, this.settings.hue, this.lightTime, s.xs[mid] ?? 0, s.ys[mid] ?? 0, this.radius);
			slot.xs = s.xs;
			slot.ys = s.ys;
			slot.len = s.len;
			slot.width = s.width;
			slot.seed = s.seed;
			slot.fade = fade;
			hslToRgb(color.h, color.s, Math.min(78, color.l + 8), slot.rgb);
			strokeN++;
		}
		if (strokes.length !== strokeN) strokes.length = strokeN;
		const showKey = this.keyInited && [...this.keys].some((code) => WASD.has(code) || ARROWS.has(code));
		const frame = {
			width: w,
			height: h,
			cx,
			cy,
			radius,
			dpr: this.dpr,
			spin: this.settings.spin ? this.spinAngle : 0,
			n: this.settings.segments,
			mirrors: this.mirrors(),
			activity: this.settings.lightActivity,
			lightTime: this.lightTime,
			boost,
			flash: this.flash,
			pin: !showKey && this.pin && !this.settings.frozen ? this.pin : null,
			key: showKey ? {
				x: this.keyX,
				y: this.keyY
			} : null,
			strokes,
			icons,
			iconRing: this.settings.iconKind === "ring",
			fill: this.syncFill()
		};
		this.gl?.draw(frame);
	}
	presentCanvas() {
		const ctx = this.dctx;
		if (!ctx) return;
		const { width: w, height: h, cx, cy, radius } = this;
		if (!w || !h || !Number.isFinite(cx) || !Number.isFinite(cy) || !Number.isFinite(radius) || radius < 1) return;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = BG;
		ctx.fillRect(0, 0, w, h);
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, Math.max(8, radius), 0, TAU);
		ctx.clip();
		ctx.translate(cx, cy);
		if (this.settings.spin) ctx.rotate(this.spinAngle);
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.globalCompositeOperation = "source-over";
		this.drawFill(ctx);
		this.drawIcons(ctx);
		const n = this.settings.segments;
		const mirrors = this.mirrors();
		for (const s of this.strokes) {
			if (s.len < 2) continue;
			const fade = this.fadeOf(s);
			if (fade < .02) continue;
			const mid = Math.max(0, (s.len >> 1) - 1);
			const color = colorAt(this.settings.colorMode, this.settings.colorMotion, this.settings.hue, this.lightTime, s.xs[mid] ?? 0, s.ys[mid] ?? 0, this.radius);
			for (let i = 0; i < n; i++) {
				const ca = this.cos[i] ?? 1;
				const sa = this.sin[i] ?? 0;
				this.drawPolyline(ctx, s, ca, sa, false, color, fade);
				if (mirrors) this.drawPolyline(ctx, s, ca, sa, true, color, fade);
			}
		}
		ctx.restore();
		const vig = ctx.createRadialGradient(cx, cy, radius * .5, cx, cy, radius);
		vig.addColorStop(0, "rgba(8, 8, 11, 0)");
		vig.addColorStop(1, "rgba(8, 8, 11, 0.42)");
		ctx.fillStyle = vig;
		ctx.beginPath();
		ctx.arc(cx, cy, radius, 0, TAU);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(cx, cy, radius, 0, TAU);
		ctx.strokeStyle = "rgba(197, 205, 216, 0.22)";
		ctx.lineWidth = Math.max(1, this.dpr);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(cx, cy, Math.max(4, radius - 5 * this.dpr), 0, TAU);
		ctx.strokeStyle = "rgba(197, 205, 216, 0.06)";
		ctx.lineWidth = Math.max(1, 3 * this.dpr);
		ctx.stroke();
		if (this.flash > .02) {
			ctx.beginPath();
			ctx.arc(cx, cy, Math.max(8, radius - 3 * this.dpr), 0, TAU);
			ctx.strokeStyle = `rgba(243, 243, 245, ${this.flash * .55})`;
			ctx.lineWidth = Math.max(1, 5 * this.dpr * this.flash);
			ctx.stroke();
		}
		if (this.keyInited && [...this.keys].some((code) => WASD.has(code) || ARROWS.has(code))) {
			ctx.beginPath();
			ctx.arc(cx + this.keyX, cy + this.keyY, 4 * this.dpr, 0, TAU);
			ctx.strokeStyle = "rgba(197, 205, 216, 0.7)";
			ctx.lineWidth = Math.max(1, this.dpr);
			ctx.stroke();
		} else if (this.pin && !this.settings.frozen) {
			ctx.beginPath();
			ctx.arc(cx + this.pin.x, cy + this.pin.y, 3.5 * this.dpr, 0, TAU);
			ctx.strokeStyle = "rgba(197, 205, 216, 0.45)";
			ctx.lineWidth = Math.max(1, this.dpr);
			ctx.stroke();
		}
	}
	stepBrushes(dt) {
		const k = 1 - Math.exp(-18 * dt);
		const pinnedId = "pin";
		for (const [id, b] of this.brushes) {
			if (!b.armed) {
				b.sx = b.x;
				b.sy = b.y;
				b.armed = true;
				continue;
			}
			const nx = b.sx + (b.x - b.sx) * k;
			const ny = b.sy + (b.y - b.sy) * k;
			const pinned = id === pinnedId || id === "key";
			this.appendPair(id, b.sx, b.sy, nx, ny, b.pressure, pinned);
			this.feedEcho(id, nx, ny, b.pressure, pinned);
			this.feedField(id, nx, ny, dt, b.pressure, pinned);
			b.sx = nx;
			b.sy = ny;
		}
	}
	stepPin(dt) {
		if (!this.pin || this.settings.frozen || this.rightHeld || this.altHeld) return;
		this.pinAcc += dt;
		if (this.pinAcc < .05) return;
		this.pinAcc = 0;
		const { x, y } = this.pin;
		this.appendPair("pin", x, y, x + .35, y + .35, .5, true);
	}
	stepKeys(dt) {
		let kdx = 0;
		let kdy = 0;
		if (this.keys.has("KeyA") || !this.menuOpen && this.keys.has("ArrowLeft")) kdx -= 1;
		if (this.keys.has("KeyD") || !this.menuOpen && this.keys.has("ArrowRight")) kdx += 1;
		if (this.keys.has("KeyW") || !this.menuOpen && this.keys.has("ArrowUp")) kdy -= 1;
		if (this.keys.has("KeyS") || !this.menuOpen && this.keys.has("ArrowDown")) kdy += 1;
		if (!kdx && !kdy) return false;
		if (!this.keyInited) {
			this.keyX = this.radius * .38;
			this.keyY = 0;
			this.keyInited = true;
		}
		if (this.pin) this.pin = null;
		const m = Math.hypot(kdx, kdy) || 1;
		const speed = 260 * this.dpr;
		this.keyX += kdx / m * speed * dt;
		this.keyY += kdy / m * speed * dt;
		const r = Math.hypot(this.keyX, this.keyY);
		const maxR = this.radius * .92;
		if (r > maxR) {
			this.keyX *= maxR / r;
			this.keyY *= maxR / r;
		}
		const brush = this.brushes.get("key");
		if (!brush) this.armBrush("key", this.keyX, this.keyY, .7);
		else {
			brush.x = this.keyX;
			brush.y = this.keyY;
		}
		return true;
	}
	anyPainting() {
		return this.brushes.size > 0 || this.pin !== null;
	}
	frame = (now) => {
		if (this.destroyed) return;
		this.raf = requestAnimationFrame(this.frame);
		const dt = this.lastTs ? Math.min(.1, (now - this.lastTs) / 1e3) : .016;
		this.lastTs = now;
		if (this.flash > .01) this.flash = Math.max(0, this.flash - dt * 3.2);
		if (this.settings.frozen) {
			this.present();
			return;
		}
		this.inkTime += dt;
		this.lightTime += dt;
		this.aliveTime += dt;
		this.cullStrokes();
		if (this.settings.spin && !this.reduced) this.spinAngle += .07 * dt;
		if (this.settings.pathMode === "field") this.rebuildField(this.lightTime);
		const usingKeys = this.stepKeys(dt);
		this.stepBrushes(dt);
		this.stepPin(dt);
		if (!this.reduced) this.stepIcons();
		if (!this.settings.icon && !this.anyPainting() && !usingKeys && !this.reduced && this.inkTime >= this.resumeIdleAt) {
			if (!this.hasIdle) {
				const p = this.hypotrochoid(this.idleT);
				this.lastIdleX = p.x;
				this.lastIdleY = p.y;
				this.hasIdle = true;
			}
			this.idleT += dt * .42;
			const p = this.hypotrochoid(this.idleT);
			this.appendPair("idle", this.lastIdleX, this.lastIdleY, p.x, p.y, .45, false);
			this.lastIdleX = p.x;
			this.lastIdleY = p.y;
		}
		this.present();
	};
};
var GIF_FPS = 8;
var GIF_EDGE = 360;
var VIDEO_EDGE = 720;
var scratch = null;
function lensRect(canvas, lens) {
	if (!lens || lens.radius < 8) return null;
	const pad = Math.max(2, lens.radius * .06);
	const side = Math.min(canvas.width, canvas.height, (lens.radius + pad) * 2);
	if (side < 8) return null;
	return {
		x: Math.max(0, Math.min(canvas.width - side, lens.cx - side / 2)),
		y: Math.max(0, Math.min(canvas.height - side, lens.cy - side / 2)),
		side
	};
}
function snap(source, lens, edge) {
	const box = lensRect(source, lens);
	const side = edge - edge % 2;
	if (!scratch) scratch = document.createElement("canvas");
	if (scratch.width !== side) scratch.width = side;
	if (scratch.height !== side) scratch.height = side;
	const ctx = scratch.getContext("2d", { willReadFrequently: true });
	if (!ctx) throw new Error("Could not read the lens");
	if (box) ctx.drawImage(source, box.x, box.y, box.side, box.side, 0, 0, side, side);
	else ctx.drawImage(source, 0, 0, side, side);
	return ctx.getImageData(0, 0, side, side);
}
function encodeGif(frames, delayMs) {
	const gif = ct();
	return frames.reduce(async (prev, frame) => {
		await prev;
		const palette = H(frame.data, 256);
		const index = nt(frame.data, palette);
		gif.writeFrame(index, frame.width, frame.height, {
			palette,
			delay: delayMs
		});
		await new Promise((resolve) => setTimeout(resolve, 0));
	}, Promise.resolve()).then(() => {
		gif.finish();
		return new Blob([gif.bytes()], { type: "image/gif" });
	});
}
/** A short looping GIF of the lens, not the empty margin around it. */
async function captureGif(canvas, lens) {
	if (canvas.width < 2 || canvas.height < 2) throw new Error("Lens isn’t ready");
	const count = Math.round(24);
	const gap = 1e3 / GIF_FPS;
	const frames = [];
	let last = 0;
	while (frames.length < count) {
		await new Promise((resolve) => {
			requestAnimationFrame(() => resolve());
		});
		const now = performance.now();
		if (frames.length === 0 || now - last >= 120) {
			frames.push(snap(canvas, lens(), GIF_EDGE));
			last = now;
		}
	}
	const blob = await encodeGif(frames, gap);
	if (blob.size < 32) throw new Error("Empty GIF");
	return blob;
}
/** MP4 (or WebM) of the lens, cropped square so the folds fill the frame. */
async function captureVideo(canvas, lens, seconds, mime) {
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
	await new Promise((resolve) => {
		requestAnimationFrame(() => resolve());
	});
	try {
		return await recordCanvas(out, seconds, mime);
	} finally {
		live = false;
	}
}
var KaleidoStage = (0, import_react.forwardRef)(function KaleidoStage({ settings, bottomInset, rimPad, topInset, menuOpen, onInteract, onFreeze, onMiddleClick, onWheel, onLayout, onPinChange }, ref) {
	const rootRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	const recorderRef = (0, import_react.useRef)(new ClipRecorder());
	const settingsRef = (0, import_react.useRef)(settings);
	const onWheelRef = (0, import_react.useRef)(onWheel);
	const onFreezeRef = (0, import_react.useRef)(onFreeze);
	const onLayoutRef = (0, import_react.useRef)(onLayout);
	const onPinRef = (0, import_react.useRef)(onPinChange);
	const insetRef = (0, import_react.useRef)(bottomInset);
	const rimRef = (0, import_react.useRef)(rimPad);
	const topRef = (0, import_react.useRef)(topInset);
	const pressRef = (0, import_react.useRef)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	settingsRef.current = settings;
	onWheelRef.current = onWheel;
	onFreezeRef.current = onFreeze;
	onLayoutRef.current = onLayout;
	onPinRef.current = onPinChange;
	insetRef.current = bottomInset;
	rimRef.current = rimPad;
	topRef.current = topInset;
	(0, import_react.useImperativeHandle)(ref, () => ({
		clear: () => engineRef.current?.clear(),
		burst: () => engineRef.current?.burst(),
		exportPng: () => engineRef.current?.exportPng() ?? Promise.resolve(),
		exportGif: () => {
			const engine = engineRef.current;
			const canvas = engine?.canvas();
			if (!engine || !canvas) return Promise.reject(/* @__PURE__ */ new Error("Lens isn’t ready"));
			return captureGif(canvas, () => engine.lensPixels());
		},
		exportMp4: (mime) => {
			const engine = engineRef.current;
			const canvas = engine?.canvas();
			if (!engine || !canvas) return Promise.reject(/* @__PURE__ */ new Error("Lens isn’t ready"));
			return captureVideo(canvas, () => engine.lensPixels(), 3, mime);
		},
		copyPng: () => engineRef.current?.copyPng() ?? Promise.resolve(false),
		setBottomInset: (px) => engineRef.current?.setBottomInset(px),
		setRimPad: (px) => engineRef.current?.setRimPad(px),
		setTopInset: (px) => engineRef.current?.setTopInset(px),
		startClip: (handlers, seconds) => {
			const canvas = engineRef.current?.canvas();
			if (!canvas || !canRecord()) return false;
			return recorderRef.current.start(canvas, handlers, seconds);
		},
		stopClip: () => recorderRef.current.stop(),
		recording: () => recorderRef.current.active,
		togglePin: () => engineRef.current?.togglePin() ?? false,
		pinned: () => engineRef.current?.pinned() ?? false,
		getLayout: () => engineRef.current?.getLayout() ?? {
			cx: 0,
			cy: 0,
			radius: 0
		}
	}));
	(0, import_react.useEffect)(() => {
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
	(0, import_react.useEffect)(() => {
		engineRef.current?.setSettings(settings);
	}, [settings]);
	(0, import_react.useEffect)(() => {
		engineRef.current?.setBottomInset(bottomInset);
		engineRef.current?.setRimPad(rimPad);
		engineRef.current?.setTopInset(topInset);
	}, [
		bottomInset,
		rimPad,
		topInset
	]);
	(0, import_react.useEffect)(() => {
		engineRef.current?.setMenuOpen(menuOpen);
	}, [menuOpen]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const handler = (event) => {
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
	if (failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 flex items-center justify-center bg-bg p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl text-fg",
				children: "Kaleido"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-pretty text-muted",
				children: "This lens needs a current browser with canvas. If you are on an older phone or tablet, send the device make, model, year, and OS so a fallback can be built for it."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: rootRef,
		className: "absolute inset-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			"data-testid": "kaleido-canvas",
			className: "absolute inset-0 size-full cursor-crosshair touch-none select-none",
			"aria-label": "Kaleidoscope canvas. Move to paint. Two fingers work. Arrow keys or right-drag park a second brush. Long-press or Space freezes. Scroll changes trail.",
			onPointerDown: (event) => {
				if (event.button === 0) onInteract();
				if (event.button !== 0) return;
				if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
				clearPress();
				const timer = window.setTimeout(() => {
					pressRef.current = null;
					onFreezeRef.current();
				}, 480);
				pressRef.current = {
					x: event.clientX,
					y: event.clientY,
					timer
				};
			},
			onPointerMove: (event) => {
				const press = pressRef.current;
				if (!press) return;
				if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > 14) clearPress();
			},
			onPointerUp: clearPress,
			onPointerCancel: clearPress,
			onContextMenu: (event) => {
				event.preventDefault();
			},
			onAuxClick: (event) => {
				if (event.button === 1) {
					event.preventDefault();
					onMiddleClick();
				}
			}
		})
	});
});
function useChromeMode() {
	const [flower, setFlower] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(min-width: 1024px)").matches && !window.matchMedia("(pointer: coarse)").matches;
	});
	(0, import_react.useEffect)(() => {
		const wide = window.matchMedia("(min-width: 1024px)");
		const coarse = window.matchMedia("(pointer: coarse)");
		const apply = () => setFlower(wide.matches && !coarse.matches);
		apply();
		wide.addEventListener("change", apply);
		coarse.addEventListener("change", apply);
		return () => {
			wide.removeEventListener("change", apply);
			coarse.removeEventListener("change", apply);
		};
	}, []);
	return flower;
}
function KaleidoApp() {
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_SETTINGS);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [hint, setHint] = (0, import_react.useState)(true);
	const [exported, setExported] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [tuneOpen, setTuneOpen] = (0, import_react.useState)(false);
	const [dialOpen, setDialOpen] = (0, import_react.useState)(false);
	const [helpOpen, setHelpOpen] = (0, import_react.useState)(false);
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const [hiddenChrome, setHiddenChrome] = (0, import_react.useState)(false);
	const [pinned, setPinned] = (0, import_react.useState)(false);
	const [clipState, setClipState] = (0, import_react.useState)("idle");
	const [clipElapsed, setClipElapsed] = (0, import_react.useState)(0);
	const [clipMax, setClipMax] = (0, import_react.useState)(15);
	const [recordEnabled, setRecordEnabled] = (0, import_react.useState)(true);
	const [heldClip, setHeldClip] = (0, import_react.useState)(null);
	const [exportKind, setExportKind] = (0, import_react.useState)(null);
	const [exportLabel, setExportLabel] = (0, import_react.useState)(null);
	const [lens, setLens] = (0, import_react.useState)({
		cx: 0,
		cy: 0,
		radius: 0
	});
	const [chromeH, setChromeH] = (0, import_react.useState)(76);
	const [focusId, setFocusId] = (0, import_react.useState)("freeze");
	const [macros, setMacros] = (0, import_react.useState)(emptyMacros);
	const [macroSlot, setMacroSlot] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const stageRef = (0, import_react.useRef)(null);
	const noticeTimer = (0, import_react.useRef)(0);
	const burstOnce = (0, import_react.useRef)(false);
	const saveHandleRef = (0, import_react.useRef)(null);
	const armingRef = (0, import_react.useRef)(false);
	const savingRef = (0, import_react.useRef)(false);
	const exportingRef = (0, import_react.useRef)(false);
	const heldRef = (0, import_react.useRef)(heldClip);
	heldRef.current = heldClip;
	const flower = useChromeMode();
	(0, import_react.useEffect)(() => {
		setSettings(loadSettings());
		setMacros(loadMacros());
		setReady(true);
		setRecordEnabled(canRecord());
	}, []);
	const bottomInset = hiddenChrome ? 0 : Math.max(chromeH, tuneOpen ? 240 : dialOpen && !flower ? 228 : 76);
	const flowerOpen = flower && dialOpen && !tuneOpen;
	const rimPad = !hiddenChrome && flowerOpen ? 64 : 0;
	const topInset = hiddenChrome ? 48 : flowerOpen ? 112 : 0;
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		saveSettings(settings);
	}, [ready, settings]);
	const flash = (0, import_react.useCallback)((msg) => {
		setNotice(msg);
		window.clearTimeout(noticeTimer.current);
		noticeTimer.current = window.setTimeout(() => setNotice(null), 1500);
	}, []);
	const writeMacros = (0, import_react.useCallback)((bank) => {
		setMacros(bank);
		saveMacros(bank);
	}, []);
	const patch = (0, import_react.useCallback)((next) => {
		setSettings((prev) => ({
			...prev,
			...next
		}));
	}, []);
	const saveMacroSlot = (0, import_react.useCallback)((slot, settingsNow) => {
		const next = {
			...macros,
			[slot]: lookFrom(settingsNow)
		};
		writeMacros(next);
		setMacroSlot(slot);
		flash(`Slot ${slot} saved`);
	}, [
		flash,
		macros,
		writeMacros
	]);
	const recallMacroSlot = (0, import_react.useCallback)((slot) => {
		setSettings((prev) => {
			const stored = macros[slot];
			if (!stored) {
				const next = {
					...macros,
					[slot]: lookFrom(prev)
				};
				writeMacros(next);
				setMacroSlot(slot);
				flash(`Save ${slot}`);
				return prev;
			}
			setMacroSlot(slot);
			flash(`Slot ${slot}`);
			return applyLook(stored, prev.frozen);
		});
	}, [
		flash,
		macros,
		writeMacros
	]);
	const closeMenus = (0, import_react.useCallback)(() => {
		setDialOpen(false);
		setTuneOpen(false);
		setHelpOpen(false);
		setMoreOpen(false);
	}, []);
	const onRandomize = (0, import_react.useCallback)(() => {
		burstOnce.current = true;
		setHint(false);
		closeMenus();
		setSettings(randomSettings());
	}, [closeMenus]);
	(0, import_react.useEffect)(() => {
		if (!burstOnce.current) return;
		burstOnce.current = false;
		stageRef.current?.clear();
		stageRef.current?.burst();
	}, [settings]);
	const onClear = (0, import_react.useCallback)(() => {
		stageRef.current?.clear();
		setPinned(false);
	}, []);
	const onExport = (0, import_react.useCallback)(async () => {
		try {
			await stageRef.current?.exportPng();
			setExported(true);
			window.setTimeout(() => setExported(false), 1600);
		} catch {
			setExported(false);
		}
	}, []);
	const onCopy = (0, import_react.useCallback)(async () => {
		if (await stageRef.current?.copyPng()) {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} else await onExport();
	}, [onExport]);
	const onExportLoop = (0, import_react.useCallback)(async (kind) => {
		if (exportingRef.current) return;
		if (stageRef.current?.recording()) {
			flash("Finish the clip first");
			return;
		}
		const video = kind === "mp4" ? videoExportMime() : null;
		const ext = kind === "gif" ? "gif" : video?.ext ?? "webm";
		const filename = stampedName("kaleido", ext);
		exportingRef.current = true;
		let destination = "later";
		try {
			destination = await chooseSaveFile(filename, ext);
		} catch {
			destination = "later";
		}
		if (destination === "cancel" || stageRef.current?.recording()) {
			exportingRef.current = false;
			return;
		}
		setExportKind(kind);
		setExportLabel(kind === "gif" ? "Making a GIF…" : ext === "mp4" ? "Making an MP4…" : "Making a video…");
		try {
			const blob = kind === "gif" ? await stageRef.current?.exportGif() : await stageRef.current?.exportMp4(video?.mime ?? "video/webm");
			if (!blob || blob.size === 0) throw new Error("empty");
			const name = blob.type.includes("mp4") ? filename.replace(/\.\w+$/, ".mp4") : blob.type.includes("gif") ? filename.replace(/\.\w+$/, ".gif") : filename.replace(/\.\w+$/, ".webm");
			setHeldClip({
				blob,
				name
			});
			if (destination === "later") {
				setClipState("ready");
				return;
			}
			try {
				await writeClipFile(destination, blob);
				setClipState("idle");
				flash("Saved");
			} catch {
				setClipState("ready");
			}
		} catch {
			flash(kind === "gif" ? "Couldn’t make a GIF" : "Couldn’t make a video");
			setClipState(heldRef.current ? "ready" : "idle");
		} finally {
			exportingRef.current = false;
			setExportKind(null);
			setExportLabel(null);
		}
	}, [flash]);
	const onDownloadClip = (0, import_react.useCallback)(async () => {
		if (!heldClip || savingRef.current) return;
		savingRef.current = true;
		try {
			const how = await saveClip(heldClip.blob, heldClip.name);
			setClipState((state) => state === "ready" ? "idle" : state);
			flash(how === "shared" ? "Shared" : how === "saved" ? "Saved" : "Downloading");
		} catch (err) {
			if (!(err instanceof DOMException && err.name === "AbortError")) setClipState((state) => state === "recording" ? state : "ready");
		} finally {
			savingRef.current = false;
		}
	}, [flash, heldClip]);
	const onRecord = (0, import_react.useCallback)(async () => {
		if (exportingRef.current) return;
		if (stageRef.current?.recording()) {
			stageRef.current.stopClip();
			return;
		}
		if (!recordEnabled) {
			setClipState("unsupported");
			window.setTimeout(() => setClipState("idle"), 1800);
			return;
		}
		if (armingRef.current) return;
		armingRef.current = true;
		let destination = "later";
		try {
			destination = await chooseClipFile();
		} finally {
			armingRef.current = false;
		}
		if (destination === "cancel" || stageRef.current?.recording()) return;
		saveHandleRef.current = destination === "later" ? null : destination;
		setSettings((prev) => prev.frozen ? {
			...prev,
			frozen: false
		} : prev);
		setClipElapsed(0);
		if (stageRef.current?.startClip({
			onTick: (elapsed) => setClipElapsed(elapsed),
			onStop: (blob) => {
				setClipElapsed(0);
				const handle = saveHandleRef.current;
				saveHandleRef.current = null;
				if (!blob || blob.size === 0) {
					setClipState("idle");
					flash("Clip didn’t capture");
					return;
				}
				const name = clipFilename(blob.type);
				setHeldClip({
					blob,
					name
				});
				if (!handle) {
					setClipState("ready");
					return;
				}
				setClipState("idle");
				flash("Saving…");
				writeClipFile(handle, blob).then(() => flash("Saved"), () => setClipState("ready"));
			}
		}, clipMax)) setClipState("recording");
		else {
			saveHandleRef.current = null;
			setClipState("unsupported");
			window.setTimeout(() => setClipState("idle"), 1800);
		}
	}, [
		clipMax,
		flash,
		recordEnabled
	]);
	const cyclePath = (0, import_react.useCallback)(() => {
		setSettings((prev) => ({
			...prev,
			pathMode: cycleId(PATH_MODES, prev.pathMode)
		}));
	}, []);
	const onCyclePersist = (0, import_react.useCallback)(() => {
		setSettings((prev) => ({
			...prev,
			persist: cyclePersist(prev.persist)
		}));
	}, []);
	const onTogglePark = (0, import_react.useCallback)(() => {
		setSettings((prev) => ({
			...prev,
			persist: togglePark(prev.persist)
		}));
	}, []);
	const onCycleLight = (0, import_react.useCallback)(() => {
		setSettings((prev) => ({
			...prev,
			lightActivity: cycleId(LIGHT_ACTIVITIES, prev.lightActivity)
		}));
	}, []);
	const onCycleColor = (0, import_react.useCallback)(() => {
		setSettings((prev) => ({
			...prev,
			colorMode: cycleId(COLOR_MODES, prev.colorMode)
		}));
	}, []);
	const onTogglePin = (0, import_react.useCallback)(() => {
		const on = stageRef.current?.togglePin() ?? false;
		setPinned(on);
	}, []);
	const openDial = (0, import_react.useCallback)(() => {
		setHiddenChrome(false);
		setTuneOpen(false);
		setHelpOpen(false);
		setMoreOpen(false);
		setDialOpen(true);
	}, []);
	const activateFocus = (0, import_react.useCallback)((id) => {
		switch (id) {
			case "freeze":
				setSettings((prev) => ({
					...prev,
					frozen: !prev.frozen
				}));
				break;
			case "record":
				if (clipState === "ready") onDownloadClip();
				else onRecord();
				closeMenus();
				break;
			case "random":
				onRandomize();
				break;
			case "trail":
				onTogglePark();
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
		}
	}, [
		closeMenus,
		clipState,
		cyclePath,
		onCycleColor,
		onCycleLight,
		onDownloadClip,
		onRandomize,
		onRecord,
		onTogglePark,
		onTogglePin
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const target = e.target;
			if (target && [
				"INPUT",
				"TEXTAREA",
				"SELECT"
			].includes(target.tagName)) return;
			if (e.code === "Space") {
				e.preventDefault();
				if (tuneOpen || dialOpen) closeMenus();
				else openDial();
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
				setSettings((prev) => ({
					...prev,
					frozen: !prev.frozen
				}));
				return;
			}
			if (e.code === "KeyV") {
				e.preventDefault();
				if (clipState === "ready") onDownloadClip();
				else onRecord();
				return;
			}
			if (e.key === "r" || e.key === "R") {
				e.preventDefault();
				onRandomize();
				return;
			}
			if (e.key === "e" || e.key === "E") {
				e.preventDefault();
				onExport();
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
			if (e.key === "?" || e.shiftKey && e.code === "Slash") {
				e.preventDefault();
				setDialOpen(true);
				setTuneOpen(true);
				setHelpOpen(true);
				setMoreOpen(true);
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
				setSettings((prev) => ({
					...prev,
					segments: clampSegments(prev.segments - 1)
				}));
				return;
			}
			if (e.key === "]") {
				setSettings((prev) => ({
					...prev,
					segments: clampSegments(prev.segments + 1)
				}));
				return;
			}
			if (e.shiftKey && e.code === "ArrowLeft") {
				e.preventDefault();
				setSettings((prev) => ({
					...prev,
					colorMotion: "hold",
					hue: (prev.hue + 360 - 8) % 360
				}));
				return;
			}
			if (e.shiftKey && e.code === "ArrowRight") {
				e.preventDefault();
				setSettings((prev) => ({
					...prev,
					colorMotion: "hold",
					hue: (prev.hue + 8) % 360
				}));
				return;
			}
			if (e.shiftKey && e.code === "ArrowUp") {
				e.preventDefault();
				setSettings((prev) => ({
					...prev,
					persist: clamp(prev.persist + 8, 0, 100)
				}));
				return;
			}
			if (e.shiftKey && e.code === "ArrowDown") {
				e.preventDefault();
				setSettings((prev) => ({
					...prev,
					persist: clamp(prev.persist - 8, 0, 100)
				}));
				return;
			}
			if (dialOpen && !tuneOpen && e.code.startsWith("Arrow")) {
				e.preventDefault();
				const idx = DIAL_IDS.indexOf(focusId);
				const n = DIAL_IDS.length;
				const next = DIAL_IDS[(idx + (e.code === "ArrowLeft" || e.code === "ArrowUp" ? -1 : 1) + n) % n];
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
				const n = digit[1];
				if (n === "1" || n === "0") {
					if (e.shiftKey) setSettings((prev) => {
						saveMacroSlot(n, prev);
						return prev;
					});
					else recallMacroSlot(n);
					return;
				}
				const folds = Number(n);
				if (folds >= 2 && folds <= 9) {
					setSettings((prev) => ({
						...prev,
						segments: folds
					}));
					flash(`${folds} folds`);
				}
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		activateFocus,
		closeMenus,
		clipState,
		cyclePath,
		dialOpen,
		focusId,
		flash,
		hiddenChrome,
		onClear,
		onCyclePersist,
		onDownloadClip,
		onExport,
		onRandomize,
		onRecord,
		onTogglePin,
		openDial,
		recallMacroSlot,
		saveMacroSlot,
		tuneOpen
	]);
	const pathLabel = settings.pathMode === "twin" ? "Twin brush" : settings.pathMode === "orbit" ? "Orbit" : settings.pathMode === "echo" ? "Echo" : settings.pathMode === "rosette" ? "Rosette" : settings.pathMode === "field" ? "Field" : null;
	const status = exportLabel ?? notice ?? (clipState === "recording" ? `Recording ${Math.max(0, clipMax - clipElapsed).toFixed(0)}s` : clipState === "ready" ? "Clip ready" : clipState === "unsupported" ? "Recording isn’t available here" : copied ? "Copied" : settings.frozen ? "Frozen" : pinned ? "Pin parked" : macroSlot ? macros[macroSlot] ? `Slot ${macroSlot}` : `Save ${macroSlot}` : pathLabel);
	const showHeader = !hiddenChrome && !tuneOpen;
	const downloadButton = clipState === "ready" && !exportKind && heldClip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-testid": "btn-download-clip",
		onClick: () => void onDownloadClip(),
		className: "pointer-events-auto rounded-full bg-fg px-3 py-1.5 text-xs font-medium text-bg",
		children: heldClip.name.endsWith(".gif") ? "Download GIF" : heldClip.name.endsWith(".mp4") ? "Download MP4" : heldClip.name.includes("-clip-") ? "Download clip" : "Download video"
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-screen h-dvh w-full select-none overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoStage, {
				ref: stageRef,
				settings,
				bottomInset,
				rimPad,
				topInset,
				menuOpen: dialOpen || tuneOpen,
				onInteract: () => {
					setHint(false);
					closeMenus();
				},
				onFreeze: () => {
					setHint(false);
					setSettings((prev) => ({
						...prev,
						frozen: !prev.frozen
					}));
				},
				onMiddleClick: cyclePath,
				onWheel: (delta) => {
					setSettings((prev) => ({
						...prev,
						persist: clamp(prev.persist + (delta > 0 ? -4 : 4), 0, 100)
					}));
				},
				onLayout: setLens,
				onPinChange: setPinned
			}),
			showHeader ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl leading-tight tracking-[-0.03em] text-fg sm:text-4xl",
					children: "Kaleido"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("mt-1 max-w-xs text-sm text-muted transition-opacity duration-300 ease-out sm:max-w-md", hint ? "opacity-100" : "opacity-0"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sm:hidden",
						children: "Tap the aperture. Two fingers paint. Decay sets how fast lines fade."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Paint · 2–9 folds · 1 and 0 macros · Space opens the dial"
					})]
				})] }), downloadButton ?? (status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md bg-surface px-3 py-1.5 text-xs font-medium tracking-wide text-fg shadow-[var(--shadow-border)]",
					children: status
				}) : null)]
			}) : downloadButton || status && !hiddenChrome ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute top-3 right-3 z-20",
				children: downloadButton ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md bg-surface px-3 py-1.5 text-xs font-medium tracking-wide text-fg shadow-[var(--shadow-border)]",
					children: status
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoControls, {
				settings,
				exported,
				copied,
				clipState,
				clipHeld: heldClip !== null,
				clipElapsed,
				clipMax,
				tuneOpen,
				dialOpen,
				helpOpen,
				moreOpen,
				recordEnabled,
				pinned,
				hiddenChrome,
				flower,
				lens,
				focusId,
				macros,
				macroSlot,
				onChange: patch,
				onRandomize,
				onClear,
				onExport: () => void onExport(),
				onExportGif: () => void onExportLoop("gif"),
				onExportMp4: () => void onExportLoop("mp4"),
				exportKind,
				onCopy: () => void onCopy(),
				onRecord,
				onDownloadClip: () => void onDownloadClip(),
				onRecordSeconds: setClipMax,
				onToggleTune: () => {
					setHiddenChrome(false);
					setDialOpen(true);
					setTuneOpen((open) => !open);
				},
				onToggleDial: () => {
					setHiddenChrome(false);
					setDialOpen((open) => {
						if (open) {
							setTuneOpen(false);
							setHelpOpen(false);
							setMoreOpen(false);
						}
						return !open;
					});
				},
				onTogglePin,
				onToggleHelp: () => setHelpOpen((open) => !open),
				onToggleMore: () => setMoreOpen((open) => !open),
				onHideChrome: () => {
					closeMenus();
					setHiddenChrome((hidden) => !hidden);
				},
				onCloseMenus: closeMenus,
				onTogglePark,
				onCycleLight,
				onRecallMacro: recallMacroSlot,
				onSaveMacro: (slot) => saveMacroSlot(slot, settings),
				onChromeHeight: setChromeH,
				onFocusId: setFocusId
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoApp, {});
}
//#endregion
export { Home as component };
