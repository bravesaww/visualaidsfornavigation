"use client";

import {
  ArrowLeft,
  Binoculars,
  Cloud,
  Footprints,
  Moon,
  Move,
  Plane,
  RadioTower,
  RotateCcw,
  Settings2,
  Sun,
} from "lucide-react";
import type { ReactNode } from "react";
import { useSim } from "@/game/store";
import type { Binocs, Mode, TrafficMode } from "@/game/constants";
import { LIGHT_INFO, MARKING_INFO, PAPI_OPTIONS, WEATHER_OPTIONS } from "@/game/constants";

const MODES: {
  id: Mode;
  title: string;
  kicker: string;
  body: string;
  keys: string;
}[] = [
  {
    id: "walk",
    title: "Walk",
    kicker: "On the strip",
    body: "First-person on the runway. WASD to walk, click to look.",
    keys: "WASD · Shift sprint · click look",
  },
  {
    id: "approach",
    title: "Approach",
    kicker: "On the glideslope",
    body: "Fly the ILS CAT III to runway 09 from 2 NM through flare, rollout and taxi.",
    keys: "Drag look · speed in settings",
  },
  {
    id: "noclip",
    title: "Noclip",
    kicker: "Free camera",
    body: "Unconstrained fly-through. Inspect lighting and markings from any angle.",
    keys: "WASD · Q/E up/down · Shift boost",
  },
  {
    id: "tower",
    title: "Tower",
    kicker: "Visual cab",
    body: "Seated in the control room watching arrivals and departures.",
    keys: "Look · WASD lean · Space binoculars",
  },
];

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5 text-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        className="size-4 accent-accent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block py-2">
      <span className="mb-1 flex justify-between text-xs text-muted">
        {label}
        <span className="font-mono text-fg">{display}</span>
      </span>
      <input
        type="range"
        className="w-full accent-accent"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function Overlay() {
  const s = useSim();

  if (!s.started) {
    return (
      <div data-ui className="absolute inset-0 z-50 overflow-y-auto bg-bg px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
            Visual navigation
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight text-fg">Aerodrome 09</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Four views of the ICAO field. Pick a mode.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  s.set({
                    started: true,
                    mode: m.id,
                    panel: false,
                    traffic: m.id === "tower" ? "arriving" : "off",
                  });
                }}
                className="rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-accent hover:bg-elevated"
              >
                <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{m.kicker}</p>
                <p className="mt-1 text-lg font-medium text-fg">{m.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{m.body}</p>
                <p className="mt-3 font-mono text-[11px] text-subtle">{m.keys}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const icons: Record<Mode, ReactNode> = {
    walk: <Footprints className="size-5" />,
    approach: <Plane className="size-5" />,
    noclip: <Move className="size-5" />,
    tower: <RadioTower className="size-5" />,
  };

  return (
    <>
      <header
        data-ui
        className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-3"
      >
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Aerodrome 09</p>
          <p className="text-sm text-fg">{labelMode(s.mode)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="rounded-full border border-border bg-surface/90 px-3 py-1 font-mono text-xs text-accent">
            HDG {s.hud.heading}
          </div>
          {s.mode === "approach" && (
            <div className="rounded-md border border-border bg-surface/90 px-3 py-1 font-mono text-[11px] text-accent">
              {s.hud.dist} · {s.hud.alt} · {s.hud.ias} · {s.hud.phase}
            </div>
          )}
        </div>
      </header>

      <div data-ui className="absolute top-14 left-3 z-40 flex flex-col gap-2">
        <IconBtn label="Home" onClick={() => s.set({ started: false, panel: false })}>
          <ArrowLeft className="size-5" />
        </IconBtn>
        <IconBtn
          label={`${labelMode(s.mode)} settings`}
          active={s.panel}
          onClick={() => s.set({ panel: !s.panel })}
        >
          <Settings2 className="size-5" />
        </IconBtn>
        <IconBtn label="Day / night" onClick={() => s.set({ night: !s.night })}>
          {s.night ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </IconBtn>
        <IconBtn
          label="Weather"
          active={s.panel}
          onClick={() => s.set({ panel: true })}
        >
          <Cloud className="size-5" />
        </IconBtn>
        {s.mode === "approach" && (
          <IconBtn
            label="Restart approach"
            onClick={() => s.set({ restartToken: s.restartToken + 1 })}
          >
            <RotateCcw className="size-5" />
          </IconBtn>
        )}
        {s.mode === "tower" && (
          <IconBtn
            label="Binoculars"
            active={s.binocs > 1}
            onClick={() => s.set({ binocs: s.binocs === 5 ? 1 : ((s.binocs + 1) as Binocs) })}
          >
            <Binoculars className="size-5" />
          </IconBtn>
        )}
      </div>

      {s.panel && (
        <aside
          data-ui
          className="absolute top-16 right-3 z-40 w-[min(20rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-lg border border-border bg-surface p-4 shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-medium">
              {icons[s.mode]}
              {labelMode(s.mode)} settings
            </h2>
            <button
              type="button"
              className="text-xs text-muted hover:text-fg"
              onClick={() => s.set({ panel: false })}
            >
              Close
            </button>
          </div>

          <p className="mb-2 text-[11px] tracking-[0.14em] text-muted uppercase">Weather</p>
          <div className="mb-3 grid grid-cols-2 gap-1.5">
            {WEATHER_OPTIONS.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`h-9 rounded-md border px-2 text-left text-[11px] ${
                  s.weather === w.id
                    ? "border-accent bg-elevated text-accent"
                    : "border-border text-muted hover:text-fg"
                }`}
                onClick={() => s.set({ weather: w.id })}
              >
                {w.label}
              </button>
            ))}
          </div>

          <p className="mb-2 text-[11px] tracking-[0.14em] text-muted uppercase">Traffic</p>
          <div className="mb-3 flex gap-1.5">
            {(
              [
                ["off", "Off"],
                ["arriving", "Arriving"],
                ["departing", "Departing"],
              ] as [TrafficMode, string][]
            ).map(([id, lab]) => (
              <button
                key={id}
                type="button"
                className={`h-9 flex-1 rounded-md border text-[11px] ${
                  s.traffic === id
                    ? "border-accent bg-elevated text-accent"
                    : "border-border text-muted hover:text-fg"
                }`}
                onClick={() => s.set({ traffic: id })}
              >
                {lab}
              </button>
            ))}
          </div>

          <p className="mb-2 text-[11px] tracking-[0.14em] text-muted uppercase">Light intensity</p>
          <div className="mb-3 flex gap-1.5">
            {([1, 2, 3] as const).map((n) => (
              <button
                key={n}
                type="button"
                className={`h-9 flex-1 rounded-md border text-[11px] ${
                  s.lightLevel === n
                    ? "border-accent bg-elevated text-accent"
                    : "border-border text-muted hover:text-fg"
                }`}
                onClick={() => s.set({ lightLevel: n })}
              >
                {n === 1 ? "Low" : n === 2 ? "Medium" : "High"}
              </button>
            ))}
          </div>

          <p className="mb-2 text-[11px] tracking-[0.14em] text-muted uppercase">PAPI glide path</p>
          <div className="mb-3 grid grid-cols-2 gap-1.5">
            {PAPI_OPTIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`h-11 rounded-md border px-2 text-left ${
                  s.papiMode === p.id
                    ? "border-accent bg-elevated text-accent"
                    : "border-border text-muted hover:text-fg"
                }`}
                onClick={() => s.set({ papiMode: p.id })}
              >
                <span className="block text-[11px]">{p.label}</span>
                <span className="block text-[10px] text-subtle">{p.hint}</span>
              </button>
            ))}
          </div>

          {(s.mode === "walk" || s.mode === "noclip") && (
            <>
              <Slider
                label="Move speed"
                value={s.moveSpeed}
                min={0.3}
                max={4}
                step={0.1}
                display={`${s.moveSpeed.toFixed(1)}×`}
                onChange={(v) => s.set({ moveSpeed: v })}
              />
              <Slider
                label="Look sensitivity"
                value={s.lookSens}
                min={0.4}
                max={2.2}
                step={0.1}
                display={`${s.lookSens.toFixed(1)}×`}
                onChange={(v) => s.set({ lookSens: v })}
              />
            </>
          )}

          {s.mode === "approach" && (
            <>
              <Slider
                label="Approach speed"
                value={s.appSpeedKt}
                min={118}
                max={170}
                step={2}
                display={`${s.appSpeedKt} kt`}
                onChange={(v) => s.set({ appSpeedKt: v })}
              />
              <Slider
                label="Glideslope"
                value={s.glideslope}
                min={2.5}
                max={3.5}
                step={0.1}
                display={`${s.glideslope.toFixed(1)}°`}
                onChange={(v) => s.set({ glideslope: v })}
              />
              <Slider
                label="Look sensitivity"
                value={s.lookSens}
                min={0.4}
                max={2}
                step={0.1}
                display={`${s.lookSens.toFixed(1)}×`}
                onChange={(v) => s.set({ lookSens: v })}
              />
              <button
                type="button"
                className="mt-2 h-9 w-full rounded-md border border-border text-xs hover:border-accent"
                onClick={() => s.set({ restartToken: s.restartToken + 1 })}
              >
                Restart approach
              </button>
            </>
          )}

          {s.mode === "tower" && (
            <>
              <Slider
                label="Field of view"
                value={s.fov}
                min={35}
                max={75}
                step={1}
                display={`${s.fov}°`}
                onChange={(v) => s.set({ fov: v })}
              />
              <p className="mb-1 mt-2 text-[11px] tracking-[0.14em] text-muted uppercase">Binoculars</p>
              <div className="flex gap-1.5">
                {([1, 2, 3, 4, 5] as Binocs[]).map((z) => (
                  <button
                    key={z}
                    type="button"
                    className={`h-9 flex-1 rounded-md border text-[11px] ${
                      s.binocs === z
                        ? "border-accent bg-elevated text-accent"
                        : "border-border text-muted hover:text-fg"
                    }`}
                    onClick={() => s.set({ binocs: z })}
                  >
                    {z === 1 ? "Off" : `${z}×`}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Clear glass cab. Drag to look. WASD to walk. Space cycles binoculars 2×–5×.
              </p>
            </>
          )}

          {(s.mode === "walk" || s.mode === "noclip" || s.mode === "approach" || s.mode === "tower") && (
            <div className="mt-3 border-t border-border pt-3">
              <p className="mb-1 text-[11px] tracking-[0.14em] text-muted uppercase">Markings</p>
              {(Object.keys(MARKING_INFO) as (keyof typeof MARKING_INFO)[]).map((k) => (
                <label key={k} className="flex cursor-pointer items-start justify-between gap-3 py-1.5 text-sm">
                  <span>
                    <span className="block">{MARKING_INFO[k].label}</span>
                    <span className="block text-[10px] text-subtle">{MARKING_INFO[k].dim}</span>
                  </span>
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-accent"
                    checked={s.markings[k as keyof typeof s.markings]}
                    onChange={(e) => s.set({ markings: { ...s.markings, [k]: e.target.checked } })}
                  />
                </label>
              ))}
              <p className="mt-3 mb-1 text-[11px] tracking-[0.14em] text-muted uppercase">Lights</p>
              {(Object.keys(LIGHT_INFO) as (keyof typeof LIGHT_INFO)[]).map((k) => (
                <label key={k} className="flex cursor-pointer items-start justify-between gap-3 py-1.5 text-sm">
                  <span>
                    <span className="block">{LIGHT_INFO[k].label}</span>
                    <span className="block text-[10px] text-subtle">{LIGHT_INFO[k].dim}</span>
                  </span>
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-accent"
                    checked={s.lights[k as keyof typeof s.lights]}
                    onChange={(e) => s.set({ lights: { ...s.lights, [k]: e.target.checked } })}
                  />
                </label>
              ))}
            </div>
          )}
        </aside>
      )}

      {s.mode === "walk" && <WalkPad />}
      {s.mode === "tower" && s.binocs > 1 && <BinocsOverlay zoom={s.binocs} />}

      <p className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 text-[11px] text-subtle">
        {hint(s.mode)}
      </p>
    </>
  );
}

function BinocsOverlay({ zoom }: { zoom: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 38%, rgba(6,8,12,0.55) 52%, rgba(6,8,12,0.92) 68%)",
        }}
      />
      <div className="absolute top-1/2 left-[18%] h-[70%] w-px -translate-y-1/2 bg-fg/20" />
      <div className="absolute top-[18%] left-1/2 w-[70%] h-px -translate-x-1/2 bg-fg/20" />
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-accent">
        BINOC {zoom}×
      </p>
    </div>
  );
}

function WalkPad() {
  const set = useSim((s) => s.set);
  const press = (x: number, y: number) => set({ walkAxis: { x, y } });
  const stop = () => set({ walkAxis: { x: 0, y: 0 } });
  const Btn = ({
    x,
    y,
    label,
    className,
  }: {
    x: number;
    y: number;
    label: string;
    className: string;
  }) => (
    <button
      type="button"
      aria-label={label}
      className={`absolute flex size-12 items-center justify-center rounded-md border border-border bg-surface/90 text-xs text-fg ${className}`}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        press(x, y);
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
    >
      {label}
    </button>
  );
  return (
    <div data-ui className="absolute bottom-6 left-4 z-40 h-40 w-40 touch-none">
      <Btn x={0} y={1} label="W" className="top-0 left-14" />
      <Btn x={-1} y={0} label="A" className="top-14 left-0" />
      <Btn x={1} y={0} label="D" className="top-14 left-28" />
      <Btn x={0} y={-1} label="S" className="top-28 left-14" />
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  active,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex size-11 items-center justify-center rounded-md border ${
        active
          ? "border-accent bg-elevated text-accent"
          : "border-border bg-surface text-fg hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}

function labelMode(m: Mode) {
  return MODES.find((x) => x.id === m)?.title ?? m;
}

function hint(m: Mode) {
  if (m === "walk") return "Click the view to look · WASD walk";
  if (m === "approach") return "On the glideslope · drag to look";
  if (m === "tower") return "Seated in the cab · drag to look · Space binoculars";
  return "WASD fly · Q/E vertical · drag to look";
}
