import * as THREE from './vendor/three.js';

const button = document.querySelector('.stage-phone');
const hero = button.closest('.hero-stage');
const canvas = button.querySelector('canvas');

function createPhone() {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 40);
  camera.position.set(0, 3.5, 6.1);
  camera.lookAt(0, .35, 0);
  scene.add(new THREE.HemisphereLight(0xfff7e8, 0x619cb3, 2.25));
  const key = new THREE.DirectionalLight(0xfff6dd, 3.2);
  key.position.set(-3, 6, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x89edff, 2.3);
  rim.position.set(4, 1, -4);
  scene.add(rim);

  const phone = new THREE.Group();
  scene.add(phone);
  const enamel = new THREE.MeshPhysicalMaterial({ color: 0xf7ad95, roughness: .28, clearcoat: .6 });
  const cream = new THREE.MeshPhysicalMaterial({ color: 0xffdfb1, roughness: .31, clearcoat: .5 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x603238, roughness: .42 });
  function add(geometry, material, x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    phone.add(mesh);
    return mesh;
  }
  function roundedBox(w, h, d, radius) {
    const shape = new THREE.Shape();
    const x = w / 2 - radius, y = d / 2 - radius;
    shape.moveTo(-x, -y);
    shape.lineTo(x, -y);
    shape.lineTo(x, y);
    shape.lineTo(-x, y);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: h - radius * 2, bevelEnabled: true, bevelSize: radius,
      bevelThickness: radius, bevelSegments: 5, steps: 1,
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, -(h - radius * 2) / 2, 0);
    return geo;
  }
  add(roundedBox(2.15, .48, 1.45, .20), enamel, 0, .22, 0);
  add(roundedBox(1.88, .27, .38, .12), cream, 0, .62, -.39);
  for (const x of [-.76, .76]) add(roundedBox(.48, .34, .55, .14), cream, x, .56, -.27);
  add(new THREE.CylinderGeometry(.48, .5, .07, 42), dark, 0, .47, .26);
  add(new THREE.CylinderGeometry(.40, .43, .08, 42), cream, 0, .52, .26);
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2;
    add(new THREE.CylinderGeometry(.047, .047, .016, 14), dark, Math.cos(a)*.30, .568, .26+Math.sin(a)*.30);
  }
  add(new THREE.CylinderGeometry(.135, .14, .038, 30), enamel, 0, .576, .26);

  let yaw = -.44, pitch = .04;
  let look = 0;
  let drag;
  let dragged = false;
  let frame = 0;
  let visible = true;

  function draw(time) {
    frame = 0;
    const still = hero.hasAttribute('data-paused');
    const t = still ? 0 : time / 1000;
    phone.position.y = still ? 0 : Math.sin(t * 1.6) * .10;
    phone.rotation.set(pitch + Math.sin(t * 1.4) * .065, yaw + look, .10 + Math.cos(t * 1.65) * .075);
    renderer.render(scene, camera);
    if (!still && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function sync() {
    cancelAnimationFrame(frame);
    draw(performance.now());
  }
  function resize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    sync();
  }
  button.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    dragged = false;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, pitch };
    button.setPointerCapture(event.pointerId);
  });
  button.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) {
      look = ((event.clientX - button.getBoundingClientRect().left) / button.clientWidth - .5) * .27;
      return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) < 5 && !dragged) return;
    dragged = true;
    yaw = drag.yaw + dx * .024;
    pitch = Math.max(-.65, Math.min(.65, drag.pitch + dy * .015));
    if (hero.hasAttribute('data-paused')) sync();
  });
  button.addEventListener('pointerleave', () => { look = 0; });
  button.addEventListener('lostpointercapture', () => { drag = undefined; });
  button.addEventListener('click', event => {
    if (dragged && event.detail) event.stopImmediatePropagation();
    dragged = false;
  }, true);

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(hero);
  new MutationObserver(sync).observe(hero, { attributes: true, attributeFilter: ['data-paused'] });
  document.addEventListener('visibilitychange', sync);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    button.removeAttribute('data-model');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    button.setAttribute('data-model', '');
    resize();
  });
  button.setAttribute('data-model', '');
  resize();
}

try {
  createPhone();
} catch {
  // The HTML telephone still opens the call when WebGL is unavailable.
}
