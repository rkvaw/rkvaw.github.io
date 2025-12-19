// Super simple, soft, high-quality cloud effect using Three.js

const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0a23, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 200;

const particles = 40;
const geometry = new THREE.BufferGeometry();
const positions = [];
const velocities = [];
const colors = [];
const sizes = [];

for (let i = 0; i < particles; i++) {
  positions.push(
    (Math.random() - 0.5) * 400,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 100
  );
  velocities.push(
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1,
    0
  );
  // Soft pastel color
  const color = new THREE.Color();
  color.setHSL(0.55 + Math.random() * 0.1, 0.2 + Math.random() * 0.2, 0.9);
  colors.push(color.r, color.g, color.b);
  sizes.push(60 + Math.random() * 40);
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

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

// Animate
function animateClouds() {
  requestAnimationFrame(animateClouds);

  // Update particle positions for soft movement
  const pos = geometry.getAttribute('position');
  for (let i = 0; i < particles; i++) {
    let ix = i * 3, iy = i * 3 + 1;
    pos.array[ix] += velocities[ix] * (0.5 + Math.random() * 0.5);
    pos.array[iy] += velocities[iy] * (0.5 + Math.random() * 0.5);

    // Wrap around for endless clouds
    if (pos.array[ix] < -220) pos.array[ix] = 220;
    if (pos.array[ix] > 220) pos.array[ix] = -220;
    if (pos.array[iy] < -120) pos.array[iy] = 120;
    if (pos.array[iy] > 120) pos.array[iy] = -120;
  }
  pos.needsUpdate = true;

  points.rotation.z += 0.0002;
  renderer.render(scene, camera);
}
animateClouds();

// Responsive
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});