"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildAerodrome } from "./buildAerodrome";
import { buildTraffic, updateTraffic } from "./buildTraffic";
import { RWY } from "./constants";
import type { Binocs } from "./constants";
import { createMaterials, loadMaps } from "./materials";
import { useSim } from "./store";
import type { Mode } from "./constants";
import { buildWeather } from "./weather";

const keys = new Set<string>();
const SCENE_REV = 4;

export function SimCanvas() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let cancelled = false;
    let dispose = () => {};

    const boot = async () => {
    const maps = await loadMaps();
    if (cancelled || !el) return;

    const scene = new THREE.Scene();
    const fog = new THREE.Fog(0xb7c8d4, 400, 9000);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(60, 1, 0.08, 40000);
    camera.position.set(80, 40, 180);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xdfe6ea, 0.35);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff1d6, 1.35);
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
    const hemi = new THREE.HemisphereLight(0x9ec4e0, 0x3d4a32, 0.45);
    scene.add(hemi);

    const mats = createMaterials(maps);
    const world = buildAerodrome(mats);
    scene.add(world.root);
    const traffic = buildTraffic(mats);
    scene.add(traffic.group);
    const wx = buildWeather(mats);
    scene.add(wx.clouds, wx.lightning, wx.moon, wx.rain);

    const look = { yaw: 0, pitch: 0 };
    let heading = -Math.PI / 2;
    let phase = "STANDBY";
    let appSpeed = 71;
    let mode: Mode = "walk";
    let prevMode: Mode | null = null;
    let prevRestart = 0;
    let dragging = false;
    const walkVel = new THREE.Vector3();
    let canJump = true;
    const fwd = new THREE.Vector3();
    const right = new THREE.Vector3();
    const tmp = new THREE.Vector3();

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
        const ang = (Math.atan((src.position.y - 4) / rem) * 180) / Math.PI;
        reds = ang > 3.5 ? 0 : ang > 3.2 ? 1 : ang > 2.8 ? 2 : ang > 2.5 ? 3 : 4;
      }
      world.setPapi(reds);
    };

    const applyVis = () => {
      const s = st();
      Object.entries(world.markings).forEach(([k, g]) => {
        g.visible = Boolean(s.markings[k as keyof typeof s.markings]);
      });
      Object.entries(world.lights).forEach(([k, g]) => {
        g.visible = Boolean(s.lights[k as keyof typeof s.lights]);
      });
      wx.apply(s.weather, s.night, { fog, ambient, sun, hemi, renderer, sky: world.sky, mats });
      world.setLightLevel(s.lightLevel);
      applyPapi();
      if (s.mode === "tower") camera.fov = s.fov / s.binocs;
      else if (s.mode === "approach") camera.fov = 62;
      else if (s.mode === "walk") camera.fov = 65;
      else camera.fov = 60;
      camera.updateProjectionMatrix();
    };

    const unsub = useSim.subscribe(() => applyVis());
    applyVis();

    const clearCameraRig = () => {
      const keep: THREE.Object3D[] = [];
      camera.children.forEach((c) => keep.push(c));
      keep.forEach((c) => camera.remove(c));
    };

    const startApproach = () => {
      clearCameraRig();
      const dist = 3704;
      const gs = (st().glideslope * Math.PI) / 180;
      camera.position.set(-RWY.length / 2 - dist, dist * Math.tan(gs) + 12, 0);
      heading = -Math.PI / 2;
      look.yaw = 0;
      look.pitch = -gs;
      phase = "APPROACH";
      appSpeed = st().appSpeedKt * 0.51444;
    };

    const attach = (m: Mode) => {
      mode = m;
      clearCameraRig();
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

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-ui]")) return;
      if (e.button === 0 || e.button === 2) {
        dragging = true;
        if (mode === "walk" || mode === "tower") {
          void renderer.domElement.requestPointerLock();
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      const locked = document.pointerLockElement === renderer.domElement;
      if (!(locked || dragging)) return;
      const s = st().lookSens * 0.002;
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

    const kd = (e: KeyboardEvent) => {
      if (e.code === "Space" && st().mode === "tower") {
        e.preventDefault();
        if (!keys.has("Space")) {
          const b = st().binocs;
          st().set({ binocs: (b >= 5 ? 1 : ((b + 1) as Binocs)) });
        }
      }
      keys.add(e.code);
    };
    const ku = (e: KeyboardEvent) => keys.delete(e.code);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("blur", () => keys.clear());

    const moveFlat = (dt: number, speed: number, vertical: boolean) => {
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

    const updateWalk = (dt: number) => {
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

    const updateNoclip = (dt: number) => {
      const sprint = keys.has("ShiftLeft") || keys.has("ShiftRight");
      moveFlat(dt, (sprint ? 180 : 55) * st().moveSpeed, true);
      applyLook();
    };

    const updateTower = (dt: number) => {
      const seat = world.towerSeat;
      moveFlat(dt, 8.5 * st().moveSpeed, false);
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, seat.x - 4.5, seat.x + 4.5);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, seat.z - 3.5, seat.z + 4.5);
      camera.position.y = seat.y;
      applyLook();
    };

    const updateApproach = (dt: number) => {
      const half = RWY.length / 2;
      const thrX = -half;
      const target = st().appSpeedKt * 0.51444;
      appSpeed += (target - appSpeed) * 1.5 * dt;

      if (phase === "APPROACH") {
        camera.position.x += appSpeed * dt;
        const rem = thrX - camera.position.x;
        if (rem > 80) {
          const gs = (st().glideslope * Math.PI) / 180;
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
        heading += ((-0.35) - (heading + Math.PI / 2)) * dt * 0.4;
        if (camera.position.x > 400) phase = "PARKED";
      }

      applyLook();
      const rem = Math.max(0, thrX - camera.position.x);
      st().set({
        hud: {
          dist: phase === "APPROACH" ? `${(rem / 1852).toFixed(2)} NM` : "—",
          alt: `${Math.round(camera.position.y * 3.28084)} ft`,
          ias: `${Math.round(appSpeed * 1.94384)} kt`,
          gs: `${st().glideslope.toFixed(1)}°`,
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
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.08);
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
      if (hudTick > 0.25 && mode !== "approach") {
        hudTick = 0;
        const hdg = (((-(heading + look.yaw) * 180) / Math.PI + 3600) % 360);
        s.set({
          hud: {
            ...s.hud,
            alt: `${Math.round(camera.position.y * 3.28)} ft AGL`,
            heading: String(Math.round(hdg)).padStart(3, "0"),
            phase: mode.toUpperCase(),
          },
        });
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

    void boot();
    return () => {
      cancelled = true;
      dispose();
    };
  }, [SCENE_REV]);

  return <div ref={host} className="absolute inset-0 touch-none bg-bg" />;
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys?: (codes: string[]) => void;
    };
  }
}
