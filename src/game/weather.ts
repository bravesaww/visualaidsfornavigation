import * as THREE from "three";
import type { Weather } from "./constants";
import type { Mats } from "./materials";

export type WeatherFx = {
  rain: THREE.InstancedMesh;
  rainPos: Float32Array;
  rainVel: Float32Array;
  clouds: THREE.Group;
  lightning: THREE.PointLight;
  moon: THREE.Mesh;
  apply: (w: Weather, night: boolean, ctx: ApplyCtx) => void;
  tick: (dt: number, cam: THREE.Camera, w: Weather) => void;
};

type ApplyCtx = {
  fog: THREE.Fog;
  ambient: THREE.AmbientLight;
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  renderer: THREE.WebGLRenderer;
  sky: THREE.Mesh;
  mats: Mats;
};

const PRESETS: Record<
  Weather,
  {
    fogNear: number;
    fogFar: number;
    fogCol: number;
    amb: number;
    sun: number;
    hemi: number;
    exposure: number;
    night: boolean;
    rain: number;
    clouds: number;
    stormSky: boolean;
  }
> = {
  clear: {
    fogNear: 600, fogFar: 14000, fogCol: 0xb7c8d4, amb: 0.55, sun: 1.7, hemi: 0.7,
    exposure: 1.08, night: false, rain: 0, clouds: 0, stormSky: false,
  },
  clouds: {
    fogNear: 400, fogFar: 8000, fogCol: 0x9aadb8, amb: 0.32, sun: 0.95, hemi: 0.4,
    exposure: 0.95, night: false, rain: 0, clouds: 0.7, stormSky: false,
  },
  heavyClouds: {
    fogNear: 180, fogFar: 3200, fogCol: 0x6e7a84, amb: 0.22, sun: 0.28, hemi: 0.25,
    exposure: 0.72, night: false, rain: 0, clouds: 1, stormSky: true,
  },
  moonlight: {
    fogNear: 120, fogFar: 4200, fogCol: 0x0a1220, amb: 0.08, sun: 0.12, hemi: 0.12,
    exposure: 0.48, night: true, rain: 0, clouds: 0.25, stormSky: false,
  },
  storm: {
    fogNear: 60, fogFar: 1600, fogCol: 0x2a3138, amb: 0.1, sun: 0.06, hemi: 0.1,
    exposure: 0.5, night: true, rain: 1, clouds: 1, stormSky: true,
  },
  drizzle: {
    fogNear: 280, fogFar: 5200, fogCol: 0x8a99a4, amb: 0.28, sun: 0.55, hemi: 0.32,
    exposure: 0.82, night: false, rain: 0.25, clouds: 0.8, stormSky: false,
  },
  rain: {
    fogNear: 140, fogFar: 2600, fogCol: 0x5c6870, amb: 0.2, sun: 0.22, hemi: 0.22,
    exposure: 0.68, night: false, rain: 0.6, clouds: 1, stormSky: true,
  },
  heavyRain: {
    fogNear: 50, fogFar: 1200, fogCol: 0x3a4248, amb: 0.14, sun: 0.1, hemi: 0.14,
    exposure: 0.55, night: true, rain: 1, clouds: 1, stormSky: true,
  },
};

function cloudMap() {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, s, s);
  const blobs = [
    [0.5, 0.52, 0.42],
    [0.32, 0.48, 0.28],
    [0.68, 0.5, 0.3],
    [0.45, 0.38, 0.24],
    [0.58, 0.62, 0.22],
    [0.38, 0.6, 0.18],
  ];
  blobs.forEach(([x, y, r]) => {
    const g = ctx.createRadialGradient(x * s, y * s, 2, x * s, y * s, r * s);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.45, "rgba(235,240,245,0.55)");
    g.addColorStop(1, "rgba(220,228,236,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x * s, y * s, r * s, 0, Math.PI * 2);
    ctx.fill();
  });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function cloudPuff(mat: THREE.SpriteMaterial, rng: () => number) {
  const g = new THREE.Group();
  const n = 9 + Math.floor(rng() * 6);
  for (let i = 0; i < n; i++) {
    const spr = new THREE.Sprite(mat);
    const s = 70 + rng() * 140;
    spr.scale.set(s * (1.4 + rng() * 0.6), s * (0.55 + rng() * 0.35), 1);
    spr.position.set((rng() - 0.5) * 180, (rng() - 0.45) * 50, (rng() - 0.5) * 110);
    g.add(spr);
  }
  return g;
}

export function buildWeather(mats: Mats): WeatherFx {
  const COUNT = 3600;
  const pos = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 50;
    pos[i * 3 + 1] = Math.random() * 36;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 36;
    vel[i] = 22 + Math.random() * 28;
  }
  const dropGeo = new THREE.PlaneGeometry(0.012, 0.72);
  const dropMat = new THREE.MeshBasicMaterial({
    color: 0xc5d2dc,
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const rain = new THREE.InstancedMesh(dropGeo, dropMat, COUNT);
  rain.frustumCulled = false;
  rain.visible = false;
  rain.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < COUNT; i++) {
    dummy.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    dummy.updateMatrix();
    rain.setMatrixAt(i, dummy.matrix);
  }
  rain.instanceMatrix.needsUpdate = true;

  let seed = 1;
  const rng = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const map = cloudMap();
  const fair = new THREE.SpriteMaterial({
    map,
    color: 0xf2f5f8,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
  });
  const storm = new THREE.SpriteMaterial({
    map,
    color: 0x6a727c,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const clouds = new THREE.Group();
  for (let i = 0; i < 22; i++) {
    const p = cloudPuff(fair, rng);
    p.position.set((i % 7) * 1300 - 3900, 380 + (i % 4) * 70, ((i % 3) - 1) * (850 + (i % 5) * 160));
    p.userData.layer = i;
    clouds.add(p);
  }
  clouds.visible = false;
  clouds.userData.fair = fair;
  clouds.userData.storm = storm;

  const lightning = new THREE.PointLight(0xddeeff, 0, 4000);
  lightning.position.set(200, 600, -400);

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(40, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xe8eef4 }),
  );
  moon.position.set(-1200, 1400, -800);
  moon.visible = false;

  let flash = 0;
  void mats;

  return {
    rain,
    rainPos: pos,
    rainVel: vel,
    clouds,
    lightning,
    moon,
    apply(w, nightToggle, ctx) {
      const p = { ...PRESETS[w] };
      const night = nightToggle || p.night || w === "moonlight";
      if (nightToggle && !p.night) {
        p.fogCol = 0x0a1220;
        p.fogNear = Math.min(p.fogNear, 160);
        p.fogFar = Math.min(p.fogFar, 4500);
        p.amb = 0.07;
        p.sun = 0.08;
        p.hemi = 0.1;
        p.exposure = 0.46;
      }
      ctx.fog.near = p.fogNear;
      ctx.fog.far = p.fogFar;
      ctx.fog.color.set(night ? 0x0a1220 : p.fogCol);
      ctx.ambient.intensity = p.amb;
      ctx.sun.intensity = p.sun;
      ctx.hemi.intensity = p.hemi;
      ctx.renderer.toneMappingExposure = p.exposure;
      ctx.sun.color.set(night ? 0xa8c4e8 : 0xfff1d6);
      ctx.ambient.color.set(night ? 0x6a7a90 : 0xdfe6ea);
      const skyMat = ctx.sky.material as THREE.MeshBasicMaterial;
      skyMat.map = p.stormSky ? mats.storm : night ? mats.skyNight : mats.skyDay;
      skyMat.needsUpdate = true;
      rain.visible = p.rain > 0;
      (rain.material as THREE.MeshBasicMaterial).opacity = 0.18 + p.rain * 0.28;
      clouds.visible = p.clouds > 0;
      const use = p.stormSky ? (clouds.userData.storm as THREE.SpriteMaterial) : (clouds.userData.fair as THREE.SpriteMaterial);
      clouds.children.forEach((c) => {
        c.children.forEach((s) => {
          (s as THREE.Sprite).material = use;
        });
      });
      moon.visible = night && w !== "storm";
      lightning.intensity = 0;
    },
    tick(dt, cam, w) {
      const p = PRESETS[w];
      if (p.clouds > 0) {
        clouds.children.forEach((c, i) => {
          c.position.x += dt * (8 + i * 0.35);
          c.position.y += Math.sin((performance.now() * 0.00015) + i) * 0.04;
          if (c.position.x > 5200) c.position.x = -5200;
        });
      }
      if (p.rain > 0) {
        rain.position.copy(cam.position);
        const speed = 0.85 + p.rain * 1.6;
        for (let i = 0; i < vel.length; i++) {
          pos[i * 3 + 1] -= vel[i] * speed * dt;
          if (pos[i * 3 + 1] < -10) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = 16 + Math.random() * 22;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 36;
          }
          dummy.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          dummy.rotation.set(0, 0, 0.08);
          dummy.updateMatrix();
          rain.setMatrixAt(i, dummy.matrix);
        }
        rain.instanceMatrix.needsUpdate = true;
      }
      if (w === "storm") {
        flash -= dt;
        if (flash <= 0 && Math.random() < dt * 0.35) {
          lightning.intensity = 18 + Math.random() * 22;
          flash = 0.08 + Math.random() * 0.12;
        } else if (flash > 0) {
          lightning.intensity *= Math.max(0, 1 - dt * 12);
        } else lightning.intensity = 0;
      }
    },
  };
}
