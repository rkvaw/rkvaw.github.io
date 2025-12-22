// particles.js — subtle, efficient soft cloud background (Three.js)
(() => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 180;

  const particleCount = 28;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const ix = i * 3;
    positions[ix] = (Math.random() - 0.5) * 600;
    positions[ix + 1] = (Math.random() - 0.5) * 300;
    positions[ix + 2] = (Math.random() - 0.5) * 100;

    const c = new THREE.Color();
    c.setHSL(0.56 + Math.random() * 0.03, 0.12 + Math.random() * 0.05, 0.86 + Math.random() * 0.03);
    colors[ix] = c.r; colors[ix + 1] = c.g; colors[ix + 2] = c.b;

    sizes[i] = 60 + Math.random() * 50;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 80,
    vertexColors: true,
    transparent: true,
    opacity: 0.14,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const velocities = new Float32Array(particleCount * 3);
  for (let i = 0; i < velocities.length; i++) velocities[i] = (Math.random() - 0.5) * 0.018;

  function animate() {
    requestAnimationFrame(animate);

    const pos = geometry.getAttribute('position').array;
    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      // subtle per-particle drift
      pos[ix] += velocities[ix] * (0.6 + Math.random() * 0.6);
      pos[ix + 1] += velocities[ix + 1] * (0.6 + Math.random() * 0.6);

      // wrap-around for continuous motion
      if (pos[ix] < -800) pos[ix] = 800;
      if (pos[ix] > 800) pos[ix] = -800;
      if (pos[ix + 1] < -420) pos[ix + 1] = 420;
      if (pos[ix + 1] > 420) pos[ix + 1] = -420;
    }
    geometry.getAttribute('position').needsUpdate = true;

    points.rotation.z += 0.00012;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
})();