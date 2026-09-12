// @ts-nocheck
import { LIGHT_INFO, MARKING_INFO, MODES, PAPI_OPTIONS } from "./constants.js";
import { setState, state, subscribe } from "./state.js";

function el(tag, className, text) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
}

function hint(mode) {
  if (mode === "walk") return "Click the view to look · WASD walk";
  if (mode === "approach") return "On the glideslope · drag to look";
  if (mode === "tower") return "Seated in the cab · drag to look · Space binoculars";
  return "WASD fly · Q/E vertical · drag to look";
}

function labelMode(mode) {
  return MODES.find((m) => m.id === mode)?.title ?? mode;
}

export function mountUI(root) {
  const home = el("div", "sim-home");
  home.dataset.ui = "1";
  const inner = el("div", "sim-home-inner");
  inner.append(el("p", "sim-kicker", "Visual navigation"));
  inner.append(el("h1", "", "Aerodrome 09"));
  inner.append(el("p", "sim-lead", "Four views of the ICAO field. Pick a mode."));
  const grid = el("div", "sim-modes");
  MODES.forEach((m) => {
    const b = el("button", "sim-mode");
    b.type = "button";
    b.append(el("p", "sim-kicker", m.kicker));
    b.append(el("h2", "", m.title));
    b.append(el("p", "", m.body));
    const k = el("p", "keys", m.keys);
    b.append(k);
    b.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      setState({
        started: true,
        mode: m.id,
        panel: false,
        traffic: m.id === "tower" ? "arriving" : "off",
      });
    });
    grid.append(b);
  });
  inner.append(grid);
  home.append(inner);

  const play = el("div", "hidden");
  const header = el("header", "sim-header");
  header.dataset.ui = "1";
  const titleBox = el("div");
  titleBox.append(el("p", "sim-kicker", "Aerodrome 09"));
  const modeTitle = el("p", "", "Walk");
  titleBox.append(modeTitle);
  const chips = el("div");
  chips.style.display = "flex";
  chips.style.flexDirection = "column";
  chips.style.alignItems = "flex-end";
  chips.style.gap = "0.35rem";
  const hdg = el("div", "sim-chip", "HDG 090");
  const appHud = el("div", "sim-chip sim-hud hidden");
  chips.append(hdg, appHud);
  header.append(titleBox, chips);

  const tools = el("div", "sim-tools");
  tools.dataset.ui = "1";
  const mkIcon = (label, text, onClick) => {
    const b = el("button", "sim-icon", text);
    b.type = "button";
    b.setAttribute("aria-label", label);
    b.addEventListener("click", onClick);
    return b;
  };
  const homeBtn = mkIcon("Home", "←", () => setState({ started: false, panel: false }));
  const setBtn = mkIcon("Settings", "⚙", () => setState({ panel: !state.panel }));
  const nightBtn = mkIcon("Day / night", "☀", () => setState({ night: !state.night }));
  const restartBtn = mkIcon("Restart approach", "↻", () => setState({ restartToken: state.restartToken + 1 }));
  const binocBtn = mkIcon("Binoculars", "▣", () => setState({ binocs: state.binocs >= 5 ? 1 : state.binocs + 1 }));
  tools.append(homeBtn, setBtn, nightBtn, restartBtn, binocBtn);

  const panel = el("aside", "sim-panel hidden");
  panel.dataset.ui = "1";

  const pad = el("div", "sim-pad hidden");
  pad.dataset.ui = "1";
  const dirs = [
    [0, 1, "W", "0", "3.5rem"],
    [-1, 0, "A", "3.5rem", "0"],
    [1, 0, "D", "3.5rem", "7rem"],
    [0, -1, "S", "7rem", "3.5rem"],
  ];
  dirs.forEach(([x, y, lab, top, left]) => {
    const b = el("button", "", lab);
    b.type = "button";
    b.style.top = top;
    b.style.left = left;
    const press = () => setState({ walkAxis: { x, y } });
    const stop = () => setState({ walkAxis: { x: 0, y: 0 } });
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      press();
    });
    b.addEventListener("pointerup", stop);
    b.addEventListener("pointerleave", stop);
    b.addEventListener("pointercancel", stop);
    pad.append(b);
  });

  const binocs = el("div", "sim-binocs hidden");
  binocs.append(el("p", "", "BINOC 2×"));

  const hintEl = el("p", "sim-hint", hint("walk"));

  play.append(header, tools, panel, pad, binocs, hintEl);
  root.append(home, play);

  const renderPanel = () => {
    panel.replaceChildren();
    const row = el("div", "sim-row");
    row.append(el("h2", "", `${labelMode(state.mode)} settings`));
    const close = el("button", "sim-close", "Close");
    close.type = "button";
    close.addEventListener("click", () => setState({ panel: false }));
    row.append(close);
    panel.append(row);

    const trafficLab = el("p", "sim-label", "Traffic");
    panel.append(trafficLab);
    const trow = el("div", "sim-btns");
    [
      ["off", "Off"],
      ["arriving", "Arriving"],
      ["departing", "Departing"],
    ].forEach(([id, lab]) => {
      const b = el("button", `sim-btn${state.traffic === id ? " is-on" : ""}`, lab);
      b.type = "button";
      b.addEventListener("click", () => setState({ traffic: id }));
      trow.append(b);
    });
    panel.append(trow);

    const ll = el("p", "sim-label", "Light intensity");
    panel.append(ll);
    const lrow = el("div", "sim-btns");
    [1, 2, 3].forEach((n) => {
      const lab = n === 1 ? "Low" : n === 2 ? "Medium" : "High";
      const b = el("button", `sim-btn${state.lightLevel === n ? " is-on" : ""}`, lab);
      b.type = "button";
      b.addEventListener("click", () => setState({ lightLevel: n }));
      lrow.append(b);
    });
    panel.append(lrow);

    panel.append(el("p", "sim-label", "PAPI glide path"));
    const prow = el("div", "sim-btns grid2");
    PAPI_OPTIONS.forEach((p) => {
      const b = el("button", `sim-btn${state.papiMode === p.id ? " is-on" : ""}`);
      b.type = "button";
      b.innerHTML = `<span>${p.label}</span><br><small>${p.hint}</small>`;
      b.addEventListener("click", () => setState({ papiMode: p.id }));
      prow.append(b);
    });
    panel.append(prow);

    const slider = (label, value, min, max, step, display, onChange) => {
      const wrap = el("label", "sim-slider");
      const cap = el("span");
      cap.append(document.createTextNode(label));
      const val = el("span", "", display);
      cap.append(val);
      const input = document.createElement("input");
      input.type = "range";
      input.min = String(min);
      input.max = String(max);
      input.step = String(step);
      input.value = String(value);
      input.addEventListener("input", () => onChange(Number(input.value)));
      wrap.append(cap, input);
      panel.append(wrap);
    };

    if (state.mode === "walk" || state.mode === "noclip") {
      slider("Move speed", state.moveSpeed, 0.3, 4, 0.1, `${state.moveSpeed.toFixed(1)}×`, (v) =>
        setState({ moveSpeed: v }),
      );
      slider("Look sensitivity", state.lookSens, 0.4, 2.2, 0.1, `${state.lookSens.toFixed(1)}×`, (v) =>
        setState({ lookSens: v }),
      );
    }
    if (state.mode === "approach") {
      slider("Approach speed", state.appSpeedKt, 118, 170, 2, `${state.appSpeedKt} kt`, (v) =>
        setState({ appSpeedKt: v }),
      );
      slider("Glideslope", state.glideslope, 2.5, 3.5, 0.1, `${state.glideslope.toFixed(1)}°`, (v) =>
        setState({ glideslope: v }),
      );
      const rst = el("button", "sim-btn", "Restart approach");
      rst.type = "button";
      rst.addEventListener("click", () => setState({ restartToken: state.restartToken + 1 }));
      panel.append(rst);
    }
    if (state.mode === "tower") {
      slider("Field of view", state.fov, 35, 75, 1, `${state.fov}°`, (v) => setState({ fov: v }));
      panel.append(el("p", "sim-label", "Binoculars"));
      const brow = el("div", "sim-btns");
      [1, 2, 3, 4, 5].forEach((z) => {
        const b = el("button", `sim-btn${state.binocs === z ? " is-on" : ""}`, z === 1 ? "Off" : `${z}×`);
        b.type = "button";
        b.addEventListener("click", () => setState({ binocs: z }));
        brow.append(b);
      });
      panel.append(brow);
    }

    panel.append(el("p", "sim-label", "Markings"));
    Object.keys(MARKING_INFO).forEach((k) => {
      const lab = el("label", "sim-check");
      const span = el("span");
      span.append(document.createTextNode(MARKING_INFO[k].label));
      span.append(el("small", "", MARKING_INFO[k].dim));
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.markings[k];
      input.addEventListener("change", () =>
        setState({ markings: { ...state.markings, [k]: input.checked } }),
      );
      lab.append(span, input);
      panel.append(lab);
    });
    panel.append(el("p", "sim-label", "Lights"));
    Object.keys(LIGHT_INFO).forEach((k) => {
      const lab = el("label", "sim-check");
      const span = el("span");
      span.append(document.createTextNode(LIGHT_INFO[k].label));
      span.append(el("small", "", LIGHT_INFO[k].dim));
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.lights[k];
      input.addEventListener("change", () => setState({ lights: { ...state.lights, [k]: input.checked } }));
      lab.append(span, input);
      panel.append(lab);
    });
  };

  const paint = () => {
    home.classList.toggle("hidden", state.started);
    play.classList.toggle("hidden", !state.started);
    if (!state.started) return;
    modeTitle.textContent = labelMode(state.mode);
    hdg.textContent = `HDG ${state.hud.heading}`;
    if (state.mode === "approach") {
      appHud.classList.remove("hidden");
      appHud.textContent = `${state.hud.dist} · ${state.hud.alt} · ${state.hud.ias} · ${state.hud.phase}`;
    } else {
      appHud.classList.add("hidden");
    }
    setBtn.classList.toggle("is-on", state.panel);
    nightBtn.textContent = state.night ? "☾" : "☀";
    restartBtn.classList.toggle("hidden", state.mode !== "approach");
    binocBtn.classList.toggle("hidden", state.mode !== "tower");
    binocBtn.classList.toggle("is-on", state.binocs > 1);
    panel.classList.toggle("hidden", !state.panel);
    if (state.panel) renderPanel();
    pad.classList.toggle("hidden", state.mode !== "walk");
    binocs.classList.toggle("hidden", !(state.mode === "tower" && state.binocs > 1));
    binocs.querySelector("p").textContent = `BINOC ${state.binocs}×`;
    hintEl.textContent = hint(state.mode);
  };

  subscribe(paint);
  paint();
}
