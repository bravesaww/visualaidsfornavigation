import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RadioTower, c as Moon, d as Binoculars, f as ArrowLeft, i as RotateCcw, l as Footprints, n as Sun, o as Plane, r as Settings2, s as Move, u as Cloud } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { A as Scene, C as PerspectiveCamera, D as PointsMaterial, E as Points, F as Vector3, M as SphereGeometry, N as TextureLoader, O as RepeatWrapping, P as TorusGeometry, S as MeshStandardMaterial, T as PointLight, _ as MathUtils, a as BufferGeometry, b as MeshLambertMaterial, c as CircleGeometry, d as DirectionalLight, f as ExtrudeGeometry, g as LinearFilter, h as HemisphereLight, i as BufferAttribute, j as Shape, k as SRGBColorSpace, l as ConeGeometry, m as Group, n as AmbientLight, o as CanvasTexture, p as Fog, r as BoxGeometry, s as CapsuleGeometry, t as WebGLRenderer, u as CylinderGeometry, v as Mesh, w as PlaneGeometry, x as MeshPhysicalMaterial, y as MeshBasicMaterial } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CjP3G8jQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RWY = {
	length: 2440,
	width: 45,
	heading09: 90,
	stopway: 60,
	clearway: 300
};
var TAXI = {
	width: 23,
	parallelZ: 95,
	linkXs: [
		-720,
		-240,
		240,
		720
	],
	linkNames: [
		"E",
		"D",
		"C",
		"B"
	]
};
var WEATHER_OPTIONS = [
	{
		id: "clear",
		label: "Clear sky"
	},
	{
		id: "clouds",
		label: "Clouds"
	},
	{
		id: "heavyClouds",
		label: "Heavy clouds"
	},
	{
		id: "moonlight",
		label: "Moonlight"
	},
	{
		id: "storm",
		label: "Storm"
	},
	{
		id: "drizzle",
		label: "Drizzle"
	},
	{
		id: "rain",
		label: "Rain"
	},
	{
		id: "heavyRain",
		label: "Heavy rain"
	}
];
var DEFAULT_MARKINGS = {
	centerline: true,
	threshold: true,
	aiming: true,
	tdz: true,
	sides: true,
	numbers: true,
	taxiLines: true,
	hold: true,
	signs: true,
	areas: true
};
var DEFAULT_LIGHTS = {
	edge: true,
	threshold: true,
	end: true,
	centerline: true,
	tdz: true,
	als: true,
	papi: true,
	taxi: true,
	stopbar: true,
	rabbit: true
};
var PAPI_OPTIONS = [
	{
		id: "auto",
		label: "Auto",
		hint: "Follows aircraft path"
	},
	{
		id: "high",
		label: "4 white",
		hint: "Well above path"
	},
	{
		id: "slightHigh",
		label: "3W / 1R",
		hint: "Slightly high"
	},
	{
		id: "onPath",
		label: "2W / 2R",
		hint: "On 3° path"
	},
	{
		id: "slightLow",
		label: "1W / 3R",
		hint: "Slightly low"
	},
	{
		id: "low",
		label: "4 red",
		hint: "Well below path"
	}
];
var MARKING_INFO = {
	centerline: {
		label: "Centre-line",
		dim: "White · 30 m × 0.90 m, 20 m gap"
	},
	threshold: {
		label: "Threshold",
		dim: "White · 12 bars, 30 m × 1.80 m"
	},
	aiming: {
		label: "Aiming point",
		dim: "White · 60 m × 10 m at 400 m"
	},
	tdz: {
		label: "Touchdown zone",
		dim: "White · 22.5 m × 3 m, 150 m spacing"
	},
	sides: {
		label: "Side stripes",
		dim: "White · 0.90 m wide"
	},
	numbers: {
		label: "09 / 27",
		dim: "White · 9 m high designation"
	},
	taxiLines: {
		label: "Taxiway centre-line",
		dim: "Yellow · 0.30 m"
	},
	hold: {
		label: "Holding points",
		dim: "Yellow pattern A · CAT III"
	},
	signs: {
		label: "Info / location signs",
		dim: "Yellow/black · red mandatory"
	},
	areas: {
		label: "Clearway / stopway / ASDA",
		dim: "SWY 60 m · CWY 300 m · ASDA 2500 m"
	}
};
var LIGHT_INFO = {
	edge: {
		label: "Edge",
		dim: "White · 60 m spacing"
	},
	threshold: {
		label: "Threshold",
		dim: "Green · wing bar"
	},
	end: {
		label: "Runway end",
		dim: "Red"
	},
	centerline: {
		label: "Centre-line",
		dim: "White → alt. → red (last 300 m)"
	},
	tdz: {
		label: "TDZ CAT III",
		dim: "White · 30 m, first 900 m"
	},
	als: {
		label: "ALS CAT III",
		dim: "White · 900 m with crossbars"
	},
	papi: {
		label: "PAPI",
		dim: "Red / white · 4 units, left of 09"
	},
	taxi: {
		label: "Taxiway edge",
		dim: "Blue · 60 m"
	},
	stopbar: {
		label: "Stop bars",
		dim: "Red · CAT III hold"
	},
	rabbit: {
		label: "Sequenced flashers",
		dim: "White · 60 m, approach"
	}
};
var useSim = create((set) => ({
	started: false,
	mode: "walk",
	weather: "clear",
	night: false,
	moveSpeed: 1,
	lookSens: 1,
	appSpeedKt: 138,
	glideslope: 3,
	fov: 60,
	traffic: "off",
	walkAxis: {
		x: 0,
		y: 0
	},
	restartToken: 0,
	markings: { ...DEFAULT_MARKINGS },
	lights: { ...DEFAULT_LIGHTS },
	lightLevel: 2,
	papiMode: "onPath",
	binocs: 1,
	hud: {
		dist: "—",
		alt: "—",
		ias: "—",
		gs: "3.0°",
		phase: "STANDBY",
		heading: "090"
	},
	panel: false,
	set: (p) => set(p)
}));
var MODES = [
	{
		id: "walk",
		title: "Walk",
		kicker: "On the strip",
		body: "First-person on the runway. WASD to walk, click to look.",
		keys: "WASD · Shift sprint · click look"
	},
	{
		id: "approach",
		title: "A320 Approach",
		kicker: "Left seat",
		body: "Captain’s seat on ILS CAT III to runway 09, from 2 NM through flare, rollout and taxi.",
		keys: "Drag look · speed in settings"
	},
	{
		id: "noclip",
		title: "Noclip",
		kicker: "Free camera",
		body: "Unconstrained fly-through. Inspect lighting and markings from any angle.",
		keys: "WASD · Q/E up/down · Shift boost"
	},
	{
		id: "tower",
		title: "Tower",
		kicker: "Visual cab",
		body: "Seated in the control room watching arrivals and departures.",
		keys: "Look · WASD lean · traffic on"
	}
];
function Slider({ label, value, min, max, step, display, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1 flex justify-between text-xs text-muted",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-fg",
				children: display
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			className: "w-full accent-accent",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(Number(e.target.value))
		})]
	});
}
function Overlay() {
	const s = useSim();
	if (!s.started) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ui": true,
		className: "absolute inset-0 z-50 overflow-y-auto bg-bg px-4 py-6 sm:px-6 sm:py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.2em] text-muted uppercase",
					children: "Visual navigation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-3xl font-medium tracking-tight text-fg",
					children: "Aerodrome 09"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
					children: "Four views of the ICAO field. Pick a mode."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-3 sm:grid-cols-2",
					children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onPointerDown: (e) => {
							e.stopPropagation();
							s.set({
								started: true,
								mode: m.id,
								panel: false,
								traffic: m.id === "tower" ? "arriving" : "off"
							});
						},
						className: "rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-accent hover:bg-elevated",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-[0.16em] text-muted uppercase",
								children: m.kicker
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-lg font-medium text-fg",
								children: m.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: m.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-mono text-[11px] text-subtle",
								children: m.keys
							})
						]
					}, m.id))
				})
			]
		})
	});
	const icons = {
		walk: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "size-5" }),
		approach: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "size-5" }),
		noclip: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move, { className: "size-5" }),
		tower: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioTower, { className: "size-5" })
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		s.mode === "approach" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CockpitChrome, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			"data-ui": true,
			className: "pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.16em] text-muted uppercase",
				children: "Aerodrome 09"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: labelMode(s.mode)
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-full border border-border bg-surface/90 px-3 py-1 font-mono text-xs text-accent",
				children: ["HDG ", s.hud.heading]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ui": true,
			className: "absolute top-14 left-3 z-40 flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Home",
					onClick: () => s.set({
						started: false,
						panel: false
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: `${labelMode(s.mode)} settings`,
					active: s.panel,
					onClick: () => s.set({ panel: !s.panel }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Day / night",
					onClick: () => s.set({ night: !s.night }),
					children: s.night ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Weather",
					active: s.panel,
					onClick: () => s.set({ panel: true }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-5" })
				}),
				s.mode === "approach" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Restart approach",
					onClick: () => s.set({ restartToken: s.restartToken + 1 }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-5" })
				}),
				s.mode === "tower" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Binoculars",
					active: s.binocs > 1,
					onClick: () => s.set({ binocs: s.binocs === 5 ? 1 : s.binocs + 1 }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Binoculars, { className: "size-5" })
				})
			]
		}),
		s.panel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			"data-ui": true,
			className: "absolute top-16 right-3 z-40 w-[min(20rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-lg border border-border bg-surface p-4 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-sm font-medium",
						children: [
							icons[s.mode],
							labelMode(s.mode),
							" settings"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-muted hover:text-fg",
						onClick: () => s.set({ panel: false }),
						children: "Close"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] tracking-[0.14em] text-muted uppercase",
					children: "Weather"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 grid grid-cols-2 gap-1.5",
					children: WEATHER_OPTIONS.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `h-9 rounded-md border px-2 text-left text-[11px] ${s.weather === w.id ? "border-accent bg-elevated text-accent" : "border-border text-muted hover:text-fg"}`,
						onClick: () => s.set({ weather: w.id }),
						children: w.label
					}, w.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] tracking-[0.14em] text-muted uppercase",
					children: "Traffic"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex gap-1.5",
					children: [
						["off", "Off"],
						["arriving", "Arriving"],
						["departing", "Departing"]
					].map(([id, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `h-9 flex-1 rounded-md border text-[11px] ${s.traffic === id ? "border-accent bg-elevated text-accent" : "border-border text-muted hover:text-fg"}`,
						onClick: () => s.set({ traffic: id }),
						children: lab
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] tracking-[0.14em] text-muted uppercase",
					children: "Light intensity"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex gap-1.5",
					children: [
						1,
						2,
						3
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `h-9 flex-1 rounded-md border text-[11px] ${s.lightLevel === n ? "border-accent bg-elevated text-accent" : "border-border text-muted hover:text-fg"}`,
						onClick: () => s.set({ lightLevel: n }),
						children: n === 1 ? "Low" : n === 2 ? "Medium" : "High"
					}, n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] tracking-[0.14em] text-muted uppercase",
					children: "PAPI glide path"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 grid grid-cols-2 gap-1.5",
					children: PAPI_OPTIONS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `h-11 rounded-md border px-2 text-left ${s.papiMode === p.id ? "border-accent bg-elevated text-accent" : "border-border text-muted hover:text-fg"}`,
						onClick: () => s.set({ papiMode: p.id }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[11px]",
							children: p.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[10px] text-subtle",
							children: p.hint
						})]
					}, p.id))
				}),
				(s.mode === "walk" || s.mode === "noclip") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					label: "Move speed",
					value: s.moveSpeed,
					min: .3,
					max: 4,
					step: .1,
					display: `${s.moveSpeed.toFixed(1)}×`,
					onChange: (v) => s.set({ moveSpeed: v })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					label: "Look sensitivity",
					value: s.lookSens,
					min: .4,
					max: 2.2,
					step: .1,
					display: `${s.lookSens.toFixed(1)}×`,
					onChange: (v) => s.set({ lookSens: v })
				})] }),
				s.mode === "approach" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Approach speed",
						value: s.appSpeedKt,
						min: 118,
						max: 170,
						step: 2,
						display: `${s.appSpeedKt} kt`,
						onChange: (v) => s.set({ appSpeedKt: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Glideslope",
						value: s.glideslope,
						min: 2.5,
						max: 3.5,
						step: .1,
						display: `${s.glideslope.toFixed(1)}°`,
						onChange: (v) => s.set({ glideslope: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Look sensitivity",
						value: s.lookSens,
						min: .4,
						max: 2,
						step: .1,
						display: `${s.lookSens.toFixed(1)}×`,
						onChange: (v) => s.set({ lookSens: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 h-9 w-full rounded-md border border-border text-xs hover:border-accent",
						onClick: () => s.set({ restartToken: s.restartToken + 1 }),
						children: "Restart approach"
					})
				] }),
				s.mode === "tower" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						label: "Field of view",
						value: s.fov,
						min: 35,
						max: 75,
						step: 1,
						display: `${s.fov}°`,
						onChange: (v) => s.set({ fov: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 mt-2 text-[11px] tracking-[0.14em] text-muted uppercase",
						children: "Binoculars"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1.5",
						children: [
							1,
							2,
							3,
							4,
							5
						].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `h-9 flex-1 rounded-md border text-[11px] ${s.binocs === z ? "border-accent bg-elevated text-accent" : "border-border text-muted hover:text-fg"}`,
							onClick: () => s.set({ binocs: z }),
							children: z === 1 ? "Off" : `${z}×`
						}, z))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs leading-relaxed text-muted",
						children: "Clear glass cab. Drag to look. WASD to walk. Binoculars zoom the field."
					})
				] }),
				(s.mode === "walk" || s.mode === "noclip" || s.mode === "approach" || s.mode === "tower") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 border-t border-border pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-[11px] tracking-[0.14em] text-muted uppercase",
							children: "Markings"
						}),
						Object.keys(MARKING_INFO).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer items-start justify-between gap-3 py-1.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								children: MARKING_INFO[k].label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[10px] text-subtle",
								children: MARKING_INFO[k].dim
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mt-1 size-4 accent-accent",
								checked: s.markings[k],
								onChange: (e) => s.set({ markings: {
									...s.markings,
									[k]: e.target.checked
								} })
							})]
						}, k)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 mb-1 text-[11px] tracking-[0.14em] text-muted uppercase",
							children: "Lights"
						}),
						Object.keys(LIGHT_INFO).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer items-start justify-between gap-3 py-1.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								children: LIGHT_INFO[k].label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[10px] text-subtle",
								children: LIGHT_INFO[k].dim
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mt-1 size-4 accent-accent",
								checked: s.lights[k],
								onChange: (e) => s.set({ lights: {
									...s.lights,
									[k]: e.target.checked
								} })
							})]
						}, k))
					]
				})
			]
		}),
		s.mode === "approach" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute top-28 left-16 z-20 w-52 rounded-md border border-border bg-bg/75 px-3 py-2 font-mono text-[11px] text-accent",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-center tracking-[0.12em] text-muted",
				children: "A320 · ILS CAT III · RWY 09"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-x-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["DIST ", s.hud.dist] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["ALT ", s.hud.alt] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["IAS ", s.hud.ias] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.hud.phase })
				]
			})]
		}),
		s.mode === "walk" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalkPad, {}),
		s.mode === "tower" && s.binocs > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BinocsOverlay, { zoom: s.binocs }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 text-[11px] text-subtle",
			children: hint(s.mode)
		})
	] });
}
function CockpitChrome() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 z-10" });
}
function BinocsOverlay({ zoom }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-20 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				style: { background: "radial-gradient(circle at center, transparent 38%, rgba(6,8,12,0.55) 52%, rgba(6,8,12,0.92) 68%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-[18%] h-[70%] w-px -translate-y-1/2 bg-fg/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[18%] left-1/2 w-[70%] h-px -translate-x-1/2 bg-fg/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-accent",
				children: [
					"BINOC ",
					zoom,
					"×"
				]
			})
		]
	});
}
function WalkPad() {
	const set = useSim((s) => s.set);
	const press = (x, y) => set({ walkAxis: {
		x,
		y
	} });
	const stop = () => set({ walkAxis: {
		x: 0,
		y: 0
	} });
	const Btn = ({ x, y, label, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		className: `absolute flex size-12 items-center justify-center rounded-md border border-border bg-surface/90 text-xs text-fg ${className}`,
		onPointerDown: (e) => {
			e.preventDefault();
			e.stopPropagation();
			press(x, y);
		},
		onPointerUp: stop,
		onPointerLeave: stop,
		onPointerCancel: stop,
		children: label
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ui": true,
		className: "absolute bottom-6 left-4 z-40 h-40 w-40 touch-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				x: 0,
				y: 1,
				label: "W",
				className: "top-0 left-14"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				x: -1,
				y: 0,
				label: "A",
				className: "top-14 left-0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				x: 1,
				y: 0,
				label: "D",
				className: "top-14 left-28"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				x: 0,
				y: -1,
				label: "S",
				className: "top-28 left-14"
			})
		]
	});
}
function IconBtn({ children, onClick, active, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		title: label,
		"aria-label": label,
		onClick,
		className: `flex size-11 items-center justify-center rounded-md border ${active ? "border-accent bg-elevated text-accent" : "border-border bg-surface text-fg hover:border-accent"}`,
		children
	});
}
function labelMode(m) {
	return MODES.find((x) => x.id === m)?.title ?? m;
}
function hint(m) {
	if (m === "walk") return "Click the view to look · WASD walk";
	if (m === "approach") return "You are in the left seat · drag to look · gear = settings";
	if (m === "tower") return "Seated in the cab · drag to look";
	return "WASD fly · Q/E vertical · drag to look";
}
function canvasFace(w, h, paint) {
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	paint(c.getContext("2d"), w, h);
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	return t;
}
function board(w, h, tex, mats, postH = 1.6) {
	const g = new Group();
	const face = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ map: tex }));
	face.position.y = postH + h / 2;
	const back = new Mesh(new PlaneGeometry(w, h), new MeshStandardMaterial({ color: 1119e3 }));
	back.rotation.y = Math.PI;
	back.position.y = postH + h / 2;
	const post = new Mesh(new CylinderGeometry(.05, .06, postH, 6), mats.metal);
	post.position.y = postH / 2;
	g.add(face, back, post);
	return g;
}
function buildSigns(mats) {
	const group = new Group();
	group.name = "signs";
	const half = RWY.length / 2;
	const loc = (letter) => canvasFace(256, 128, (ctx, w, h) => {
		ctx.fillStyle = "#111318";
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = "#f0c43a";
		ctx.font = "bold 92px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(letter, w / 2, h / 2 + 4);
	});
	const info = (text) => canvasFace(512, 128, (ctx, w, h) => {
		ctx.fillStyle = "#f0c43a";
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = "#111318";
		ctx.font = "bold 52px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text, w / 2, h / 2 + 2);
	});
	const mandatory = (text) => canvasFace(512, 160, (ctx, w, h) => {
		ctx.fillStyle = "#c62828";
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = "#f4f6f8";
		ctx.font = "bold 48px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const lines = text.split("\n");
		lines.forEach((ln, i) => ctx.fillText(ln, w / 2, h / 2 + (i - (lines.length - 1) / 2) * 52));
	});
	TAXI.linkXs.forEach((x, i) => {
		const name = TAXI.linkNames[i];
		const s = board(1.8, .9, loc(name), mats);
		s.position.set(x + 10, 0, TAXI.parallelZ + 14);
		s.rotation.y = Math.PI;
		group.add(s);
		const hold = board(2.6, 1.15, mandatory(`CAT III\n09-27`), mats, 1.4);
		hold.position.set(x - 8, 0, 28);
		hold.rotation.y = Math.PI;
		group.add(hold);
		const dir = board(2.4, .7, info(`← ${name}  RWY →`), mats, 1.3);
		dir.position.set(x, 0, TAXI.parallelZ - 16);
		group.add(dir);
	});
	const twr = board(2.2, .8, info("TWR"), mats);
	twr.position.set(-half + 248, 0, TAXI.parallelZ + 110);
	group.add(twr);
	const ptt = board(2.2, .8, info("PTT"), mats);
	ptt.position.set(120, 0, -RWY.width / 2 - 60);
	group.add(ptt);
	const dist = board(3.2, .9, info("TORA 2440  ASDA 2500"), mats, 1.5);
	dist.position.set(-half + 90, 0, RWY.width / 2 + 18);
	group.add(dist);
	const toda = board(3.2, .9, info("TODA 2740  LDA 2440"), mats, 1.5);
	toda.position.set(half - 90, 0, RWY.width / 2 + 18);
	toda.rotation.y = Math.PI;
	group.add(toda);
	return group;
}
function buildHoldLines(mats) {
	const g = new Group();
	g.name = "hold";
	TAXI.linkXs.forEach((x) => {
		for (let i = 0; i < 4; i++) {
			const bar = new Mesh(new PlaneGeometry(TAXI.width + 4, .35), mats.yellow);
			bar.rotation.x = -Math.PI / 2;
			bar.position.set(x, .13, 32 + i * .9);
			g.add(bar);
		}
		const dash = new Mesh(new PlaneGeometry(.4, 18), mats.yellow);
		dash.rotation.x = -Math.PI / 2;
		dash.position.set(x - TAXI.width / 2 - 1, .13, 22);
		g.add(dash);
	});
	return g;
}
function tree() {
	const g = new Group();
	const trunk = new Mesh(new CylinderGeometry(.18, .28, 2.2, 6), new MeshStandardMaterial({
		color: 4863012,
		roughness: .9
	}));
	trunk.position.y = 1.1;
	const leaf = new Mesh(new ConeGeometry(1.35, 3.2, 8), new MeshStandardMaterial({
		color: 4024890,
		roughness: .85
	}));
	leaf.position.y = 3.3;
	const leaf2 = new Mesh(new ConeGeometry(1.05, 2.2, 8), new MeshStandardMaterial({
		color: 5012548,
		roughness: .85
	}));
	leaf2.position.y = 4.5;
	g.add(trunk, leaf, leaf2);
	g.traverse((o) => {
		const m = o;
		if (m.isMesh) m.castShadow = true;
	});
	return g;
}
function building(w, h, d, color, mats) {
	const g = new Group();
	const body = new Mesh(new BoxGeometry(w, h, d), new MeshStandardMaterial({
		color,
		roughness: .7,
		metalness: .08,
		map: mats.concrete.map
	}));
	body.position.y = h / 2;
	body.castShadow = true;
	body.receiveShadow = true;
	g.add(body);
	const floors = Math.max(2, Math.floor(h / 3.2));
	const winMat = new MeshStandardMaterial({
		color: 13227746,
		emissive: 8952234,
		emissiveIntensity: .35,
		roughness: .25
	});
	for (let f = 0; f < floors; f++) for (let s = -1; s <= 1; s += 2) {
		const win = new Mesh(new BoxGeometry(w * .7, .9, .08), winMat);
		win.position.set(0, 1.4 + f * 3.1, s * (d / 2 + .02));
		g.add(win);
	}
	const roof = new Mesh(new BoxGeometry(w + .4, .25, d + .4), new MeshStandardMaterial({
		color: 4870232,
		roughness: .6
	}));
	roof.position.y = h + .1;
	g.add(roof);
	return g;
}
function buildTown(mats) {
	const root = new Group();
	root.name = "town";
	const roadMat = new MeshStandardMaterial({
		color: 3817028,
		roughness: .9,
		map: mats.asphalt.map
	});
	const addRoad = (x, z, w, d) => {
		const r = new Mesh(new PlaneGeometry(w, d), roadMat);
		r.rotation.x = -Math.PI / 2;
		r.position.set(x, .06, z);
		r.receiveShadow = true;
		root.add(r);
	};
	const clusters = [
		{
			cx: 180,
			cz: 520
		},
		{
			cx: -420,
			cz: 560
		},
		{
			cx: 520,
			cz: -480
		},
		{
			cx: -280,
			cz: -540
		}
	];
	const pal = [
		12107976,
		12892328,
		10134702,
		13682876,
		9344672
	];
	let seed = 7;
	const rng = () => {
		seed = seed * 16807 % 2147483647;
		return (seed - 1) / 2147483646;
	};
	clusters.forEach((c) => {
		addRoad(c.cx, c.cz, 220, 14);
		addRoad(c.cx, c.cz, 14, 180);
		for (let i = 0; i < 10; i++) {
			const w = 8 + rng() * 14;
			const d = 8 + rng() * 12;
			const b = building(w, 8 + rng() * 22, d, pal[i % pal.length], mats);
			const side = i % 2 === 0 ? 1 : -1;
			b.position.set(c.cx + (rng() - .5) * 160, 0, c.cz + side * (28 + rng() * 50));
			root.add(b);
		}
		for (let i = 0; i < 16; i++) {
			const t = tree();
			t.position.set(c.cx + (rng() - .5) * 210, 0, c.cz + (rng() - .5) * 180);
			t.scale.setScalar(.8 + rng() * .7);
			root.add(t);
		}
	});
	return root;
}
function plane(w, h, mat, y) {
	const mesh = new Mesh(new PlaneGeometry(w, h), mat);
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.y = y;
	mesh.receiveShadow = true;
	return mesh;
}
function box(w, h, d, mat) {
	const mesh = new Mesh(new BoxGeometry(w, h, d), mat);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh;
}
function glowMat(color) {
	return new MeshBasicMaterial({
		color,
		transparent: true,
		opacity: .7,
		depthWrite: false
	});
}
function tagLit(mat, base) {
	mat.userData.baseEmissive = base;
	mat.emissiveIntensity = base;
	return mat;
}
function elevatedLight(color, tall = false) {
	const g = new Group();
	const base = new Mesh(new CylinderGeometry(.16, .18, .06, 10), new MeshStandardMaterial({
		color: 2764340,
		roughness: .5,
		metalness: .4
	}));
	base.position.y = .03;
	const stemH = tall ? .7 : .42;
	const stem = new Mesh(new CylinderGeometry(.04, .055, stemH, 8), new MeshStandardMaterial({
		color: 1842722,
		roughness: .4,
		metalness: .45
	}));
	stem.position.y = .03 + stemH / 2;
	const can = new Mesh(new CylinderGeometry(.12, .14, .14, 12), new MeshStandardMaterial({
		color: 1119e3,
		roughness: .32,
		metalness: .6
	}));
	can.position.y = stemH + .14;
	const lensMat = tagLit(new MeshStandardMaterial({
		color,
		emissive: color,
		roughness: .12
	}), 6.5);
	const lens = new Mesh(new SphereGeometry(.09, 12, 10), lensMat);
	lens.position.y = stemH + .22;
	const halo = new Mesh(new SphereGeometry(.22, 10, 8), glowMat(color));
	halo.position.y = stemH + .22;
	halo.userData.glow = true;
	const hood = new Mesh(new CylinderGeometry(.13, .13, .04, 12, 1, true), new MeshStandardMaterial({
		color: 658448,
		roughness: .5
	}));
	hood.position.y = stemH + .28;
	g.add(base, stem, can, lens, halo, hood);
	return g;
}
function insetLight(color) {
	const g = new Group();
	const ring = new Mesh(new CylinderGeometry(.16, .16, .05, 10), new MeshStandardMaterial({
		color: 1711136,
		roughness: .4,
		metalness: .6
	}));
	ring.position.y = .03;
	const lensMat = tagLit(new MeshStandardMaterial({
		color,
		emissive: color,
		roughness: .2
	}), 5.4);
	const lens = new Mesh(new CylinderGeometry(.09, .09, .04, 10), lensMat);
	lens.position.y = .05;
	const halo = new Mesh(new SphereGeometry(.18, 8, 6), glowMat(color));
	halo.position.y = .08;
	halo.userData.glow = true;
	g.add(ring, lens, halo);
	return g;
}
function papiUnit(red) {
	const g = new Group();
	const body = new Mesh(new BoxGeometry(.85, .42, 1.05), new MeshStandardMaterial({
		color: 1777188,
		roughness: .4,
		metalness: .45
	}));
	body.position.y = .34;
	const visor = new Mesh(new BoxGeometry(.88, .1, .45), new MeshStandardMaterial({
		color: 921620,
		roughness: .5
	}));
	visor.position.set(0, .56, -.28);
	const col = red ? 16720452 : 16774856;
	const lensMat = tagLit(new MeshStandardMaterial({
		color: col,
		emissive: col,
		roughness: .12
	}), 8);
	const lens = new Mesh(new CylinderGeometry(.2, .2, .1, 14), lensMat);
	lens.rotation.x = Math.PI / 2;
	lens.position.set(0, .38, -.5);
	const halo = new Mesh(new SphereGeometry(.38, 10, 8), glowMat(col));
	halo.position.set(0, .38, -.55);
	halo.userData.glow = true;
	g.add(body, visor, lens, halo);
	g.userData.lensMat = lensMat;
	g.userData.haloMat = halo.material;
	return g;
}
function buildAerodrome(mats) {
	const root = new Group();
	const half = RWY.length / 2;
	const hw = RWY.width / 2;
	const markings = {};
	const lights = {};
	const features = {};
	const mk = (bag, name) => {
		const g = new Group();
		g.name = name;
		bag[name] = g;
		root.add(g);
		return g;
	};
	const env = mk(features, "environment");
	env.add(plane(12e3, 8e3, mats.ground, -.35));
	env.add(plane(RWY.length + 220, 240, mats.strip, .02));
	env.add(buildTown(mats));
	const skyGeo = new SphereGeometry(18e3, 24, 16);
	const skyMat = new MeshBasicMaterial({
		map: mats.skyDay,
		side: 1
	});
	const sky = new Mesh(skyGeo, skyMat);
	env.add(sky);
	mk(features, "runway").add(plane(RWY.length, RWY.width, mats.asphalt, .08));
	const cl = mk(markings, "centerline");
	for (let x = -half + 45; x < half - 45; x += 50) {
		const s = plane(30, .9, mats.white, .12);
		s.position.set(x + 15, .12, 0);
		cl.add(s);
	}
	const thr = mk(markings, "threshold");
	const nStripes = 12;
	const sw = 1.8;
	const z0 = -19.800000000000004;
	const paintThr = (ax, dir) => {
		for (let i = 0; i < nStripes; i++) {
			const m = plane(30, sw, mats.white, .12);
			m.position.set(ax + dir * 15, .12, z0 + i * 3.6);
			thr.add(m);
		}
	};
	paintThr(-half + 8, 1);
	paintThr(half - 8, -1);
	const aim = mk(markings, "aiming");
	const paintAim = (cx) => {
		const a = plane(60, 10, mats.white, .12);
		a.position.set(cx, .12, -15);
		const b = plane(60, 10, mats.white, .12);
		b.position.set(cx, .12, 15);
		aim.add(a, b);
	};
	paintAim(-half + 400);
	paintAim(half - 400);
	const tdz = mk(markings, "tdz");
	[
		150,
		300,
		450,
		600,
		750,
		900
	].forEach((d, idx) => {
		const nBars = idx === 0 ? 3 : 1;
		[-1, 1].forEach((side) => {
			for (let k = 0; k < nBars; k++) {
				const a = plane(22.5, 3, mats.white, .12);
				a.position.set(-half + d + 11, .12, side * (9 + k * 6));
				const b = plane(22.5, 3, mats.white, .12);
				b.position.set(half - d - 11, .12, side * (9 + k * 6));
				tdz.add(a, b);
			}
		});
	});
	const sides = mk(markings, "sides");
	const sl = plane(RWY.length - 24, .9, mats.white, .12);
	sl.position.set(0, .12, -hw + 2);
	const sr = plane(RWY.length - 24, .9, mats.white, .12);
	sr.position.set(0, .12, hw - 2);
	sides.add(sl, sr);
	const nums = mk(markings, "numbers");
	const numTex = (t) => {
		const c = document.createElement("canvas");
		c.width = 256;
		c.height = 384;
		const x = c.getContext("2d");
		x.fillStyle = "#f4f6f8";
		x.font = "bold 200px sans-serif";
		x.textAlign = "center";
		x.textBaseline = "middle";
		x.fillText(t, 128, 200);
		const mesh = new Mesh(new PlaneGeometry(18, 27), new MeshBasicMaterial({
			map: new CanvasTexture(c),
			transparent: true
		}));
		mesh.rotation.x = -Math.PI / 2;
		return mesh;
	};
	const n09 = numTex("09");
	n09.rotation.z = Math.PI / 2;
	n09.position.set(-half + 52, .14, 0);
	const n27 = numTex("27");
	n27.rotation.z = -Math.PI / 2;
	n27.position.set(half - 52, .14, 0);
	nums.add(n09, n27);
	const areas = mk(markings, "areas");
	const stopLen = RWY.stopway;
	const cw = RWY.clearway;
	const stopL = plane(stopLen, RWY.width, mats.stopway, .07);
	stopL.position.set(-half - stopLen / 2, .07, 0);
	const stopR = plane(stopLen, RWY.width, mats.stopway, .07);
	stopR.position.set(half + stopLen / 2, .07, 0);
	const clrL = plane(cw, 150, mats.clearway, .04);
	clrL.position.set(-half - stopLen - cw / 2, .04, 0);
	const clrR = plane(cw, 150, mats.clearway, .04);
	clrR.position.set(half + stopLen + cw / 2, .04, 0);
	for (let i = 0; i < 4; i++) {
		const ch = plane(8, 1.2, mats.yellow, .13);
		ch.position.set(-half - 10 - i * 12, .13, 0);
		ch.rotation.z = Math.PI / 4;
		const ch2 = ch.clone();
		ch2.position.x = half + 10 + i * 12;
		areas.add(ch, ch2);
	}
	areas.add(stopL, stopR, clrL, clrR);
	const taxiLines = mk(markings, "taxiLines");
	const taxCl = plane(RWY.length + 80, .28, mats.yellow, .11);
	taxCl.position.set(0, .11, TAXI.parallelZ);
	taxiLines.add(taxCl);
	const taxi = mk(features, "taxiways");
	const alpha = plane(RWY.length + 120, TAXI.width, mats.taxi, .07);
	alpha.position.set(0, .07, TAXI.parallelZ);
	taxi.add(alpha);
	TAXI.linkXs.forEach((x) => {
		const link = plane(28, 72, mats.taxi, .07);
		link.position.set(x, .07, TAXI.parallelZ / 2 + 8);
		taxi.add(link);
		const bay = plane(70, 40, mats.taxi, .075);
		bay.position.set(x, .075, TAXI.parallelZ - 8);
		taxi.add(bay);
	});
	const orp = mk(features, "orp");
	const orp1 = plane(70, 50, mats.concrete, .07);
	orp1.position.set(-half - 20, .07, TAXI.parallelZ - 10);
	const orp2 = plane(70, 50, mats.concrete, .07);
	orp2.position.set(half + 20, .07, TAXI.parallelZ - 10);
	orp.add(orp1, orp2);
	const ptt = mk(features, "ptt");
	const pttPad = plane(55, 42, mats.concrete, .08);
	pttPad.position.set(120, .08, -hw - 85);
	ptt.add(pttPad);
	const tower = mk(features, "tower");
	const tx = -half + 260;
	const tz = TAXI.parallelZ + 150;
	const tBase = new Mesh(new CylinderGeometry(8.2, 9.4, 8, 14), mats.towerDark);
	tBase.position.set(tx, 4, tz);
	const tDoor = box(1.4, 2.4, .2, mats.tower);
	tDoor.position.set(tx, 1.2, tz - 8.8);
	const tShaft = new Mesh(new CylinderGeometry(3, 4.6, 34, 14), mats.tower);
	tShaft.position.set(tx, 25, tz);
	const collar = new Mesh(new CylinderGeometry(6.4, 4.2, 2.2, 12), mats.towerDark);
	collar.position.set(tx, 42.2, tz);
	const glass = new Mesh(new CylinderGeometry(8.8, 9.2, 3.6, 24, 1, true), mats.glass);
	glass.position.set(tx, 45, tz);
	const roof = new Mesh(new CylinderGeometry(6.2, 9.6, 1.2, 10), mats.towerDark);
	roof.position.set(tx, 47.2, tz);
	const cap = new Mesh(new CylinderGeometry(2.4, 2.4, .4, 10), mats.metal);
	cap.position.set(tx, 47.9, tz);
	const tFloor = plane(16, 16, mats.concrete, 43.15);
	tFloor.position.set(tx, 43.15, tz);
	const mast = new Mesh(new CylinderGeometry(.07, .07, 8, 6), mats.metal);
	mast.position.set(tx, 52, tz);
	const dish = new Mesh(new SphereGeometry(.85, 12, 8, 0, Math.PI * 2, 0, 1.1), mats.metal);
	dish.position.set(tx + .4, 54.2, tz);
	const mast2 = new Mesh(new CylinderGeometry(.05, .05, 5, 6), mats.metal);
	mast2.position.set(tx - 1.4, 50.4, tz + 1.2);
	const desk = box(7.2, .35, 1, mats.cockpitPanel);
	desk.position.set(tx, 42.85, tz - 5.6);
	const chair = box(.5, .55, .5, mats.leather);
	chair.position.set(tx, 43.45, tz - 2.4);
	const screen = box(1.2, .7, .06, mats.btn);
	screen.position.set(tx - 1.5, 43.85, tz - 5.5);
	const screen2 = screen.clone();
	screen2.position.x = tx + 1.5;
	tower.add(tBase, tDoor, tShaft, collar, glass, roof, cap, tFloor, mast, dish, mast2, desk, chair, screen, screen2);
	const edge = mk(lights, "edge");
	for (let x = -half + 20; x <= half - 20; x += 60) {
		const L = elevatedLight(16054008);
		L.position.set(x, 0, -hw - 1.6);
		const R = elevatedLight(16054008);
		R.position.set(x, 0, hw + 1.6);
		edge.add(L, R);
	}
	const thrL = mk(lights, "threshold");
	for (let i = 0; i < 14; i++) {
		const z = -hw + 2 + i / 13 * (RWY.width - 4);
		const a = elevatedLight(3997576);
		a.position.set(-half + 1.2, 0, z);
		const b = elevatedLight(3997576);
		b.position.set(half - 1.2, 0, z);
		thrL.add(a, b);
	}
	const endL = mk(lights, "end");
	for (let i = 0; i < 10; i++) {
		const z = -hw + 2 + i / 9 * (RWY.width - 4);
		const a = elevatedLight(16726586);
		a.position.set(-half - 5, 0, z);
		const b = elevatedLight(16726586);
		b.position.set(half + 5, 0, z);
		endL.add(a, b);
	}
	const clL = mk(lights, "centerline");
	for (let x = -half + 12; x < half - 12; x += 15) {
		const fromEnd = Math.min(x + half, half - x);
		const c = insetLight(fromEnd < 300 ? 16724804 : fromEnd < 900 ? Math.round(x / 15) % 2 ? 16724804 : 16777215 : 16777215);
		c.position.set(x, .02, 0);
		clL.add(c);
	}
	const tdzL = mk(lights, "tdz");
	for (let d = 0; d <= 900; d += 30) for (const s of [-9, 9]) {
		const a = insetLight(16777215);
		a.position.set(-half + 30 + d, .03, s);
		const b = insetLight(16777215);
		b.position.set(half - 30 - d, .03, s);
		tdzL.add(a, b);
	}
	const als = mk(lights, "als");
	const buildAls = (dir) => {
		const start = dir > 0 ? -half : half;
		const sign = dir > 0 ? -1 : 1;
		for (let d = 30; d <= 900; d += 30) {
			const l = elevatedLight(16777215);
			l.position.set(start + sign * d, .15, 0);
			als.add(l);
		}
		[
			150,
			300,
			450,
			600,
			750
		].forEach((d) => {
			const x = start + sign * d;
			for (let z = -16; z <= 16; z += 4) {
				if (Math.abs(z) < 1.5) continue;
				const l = elevatedLight(16777215);
				l.position.set(x, .15, z);
				als.add(l);
			}
		});
	};
	buildAls(1);
	buildAls(-1);
	const papi = mk(lights, "papi");
	const papiUnits = [];
	const mkPapi = (dir) => {
		const x = dir > 0 ? -half + 340 : half - 340;
		for (let i = 0; i < 4; i++) {
			const l = papiUnit(i < 2);
			l.position.set(x, 0, hw + 16 + i * 9);
			if (dir < 0) l.rotation.y = Math.PI;
			papi.add(l);
			papiUnits.push(l);
		}
	};
	mkPapi(1);
	mkPapi(-1);
	const taxiL = mk(lights, "taxi");
	for (let x = -half; x <= half; x += 60) {
		const a = elevatedLight(4500223);
		a.position.set(x, .04, TAXI.parallelZ - TAXI.width / 2 - 1);
		const b = elevatedLight(4500223);
		b.position.set(x, .04, TAXI.parallelZ + TAXI.width / 2 + 1);
		taxiL.add(a, b);
	}
	const stopbar = mk(lights, "stopbar");
	TAXI.linkXs.forEach((x) => {
		for (let z = -10; z <= 10; z += 2.2) {
			const l = insetLight(16720452);
			l.position.set(x, .04, 30 + z * .05);
			l.position.z = 30;
			l.position.x = x + z;
			stopbar.add(l);
		}
	});
	const rabbit = mk(lights, "rabbit");
	const mkRabbit = (dir) => {
		const start = dir > 0 ? -half : half;
		const sign = dir > 0 ? -1 : 1;
		for (let d = 60; d <= 900; d += 60) {
			const l = elevatedLight(16774314, true);
			l.position.set(start + sign * d, .2, 0);
			rabbit.add(l);
		}
		for (let d = 30; d <= 300; d += 30) {
			const x = start + sign * d;
			for (const z of [-12, 12]) {
				const l = elevatedLight(16777215, true);
				l.position.set(x, .2, z);
				rabbit.add(l);
			}
		}
	};
	mkRabbit(1);
	mkRabbit(-1);
	mk(markings, "hold").add(buildHoldLines(mats));
	mk(markings, "signs").add(buildSigns(mats));
	const setLightLevel = (level) => {
		const mul = level === 1 ? .45 : level === 2 ? 1 : 2.15;
		Object.values(lights).forEach((grp) => {
			grp.traverse((o) => {
				const m = o;
				if (!m.isMesh) return;
				const mat = m.material;
				if ("emissiveIntensity" in mat && mat.userData.baseEmissive) mat.emissiveIntensity = mat.userData.baseEmissive * mul;
				if (m.userData.glow && "opacity" in mat) mat.opacity = Math.min(.95, .35 * mul);
			});
		});
	};
	const setPapi = (redFromRwy) => {
		const paint = (unit, red) => {
			const col = red ? 16720452 : 16774856;
			const lens = unit.userData.lensMat;
			const halo = unit.userData.haloMat;
			if (lens) {
				lens.color.setHex(col);
				lens.emissive.setHex(col);
			}
			if (halo) halo.color.setHex(col);
		};
		for (let bank = 0; bank < 2; bank++) for (let i = 0; i < 4; i++) paint(papiUnits[bank * 4 + i], i < redFromRwy);
	};
	return {
		root,
		markings,
		lights,
		features,
		sky,
		towerSeat: new Vector3(tx, 45.55, tz - 1.2),
		towerLookYaw: 0,
		papiUnits,
		setLightLevel,
		setPapi
	};
}
function makeLive(w, h, tex) {
	const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ map: tex }));
	m.frustumCulled = false;
	return m;
}
/** Photo-matched A320 captain viewmodel. Camera looks −Z. */
function buildCockpitViewmodel(mats) {
	const group = new Group();
	group.name = "cockpitVM";
	const pfdCanvas = document.createElement("canvas");
	pfdCanvas.width = 512;
	pfdCanvas.height = 512;
	const ndCanvas = document.createElement("canvas");
	ndCanvas.width = 512;
	ndCanvas.height = 512;
	const pfdTex = new CanvasTexture(pfdCanvas);
	const ndTex = new CanvasTexture(ndCanvas);
	pfdTex.colorSpace = SRGBColorSpace;
	ndTex.colorSpace = SRGBColorSpace;
	const plate = new Mesh(new PlaneGeometry(2.55, 1.67), new MeshBasicMaterial({
		map: mats.cockpitView,
		transparent: true,
		depthWrite: false
	}));
	plate.position.set(0, -.02, -.86);
	plate.frustumCulled = false;
	group.add(plate);
	const pfd = makeLive(.155, .145, pfdTex);
	pfd.position.set(-.448, -.318, -.855);
	const nd = makeLive(.155, .145, ndTex);
	nd.position.set(-.218, -.318, -.855);
	group.add(pfd, nd);
	const fill = new PointLight(13161692, .25, 3);
	fill.position.set(0, .2, -.2);
	group.add(fill);
	drawPfd(pfdCanvas, {
		pitch: 0,
		roll: 0,
		alt: 636,
		ias: 138,
		hdg: 90,
		gs: 3,
		ra: 636,
		loc: 0,
		gsDev: 0
	});
	drawNd(ndCanvas, {
		hdg: 90,
		distNm: 2,
		phase: "APP"
	});
	pfdTex.needsUpdate = true;
	ndTex.needsUpdate = true;
	group.traverse((o) => {
		o.frustumCulled = false;
	});
	return {
		group,
		pfd: pfdCanvas,
		nd: ndCanvas,
		pfdTex,
		ndTex
	};
}
function drawPfd(canvas, d) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const W = canvas.width;
	const H = canvas.height;
	ctx.fillStyle = "#070b10";
	ctx.fillRect(0, 0, W, H);
	ctx.save();
	ctx.translate(W / 2, H / 2);
	ctx.rotate(-d.roll);
	ctx.translate(0, d.pitch * 5.5);
	ctx.fillStyle = "#3a6ea6";
	ctx.fillRect(-500, -500, 1e3, 500);
	ctx.fillStyle = "#6b5130";
	ctx.fillRect(-500, 0, 1e3, 500);
	ctx.strokeStyle = "#e8eaed";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(-200, 0);
	ctx.lineTo(200, 0);
	ctx.stroke();
	ctx.restore();
	ctx.strokeStyle = "#e6c75a";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(W / 2 - 54, H / 2);
	ctx.lineTo(W / 2 - 14, H / 2);
	ctx.moveTo(W / 2 + 14, H / 2);
	ctx.lineTo(W / 2 + 54, H / 2);
	ctx.stroke();
	ctx.fillStyle = "#05070a";
	ctx.fillRect(6, 36, 78, H - 72);
	ctx.fillRect(W - 84, 36, 78, H - 72);
	ctx.fillStyle = "#7ec8d8";
	ctx.font = "bold 28px monospace";
	ctx.fillText(String(Math.round(d.ias)).padStart(3, "0"), 16, H / 2 + 10);
	ctx.fillText(String(Math.round(d.alt)).padStart(4, "0"), W - 78, H / 2 + 10);
	ctx.fillStyle = "#c5ccd2";
	ctx.font = "14px monospace";
	ctx.fillText("SPD", 24, 58);
	ctx.fillText("ALT", W - 62, 58);
	ctx.fillText(`HDG ${String(Math.round((d.hdg + 360) % 360)).padStart(3, "0")}`, W / 2 - 48, H - 18);
	ctx.fillStyle = "#7dff9a";
	ctx.font = "bold 16px monospace";
	ctx.textAlign = "center";
	ctx.fillText("CAT 3 DUAL", W / 2, 22);
	ctx.fillStyle = "#e6c75a";
	ctx.font = "14px monospace";
	ctx.fillText("AP 1+2   LAND", W / 2, 42);
	const ra = d.ra ?? d.alt;
	ctx.fillStyle = "#7ec8d8";
	ctx.fillText(`RA ${Math.max(0, Math.round(ra))} ft`, W / 2, H - 38);
	ctx.textAlign = "left";
	const loc = d.loc ?? 0;
	const gsDev = d.gsDev ?? 0;
	ctx.fillStyle = "#d0d4d8";
	ctx.fillRect(W / 2 - 60, H - 70, 120, 6);
	ctx.fillStyle = "#7dff9a";
	ctx.fillRect(W / 2 + loc * 50 - 4, H - 74, 8, 14);
	ctx.fillRect(W - 28, H / 2 + gsDev * 40 - 4, 14, 8);
	ctx.fillStyle = "#889098";
	ctx.font = "12px monospace";
	ctx.fillText("LOC", W / 2 - 12, H - 78);
	ctx.fillText("GS", W - 46, H / 2 - 16);
}
function drawNd(canvas, d) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const W = canvas.width;
	const H = canvas.height;
	ctx.fillStyle = "#070b10";
	ctx.fillRect(0, 0, W, H);
	ctx.strokeStyle = "#24343e";
	ctx.beginPath();
	ctx.arc(W / 2, H / 2 + 36, 150, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(W / 2, H / 2 + 36, 90, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = "#8fb4c4";
	ctx.beginPath();
	ctx.moveTo(W / 2, H / 2 + 36);
	ctx.lineTo(W / 2, 46);
	ctx.stroke();
	ctx.fillStyle = "#7ec8d8";
	ctx.font = "bold 22px monospace";
	ctx.textAlign = "center";
	ctx.fillText(String(Math.round(d.hdg)).padStart(3, "0"), W / 2, 34);
	ctx.fillStyle = "#7dff9a";
	ctx.font = "16px monospace";
	ctx.fillText("ILS CAT 3  09", W / 2, H - 52);
	ctx.fillStyle = "#c5ccd2";
	ctx.fillText(`${Math.max(0, d.distNm).toFixed(2)} NM`, W / 2, H - 30);
	ctx.fillText(d.phase, W / 2, H - 12);
	ctx.textAlign = "left";
}
function buildAirliner(mats, scale = 1) {
	const g = new Group();
	const fuse = new Mesh(new CapsuleGeometry(1.82, 24.4, 10, 20), mats.fuselage);
	fuse.rotation.z = Math.PI / 2;
	fuse.position.x = .6;
	const nose = new Mesh(new SphereGeometry(1.72, 16, 14), mats.fuselage);
	nose.scale.set(1.55, .95, .95);
	nose.position.set(-11.6, .08, 0);
	const cockpitGlass = new Mesh(new SphereGeometry(1.35, 12, 10, 0, Math.PI * 2, .35, .7), mats.window);
	cockpitGlass.scale.set(1.15, .7, 1);
	cockpitGlass.position.set(-10.4, .55, 0);
	cockpitGlass.rotation.z = .15;
	const belly = new Mesh(new CylinderGeometry(1.55, 1.7, 16, 16, 1, true), mats.livery);
	belly.rotation.z = Math.PI / 2;
	belly.position.set(.4, -.55, 0);
	belly.scale.set(1, 1, .28);
	for (let i = 0; i < 12; i++) {
		const w = new Mesh(new BoxGeometry(.62, .34, .05), mats.window);
		w.position.set(-7.2 + i * 1.28, .42, 1.8);
		const w2 = w.clone();
		w2.position.z = -1.8;
		g.add(w, w2);
	}
	const mkWing = (side) => {
		const shape = new Shape();
		shape.moveTo(0, 0);
		shape.lineTo(5.2, .35);
		shape.lineTo(16.5, .15);
		shape.lineTo(17.2, -.05);
		shape.lineTo(15.4, -1.1);
		shape.lineTo(0, -2.4);
		shape.closePath();
		const geo = new ExtrudeGeometry(shape, {
			depth: .22,
			bevelEnabled: false
		});
		geo.rotateX(Math.PI / 2);
		const wing = new Mesh(geo, mats.fuseDark);
		wing.position.set(-.6, -.35, 0);
		wing.scale.z = side;
		const winglet = new Mesh(new BoxGeometry(.18, 1.35, .55), mats.livery);
		winglet.position.set(4.4, .35, side * 15.6);
		const tip = new Mesh(new BoxGeometry(.12, 1.6, .45), mats.fuselage);
		tip.position.set(4.6, .7, side * 16.4);
		g.add(wing, winglet, tip);
	};
	mkWing(1);
	mkWing(-1);
	const mkEng = (z) => {
		const e = new Group();
		const cowl = new Mesh(new CylinderGeometry(.82, .74, 3.4, 16), mats.fuseDark);
		cowl.rotation.z = Math.PI / 2;
		const lip = new Mesh(new TorusGeometry(.82, .09, 8, 18), mats.metal);
		lip.rotation.y = Math.PI / 2;
		lip.position.x = -1.7;
		const fan = new Mesh(new CircleGeometry(.7, 16), new MeshStandardMaterial({
			color: 10135732,
			metalness: .6,
			roughness: .25
		}));
		fan.rotation.y = Math.PI / 2;
		fan.position.x = -1.55;
		const hub = new Mesh(new CylinderGeometry(.18, .18, .12, 10), mats.metal);
		hub.rotation.z = Math.PI / 2;
		hub.position.x = -1.5;
		const exhaust = new Mesh(new CylinderGeometry(.48, .62, .7, 12), mats.metal);
		exhaust.rotation.z = Math.PI / 2;
		exhaust.position.x = 1.85;
		const pylon = new Mesh(new BoxGeometry(.28, 1.25, .2), mats.fuseDark);
		pylon.position.set(.1, .85, 0);
		e.add(cowl, lip, fan, hub, exhaust, pylon);
		e.position.set(.4, -1.45, z);
		return e;
	};
	const finShape = new Shape();
	finShape.moveTo(0, 0);
	finShape.lineTo(3.4, .2);
	finShape.lineTo(2.6, 5.1);
	finShape.lineTo(.4, 5.1);
	finShape.lineTo(0, .2);
	const finGeo = new ExtrudeGeometry(finShape, {
		depth: .22,
		bevelEnabled: false
	});
	finGeo.rotateY(Math.PI / 2);
	const fin = new Mesh(finGeo, mats.fuselage);
	fin.position.set(12.1, .5, .11);
	const finStripe = new Mesh(new BoxGeometry(.26, .45, 2.4), mats.livery);
	finStripe.position.set(12.4, 4.6, 0);
	const stab = new Mesh(new BoxGeometry(2.6, .16, 8.4), mats.fuseDark);
	stab.position.set(12.4, .7, 0);
	const mkGear = (x, z) => {
		const leg = new Mesh(new CylinderGeometry(.08, .08, 1.5, 6), mats.metal);
		leg.position.set(x, -1.6, z);
		const wheel = new Mesh(new TorusGeometry(.28, .1, 6, 10), mats.fuseDark);
		wheel.position.set(x, -2.35, z);
		wheel.rotation.y = Math.PI / 2;
		g.add(leg, wheel);
	};
	mkGear(-8.4, 0);
	mkGear(1.4, 1.15);
	mkGear(1.4, -1.15);
	g.add(fuse, nose, cockpitGlass, belly, mkEng(-5.8), mkEng(5.8), fin, finStripe, stab);
	g.scale.setScalar(scale);
	g.traverse((o) => {
		const m = o;
		if (m.isMesh) {
			m.castShadow = true;
			m.receiveShadow = true;
		}
	});
	return g;
}
function buildTraffic(mats) {
	const group = new Group();
	const ac = buildAirliner(mats, 1.08);
	ac.visible = false;
	group.add(ac);
	return {
		group,
		ac,
		t: 0
	};
}
function updateTraffic(tr, dt, mode) {
	const half = RWY.length / 2;
	if (mode === "off") {
		tr.ac.visible = false;
		return;
	}
	tr.ac.visible = true;
	tr.t += dt * (mode === "arriving" ? .022 : .03);
	if (tr.t > 1.05) tr.t = 0;
	const u = tr.t;
	const taxiZ = TAXI.parallelZ;
	const landX = -half + RWY.length * .75;
	if (mode === "arriving") {
		if (u < .42) {
			const dist = 5200 * (1 - u / .42);
			const gs = 3 * (Math.PI / 180);
			tr.ac.position.set(-half - dist, Math.max(4.3, dist * Math.tan(gs) + 8), 0);
			tr.ac.rotation.set(-.05, Math.PI, 0);
		} else if (u < .5) {
			const p = (u - .42) / .08;
			tr.ac.position.set(-half + p * 120, 4.3 + (1 - p) * 8, 0);
			tr.ac.rotation.set(.02, Math.PI, 0);
		} else if (u < .72) {
			const p = (u - .5) / .22;
			tr.ac.position.set(-half + 120 + p * (landX + half - 120), 4.3, 0);
			tr.ac.rotation.set(0, Math.PI, 0);
		} else if (u < .84) {
			const p = (u - .72) / .12;
			const yaw = Math.PI + p * (Math.PI / 2);
			tr.ac.position.set(landX, 4.3, p * taxiZ);
			tr.ac.rotation.set(0, yaw, 0);
		} else {
			const p = (u - .84) / .21;
			tr.ac.position.set(landX + p * 380, 4.3, taxiZ);
			tr.ac.rotation.set(0, Math.PI * 1.5, 0);
		}
	} else if (u < .18) {
		tr.ac.position.set(-half + 90, 4.3, 0);
		tr.ac.rotation.set(0, Math.PI, 0);
	} else if (u < .48) {
		const p = (u - .18) / .3;
		tr.ac.position.set(-half + 90 + p * (half + 220), 4.3 + p * p * 180, 0);
		tr.ac.rotation.set(-.12 * p, Math.PI, 0);
	} else {
		const p = (u - .48) / .57;
		tr.ac.position.set(half + 220 + p * 4200, 184 + p * 400, 0);
		tr.ac.rotation.set(-.08, Math.PI, 0);
	}
}
function makeSky() {
	const c = document.createElement("canvas");
	c.width = 8;
	c.height = 256;
	const ctx = c.getContext("2d");
	const g = ctx.createLinearGradient(0, 0, 0, 256);
	g.addColorStop(0, "#6aa4d4");
	g.addColorStop(.45, "#9ec4e0");
	g.addColorStop(.72, "#c5d6e4");
	g.addColorStop(1, "#dfe6ea");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, 8, 256);
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	t.magFilter = LinearFilter;
	return t;
}
function makeNightSky() {
	const c = document.createElement("canvas");
	c.width = 8;
	c.height = 256;
	const ctx = c.getContext("2d");
	const g = ctx.createLinearGradient(0, 0, 0, 256);
	g.addColorStop(0, "#02040a");
	g.addColorStop(.55, "#0a1020");
	g.addColorStop(1, "#141820");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, 8, 256);
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	return t;
}
function prep(tex, rx, ry) {
	tex.wrapS = tex.wrapT = RepeatWrapping;
	tex.repeat.set(rx, ry);
	tex.anisotropy = 8;
	tex.colorSpace = SRGBColorSpace;
	tex.needsUpdate = true;
	return tex;
}
async function loadMaps() {
	const loader = new TextureLoader();
	const entries = await Promise.all([
		"asphalt",
		"ground",
		"cockpit",
		"metal",
		"concrete",
		"clouds",
		"glare",
		"leather",
		"storm"
	].map(async (n) => [n, await loader.loadAsync(`/textures/${n}.jpg`)]));
	const cockpitView = await loader.loadAsync("/textures/cockpit-view.png");
	cockpitView.colorSpace = SRGBColorSpace;
	return {
		...Object.fromEntries(entries),
		cockpitView
	};
}
function createMaterials(maps) {
	return {
		asphalt: new MeshStandardMaterial({
			map: prep(maps.asphalt.clone(), 18, 4),
			roughness: .9,
			metalness: .05,
			color: 12896462
		}),
		concrete: new MeshStandardMaterial({
			map: prep(maps.concrete.clone(), 8, 8),
			roughness: .84,
			metalness: .05,
			color: 14015200
		}),
		taxi: new MeshStandardMaterial({
			map: prep(maps.concrete.clone(), 14, 3),
			roughness: .88,
			metalness: .04,
			color: 13160148
		}),
		ground: new MeshStandardMaterial({
			map: prep(maps.concrete.clone(), 36, 24),
			roughness: .95,
			metalness: .02,
			color: 9146776
		}),
		strip: new MeshStandardMaterial({
			map: prep(maps.asphalt.clone(), 12, 4),
			roughness: .95,
			color: 8028296
		}),
		stopway: new MeshStandardMaterial({
			map: prep(maps.asphalt.clone(), 4, 2),
			roughness: .9,
			color: 11051120
		}),
		clearway: new MeshStandardMaterial({
			map: prep(maps.concrete.clone(), 6, 4),
			roughness: .95,
			color: 10134442,
			transparent: true,
			opacity: .55
		}),
		white: new MeshStandardMaterial({
			color: 16054008,
			roughness: .4,
			metalness: .08,
			emissive: 2237480,
			emissiveIntensity: .18
		}),
		yellow: new MeshStandardMaterial({
			color: 14663754,
			roughness: .45,
			emissive: 3813384,
			emissiveIntensity: .22
		}),
		redMark: new MeshStandardMaterial({
			color: 12868170,
			roughness: .5,
			emissive: 4198408,
			emissiveIntensity: .2
		}),
		tower: new MeshStandardMaterial({
			map: prep(maps.concrete.clone(), 2, 6),
			roughness: .5,
			metalness: .14,
			color: 11844804
		}),
		towerDark: new MeshStandardMaterial({
			map: prep(maps.concrete.clone(), 2, 2),
			color: 6055022,
			roughness: .55,
			metalness: .2
		}),
		glass: new MeshPhysicalMaterial({
			color: 13624562,
			transparent: true,
			opacity: .09,
			roughness: .04,
			metalness: .05,
			depthWrite: false
		}),
		cockpitDark: new MeshStandardMaterial({
			map: prep(maps.cockpit.clone(), 2, 2),
			color: 1711394,
			roughness: .52,
			metalness: .14
		}),
		cockpitPanel: new MeshStandardMaterial({
			map: prep(maps.cockpit.clone(), 2, 1),
			color: 2764340,
			roughness: .38,
			metalness: .2
		}),
		leather: new MeshStandardMaterial({
			map: prep(maps.leather.clone(), 2, 2),
			color: 9071186,
			roughness: .78
		}),
		metal: new MeshStandardMaterial({
			map: prep(maps.metal.clone(), 2, 2),
			color: 10134186,
			roughness: .28,
			metalness: .78
		}),
		btn: new MeshStandardMaterial({
			color: 2765628,
			emissive: 1718860,
			emissiveIntensity: .7,
			roughness: .4
		}),
		fuselage: new MeshStandardMaterial({
			map: prep(maps.metal.clone(), 4, 1),
			color: 15265265,
			roughness: .24,
			metalness: .46
		}),
		fuseDark: new MeshStandardMaterial({
			map: prep(maps.metal.clone(), 2, 1),
			color: 3818060,
			roughness: .38,
			metalness: .5
		}),
		livery: new MeshStandardMaterial({
			color: 1989254,
			roughness: .32,
			metalness: .28
		}),
		window: new MeshStandardMaterial({
			color: 791580,
			roughness: .1,
			metalness: .5,
			emissive: 1714232,
			emissiveIntensity: .35
		}),
		cloudMat: new MeshLambertMaterial({
			color: 15659766,
			emissive: 9082532,
			emissiveIntensity: .08
		}),
		cloudStorm: new MeshLambertMaterial({
			color: 6976124,
			emissive: 2764856,
			emissiveIntensity: .05
		}),
		cockpitView: maps.cockpitView,
		cloud: maps.clouds,
		storm: maps.storm,
		skyDay: makeSky(),
		skyNight: makeNightSky()
	};
}
var PRESETS = {
	clear: {
		fogNear: 600,
		fogFar: 14e3,
		fogCol: 12044500,
		amb: .38,
		sun: 1.45,
		hemi: .5,
		exposure: 1.08,
		night: false,
		rain: 0,
		clouds: 0,
		stormSky: false
	},
	clouds: {
		fogNear: 400,
		fogFar: 8e3,
		fogCol: 10137016,
		amb: .32,
		sun: .95,
		hemi: .4,
		exposure: .95,
		night: false,
		rain: 0,
		clouds: .7,
		stormSky: false
	},
	heavyClouds: {
		fogNear: 180,
		fogFar: 3200,
		fogCol: 7240324,
		amb: .22,
		sun: .28,
		hemi: .25,
		exposure: .72,
		night: false,
		rain: 0,
		clouds: 1,
		stormSky: true
	},
	moonlight: {
		fogNear: 120,
		fogFar: 4200,
		fogCol: 66e4,
		amb: .08,
		sun: .12,
		hemi: .12,
		exposure: .48,
		night: true,
		rain: 0,
		clouds: .25,
		stormSky: false
	},
	storm: {
		fogNear: 60,
		fogFar: 1600,
		fogCol: 2765112,
		amb: .1,
		sun: .06,
		hemi: .1,
		exposure: .5,
		night: true,
		rain: 1,
		clouds: 1,
		stormSky: true
	},
	drizzle: {
		fogNear: 280,
		fogFar: 5200,
		fogCol: 9083300,
		amb: .28,
		sun: .55,
		hemi: .32,
		exposure: .82,
		night: false,
		rain: .25,
		clouds: .8,
		stormSky: false
	},
	rain: {
		fogNear: 140,
		fogFar: 2600,
		fogCol: 6056048,
		amb: .2,
		sun: .22,
		hemi: .22,
		exposure: .68,
		night: false,
		rain: .6,
		clouds: 1,
		stormSky: true
	},
	heavyRain: {
		fogNear: 50,
		fogFar: 1200,
		fogCol: 3818056,
		amb: .14,
		sun: .1,
		hemi: .14,
		exposure: .55,
		night: true,
		rain: 1,
		clouds: 1,
		stormSky: true
	}
};
function puff(mat, rng) {
	const g = new Group();
	const n = 7 + Math.floor(rng() * 5);
	for (let i = 0; i < n; i++) {
		const s = 40 + rng() * 90;
		const m = new Mesh(new SphereGeometry(s, 10, 8), mat);
		m.position.set((rng() - .5) * 160, (rng() - .4) * 40, (rng() - .5) * 90);
		m.scale.set(1.4 + rng(), .55 + rng() * .35, 1.1 + rng() * .4);
		g.add(m);
	}
	return g;
}
function buildWeather(mats) {
	const COUNT = 4200;
	const pos = new Float32Array(COUNT * 3);
	const vel = new Float32Array(COUNT);
	for (let i = 0; i < COUNT; i++) {
		pos[i * 3] = (Math.random() - .5) * 60;
		pos[i * 3 + 1] = Math.random() * 40;
		pos[i * 3 + 2] = (Math.random() - .5) * 40;
		vel[i] = 18 + Math.random() * 22;
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new BufferAttribute(pos, 3));
	const rain = new Points(geo, new PointsMaterial({
		color: 12964056,
		size: .085,
		transparent: true,
		opacity: .55,
		depthWrite: false
	}));
	rain.frustumCulled = false;
	rain.visible = false;
	let seed = 1;
	const rng = () => {
		seed = seed * 16807 % 2147483647;
		return (seed - 1) / 2147483646;
	};
	const clouds = new Group();
	for (let i = 0; i < 18; i++) {
		const p = puff(mats.cloudMat, rng);
		p.position.set(i % 6 * 1400 - 3500, 420 + i % 3 * 80, (i % 2 === 0 ? -1 : 1) * (700 + i % 5 * 180));
		clouds.add(p);
	}
	clouds.visible = false;
	const lightning = new PointLight(14544639, 0, 4e3);
	lightning.position.set(200, 600, -400);
	const moon = new Mesh(new SphereGeometry(40, 16, 16), new MeshBasicMaterial({ color: 15265524 }));
	moon.position.set(-1200, 1400, -800);
	moon.visible = false;
	let flash = 0;
	return {
		rain,
		rainVel: vel,
		clouds,
		lightning,
		moon,
		apply(w, nightToggle, ctx) {
			const p = { ...PRESETS[w] };
			const night = nightToggle || p.night || w === "moonlight";
			if (nightToggle && !p.night) {
				p.fogCol = 66e4;
				p.fogNear = Math.min(p.fogNear, 160);
				p.fogFar = Math.min(p.fogFar, 4500);
				p.amb = .07;
				p.sun = .08;
				p.hemi = .1;
				p.exposure = .46;
			}
			ctx.fog.near = p.fogNear;
			ctx.fog.far = p.fogFar;
			ctx.fog.color.set(night ? 66e4 : p.fogCol);
			ctx.ambient.intensity = p.amb;
			ctx.sun.intensity = p.sun;
			ctx.hemi.intensity = p.hemi;
			ctx.renderer.toneMappingExposure = p.exposure;
			ctx.sun.color.set(night ? 11060456 : 16773590);
			ctx.ambient.color.set(night ? 6978192 : 14673642);
			const skyMat = ctx.sky.material;
			skyMat.map = p.stormSky ? mats.storm : night ? mats.skyNight : mats.skyDay;
			skyMat.needsUpdate = true;
			rain.visible = p.rain > 0;
			rain.material.opacity = .25 + p.rain * .5;
			clouds.visible = p.clouds > 0;
			clouds.children.forEach((c) => {
				c.children.forEach((s) => {
					s.material = p.stormSky ? mats.cloudStorm : mats.cloudMat;
				});
			});
			moon.visible = night && w !== "storm";
			lightning.intensity = 0;
		},
		tick(dt, cam, w) {
			const p = PRESETS[w];
			if (p.clouds > 0) clouds.children.forEach((c, i) => {
				c.position.x += dt * (6 + i * .4);
				if (c.position.x > 5200) c.position.x = -5200;
			});
			if (p.rain > 0) {
				rain.position.copy(cam.position);
				const arr = rain.geometry.getAttribute("position").array;
				const speed = .6 + p.rain * 1.4;
				for (let i = 0; i < vel.length; i++) {
					arr[i * 3 + 1] -= vel[i] * speed * dt;
					if (arr[i * 3 + 1] < -8) {
						arr[i * 3] = (Math.random() - .5) * 60;
						arr[i * 3 + 1] = 18 + Math.random() * 22;
						arr[i * 3 + 2] = (Math.random() - .5) * 40;
					}
				}
				rain.geometry.attributes.position.needsUpdate = true;
			}
			if (w === "storm") {
				flash -= dt;
				if (flash <= 0 && Math.random() < dt * .35) {
					lightning.intensity = 18 + Math.random() * 22;
					flash = .08 + Math.random() * .12;
				} else if (flash > 0) lightning.intensity *= Math.max(0, 1 - dt * 12);
				else lightning.intensity = 0;
			}
		}
	};
}
var keys = /* @__PURE__ */ new Set();
function SimCanvas() {
	const host = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = host.current;
		if (!el) return;
		let cancelled = false;
		let dispose = () => {};
		const boot = async () => {
			const maps = await loadMaps();
			if (cancelled || !el) return;
			const scene = new Scene();
			const fog = new Fog(12044500, 400, 9e3);
			scene.fog = fog;
			const camera = new PerspectiveCamera(60, 1, .08, 4e4);
			camera.position.set(80, 40, 180);
			scene.add(camera);
			const renderer = new WebGLRenderer({
				antialias: true,
				powerPreference: "high-performance"
			});
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
			renderer.outputColorSpace = SRGBColorSpace;
			renderer.toneMapping = 4;
			renderer.toneMappingExposure = 1.05;
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = 2;
			el.appendChild(renderer.domElement);
			const ambient = new AmbientLight(14673642, .35);
			scene.add(ambient);
			const sun = new DirectionalLight(16773590, 1.35);
			sun.position.set(2200, 4200, 1400);
			sun.castShadow = true;
			sun.shadow.mapSize.set(1024, 1024);
			sun.shadow.camera.near = 100;
			sun.shadow.camera.far = 9e3;
			sun.shadow.camera.left = -2e3;
			sun.shadow.camera.right = 2e3;
			sun.shadow.camera.top = 2e3;
			sun.shadow.camera.bottom = -2e3;
			scene.add(sun);
			const hemi = new HemisphereLight(10405088, 4016690, .45);
			scene.add(hemi);
			const mats = createMaterials(maps);
			const world = buildAerodrome(mats);
			scene.add(world.root);
			const cockpit = buildCockpitViewmodel(mats);
			const traffic = buildTraffic(mats);
			scene.add(traffic.group);
			const wx = buildWeather(mats);
			scene.add(wx.clouds, wx.lightning, wx.moon, wx.rain);
			const look = {
				yaw: 0,
				pitch: 0
			};
			let heading = -Math.PI / 2;
			let phase = "STANDBY";
			let appSpeed = 71;
			let mode = "walk";
			let prevMode = null;
			let prevRestart = 0;
			let dragging = false;
			let pfdTick = 0;
			const walkVel = new Vector3();
			let canJump = true;
			const fwd = new Vector3();
			const right = new Vector3();
			const tmp = new Vector3();
			const st = () => useSim.getState();
			const resize = () => {
				const w = el.clientWidth || 1;
				const h = el.clientHeight || 1;
				camera.aspect = w / h;
				camera.updateProjectionMatrix();
				renderer.setSize(w, h, false);
			};
			resize();
			const ro = new ResizeObserver(resize);
			ro.observe(el);
			const applyPapi = () => {
				const s = st();
				const half = RWY.length / 2;
				let reds = 2;
				const modeP = s.papiMode;
				if (modeP === "high") reds = 0;
				else if (modeP === "slightHigh") reds = 1;
				else if (modeP === "onPath") reds = 2;
				else if (modeP === "slightLow") reds = 3;
				else if (modeP === "low") reds = 4;
				else {
					const src = s.mode === "approach" || s.traffic !== "arriving" ? camera : traffic.ac;
					const rem = Math.max(8, -half - src.position.x);
					const ang = Math.atan((src.position.y - 4) / rem) * 180 / Math.PI;
					reds = ang > 3.5 ? 0 : ang > 3.2 ? 1 : ang > 2.8 ? 2 : ang > 2.5 ? 3 : 4;
				}
				world.setPapi(reds);
			};
			const applyVis = () => {
				const s = st();
				Object.entries(world.markings).forEach(([k, g]) => {
					g.visible = Boolean(s.markings[k]);
				});
				Object.entries(world.lights).forEach(([k, g]) => {
					g.visible = Boolean(s.lights[k]);
				});
				wx.apply(s.weather, s.night, {
					fog,
					ambient,
					sun,
					hemi,
					renderer,
					sky: world.sky,
					mats
				});
				world.setLightLevel(s.lightLevel);
				applyPapi();
				if (s.mode === "tower") camera.fov = s.fov / s.binocs;
				else if (s.mode === "approach") camera.fov = 52;
				else if (s.mode === "walk") camera.fov = 65;
				else camera.fov = 60;
				camera.updateProjectionMatrix();
			};
			const unsub = useSim.subscribe(() => applyVis());
			applyVis();
			const mountCockpit = (on) => {
				if (on) {
					if (cockpit.group.parent !== camera) camera.add(cockpit.group);
					cockpit.group.visible = true;
				} else {
					cockpit.group.visible = false;
					if (cockpit.group.parent) cockpit.group.parent.remove(cockpit.group);
				}
			};
			const startApproach = () => {
				const dist = 3704;
				const gs = st().glideslope * Math.PI / 180;
				camera.position.set(-RWY.length / 2 - dist, dist * Math.tan(gs) + 12, 0);
				heading = -Math.PI / 2;
				look.yaw = 0;
				look.pitch = -.08;
				phase = "APPROACH";
				appSpeed = st().appSpeedKt * .51444;
				mountCockpit(true);
			};
			const attach = (m) => {
				mode = m;
				mountCockpit(false);
				document.exitPointerLock();
				if (m === "walk") {
					camera.position.set(-RWY.length / 2 + 80, 1.7, 10);
					heading = Math.PI / 2;
					look.yaw = 0;
					look.pitch = 0;
					camera.fov = 65;
				} else if (m === "tower") {
					camera.position.set(world.towerSeat.x, 45.15, world.towerSeat.z + 2.4);
					heading = 0;
					look.yaw = 0;
					look.pitch = -.2;
				} else if (m === "approach") startApproach();
				else {
					camera.position.set(180, 70, 260);
					heading = .5;
					look.yaw = 0;
					look.pitch = -.28;
				}
				applyVis();
			};
			const applyLook = () => {
				camera.rotation.set(look.pitch, heading + look.yaw, 0, "YXZ");
			};
			const onDown = (e) => {
				if (e.target.closest("[data-ui]")) return;
				if (e.button === 0 || e.button === 2) {
					dragging = true;
					if (mode === "walk" || mode === "tower") renderer.domElement.requestPointerLock();
				}
			};
			const onMove = (e) => {
				if (!(document.pointerLockElement === renderer.domElement || dragging)) return;
				const s = st().lookSens * .002;
				look.yaw -= e.movementX * s;
				look.pitch -= e.movementY * s;
				look.pitch = Math.max(mode === "approach" ? -.45 : -1.2, Math.min(mode === "approach" ? .35 : 1.2, look.pitch));
				if (mode === "approach") look.yaw = Math.max(-.5, Math.min(.5, look.yaw));
			};
			const onUp = () => {
				dragging = false;
			};
			renderer.domElement.addEventListener("pointerdown", onDown);
			window.addEventListener("pointermove", onMove);
			window.addEventListener("pointerup", onUp);
			renderer.domElement.addEventListener("contextmenu", (e) => e.preventDefault());
			const kd = (e) => keys.add(e.code);
			const ku = (e) => keys.delete(e.code);
			window.addEventListener("keydown", kd);
			window.addEventListener("keyup", ku);
			window.addEventListener("blur", () => keys.clear());
			const moveFlat = (dt, speed, vertical) => {
				const yaw = heading + look.yaw;
				fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
				right.set(Math.cos(yaw), 0, -Math.sin(yaw));
				tmp.set(0, 0, 0);
				if (keys.has("KeyW")) tmp.add(fwd);
				if (keys.has("KeyS")) tmp.sub(fwd);
				if (keys.has("KeyD")) tmp.add(right);
				if (keys.has("KeyA")) tmp.sub(right);
				if (vertical) {
					if (keys.has("KeyQ") || keys.has("Space")) tmp.y += 1;
					if (keys.has("KeyE") || keys.has("ControlLeft")) tmp.y -= 1;
				}
				if (tmp.lengthSq() > 0) {
					tmp.normalize();
					camera.position.addScaledVector(tmp, speed * dt);
				}
			};
			const updateWalk = (dt) => {
				const sprint = keys.has("ShiftLeft") || keys.has("ShiftRight");
				moveFlat(dt, (sprint ? 7.5 : 3.6) * st().moveSpeed, false);
				const axis = st().walkAxis;
				if (axis.x || axis.y) {
					const yaw = heading + look.yaw;
					fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
					right.set(Math.cos(yaw), 0, -Math.sin(yaw));
					camera.position.addScaledVector(fwd, axis.y * 5.5 * st().moveSpeed * dt);
					camera.position.addScaledVector(right, axis.x * 5.5 * st().moveSpeed * dt);
				}
				if (keys.has("Space") && canJump) {
					walkVel.y = 7.5;
					canJump = false;
				}
				walkVel.y -= 26 * dt;
				camera.position.y += walkVel.y * dt;
				if (camera.position.y < 1.7) {
					camera.position.y = 1.7;
					walkVel.y = 0;
					canJump = true;
				}
				applyLook();
			};
			const updateNoclip = (dt) => {
				const sprint = keys.has("ShiftLeft") || keys.has("ShiftRight");
				moveFlat(dt, (sprint ? 180 : 55) * st().moveSpeed, true);
				applyLook();
			};
			const updateTower = (dt) => {
				const seat = world.towerSeat;
				moveFlat(dt, 8.5 * st().moveSpeed, false);
				camera.position.x = MathUtils.clamp(camera.position.x, seat.x - 4.5, seat.x + 4.5);
				camera.position.z = MathUtils.clamp(camera.position.z, seat.z - 3.5, seat.z + 4.5);
				camera.position.y = seat.y;
				applyLook();
			};
			const updateApproach = (dt) => {
				const thrX = -(RWY.length / 2);
				const target = st().appSpeedKt * .51444;
				appSpeed += (target - appSpeed) * 1.5 * dt;
				mountCockpit(true);
				if (phase === "APPROACH") {
					camera.position.x += appSpeed * dt;
					const rem = thrX - camera.position.x;
					if (rem > 80) {
						const gs = st().glideslope * Math.PI / 180;
						const ideal = rem * Math.tan(gs) + 12;
						camera.position.y += (ideal - camera.position.y) * .6 * dt;
					} else phase = "FLARE";
					camera.position.z *= 1 - dt;
				} else if (phase === "FLARE") {
					camera.position.x += appSpeed * .62 * dt;
					camera.position.y = Math.max(4.4, camera.position.y - 6 * dt);
					look.pitch = Math.min(.02, look.pitch + dt * .15);
					if (camera.position.y <= 4.45) phase = "ROLLOUT";
				} else if (phase === "ROLLOUT") {
					appSpeed = Math.max(12, appSpeed - 18 * dt);
					camera.position.x += appSpeed * dt;
					camera.position.y = 4.4;
					if (camera.position.x > -400) phase = "TAXI";
				} else if (phase === "TAXI") {
					appSpeed = Math.max(6, appSpeed - 4 * dt);
					if (camera.position.z < RWY.width / 2 + 70) camera.position.z += 8 * dt;
					camera.position.x += appSpeed * dt;
					heading += (-.35 - (heading + Math.PI / 2)) * dt * .4;
					if (camera.position.x > 400) phase = "PARKED";
				}
				applyLook();
				const rem = Math.max(0, thrX - camera.position.x);
				st().set({ hud: {
					dist: phase === "APPROACH" ? `${(rem / 1852).toFixed(2)} NM` : "—",
					alt: `${Math.round(camera.position.y * 3.28084)} ft`,
					ias: `${Math.round(appSpeed * 1.94384)} kt`,
					gs: `${st().glideslope.toFixed(1)}°`,
					phase,
					heading: "090"
				} });
				pfdTick += dt;
				if (pfdTick > .08) {
					pfdTick = 0;
					drawPfd(cockpit.pfd, {
						pitch: look.pitch * 40,
						roll: look.yaw * 8,
						alt: camera.position.y * 3.28084,
						ias: appSpeed * 1.94384,
						hdg: 90,
						gs: st().glideslope,
						ra: Math.max(0, camera.position.y * 3.28084 - 13),
						loc: MathUtils.clamp(camera.position.z / 40, -1, 1),
						gsDev: 0
					});
					drawNd(cockpit.nd, {
						hdg: 90,
						distNm: rem / 1852,
						phase
					});
					cockpit.pfdTex.needsUpdate = true;
					cockpit.ndTex.needsUpdate = true;
				}
			};
			window.__controlsTest = {
				getYaw: () => heading + look.yaw,
				getSpeed: () => 1,
				setKeys: (codes) => {
					keys.clear();
					codes.forEach((c) => keys.add(c));
				}
			};
			let last = performance.now();
			let hudTick = 0;
			let raf = 0;
			const loop = (now) => {
				raf = requestAnimationFrame(loop);
				const dt = Math.min((now - last) / 1e3, .08);
				last = now;
				const s = st();
				if (!s.started) {
					renderer.render(scene, camera);
					return;
				}
				if (s.mode !== prevMode) {
					attach(s.mode);
					prevMode = s.mode;
				}
				if (s.restartToken !== prevRestart) {
					prevRestart = s.restartToken;
					if (s.mode === "approach") startApproach();
				}
				mode = s.mode;
				if (mode === "walk") updateWalk(dt);
				else if (mode === "noclip") updateNoclip(dt);
				else if (mode === "tower") updateTower(dt);
				else updateApproach(dt);
				updateTraffic(traffic, dt, s.traffic);
				if (s.papiMode === "auto") applyPapi();
				wx.tick(dt, camera, s.weather);
				hudTick += dt;
				if (hudTick > .25 && mode !== "approach") {
					hudTick = 0;
					const hdg = (-(heading + look.yaw) * 180 / Math.PI + 3600) % 360;
					s.set({ hud: {
						...s.hud,
						alt: `${Math.round(camera.position.y * 3.28)} ft AGL`,
						heading: String(Math.round(hdg)).padStart(3, "0"),
						phase: mode.toUpperCase()
					} });
				}
				renderer.render(scene, camera);
			};
			raf = requestAnimationFrame(loop);
			dispose = () => {
				cancelAnimationFrame(raf);
				unsub();
				ro.disconnect();
				renderer.domElement.removeEventListener("pointerdown", onDown);
				window.removeEventListener("pointermove", onMove);
				window.removeEventListener("pointerup", onUp);
				window.removeEventListener("keydown", kd);
				window.removeEventListener("keyup", ku);
				renderer.dispose();
				if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
				delete window.__controlsTest;
			};
		};
		boot();
		return () => {
			cancelled = true;
			dispose();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: host,
		className: "absolute inset-0 touch-none bg-bg"
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimCanvas, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {})]
	});
}
//#endregion
export { Home as component };
