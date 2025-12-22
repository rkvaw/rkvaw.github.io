// particles.js — soft cloud background (Three.js)
const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 180;

// Soft cloud particles
const particleCount = 36;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  const ix = i * 3;
  positions[ix] = (Math.random() - 0.5) * 550;
  positions[ix + 1] = (Math.random() - 0.5) * 260;
  positions[ix + 2] = (Math.random() - 0.5) * 80;

  const c = new THREE.Color();
  c.setHSL(0.55 + Math.random() * 0.03, 0.12 + Math.random() * 0.06, 0.85 + Math.random() * 0.04);
  colors[ix] = c.r; colors[ix + 1] = c.g; colors[ix + 2] = c.b;

  sizes[i] = 60 + Math.random() * 60;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const material = new THREE.PointsMaterial({
  size: 80,
  vertexColors: true,
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const points = new THREE.Points(geometry, material);
scene.add(points);

const velocities = new Float32Array(particleCount * 3);
for (let i = 0; i < velocities.length; i++) velocities[i] = (Math.random() - 0.5) * 0.02;

function animate() {
  requestAnimationFrame(animate);

  const pos = geometry.getAttribute('position').array;
  for (let i = 0; i < particleCount; i++) {
    const ix = i * 3;
    pos[ix] += velocities[ix] * (0.5 + Math.random() * 0.6);
    pos[ix + 1] += velocities[ix + 1] * (0.5 + Math.random() * 0.6);

    if (pos[ix] < -600) pos[ix] = 600;
    if (pos[ix] > 600) pos[ix] = -600;
    if (pos[ix + 1] < -320) pos[ix + 1] = 320;
    if (pos[ix + 1] > 320) pos[ix + 1] = -320;
  }
  geometry.getAttribute('position').needsUpdate = true;

  points.rotation.z += 0.00015;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});