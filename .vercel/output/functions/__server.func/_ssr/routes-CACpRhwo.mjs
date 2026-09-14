import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Download, a as Spline, b as Aperture, c as Shuffle, d as Pin, f as Pause, g as Eraser, h as EyeOff, i as Square, l as RotateCw, m as Film, o as Sparkles, p as Palette, r as Timer, s as SlidersHorizontal, t as X, u as Play, v as Copy, y as Circle } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CACpRhwo.js
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
	frozen: false
};
var STORAGE_KEY = "kaleido.settings.v4";
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
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
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
function cycleId(list, id) {
	return list[(list.findIndex((item) => item.id === id) + 1) % list.length]?.id ?? list[0].id;
}
function loadSettings() {
	if (typeof localStorage === "undefined") return { ...DEFAULT_SETTINGS };
	try {
		const raw = localStorage.getItem("kaleido.settings.v4") ?? localStorage.getItem("kaleido.settings.v3") ?? localStorage.getItem("kaleido.settings.v2");
		if (!raw) return { ...DEFAULT_SETTINGS };
		const parsed = JSON.parse(raw);
		const oldBrush = Number(parsed.brush);
		const brush = Number.isFinite(oldBrush) ? oldBrush > 14 ? 5 : clamp(oldBrush, 1, 14) : 5;
		return {
			segments: clamp(Math.round(Number(parsed.segments) || 8), 3, 16),
			colorMode: isColorMode(parsed.colorMode) ? parsed.colorMode : "spectrum",
			brush,
			persist: clamp(Number(parsed.persist ?? 58), 0, 100),
			pathMode: isPathMode(parsed.pathMode) ? parsed.pathMode : "solo",
			colorMotion: isColorMotion(parsed.colorMotion) ? parsed.colorMotion : "drift",
			lightActivity: isLightActivity(parsed.lightActivity) ? parsed.lightActivity : "pulse",
			hue: clamp(Number(parsed.hue) || 0, 0, 359),
			spin: parsed.spin !== false,
			frozen: false
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
		4,
		6,
		8,
		10,
		12,
		14,
		16
	];
	const modes = COLOR_MODES.map((mode) => mode.id);
	const paths = PATH_MODES.map((mode) => mode.id);
	const lights = LIGHT_ACTIVITIES.map((mode) => mode.id);
	return {
		segments: segmentChoices[Math.floor(Math.random() * segmentChoices.length)] ?? 8,
		colorMode: modes[Math.floor(Math.random() * modes.length)] ?? "spectrum",
		brush: Math.round(3 + Math.random() * 7),
		persist: Math.round(40 + Math.random() * 50),
		pathMode: paths[Math.floor(Math.random() * paths.length)] ?? "solo",
		colorMotion: Math.random() > .35 ? "drift" : "hold",
		lightActivity: lights[Math.floor(Math.random() * lights.length)] ?? "pulse",
		hue: Math.floor(Math.random() * 360),
		spin: Math.random() > .35,
		frozen: false
	};
}
function Chip({ active, children, onClick, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		title: hint,
		onClick,
		className: cn("h-10 shrink-0 rounded-md px-3.5 text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96]", active ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
		children
	});
}
function downloadAsset(href, filename) {
	const a = document.createElement("a");
	a.href = href;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
}
function KaleidoControls({ settings, exported, copied, clipState, clipElapsed, clipMax, tuneOpen, dialOpen, helpOpen, recordEnabled, pinned, hiddenChrome, wide, lens, focusId, onChange, onRandomize, onClear, onExport, onCopy, onRecord, onRecordSeconds, onToggleTune, onToggleDial, onTogglePin, onToggleHelp, onHideChrome, onCloseMenus, onCyclePersist, onCycleLight, onChromeHeight, onFocusId }) {
	const chromeRef = (0, import_react.useRef)(null);
	const remain = Math.max(0, clipMax - clipElapsed);
	const recording = clipState === "recording";
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
			label: recording ? `${remain.toFixed(0)}s left` : clipState === "saved" ? "Saved" : `Record ${clipMax}s`,
			testId: "btn-record",
			active: recording,
			onClick: onRecord,
			icon: recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-4 fill-destructive text-destructive" })
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
			label: `Trail ${persistLabel(settings.persist)}`,
			testId: "btn-persist",
			sticky: true,
			onClick: onCyclePersist,
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
	const flower = showPetals && wide;
	const dock = showPetals && !wide;
	const hasLens = lens.radius > 40;
	const petalR = hasLens ? Math.max(72, Math.min(lens.radius + 36, lens.cx - 28, Math.max(72, lens.cy - 72))) : 110;
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
				const ang = (126 + (i + .5) / petals.length * 288) * Math.PI / 180;
				const x = hasLens ? lens.cx + Math.cos(ang) * petalR : Math.cos(ang) * petalR;
				const y = hasLens ? lens.cy + Math.sin(ang) * petalR : Math.sin(ang) * petalR;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": wide ? petal.testId : void 0,
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
					className: "pointer-events-auto w-full max-w-md rounded-2xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "persist",
									className: "w-16 shrink-0 text-xs font-medium text-muted",
									children: "Decay"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									id: "persist",
									"data-testid": "slider-persist",
									min: 0,
									max: 100,
									step: 1,
									value: [settings.persist],
									onValueChange: (value) => onChange({ persist: value[0] ?? 88 }),
									"aria-label": "How long trails linger"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-12 text-right text-xs font-medium tabular-nums text-fg",
									children: persistLabel(settings.persist)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "segments",
									className: "w-16 shrink-0 text-xs font-medium text-muted",
									children: "Folds"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									id: "segments",
									"data-testid": "slider-segments",
									min: 3,
									max: 16,
									step: 1,
									value: [settings.segments],
									onValueChange: (value) => onChange({ segments: value[0] ?? 8 }),
									"aria-label": "Segment count"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-8 text-right font-medium tabular-nums text-fg",
									children: settings.segments
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "brush",
									className: "w-16 shrink-0 text-xs font-medium text-muted",
									children: "Line"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									id: "brush",
									min: 1,
									max: 14,
									step: 1,
									value: [settings.brush],
									onValueChange: (value) => onChange({ brush: value[0] ?? 5 }),
									"aria-label": "Line thickness"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-8 text-right font-medium tabular-nums text-fg",
									children: settings.brush
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-1 overflow-x-auto",
							role: "radiogroup",
							"aria-label": "Color motion",
							children: [COLOR_MOTIONS.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								hint: mode.hint,
								active: settings.colorMotion === mode.id,
								onClick: () => onChange({ colorMotion: mode.id }),
								children: mode.label
							}, mode.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: settings.persist >= 100,
								onClick: () => onChange({ persist: 100 }),
								hint: "Lines stay until you change the decay",
								children: "Park"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-nowrap gap-1 overflow-x-auto",
							role: "radiogroup",
							"aria-label": "Light activity",
							children: LIGHT_ACTIVITIES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								hint: mode.hint,
								active: settings.lightActivity === mode.id,
								onClick: () => onChange({ lightActivity: mode.id }),
								children: mode.label
							}, mode.id))
						}),
						settings.colorMotion === "hold" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "hue",
									className: "w-16 shrink-0 text-xs font-medium text-muted",
									children: "Hue"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									id: "hue",
									min: 0,
									max: 359,
									step: 1,
									value: [settings.hue],
									onValueChange: (value) => onChange({ hue: value[0] ?? 0 }),
									"aria-label": "Hue"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-8 text-right font-medium tabular-nums text-fg",
									children: settings.hue
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-1 overflow-x-auto",
							role: "radiogroup",
							"aria-label": "Clip length",
							children: [RECORD_OPTIONS.map((seconds) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
								active: clipMax === seconds,
								onClick: () => onRecordSeconds(seconds),
								hint: `Record ${seconds} seconds`,
								children: [seconds, "s"]
							}, seconds)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: recording,
								onClick: onRecord,
								hint: recordEnabled ? "Record the lens" : "Recording isn’t available here",
								children: recording ? `${remain.toFixed(0)}s` : clipState === "saved" ? "Saved" : "Record"
							})]
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
									"data-testid": "btn-copy",
									size: "sm",
									variant: "secondary",
									onClick: onCopy,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? "Copied" : "Copy"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									"data-testid": "btn-export",
									size: "sm",
									variant: "secondary",
									onClick: onExport,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), exported ? "Saved" : "PNG"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 grid grid-cols-4 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									"data-testid": "btn-social-gif",
									size: "sm",
									variant: "secondary",
									onClick: () => downloadAsset("/kaleido.gif", "kaleido.gif"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {}), "GIF"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									"data-testid": "btn-social-mp4",
									size: "sm",
									variant: "secondary",
									onClick: () => downloadAsset("/kaleido-loop.mp4", "kaleido-loop.mp4"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {}), "MP4"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									variant: "secondary",
									onClick: onHideChrome,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {}), "Hide"]
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
						}),
						helpOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-1 text-xs leading-relaxed text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Space opens the dial · Arrows choose · Enter locks · Esc closes" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "F freeze · V record · R random · E save · C clear · L decay" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "WASD paint · Alt or right-drag a second brush · B pin" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "H hide UI · P path · T tune · Wheel decay · 1–6 color" })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 hidden text-xs leading-relaxed text-pretty text-muted sm:block",
							children: "Space opens the menu. Arrows pick a control, Enter locks it. Lines decay unless Park is on."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [dock ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto mb-2 w-full max-w-sm rounded-2xl bg-surface p-2 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center gap-2 px-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 shrink-0 text-xs font-medium text-muted",
								children: "Decay"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								"data-testid": "slider-persist-dock",
								min: 0,
								max: 100,
								step: 1,
								value: [settings.persist],
								onValueChange: (value) => onChange({ persist: value[0] ?? 88 }),
								"aria-label": "How long trails linger"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 text-right text-xs font-medium tabular-nums text-fg",
								children: persistLabel(settings.persist)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
					})]
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
var MAX_STROKES = 90;
var MAX_PTS = 72;
function colorAt(mode, motion, hue, time, x, y, radius) {
	const u = Math.min(1, Math.hypot(x, y) / Math.max(1, radius));
	const ang = Math.atan2(y, x);
	const t = motion === "hold" ? 0 : time;
	const off = hue;
	switch (mode) {
		case "spectrum": return {
			h: (t * 46 + u * 150 + off) % 360,
			s: 84,
			l: 58,
			a: 1
		};
		case "prism": return {
			h: ((ang * 180 / Math.PI + 360 + t * 10 + off) % 360 + 360) % 360,
			s: 80,
			l: 60,
			a: 1
		};
		case "aurora": return {
			h: (150 + Math.sin(t * .65 + u * 5) * 78 + off + 360) % 360,
			s: 74,
			l: 56,
			a: 1
		};
		case "ember": return {
			h: (16 + Math.sin(t * 1.05 + u * 6) * 16 + off + 360) % 360,
			s: 90,
			l: 56,
			a: 1
		};
		case "ice": return {
			h: (196 + Math.sin(t * .7 + u * 4) * 24 + off + 360) % 360,
			s: 70,
			l: 62,
			a: 1
		};
		case "pearl": return {
			h: (36 + Math.sin(t * .5) * 10 + off + 360) % 360,
			s: 16,
			l: 78,
			a: 1
		};
	}
}
function activityAt(kind, time, along, seed) {
	switch (kind) {
		case "steady": return {
			a: .78 + .1 * Math.sin(time * 1.6 + seed),
			h: 0,
			w: 1
		};
		case "pulse": {
			const wave = .5 + .5 * Math.sin(time * 2.8 + seed);
			return {
				a: .22 + .78 * wave,
				h: 0,
				w: .82 + .28 * wave
			};
		}
		case "blink": {
			const beat = (time * 2.15 + seed * .15) % 1.15;
			const on = beat < .62 || beat > .74 && beat < .88;
			return {
				a: on ? .95 : .05,
				h: 0,
				w: on ? 1 : .7
			};
		}
		case "chase": {
			const head = (time * .62 + seed) % 1;
			const d = Math.abs(along - head);
			const prox = Math.min(d, 1 - d);
			const hot = prox < .1;
			return {
				a: hot ? 1 : .1 + .16 * (1 - prox),
				h: along * 50,
				w: hot ? 1.45 : .7
			};
		}
		case "firefly": {
			const tw = Math.sin(time * 6.8 + along * 22 + seed * 11);
			const lit = tw > .42;
			return {
				a: lit ? .2 + (tw - .42) * 1.6 : .08,
				h: lit ? 24 : 0,
				w: lit ? 1.25 : .72
			};
		}
		case "strobe": {
			const on = Math.sin(time * 16 + seed * 4) > .15;
			return {
				a: on ? 1 : .04,
				h: on ? 10 : 0,
				w: on ? 1.12 : .75
			};
		}
	}
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
var KaleidoEngine = class {
	display;
	root;
	dctx;
	dpr = 1;
	width = 0;
	height = 0;
	cx = 0;
	cy = 0;
	radius = 0;
	bottomInset = 0;
	rimPad = 0;
	settings;
	time = 0;
	spinAngle = 0;
	raf = 0;
	lastTs = 0;
	running = false;
	destroyed = false;
	cos = /* @__PURE__ */ new Float64Array(8);
	sin = /* @__PURE__ */ new Float64Array(8);
	brushes = /* @__PURE__ */ new Map();
	echoes = /* @__PURE__ */ new Map();
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
	constructor(display, root, settings) {
		const dctx = display.getContext("2d", { alpha: false });
		if (!dctx) throw new Error("Canvas 2D is not available");
		this.display = display;
		this.root = root;
		this.dctx = dctx;
		this.settings = { ...settings };
		this.rebuildTrig();
		this.reseedIdle();
		this.reduced = prefersReducedMotion();
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
		const froze = next.frozen && !this.settings.frozen;
		this.settings = { ...next };
		if (segsChanged) this.rebuildTrig();
		if (next.frozen) this.brushes.clear();
		if (froze) this.pulse();
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
		this.hasIdle = false;
		this.brushes.clear();
		this.echoes.clear();
		this.unpin();
		this.resumeIdleAt = Number.POSITIVE_INFINITY;
		this.present();
	}
	burst(seed = false) {
		this.reseedIdle();
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
		this.resumeIdleAt = this.time;
		this.present();
	}
	exportPng() {
		return this.exportBlob().then((blob) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
			a.href = url;
			a.download = `kaleido-${stamp}.png`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
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
		for (const key of [
			`${id}:main`,
			`${id}:twin`,
			`${id}:orbit`,
			`${id}:echo`
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
	pickDpr() {
		const raw = window.devicePixelRatio || 1;
		if ((navigator.deviceMemory ?? 8) <= 2 || (navigator.hardwareConcurrency || 4) <= 2) return 1;
		if (window.matchMedia("(pointer: coarse)").matches) return Math.min(1.5, raw);
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
		const bottom = this.bottomInset * dpr;
		const pad = this.rimPad * dpr;
		const usableH = Math.max(1, h - bottom);
		this.cx = w / 2;
		this.cy = usableH / 2;
		this.radius = Math.max(24, Math.min(this.cx, this.cy) - 16 * dpr - pad);
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
		while (this.strokes.length >= MAX_STROKES) {
			const idx = this.strokes.findIndex((s) => !s.pinned);
			this.strokes.splice(idx === -1 ? 0 : idx, 1);
		}
		const s = {
			xs: new Float32Array(MAX_PTS),
			ys: new Float32Array(MAX_PTS),
			len: 0,
			born: this.time,
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
			const a = this.time * 1.25;
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
			t: this.time
		});
		const horizon = this.time - .55;
		while (buf.length > 2 && (buf[1]?.t ?? 0) < horizon) buf.shift();
		const ghost = buf[0];
		if (ghost && this.time - ghost.t >= .45) {
			const next = buf[1] ?? ghost;
			const width = this.settings.brush * (.4 + .3 * pressure);
			const s = this.liveStroke(`${id}:echo`, pinned, width);
			if (s.len === 0) this.pushPoint(s, ghost.x, ghost.y);
			this.strokeTo(s, ghost.x, ghost.y, next.x, next.y);
		}
	}
	cullStrokes() {
		if (this.parkedGlobal()) return;
		const life = this.lifetime();
		const pinOn = this.pin !== null;
		this.strokes = this.strokes.filter((s) => {
			if (s.pinned && pinOn) return true;
			if (s.pinned && !pinOn) s.pinned = false;
			return this.time - s.born < life;
		});
	}
	fadeOf(s) {
		if (this.parkedGlobal() || s.pinned && this.pin !== null) return 1;
		const life = this.lifetime();
		const age = this.time - s.born;
		const t = Math.max(0, 1 - age / life);
		return t * t;
	}
	needsAlong() {
		const a = this.settings.lightActivity;
		return a === "chase" || a === "firefly";
	}
	drawPolyline(ctx, s, ca, sa, mirror, color, fade) {
		const actKind = this.settings.lightActivity;
		const w = Math.max(.85, s.width * .32 * this.dpr);
		const alongNeeded = this.needsAlong();
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
			const act = activityAt(actKind, this.time, .5, s.seed);
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
			const act = activityAt(actKind, this.time, along, s.seed);
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
	present() {
		const ctx = this.dctx;
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
		const n = this.settings.segments;
		for (const s of this.strokes) {
			if (s.len < 2) continue;
			const fade = this.fadeOf(s);
			if (fade < .02) continue;
			const mid = Math.max(0, (s.len >> 1) - 1);
			const color = colorAt(this.settings.colorMode, this.settings.colorMotion, this.settings.hue, this.time, s.xs[mid] ?? 0, s.ys[mid] ?? 0, this.radius);
			for (let i = 0; i < n; i++) {
				const ca = this.cos[i] ?? 1;
				const sa = this.sin[i] ?? 0;
				this.drawPolyline(ctx, s, ca, sa, false, color, fade);
				this.drawPolyline(ctx, s, ca, sa, true, color, fade);
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
			if (this.settings.spin && !this.reduced) this.spinAngle += .07 * dt;
			this.present();
			return;
		}
		this.time += dt;
		this.cullStrokes();
		if (this.settings.spin && !this.reduced) this.spinAngle += .07 * dt;
		const usingKeys = this.stepKeys(dt);
		this.stepBrushes(dt);
		this.stepPin(dt);
		if (!this.anyPainting() && !usingKeys && !this.reduced && this.time >= this.resumeIdleAt) {
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
var ClipRecorder = class {
	recorder = null;
	chunks = [];
	raf = 0;
	startedAt = 0;
	maxMs = 15e3;
	handlers = {};
	mime = "";
	stream = null;
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
		if (!this.recorder) return;
		if (this.recorder.state === "recording") try {
			this.recorder.stop();
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
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
var KaleidoStage = (0, import_react.forwardRef)(function KaleidoStage({ settings, bottomInset, rimPad, menuOpen, onInteract, onFreeze, onMiddleClick, onWheel, onLayout, onPinChange }, ref) {
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
	const pressRef = (0, import_react.useRef)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	settingsRef.current = settings;
	onWheelRef.current = onWheel;
	onFreezeRef.current = onFreeze;
	onLayoutRef.current = onLayout;
	onPinRef.current = onPinChange;
	insetRef.current = bottomInset;
	rimRef.current = rimPad;
	(0, import_react.useImperativeHandle)(ref, () => ({
		clear: () => engineRef.current?.clear(),
		burst: () => engineRef.current?.burst(),
		exportPng: () => engineRef.current?.exportPng() ?? Promise.resolve(),
		copyPng: () => engineRef.current?.copyPng() ?? Promise.resolve(false),
		setBottomInset: (px) => engineRef.current?.setBottomInset(px),
		setRimPad: (px) => engineRef.current?.setRimPad(px),
		startClip: (handlers, seconds) => {
			const canvas = engineRef.current?.canvas();
			if (!canvas || !canRecord()) return false;
			return recorderRef.current.start(canvas, {
				...handlers,
				onStop: (blob) => {
					if (blob && blob.size > 0) downloadBlob(blob, `kaleido-clip-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19)}.${blob.type.includes("mp4") ? "mp4" : "webm"}`);
					handlers.onStop?.(blob);
				}
			}, seconds);
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
	}, [bottomInset, rimPad]);
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
function useWide() {
	const [wide, setWide] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(min-width: 640px)");
		const apply = () => setWide(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);
	return wide;
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
	const [hiddenChrome, setHiddenChrome] = (0, import_react.useState)(false);
	const [pinned, setPinned] = (0, import_react.useState)(false);
	const [clipState, setClipState] = (0, import_react.useState)("idle");
	const [clipElapsed, setClipElapsed] = (0, import_react.useState)(0);
	const [clipMax, setClipMax] = (0, import_react.useState)(15);
	const [recordEnabled, setRecordEnabled] = (0, import_react.useState)(true);
	const [lens, setLens] = (0, import_react.useState)({
		cx: 0,
		cy: 0,
		radius: 0
	});
	const [chromeH, setChromeH] = (0, import_react.useState)(76);
	const [focusId, setFocusId] = (0, import_react.useState)("freeze");
	const stageRef = (0, import_react.useRef)(null);
	const burstOnce = (0, import_react.useRef)(false);
	const wide = useWide();
	(0, import_react.useEffect)(() => {
		setSettings(loadSettings());
		setReady(true);
		setRecordEnabled(canRecord());
	}, []);
	const bottomInset = hiddenChrome ? 0 : Math.max(chromeH, tuneOpen ? 312 : dialOpen && !wide ? 228 : 76);
	const rimPad = !hiddenChrome && dialOpen && !tuneOpen && wide ? 88 : 0;
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		saveSettings(settings);
	}, [ready, settings]);
	const patch = (0, import_react.useCallback)((next) => {
		setSettings((prev) => ({
			...prev,
			...next
		}));
	}, []);
	const closeMenus = (0, import_react.useCallback)(() => {
		setDialOpen(false);
		setTuneOpen(false);
		setHelpOpen(false);
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
	const onRecord = (0, import_react.useCallback)(() => {
		if (stageRef.current?.recording()) {
			stageRef.current.stopClip();
			return;
		}
		if (!recordEnabled) {
			setClipState("unsupported");
			window.setTimeout(() => setClipState("idle"), 1800);
			return;
		}
		setSettings((prev) => prev.frozen ? {
			...prev,
			frozen: false
		} : prev);
		setClipElapsed(0);
		if (stageRef.current?.startClip({
			onTick: (elapsed) => setClipElapsed(elapsed),
			onStop: (blob) => {
				setClipState(blob && blob.size > 0 ? "saved" : "idle");
				setClipElapsed(0);
				window.setTimeout(() => setClipState("idle"), 1600);
			}
		}, clipMax)) setClipState("recording");
		else {
			setClipState("unsupported");
			window.setTimeout(() => setClipState("idle"), 1800);
		}
	}, [recordEnabled, clipMax]);
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
		}
	}, [
		closeMenus,
		cyclePath,
		onCycleColor,
		onCycleLight,
		onCyclePersist,
		onRandomize,
		onRecord,
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
					segments: clamp(prev.segments - 1, 3, 16)
				}));
				return;
			}
			if (e.key === "]") {
				setSettings((prev) => ({
					...prev,
					segments: clamp(prev.segments + 1, 3, 16)
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
			const digit = e.code.match(/^Digit([1-6])$/);
			if (digit) {
				const mode = COLOR_MODES[Number(digit[1]) - 1];
				if (mode) setSettings((prev) => ({
					...prev,
					colorMode: mode.id
				}));
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
		hiddenChrome,
		onClear,
		onCyclePersist,
		onExport,
		onRandomize,
		onRecord,
		onTogglePin,
		openDial,
		tuneOpen
	]);
	const status = clipState === "recording" ? `Recording ${Math.max(0, clipMax - clipElapsed).toFixed(0)}s` : clipState === "unsupported" ? "Recording isn’t available here" : copied ? "Copied" : settings.frozen ? "Frozen" : pinned ? "Pin parked" : settings.pathMode !== "solo" ? settings.pathMode === "twin" ? "Twin brush" : settings.pathMode === "orbit" ? "Orbit" : "Echo" : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-screen h-dvh w-full select-none overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoStage, {
				ref: stageRef,
				settings,
				bottomInset,
				rimPad,
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
			!hiddenChrome ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl leading-tight tracking-[-0.03em] text-fg sm:text-4xl",
					children: "Kaleido"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("mt-1 max-w-xs text-sm text-muted transition-opacity duration-300 ease-out sm:max-w-md", hint ? "opacity-100" : "opacity-0"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sm:hidden",
						children: "Tap the aperture. Two fingers paint. Trail sets how fast lines fade."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Paint · Space opens the dial · Arrows choose · Enter locks · F freeze"
					})]
				})] }), status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md bg-surface px-3 py-1.5 text-xs font-medium tracking-wide text-fg shadow-[var(--shadow-border)]",
					children: status
				}) : null]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KaleidoControls, {
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
				onChange: patch,
				onRandomize,
				onClear,
				onExport: () => void onExport(),
				onCopy: () => void onCopy(),
				onRecord,
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
						}
						return !open;
					});
				},
				onTogglePin,
				onToggleHelp: () => setHelpOpen((open) => !open),
				onHideChrome: () => {
					closeMenus();
					setHiddenChrome((hidden) => !hidden);
				},
				onCloseMenus: closeMenus,
				onCyclePersist,
				onCycleLight,
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
