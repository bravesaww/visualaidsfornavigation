import * as THREE from "three";
import type { Mats } from "./materials";

function latheFuse() {
  const pts: THREE.Vector2[] = [];
  const profile = [
    [0, 0.05],
    [0.15, 0.55],
    [0.45, 1.15],
    [0.9, 1.55],
    [1.5, 1.78],
    [2.4, 1.86],
    [4.2, 1.9],
    [8, 1.9],
    [16, 1.88],
    [22, 1.82],
    [26.2, 1.55],
    [28.4, 1.05],
    [29.6, 0.55],
    [30.2, 0.12],
    [30.4, 0],
  ];
  profile.forEach(([x, r]) => pts.push(new THREE.Vector2(r, x)));
  const geo = new THREE.LatheGeometry(pts, 24);
  geo.rotateZ(-Math.PI / 2);
  geo.translate(-15.2, 0, 0);
  return geo;
}

export function buildAirliner(mats: Mats, scale = 1) {
  const g = new THREE.Group();

  const fuse = new THREE.Mesh(latheFuse(), mats.fuselage);
  const stripe = new THREE.Mesh(
    new THREE.CylinderGeometry(1.92, 1.92, 22, 24, 1, true),
    mats.livery,
  );
  stripe.rotation.z = Math.PI / 2;
  stripe.position.set(0.4, -0.15, 0);
  stripe.scale.set(1, 1, 0.18);

  const windshield = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 16, 12, 0, Math.PI * 2, 0.28, 0.55),
    mats.window,
  );
  windshield.scale.set(1.25, 0.72, 1.05);
  windshield.position.set(-12.6, 0.62, 0);
  windshield.rotation.z = 0.22;

  for (let i = 0; i < 4; i++) {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.55, 0.04), mats.fuseDark);
    frame.position.set(-12.35 - i * 0.08, 0.7, -0.85 + i * 0.55);
    frame.rotation.y = 0.15;
    g.add(frame);
  }

  for (let i = 0; i < 18; i++) {
    const w = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.16, 4, 8), mats.window);
    w.rotation.z = Math.PI / 2;
    w.position.set(-8.6 + i * 1.05, 0.48, 1.86);
    const w2 = w.clone();
    w2.position.z = -1.86;
    g.add(w, w2);
  }

  const fairing = new THREE.Mesh(
    new THREE.SphereGeometry(2.4, 12, 10),
    mats.fuselage,
  );
  fairing.scale.set(2.4, 0.55, 0.85);
  fairing.position.set(0.6, -1.05, 0);

  const mkWing = (side: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(4.8, 0.4);
    shape.lineTo(16.8, 0.12);
    shape.lineTo(17.6, -0.08);
    shape.lineTo(15.8, -1.35);
    shape.lineTo(8.2, -2.05);
    shape.lineTo(0, -2.6);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.28, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 1 });
    geo.rotateX(Math.PI / 2);
    const wing = new THREE.Mesh(geo, mats.fuseDark);
    wing.position.set(-1.1, -0.28, 0);
    wing.rotation.x = side > 0 ? -0.04 : 0.04;
    wing.scale.z = side;

    const root = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.38, 2.4), mats.fuselage);
    root.position.set(0.2, -0.42, side * 2.4);

    const shark = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.85, 0.7), mats.livery);
    shark.position.set(4.2, 0.55, side * 16.4);
    shark.rotation.z = side * 0.12;
    const sharkTip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 0.35), mats.fuselage);
    sharkTip.position.set(4.35, 1.45, side * 16.7);

    const nav = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 6),
      new THREE.MeshStandardMaterial({
        color: side > 0 ? 0x22ff66 : 0xff2244,
        emissive: side > 0 ? 0x22ff66 : 0xff2244,
        emissiveIntensity: 3.2,
      }),
    );
    nav.position.set(4.5, 0.15, side * 17.2);

    for (let i = 0; i < 4; i++) {
      const canoe = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 1.4, 4, 6), mats.fuseDark);
      canoe.rotation.z = Math.PI / 2;
      canoe.position.set(2.4 + i * 2.2, -0.7, side * (6 + i * 2.4));
      g.add(canoe);
    }

    g.add(wing, root, shark, sharkTip, nav);
  };
  mkWing(1);
  mkWing(-1);

  const mkEng = (z: number) => {
    const e = new THREE.Group();
    const cowl = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.82, 3.6, 20), mats.fuseDark);
    cowl.rotation.z = Math.PI / 2;
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.1, 10, 24), mats.metal);
    lip.rotation.y = Math.PI / 2;
    lip.position.x = -1.8;
    const inner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.2, 20),
      new THREE.MeshStandardMaterial({ color: 0x1a1e24, roughness: 0.4 }),
    );
    inner.rotation.z = Math.PI / 2;
    inner.position.x = -1.55;
    const spinner = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), mats.metal);
    spinner.scale.set(1.4, 1, 1);
    spinner.position.x = -1.35;
    for (let i = 0; i < 12; i++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.62, 0.12),
        new THREE.MeshStandardMaterial({ color: 0xc5d0d8, metalness: 0.7, roughness: 0.2 }),
      );
      const a = (i / 12) * Math.PI * 2;
      blade.position.set(-1.5, Math.cos(a) * 0.32, Math.sin(a) * 0.32);
      blade.rotation.x = a;
      e.add(blade);
    }
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.7, 1.6, 12), mats.metal);
    core.rotation.z = Math.PI / 2;
    core.position.x = 1.1;
    const chev = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.05, 6, 18), mats.fuseDark);
    chev.rotation.y = Math.PI / 2;
    chev.position.x = 1.95;
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.45, 0.22), mats.fuseDark);
    pylon.position.set(0.15, 0.95, 0);
    const pylonFair = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 0.28), mats.fuselage);
    pylonFair.position.set(0.1, 1.55, 0);
    e.add(cowl, lip, inner, spinner, core, chev, pylon, pylonFair);
    e.position.set(0.2, -1.55, z);
    return e;
  };

  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(3.8, 0.15);
  finShape.lineTo(3.1, 5.4);
  finShape.lineTo(1.5, 5.7);
  finShape.lineTo(0.35, 5.35);
  finShape.lineTo(0, 0.2);
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.26, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 1 });
  finGeo.rotateY(Math.PI / 2);
  const fin = new THREE.Mesh(finGeo, mats.fuselage);
  fin.position.set(11.4, 0.45, 0.13);
  const finCap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.5, 2.6), mats.livery);
  finCap.position.set(12.0, 5.15, 0);
  const rudder = new THREE.Mesh(new THREE.BoxGeometry(0.16, 4.4, 1.1), mats.fuseDark);
  rudder.position.set(13.55, 2.8, 0);

  const stab = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.18, 9.2), mats.fuseDark);
  stab.position.set(12.6, 0.85, 0);
  const elev = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 8.6), mats.fuselage);
  elev.position.set(14.1, 0.82, 0);

  const apu = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.7, 8), mats.metal);
  apu.rotation.z = Math.PI / 2;
  apu.position.set(14.9, 0.35, 0);

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0xff2244, emissive: 0xff2244, emissiveIntensity: 4 }),
  );
  beacon.position.set(1.2, 1.95, 0);
  const tailLite = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.5 }),
  );
  tailLite.position.set(14.6, 0.7, 0);

  const mkGear = (x: number, z: number, dual: boolean) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.65, 8), mats.metal);
    leg.position.set(x, -1.65, z);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.45), mats.fuseDark);
    door.position.set(x, -1.05, z + (z === 0 ? 0.4 : Math.sign(z) * 0.35));
    g.add(leg, door);
    const wheels = dual ? [-0.22, 0.22] : [0];
    wheels.forEach((off) => {
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.11, 8, 12), mats.fuseDark);
      wheel.position.set(x + off, -2.45, z);
      wheel.rotation.y = Math.PI / 2;
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 8), mats.metal);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(x + off, -2.45, z);
      g.add(wheel, hub);
    });
  };
  mkGear(-9.2, 0, true);
  mkGear(1.2, 1.25, true);
  mkGear(1.2, -1.25, true);

  const pitot = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 6), mats.metal);
  pitot.rotation.z = Math.PI / 2;
  pitot.position.set(-13.4, 0.15, 0.55);

  g.add(
    fuse,
    stripe,
    windshield,
    fairing,
    mkEng(-6.05),
    mkEng(6.05),
    fin,
    finCap,
    rudder,
    stab,
    elev,
    apu,
    beacon,
    tailLite,
    pitot,
  );
  g.scale.setScalar(scale);
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });
  return g;
}
