// @ts-nocheck
import * as THREE from "three";
import { RWY, TAXI } from "./constants.js";
import { buildHoldLines, buildSigns } from "./signs.js";
import { buildTown } from "./town.js";

function plane(w, h, mat, y) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  mesh.receiveShadow = true;
  return mesh;
}

function box(w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function glowMat(color) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
}

function tagLit(mat, base) {
  mat.userData.baseEmissive = base;
  mat.emissiveIntensity = base;
  return mat;
}

function elevatedLight(color, tall = false) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.18, 0.06, 10),
    new THREE.MeshStandardMaterial({ color: 0x2a2e34, roughness: 0.5, metalness: 0.4 }),
  );
  base.position.y = 0.03;
  const stemH = tall ? 0.7 : 0.42;
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.055, stemH, 8),
    new THREE.MeshStandardMaterial({ color: 0x1c1e22, roughness: 0.4, metalness: 0.45 }),
  );
  stem.position.y = 0.03 + stemH / 2;
  const can = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.14, 12),
    new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.32, metalness: 0.6 }),
  );
  can.position.y = stemH + 0.14;
  const lensMat = tagLit(
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      roughness: 0.12,
    }),
    6.5,
  );
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), lensMat);
  lens.position.y = stemH + 0.22;
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), glowMat(color));
  halo.position.y = stemH + 0.22;
  halo.userData.glow = true;
  const hood = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.04, 12, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x0a0c10, roughness: 0.5 }),
  );
  hood.position.y = stemH + 0.28;
  g.add(base, stem, can, lens, halo, hood);
  return g;
}

function insetLight(color) {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.05, 10),
    new THREE.MeshStandardMaterial({ color: 0x1a1c20, roughness: 0.4, metalness: 0.6 }),
  );
  ring.position.y = 0.03;
  const lensMat = tagLit(
    new THREE.MeshStandardMaterial({ color, emissive: color, roughness: 0.2 }),
    5.4,
  );
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 10), lensMat);
  lens.position.y = 0.05;
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), glowMat(color));
  halo.position.y = 0.08;
  halo.userData.glow = true;
  g.add(ring, lens, halo);
  return g;
}

function papiUnit(red) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.42, 1.05),
    new THREE.MeshStandardMaterial({ color: 0x1b1e24, roughness: 0.4, metalness: 0.45 }),
  );
  body.position.y = 0.34;
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.88, 0.1, 0.45),
    new THREE.MeshStandardMaterial({ color: 0x0e1014, roughness: 0.5 }),
  );
  visor.position.set(0, 0.56, -0.28);
  const col = red ? 0xff2244 : 0xfff6c8;
  const lensMat = tagLit(
    new THREE.MeshStandardMaterial({ color: col, emissive: col, roughness: 0.12 }),
    8,
  );
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 14), lensMat);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, 0.38, -0.5);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 8), glowMat(col));
  halo.position.set(0, 0.38, -0.55);
  halo.userData.glow = true;
  g.add(body, visor, lens, halo);
  g.userData.lensMat = lensMat;
  g.userData.haloMat = halo.material;
  return g;
}

export function buildAerodrome(mats) {
  const root = new THREE.Group();
  const half = RWY.length / 2;
  const hw = RWY.width / 2;

  const markings = {};
  const lights = {};
  const features = {};
  const mk = (bag, name) => {
    const g = new THREE.Group();
    g.name = name;
    bag[name] = g;
    root.add(g);
    return g;
  };

  const env = mk(features, "environment");
  env.add(plane(12000, 8000, mats.ground, -0.35));
  env.children[env.children.length - 1].receiveShadow = false;
  env.add(plane(RWY.length + 220, 240, mats.strip, 0.02));
  env.add(buildTown(mats));

  const skyGeo = new THREE.SphereGeometry(18000, 24, 16);
  const skyMat = new THREE.MeshBasicMaterial({ map: mats.skyDay, side: THREE.BackSide });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  env.add(sky);

  const rwyG = mk(features, "runway");
  rwyG.add(plane(RWY.length, RWY.width, mats.asphalt, 0.08));

  const cl = mk(markings, "centerline");
  for (let x = -half + 45; x < half - 45; x += 50) {
    const s = plane(30, 0.9, mats.white, 0.12);
    s.position.set(x + 15, 0.12, 0);
    cl.add(s);
  }

  const thr = mk(markings, "threshold");
  const nStripes = 12;
  const sw = 1.8;
  const gap = 1.8;
  const tot = nStripes * sw + (nStripes - 1) * gap;
  const z0 = -tot / 2 + sw / 2;
  const paintThr = (ax, dir) => {
    for (let i = 0; i < nStripes; i++) {
      const m = plane(30, sw, mats.white, 0.12);
      m.position.set(ax + dir * 15, 0.12, z0 + i * (sw + gap));
      thr.add(m);
    }
  };
  paintThr(-half + 8, 1);
  paintThr(half - 8, -1);

  const aim = mk(markings, "aiming");
  const paintAim = (cx) => {
    const a = plane(60, 10, mats.white, 0.12);
    a.position.set(cx, 0.12, -15);
    const b = plane(60, 10, mats.white, 0.12);
    b.position.set(cx, 0.12, 15);
    aim.add(a, b);
  };
  paintAim(-half + 400);
  paintAim(half - 400);

  const tdz = mk(markings, "tdz");
  [150, 300, 450, 600, 750, 900].forEach((d, idx) => {
    const nBars = idx === 0 ? 3 : 1;
    [-1, 1].forEach((side) => {
      for (let k = 0; k < nBars; k++) {
        const a = plane(22.5, 3, mats.white, 0.12);
        a.position.set(-half + d + 11, 0.12, side * (9 + k * 6));
        const b = plane(22.5, 3, mats.white, 0.12);
        b.position.set(half - d - 11, 0.12, side * (9 + k * 6));
        tdz.add(a, b);
      }
    });
  });

  const sides = mk(markings, "sides");
  const sl = plane(RWY.length - 24, 0.9, mats.white, 0.12);
  sl.position.set(0, 0.12, -hw + 2);
  const sr = plane(RWY.length - 24, 0.9, mats.white, 0.12);
  sr.position.set(0, 0.12, hw - 2);
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
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 27),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true }),
    );
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  };
  const n09 = numTex("09");
  n09.rotation.z = Math.PI / 2;
  n09.position.set(-half + 52, 0.14, 0);
  const n27 = numTex("27");
  n27.rotation.z = -Math.PI / 2;
  n27.position.set(half - 52, 0.14, 0);
  nums.add(n09, n27);

  const areas = mk(markings, "areas");
  const stopLen = RWY.stopway;
  const cw = RWY.clearway;
  const stopL = plane(stopLen, RWY.width, mats.stopway, 0.07);
  stopL.position.set(-half - stopLen / 2, 0.07, 0);
  const stopR = plane(stopLen, RWY.width, mats.stopway, 0.07);
  stopR.position.set(half + stopLen / 2, 0.07, 0);
  const clrL = plane(cw, 150, mats.clearway, 0.04);
  clrL.position.set(-half - stopLen - cw / 2, 0.04, 0);
  const clrR = plane(cw, 150, mats.clearway, 0.04);
  clrR.position.set(half + stopLen + cw / 2, 0.04, 0);
  for (let i = 0; i < 4; i++) {
    const ch = plane(8, 1.2, mats.yellow, 0.13);
    ch.position.set(-half - 10 - i * 12, 0.13, 0);
    ch.rotation.z = Math.PI / 4;
    const ch2 = ch.clone();
    ch2.position.x = half + 10 + i * 12;
    areas.add(ch, ch2);
  }
  areas.add(stopL, stopR, clrL, clrR);

  const taxiLines = mk(markings, "taxiLines");
  const taxCl = plane(RWY.length + 80, 0.28, mats.yellow, 0.11);
  taxCl.position.set(0, 0.11, TAXI.parallelZ);
  taxiLines.add(taxCl);

  const taxi = mk(features, "taxiways");
  const alpha = plane(RWY.length + 120, TAXI.width, mats.taxi, 0.07);
  alpha.position.set(0, 0.07, TAXI.parallelZ);
  taxi.add(alpha);
  TAXI.linkXs.forEach((x) => {
    const link = plane(28, 72, mats.taxi, 0.07);
    link.position.set(x, 0.07, TAXI.parallelZ / 2 + 8);
    taxi.add(link);
    const bay = plane(70, 40, mats.taxi, 0.075);
    bay.position.set(x, 0.075, TAXI.parallelZ - 8);
    taxi.add(bay);
  });

  const orp = mk(features, "orp");
  const orp1 = plane(70, 50, mats.concrete, 0.07);
  orp1.position.set(-half - 20, 0.07, TAXI.parallelZ - 10);
  const orp2 = plane(70, 50, mats.concrete, 0.07);
  orp2.position.set(half + 20, 0.07, TAXI.parallelZ - 10);
  orp.add(orp1, orp2);

  const ptt = mk(features, "ptt");
  const pttPad = plane(55, 42, mats.concrete, 0.08);
  pttPad.position.set(120, 0.08, -hw - 85);
  ptt.add(pttPad);

  const tower = mk(features, "tower");
  const tx = -half + 260;
  const tz = TAXI.parallelZ + 150;
  const tBase = new THREE.Mesh(new THREE.CylinderGeometry(8.2, 9.4, 8, 14), mats.towerDark);
  tBase.position.set(tx, 4, tz);
  const tDoor = box(1.4, 2.4, 0.2, mats.tower);
  tDoor.position.set(tx, 1.2, tz - 8.8);
  const tShaft = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 4.6, 34, 14), mats.tower);
  tShaft.position.set(tx, 25, tz);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 4.2, 2.2, 12), mats.towerDark);
  collar.position.set(tx, 42.2, tz);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(8.8, 9.2, 3.6, 24, 1, true), mats.glass);
  glass.position.set(tx, 45.0, tz);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 9.6, 1.2, 10), mats.towerDark);
  roof.position.set(tx, 47.2, tz);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.4, 10), mats.metal);
  cap.position.set(tx, 47.9, tz);
  const tFloor = plane(16, 16, mats.concrete, 43.15);
  tFloor.position.set(tx, 43.15, tz);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 8, 6), mats.metal);
  mast.position.set(tx, 52, tz);
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 8, 0, Math.PI * 2, 0, 1.1), mats.metal);
  dish.position.set(tx + 0.4, 54.2, tz);
  const mast2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5, 6), mats.metal);
  mast2.position.set(tx - 1.4, 50.4, tz + 1.2);
  const desk = box(7.2, 0.35, 1.0, mats.cockpitPanel);
  desk.position.set(tx, 42.85, tz - 5.6);
  const chair = box(0.5, 0.55, 0.5, mats.leather);
  chair.position.set(tx, 43.45, tz - 2.4);
  const screen = box(1.2, 0.7, 0.06, mats.btn);
  screen.position.set(tx - 1.5, 43.85, tz - 5.5);
  const screen2 = screen.clone();
  screen2.position.x = tx + 1.5;
  tower.add(tBase, tDoor, tShaft, collar, glass, roof, cap, tFloor, mast, dish, mast2, desk, chair, screen, screen2);

  const edge = mk(lights, "edge");
  for (let x = -half + 20; x <= half - 20; x += 60) {
    const L = elevatedLight(0xf4f6f8);
    L.position.set(x, 0, -hw - 1.6);
    const R = elevatedLight(0xf4f6f8);
    R.position.set(x, 0, hw + 1.6);
    edge.add(L, R);
  }

  const thrL = mk(lights, "threshold");
  for (let i = 0; i < 14; i++) {
    const z = -hw + 2 + (i / 13) * (RWY.width - 4);
    const a = elevatedLight(0x3cff88);
    a.position.set(-half + 1.2, 0, z);
    const b = elevatedLight(0x3cff88);
    b.position.set(half - 1.2, 0, z);
    thrL.add(a, b);
  }

  const endL = mk(lights, "end");
  for (let i = 0; i < 10; i++) {
    const z = -hw + 2 + (i / 9) * (RWY.width - 4);
    const a = elevatedLight(0xff3a3a);
    a.position.set(-half - 5, 0, z);
    const b = elevatedLight(0xff3a3a);
    b.position.set(half + 5, 0, z);
    endL.add(a, b);
  }

  const clL = mk(lights, "centerline");
  for (let x = -half + 12; x < half - 12; x += 15) {
    const fromEnd = Math.min(x + half, half - x);
    const col = fromEnd < 300 ? 0xff3344 : fromEnd < 900 ? (Math.round(x / 15) % 2 ? 0xff3344 : 0xffffff) : 0xffffff;
    const c = insetLight(col);
    c.position.set(x, 0.02, 0);
    clL.add(c);
  }

  const tdzL = mk(lights, "tdz");
  for (let d = 0; d <= 900; d += 30) {
    for (const s of [-9, 9]) {
      const a = insetLight(0xffffff);
      a.position.set(-half + 30 + d, 0.03, s);
      const b = insetLight(0xffffff);
      b.position.set(half - 30 - d, 0.03, s);
      tdzL.add(a, b);
    }
  }

  const als = mk(lights, "als");
  const buildAls = (dir) => {
    const start = dir > 0 ? -half : half;
    const sign = dir > 0 ? -1 : 1;
    for (let d = 30; d <= 900; d += 30) {
      const l = elevatedLight(0xffffff);
      l.position.set(start + sign * d, 0.15, 0);
      als.add(l);
    }
    [150, 300, 450, 600, 750].forEach((d) => {
      const x = start + sign * d;
      for (let z = -16; z <= 16; z += 4) {
        if (Math.abs(z) < 1.5) continue;
        const l = elevatedLight(0xffffff);
        l.position.set(x, 0.15, z);
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
    const a = elevatedLight(0x44aaff);
    a.position.set(x, 0.04, TAXI.parallelZ - TAXI.width / 2 - 1);
    const b = elevatedLight(0x44aaff);
    b.position.set(x, 0.04, TAXI.parallelZ + TAXI.width / 2 + 1);
    taxiL.add(a, b);
  }

  const stopbar = mk(lights, "stopbar");
  TAXI.linkXs.forEach((x) => {
    for (let z = -10; z <= 10; z += 2.2) {
      const l = insetLight(0xff2244);
      l.position.set(x, 0.04, 30 + z * 0.05);
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
      const l = elevatedLight(0xfff4aa, true);
      l.position.set(start + sign * d, 0.2, 0);
      rabbit.add(l);
    }
    for (let d = 30; d <= 300; d += 30) {
      const x = start + sign * d;
      for (const z of [-12, 12]) {
        const l = elevatedLight(0xffffff, true);
        l.position.set(x, 0.2, z);
        rabbit.add(l);
      }
    }
  };
  mkRabbit(1);
  mkRabbit(-1);

  const hold = mk(markings, "hold");
  hold.add(buildHoldLines(mats));
  const signs = mk(markings, "signs");
  signs.add(buildSigns(mats));

  const setLightLevel = (level) => {
    const mul = level === 1 ? 0.45 : level === 2 ? 1 : 2.15;
    Object.values(lights).forEach((grp) => {
      grp.traverse((o) => {
        const m = o;
        if (!m.isMesh) return;
        const mat = m.material;
        if ("emissiveIntensity" in mat && mat.userData.baseEmissive) {
          mat.emissiveIntensity = mat.userData.baseEmissive * mul;
        }
        if (m.userData.glow && "opacity" in mat) {
          mat.opacity = Math.min(0.95, 0.35 * mul);
        }
      });
    });
  };

  const setPapi = (redFromRwy) => {
    const paint = (unit, red) => {
      const col = red ? 0xff2244 : 0xfff6c8;
      const lens = unit.userData.lensMat;
      const halo = unit.userData.haloMat;
      if (lens) {
        lens.color.setHex(col);
        lens.emissive.setHex(col);
      }
      if (halo) halo.color.setHex(col);
    };
    for (let bank = 0; bank < 2; bank++) {
      for (let i = 0; i < 4; i++) {
        paint(papiUnits[bank * 4 + i], i < redFromRwy);
      }
    }
  };

  return {
    root,
    markings,
    lights,
    features,
    sky,
    towerSeat: new THREE.Vector3(tx, 45.55, tz - 1.2),
    towerLookYaw: 0,
    papiUnits,
    setLightLevel,
    setPapi,
  };
}
