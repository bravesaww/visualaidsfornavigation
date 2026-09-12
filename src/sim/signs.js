// @ts-nocheck
import * as THREE from "three";
import { RWY, TAXI } from "./constants.js";

function canvasFace(w, h, paint) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  paint(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function board(
  w,
  h,
  tex,
  mats, postH = 1.6) {
  const g = new THREE.Group();
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex }),
  );
  face.position.y = postH + h / 2;
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color: 0x111318 }),
  );
  back.rotation.y = Math.PI;
  back.position.y = postH + h / 2;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, postH, 6), mats.metal);
  post.position.y = postH / 2;
  g.add(face, back, post);
  return g;
}

export function buildSigns(mats) {
  const group = new THREE.Group();
  group.name = "signs";
  const half = RWY.length / 2;

  const loc = (letter) =>
    canvasFace(256, 128, (ctx, w, h) => {
      ctx.fillStyle = "#111318";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#f0c43a";
      ctx.font = "bold 92px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(letter, w / 2, h / 2 + 4);
    });

  const info = (text) =>
    canvasFace(512, 128, (ctx, w, h) => {
      ctx.fillStyle = "#f0c43a";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#111318";
      ctx.font = "bold 52px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h / 2 + 2);
    });

  const mandatory = (text) =>
    canvasFace(512, 160, (ctx, w, h) => {
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
    const s = board(1.8, 0.9, loc(name), mats);
    s.position.set(x + 10, 0, TAXI.parallelZ + 14);
    s.rotation.y = Math.PI;
    group.add(s);

    const hold = board(2.6, 1.15, mandatory(`CAT III\n09-27`), mats, 1.4);
    hold.position.set(x - 8, 0, 28);
    hold.rotation.y = Math.PI;
    group.add(hold);

    const dir = board(2.4, 0.7, info(`← ${name}  RWY →`), mats, 1.3);
    dir.position.set(x, 0, TAXI.parallelZ - 16);
    group.add(dir);
  });

  const twr = board(2.2, 0.8, info("TWR"), mats);
  twr.position.set(-half + 248, 0, TAXI.parallelZ + 110);
  group.add(twr);

  const ptt = board(2.2, 0.8, info("PTT"), mats);
  ptt.position.set(120, 0, -RWY.width / 2 - 60);
  group.add(ptt);

  const dist = board(3.2, 0.9, info("TORA 2440  ASDA 2500"), mats, 1.5);
  dist.position.set(-half + 90, 0, RWY.width / 2 + 18);
  group.add(dist);

  const toda = board(3.2, 0.9, info("TODA 2740  LDA 2440"), mats, 1.5);
  toda.position.set(half - 90, 0, RWY.width / 2 + 18);
  toda.rotation.y = Math.PI;
  group.add(toda);

  return group;
}

export function buildHoldLines(mats) {
  const g = new THREE.Group();
  g.name = "hold";
  TAXI.linkXs.forEach((x) => {
    for (let i = 0; i < 4; i++) {
      const bar = new THREE.Mesh(new THREE.PlaneGeometry(TAXI.width + 4, 0.35), mats.yellow);
      bar.rotation.x = -Math.PI / 2;
      bar.position.set(x, 0.13, 32 + i * 0.9);
      g.add(bar);
    }
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 18), mats.yellow);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(x - TAXI.width / 2 - 1, 0.13, 22);
    g.add(dash);
  });
  return g;
}
