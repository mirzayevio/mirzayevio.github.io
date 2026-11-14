import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const canvas = document.querySelector("#construction-scene");
const fallback = document.querySelector("#construction-fallback");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function showFallback(error) {
  console.error("Could not start the construction scene.", error);
  fallback.hidden = false;
  fallback.textContent = "The 3D scene could not load, but this site is still under construction.";
}

function makeMaterial(color, roughness = 0.8) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.08 });
}

function addBox(parent, position, size, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addBeam(parent, start, end, thickness, material) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const direction = to.clone().sub(from);
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(thickness, direction.length(), thickness),
    material,
  );
  mesh.position.copy(from.add(to).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function addCylinder(parent, position, radiusTop, radiusBottom, height, material, segments = 12) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    material,
  );
  mesh.position.set(...position);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function buildScene(scene) {
  const ink = makeMaterial("#343b3b");
  const steel = makeMaterial("#607474");
  const orange = makeMaterial("#ed7044");
  const paleOrange = makeMaterial("#f2a565");
  const teal = makeMaterial("#5faeaa");
  const concrete = makeMaterial("#c7c5b8");
  const shadow = makeMaterial("#d8d5ca");
  const helmet = makeMaterial("#f3ad42");
  const trousers = makeMaterial("#477b81");
  const skin = makeMaterial("#d5a681");
  const site = new THREE.Group();
  scene.add(site);

  const ground = addBox(site, [2.4, -0.25, 0], [12.4, 0.5, 3.2], shadow);
  ground.receiveShadow = true;
  addBox(site, [2.4, -0.505, 0], [12.6, 0.04, 3.35], ink);

  const mastX = 1.7;
  const mastZ = 0;
  const mastWidth = 0.7;
  const mastDepth = 0.68;
  const mastBase = 0.1;
  const mastTop = 6.05;
  for (const xSide of [-1, 1]) {
    for (const zSide of [-1, 1]) {
      const x = mastX + xSide * mastWidth / 2;
      const z = mastZ + zSide * mastDepth / 2;
      addBeam(site, [x, mastBase, z], [x, mastTop, z], 0.12, orange);
    }
  }
  for (let y = 0.4; y <= 5.9; y += 0.78) {
    const nextY = Math.min(y + 0.78, mastTop);
    for (const zSide of [-1, 1]) {
      const z = mastZ + zSide * mastDepth / 2;
      addBeam(site, [mastX - mastWidth / 2, y, z], [mastX + mastWidth / 2, y, z], 0.065, steel);
      addBeam(site, [mastX - mastWidth / 2, y, z], [mastX + mastWidth / 2, nextY, z], 0.055, steel);
      addBeam(site, [mastX + mastWidth / 2, y, z], [mastX - mastWidth / 2, nextY, z], 0.055, steel);
    }
    for (const xSide of [-1, 1]) {
      const x = mastX + xSide * mastWidth / 2;
      addBeam(site, [x, y, mastZ - mastDepth / 2], [x, y, mastZ + mastDepth / 2], 0.065, steel);
    }
  }

  addBox(site, [mastX, 6.14, 0], [1.05, 0.35, 0.95], ink);
  addBox(site, [mastX, 6.31, 0], [0.82, 0.16, 0.72], paleOrange);

  const jibStart = -5.3;
  const jibEnd = 8.2;
  const jibY = 6.45;
  const jibDepth = 0.62;
  for (const zSide of [-1, 1]) {
    const z = zSide * jibDepth / 2;
    addBeam(site, [jibStart, jibY, z], [jibEnd, jibY, z], 0.13, orange);
    addBeam(site, [jibStart, jibY + 0.56, z], [mastX, jibY + 0.56, z], 0.1, steel);
    addBeam(site, [mastX, jibY + 0.56, z], [jibEnd, jibY + 0.56, z], 0.1, steel);
    for (let x = jibStart; x < jibEnd; x += 0.62) {
      const nextX = Math.min(x + 0.62, jibEnd);
      addBeam(site, [x, jibY, z], [nextX, jibY + 0.56, z], 0.052, steel);
      addBeam(site, [nextX, jibY, z], [x, jibY + 0.56, z], 0.052, steel);
    }
  }
  for (const y of [jibY, jibY + 0.56]) {
    addBeam(site, [jibStart, y, -jibDepth / 2], [jibStart, y, jibDepth / 2], 0.1, orange);
    addBeam(site, [jibEnd, y, -jibDepth / 2], [jibEnd, y, jibDepth / 2], 0.1, orange);
  }
  for (const x of [jibStart, mastX, jibEnd]) {
    addBeam(site, [x, jibY, -jibDepth / 2], [x, jibY, jibDepth / 2], 0.08, steel);
    addBeam(site, [x, jibY + 0.56, -jibDepth / 2], [x, jibY + 0.56, jibDepth / 2], 0.08, steel);
  }

  const counterweight = addBox(site, [7.28, 6.03, 0], [1.36, 0.72, 0.94], concrete);
  counterweight.rotation.z = -0.04;
  addBox(site, [7.3, 6.06, 0.49], [1.32, 0.48, 0.035], paleOrange);

  const trolley = new THREE.Group();
  site.add(trolley);
  const trolleyX = -2.72;
  addBox(trolley, [trolleyX, 6.22, 0], [0.63, 0.22, 0.66], ink);
  for (const zSide of [-1, 1]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 12), orange);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(trolleyX, 6.33, zSide * 0.36);
    trolley.add(wheel);
  }

  const load = new THREE.Group();
  site.add(load);
  addBox(load, [0, 0, 0], [0.8, 0.62, 0.8], paleOrange);
  addBox(load, [0, 0.02, 0.414], [0.58, 0.17, 0.035], orange);
  addBox(load, [0, 0.02, -0.414], [0.58, 0.17, 0.035], orange);
  addBeam(site, [trolleyX, 6.13, 0], [trolleyX, 5.94, 0], 0.12, ink);
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), ink);
  site.add(cable);
  const hook = new THREE.Group();
  site.add(hook);
  addBeam(hook, [0, 0.02, 0], [0, -0.13, 0], 0.05, ink);
  addBeam(hook, [0, -0.13, 0], [0.08, -0.22, 0], 0.045, ink);
  addBeam(hook, [0.08, -0.22, 0], [0.2, -0.19, 0], 0.045, orange);
  const loadMotion = { x: trolleyX, y: 1.72 };
  function updateLoad() {
    trolley.position.x = loadMotion.x - trolleyX;
    load.position.set(loadMotion.x, loadMotion.y, 0);
    hook.position.set(loadMotion.x, loadMotion.y + 0.39, 0);
    const cableLength = jibY - 0.09 - loadMotion.y - 0.3;
    cable.position.set(loadMotion.x, loadMotion.y + 0.3 + cableLength / 2, 0);
    cable.scale.y = cableLength;
  }
  updateLoad();

  const building = new THREE.Group();
  site.add(building);
  const bx = 4.8;
  const bz = 0.24;
  const bw = 2.45;
  const bd = 1.55;
  const floors = [0.18, 1.55, 2.92, 4.29];
  for (const xSide of [-1, 1]) {
    for (const zSide of [-1, 1]) {
      const x = bx + xSide * bw / 2;
      const z = bz + zSide * bd / 2;
      addBeam(building, [x, 0, z], [x, floors[3], z], 0.11, steel);
    }
  }
  for (const y of floors) {
    for (const zSide of [-1, 1]) {
      const z = bz + zSide * bd / 2;
      addBeam(building, [bx - bw / 2, y, z], [bx + bw / 2, y, z], 0.105, orange);
    }
    for (const xSide of [-1, 1]) {
      const x = bx + xSide * bw / 2;
      addBeam(building, [x, y, bz - bd / 2], [x, y, bz + bd / 2], 0.1, steel);
    }
  }
  for (let y = floors[0]; y < floors[3]; y += 1.37) {
    for (const zSide of [-1, 1]) {
      const z = bz + zSide * bd / 2;
      addBeam(building, [bx - bw / 2, y, z], [bx + bw / 2, y + 1.37, z], 0.055, steel);
      addBeam(building, [bx + bw / 2, y, z], [bx - bw / 2, y + 1.37, z], 0.055, steel);
    }
  }
  addBox(building, [bx, 1.63, bz], [bw - 0.18, 0.12, bd - 0.18], concrete);
  addBox(building, [bx, 3.0, bz], [bw - 0.18, 0.12, bd - 0.18], concrete);
  addBox(building, [bx + 0.58, 3.73, bz - 0.38], [1.08, 1.35, 0.075], shadow);

  const worker = new THREE.Group();
  worker.position.set(bx - 0.36, 1.72, bz + bd / 2 + 0.05);
  building.add(worker);
  const torso = addCylinder(worker, [0, 0.28, 0], 0.16, 0.2, 0.56, trousers, 8);
  torso.rotation.z = -0.1;
  addCylinder(worker, [0, 0.75, 0], 0.15, 0.16, 0.37, skin, 10);
  addCylinder(worker, [0, 0.96, 0], 0.19, 0.18, 0.12, helmet, 10);
  const arm = new THREE.Group();
  arm.position.set(0.12, 0.48, 0);
  worker.add(arm);
  addBeam(arm, [0, 0, 0], [0.28, 0.32, 0], 0.11, trousers);
  addBeam(arm, [0.28, 0.32, 0], [0.39, 0.52, 0], 0.075, skin);
  addBeam(worker, [-0.08, 0.06, 0], [-0.14, -0.25, 0.08], 0.105, ink);
  addBeam(worker, [0.08, 0.06, 0], [0.17, -0.25, -0.08], 0.105, ink);
  const tool = addCylinder(arm, [0.43, 0.57, 0], 0.05, 0.05, 0.38, orange, 8);
  tool.rotation.z = -0.52;
  addBox(building, [bx, 1.75, bz + bd / 2 + 0.16], [2.7, 0.08, 0.09], orange);

  for (const x of [-3.6, 0.2, 7.9]) {
    addBox(site, [x, 0.19, 1.54], [0.52, 0.38, 0.4], orange);
    addBox(site, [x, 0.4, 1.54], [0.36, 0.08, 0.27], paleOrange);
  }

  const light = new THREE.HemisphereLight("#ffffff", "#9d9c8b", 2.05);
  scene.add(light);
  const sun = new THREE.DirectionalLight("#fff5df", 3.2);
  sun.position.set(-5, 10, 8);
  scene.add(sun);

  return { site, trolley, loadMotion, updateLoad, workerArm: arm, tool };
}

function start() {
  if (!window.gsap) {
    throw new Error("GSAP did not load.");
  }
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 6, -6, 0.1, 100);
  camera.position.set(12, 10, 17);
  camera.lookAt(1.1, 2.4, 0);

  const construction = buildScene(scene);
  const gsap = window.gsap;
  if (reduceMotion.matches) {
    construction.updateLoad();
  } else {
    gsap.to(construction.loadMotion, {
      y: 2.65,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      onUpdate: construction.updateLoad,
    });
    gsap.to(construction.loadMotion, {
      x: -1.7,
      duration: 3.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      onUpdate: construction.updateLoad,
    });
    gsap.to(construction.workerArm.rotation, {
      z: -0.55,
      duration: 0.55,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.35,
    });
    gsap.to(construction.tool.rotation, {
      z: 0.3,
      duration: 0.55,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.35,
    });
  }

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) {
      return;
    }
    const aspect = width / height;
    const viewHeight = aspect < 0.85 ? 16 : aspect < 1.25 ? 13 : 11.6;
    const viewWidth = viewHeight * aspect;
    camera.left = -viewWidth / 2;
    camera.right = viewWidth / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.position.x = aspect < 0.85 ? 2 : 3.2;
    camera.position.y = aspect < 0.85 ? 14.2 : 10;
    camera.position.z = 17;
    camera.lookAt(aspect < 0.85 ? 1.8 : 1.2, aspect < 0.85 ? 4.3 : 2.35, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  const render = () => {
    renderer.render(scene, camera);
    if (!reduceMotion.matches) {
      requestAnimationFrame(render);
    }
  };
  render();
}

try {
  start();
} catch (error) {
  showFallback(error);
}
