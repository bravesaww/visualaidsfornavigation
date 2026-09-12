// @ts-nocheck
import * as THREE from "three";
import { buildAerodrome } from "./aerodrome.js";
import { buildTraffic, updateTraffic } from "./traffic.js";
import { RWY } from "./constants.js";
import { createMaterials, loadMaps } from "./materials.js";
import { state, setState, subscribe } from "./state.js";

const keys = new Set();

function applyNight(night, ctx) {
  const { fog, ambient, sun, hemi, renderer, sky } = ctx;
  if (night) {
    fog.near = 160;
    fog.far = 4500;
    fog.color.set(0x0a1220);
    ambient.intensity = 0.08;
    ambient.color.set(0x6a7a90);
    sun.intensity = 0.12;
    sun.color.set(0xa8c4e8);
    hemi.intensity = 0.12;
    renderer.toneMappingExposure = 0.48;
    sky.material.map = ctx.mats.skyNight;
  } else {
    fog.near = 600;
    fog.far = 14000;
    fog.color.set(0xb7c8d4);
    ambient.intensity = 0.55;
    ambient.color.set(0xdfe6ea);
    sun.intensity = 1.7;
    sun.color.set(0xfff1d6);
    hemi.intensity = 0.7;
    renderer.toneMappingExposure = 1.08;
    sky.material.map = ctx.mats.skyDay;
  }
  sky.material.needsUpdate = true;
}

export async function startEngine(host) {
  const maps = await loadMaps();
  const scene = new THREE.Scene();
  const fog = new THREE.Fog(0xb7c8d4, 400, 9000);
  scene.fog = fog;

  const camera = new THREE.PerspectiveCamera(60, 1, 0.08, 40000);
  camera.position.set(80, 40, 180);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xdfe6ea, 0.55);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xfff1d6, 1.7);
  sun.position.set(2200, 4200, 1400);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 100;
  sun.shadow.camera.far = 9000;
  sun.shadow.camera.left = -6000;
  sun.shadow.camera.right = 6000;
  sun.shadow.camera.top = 4000;
  sun.shadow.camera.bottom = -4000;
  sun.shadow.bias = -0.0002;
  scene.add(sun);
  const hemi = new THREE.HemisphereLight(0x9ec4e0, 0x3d4a32, 0.7);
  scene.add(hemi);

  const mats = createMaterials(maps);
  const world = buildAerodrome(mats);
  scene.add(world.root);
  const traffic = buildTraffic(mats);
  scene.add(traffic.group);

  const look = { yaw: 0, pitch: 0 };
  let heading = -Math.PI / 2;
  let phase = "STANDBY";
  let appSpeed = 71;
  let mode = "walk";
  let prevMode = null;
  let prevRestart = 0;
  let dragging = false;
  const walkVel = new THREE.Vector3();
  let canJump = true;
  const fwd = new THREE.Vector3();
  const right = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const nightCtx = { fog, ambient, sun, hemi, renderer, sky: world.sky, mats };

  const resize = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  const applyPapi = () => {
    const half = RWY.length / 2;
    let reds = 2;
    const modeP = state.papiMode;
    if (modeP === "high") reds = 0;
    else if (modeP === "slightHigh") reds = 1;
    else if (modeP === "onPath") reds = 2;
    else if (modeP === "slightLow") reds = 3;
    else if (modeP === "low") reds = 4;
    else {
      const src = state.mode === "approach" || state.traffic !== "arriving" ? camera : traffic.ac;
      const rem = Math.max(8, -half - src.position.x);
      const ang = (Math.atan((src.position.y - 4) / rem) * 180) / Math.PI;
      reds = ang > 3.5 ? 0 : ang > 3.2 ? 1 : ang > 2.8 ? 2 : ang > 2.5 ? 3 : 4;
    }
    world.setPapi(reds);
  };

  const applyVis = () => {
    Object.entries(world.markings).forEach(([k, g]) => {
      g.visible = Boolean(state.markings[k]);
    });
    Object.entries(world.lights).forEach(([k, g]) => {
      g.visible = Boolean(state.lights[k]);
    });
    applyNight(state.night, nightCtx);
    world.setLightLevel(state.lightLevel);
    applyPapi();
    if (state.mode === "tower") camera.fov = state.fov / state.binocs;
    else if (state.mode === "approach") camera.fov = 62;
    else if (state.mode === "walk") camera.fov = 65;
    else camera.fov = 60;
    camera.updateProjectionMatrix();
  };

  const unsub = subscribe(applyVis);
  applyVis();

  const startApproach = () => {
    const dist = 3704;
    const gs = (state.glideslope * Math.PI) / 180;
    camera.position.set(-RWY.length / 2 - dist, dist * Math.tan(gs) + 12, 0);
    heading = -Math.PI / 2;
    look.yaw = 0;
    look.pitch = -gs;
    phase = "APPROACH";
    appSpeed = state.appSpeedKt * 0.51444;
  };

  const attach = (m) => {
    mode = m;
    document.exitPointerLock();
    if (m === "walk") {
      camera.position.set(-RWY.length / 2 + 80, 1.7, 10);
      heading = Math.PI / 2;
      look.yaw = 0;
      look.pitch = 0;
    } else if (m === "tower") {
      camera.position.set(world.towerSeat.x, 45.15, world.towerSeat.z + 2.4);
      heading = 0;
      look.yaw = 0;
      look.pitch = -0.2;
    } else if (m === "approach") {
      startApproach();
    } else {
      camera.position.set(180, 70, 260);
      heading = 0.5;
      look.yaw = 0;
      look.pitch = -0.28;
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
      if (mode === "walk" || mode === "tower") {
        renderer.domElement.requestPointerLock();
      }
    }
  };
  const onMove = (e) => {
    const locked = document.pointerLockElement === renderer.domElement;
    if (!(locked || dragging)) return;
    const s = state.lookSens * 0.002;
    look.yaw -= e.movementX * s;
    look.pitch -= e.movementY * s;
    const maxP = mode === "approach" ? 0.7 : 1.2;
    const minP = mode === "approach" ? -0.7 : -1.2;
    look.pitch = Math.max(minP, Math.min(maxP, look.pitch));
  };
  const onUp = () => {
    dragging = false;
  };

  renderer.domElement.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  renderer.domElement.addEventListener("contextmenu", (e) => e.preventDefault());

  const kd = (e) => {
    if (e.code === "Space" && state.mode === "tower") {
      e.preventDefault();
      if (!keys.has("Space")) {
        const b = state.binocs;
        setState({ binocs: b >= 5 ? 1 : b + 1 });
      }
    }
    keys.add(e.code);
  };
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
    moveFlat(dt, (sprint ? 7.5 : 3.6) * state.moveSpeed, false);
    const axis = state.walkAxis;
    if (axis.x || axis.y) {
      const yaw = heading + look.yaw;
      fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
      right.set(Math.cos(yaw), 0, -Math.sin(yaw));
      camera.position.addScaledVector(fwd, axis.y * 5.5 * state.moveSpeed * dt);
      camera.position.addScaledVector(right, axis.x * 5.5 * state.moveSpeed * dt);
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
    moveFlat(dt, (sprint ? 180 : 55) * state.moveSpeed, true);
    applyLook();
  };

  const updateTower = (dt) => {
    const seat = world.towerSeat;
    moveFlat(dt, 8.5 * state.moveSpeed, false);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, seat.x - 4.5, seat.x + 4.5);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, seat.z - 3.5, seat.z + 4.5);
    camera.position.y = seat.y;
    applyLook();
  };

  const updateApproach = (dt) => {
    const half = RWY.length / 2;
    const thrX = -half;
    const target = state.appSpeedKt * 0.51444;
    appSpeed += (target - appSpeed) * 1.5 * dt;
    if (phase === "APPROACH") {
      camera.position.x += appSpeed * dt;
      const rem = thrX - camera.position.x;
      if (rem > 80) {
        const gs = (state.glideslope * Math.PI) / 180;
        const ideal = rem * Math.tan(gs) + 12;
        camera.position.y += (ideal - camera.position.y) * 0.6 * dt;
      } else phase = "FLARE";
      camera.position.z *= 1 - dt;
    } else if (phase === "FLARE") {
      camera.position.x += appSpeed * 0.62 * dt;
      camera.position.y = Math.max(4.4, camera.position.y - 6 * dt);
      look.pitch = Math.min(0.02, look.pitch + dt * 0.15);
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
      heading += (-0.35 - (heading + Math.PI / 2)) * dt * 0.4;
      if (camera.position.x > 400) phase = "PARKED";
    }
    applyLook();
    const remaining = Math.max(0, thrX - camera.position.x);
    setState({
      hud: {
        dist: phase === "APPROACH" ? `${(remaining / 1852).toFixed(2)} NM` : "—",
        alt: `${Math.round(camera.position.y * 3.28084)} ft`,
        ias: `${Math.round(appSpeed * 1.94384)} kt`,
        gs: `${state.glideslope.toFixed(1)}°`,
        phase,
        heading: "090",
      },
    });
  };

  window.__controlsTest = {
    getYaw: () => heading + look.yaw,
    getSpeed: () => 1,
    setKeys: (codes) => {
      keys.clear();
      codes.forEach((c) => keys.add(c));
    },
  };

  let last = performance.now();
  let hudTick = 0;
  let raf = 0;
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.08);
    last = now;
    if (!state.started) {
      renderer.render(scene, camera);
      return;
    }
    if (state.mode !== prevMode) {
      attach(state.mode);
      prevMode = state.mode;
    }
    if (state.restartToken !== prevRestart) {
      prevRestart = state.restartToken;
      if (state.mode === "approach") startApproach();
    }
    mode = state.mode;
    if (mode === "walk") updateWalk(dt);
    else if (mode === "noclip") updateNoclip(dt);
    else if (mode === "tower") updateTower(dt);
    else updateApproach(dt);

    updateTraffic(traffic, dt, state.traffic);
    if (state.papiMode === "auto") applyPapi();

    hudTick += dt;
    if (hudTick > 0.25 && mode !== "approach") {
      hudTick = 0;
      const hdg = ((-(heading + look.yaw) * 180) / Math.PI + 3600) % 360;
      setState({
        hud: {
          ...state.hud,
          alt: `${Math.round(camera.position.y * 3.28)} ft AGL`,
          heading: String(Math.round(hdg)).padStart(3, "0"),
          phase: mode.toUpperCase(),
        },
      });
    }
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    unsub();
    ro.disconnect();
    renderer.domElement.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("keydown", kd);
    window.removeEventListener("keyup", ku);
    renderer.dispose();
    if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    delete window.__controlsTest;
  };
}
