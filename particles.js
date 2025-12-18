// Colorful, interactive particle simulation using Three.js

const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0a23, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 120;

const particles = 1000;
const geometry = new THREE.BufferGeometry();
const positions = [];
const velocities = [];
const colors = [];

for (let i = 0; i < particles; i++) {
  positions.push(
    (Math.random() - 0.5) * 400,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200
  );
  velocities.push(
    (Math.random() - 0.5) * 0.5,
    (Math.random() - 0.5) * 0.5,
    (Math.random() - 0.5) * 0.5
  );
  const color = new THREE.Color();
  color.setHSL(Math.random(), 1.0, 0.6);
  colors.push(color.r, color.g, color.b);
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({ size: 3, vertexColors: true, transparent: true, opacity: 0.8 });
const points = new THREE.Points(geometry, material);
scene.add(points);

// Mouse interaction
let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animate
function animateParticles() {
  requestAnimationFrame(animateParticles);

  // Update particle positions
  const pos = geometry.getAttribute('position');
  for (let i = 0; i < particles; i++) {
    let ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;

    // Simple mouse attraction
    let dx = (mouse.x * 200) - pos.array[ix];
    let dy = (mouse.y * 100) - pos.array[iy];
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 60) {
      velocities[ix] += dx * 0.0005;
      velocities[iy] += dy * 0.0005;
    }

    pos.array[ix] += velocities[ix];
    pos.array[iy] += velocities[iy];
    pos.array[iz] += velocities[iz];

    // Bounce from edges
    if (pos.array[ix] < -200 || pos.array[ix] > 200) velocities[ix] *= -1;
    if (pos.array[iy] < -100 || pos.array[iy] > 100) velocities[iy] *= -1;
    if (pos.array[iz] < -100 || pos.array[iz] > 100) velocities[iz] *= -1;

    // Damping
    velocities[ix] *= 0.98;
    velocities[iy] *= 0.98;
    velocities[iz] *= 0.98;
  }
  pos.needsUpdate = true;

  points.rotation.y += 0.0015;
  points.rotation.x += 0.0007;
  renderer.render(scene, camera);
}
animateParticles();

// Responsive
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});