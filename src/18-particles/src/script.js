import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const particlesTexture = textureLoader.load("/textures/particles/9.png");

/**
 * Particles
 */

// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.1;
particlesMaterial.setAttenuation = true;
// particlesMaterial.color = new THREE.Color("#ff88cc");
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particlesTexture;
// particlesMaterial.alphaTest = 0.001;
// particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
// particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;
gui.add(particlesMaterial, "size").min(0).max(1).step(0.001).name("size");
gui
  .add(particlesMaterial, "sizeAttenuation")
  .name("sizeAttenuation")
  .onChange(() => {
    particlesMaterial.needsUpdate = true;
  });

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1),
  new THREE.MeshBasicMaterial({
    color: "#ffffff",
  })
);
// scene.add(sphere);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const initialParticlesPosition = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  initialParticlesPosition[i] = positions[i];
}

const parameters = {
  zAxis: false,
};
gui.add(parameters, "zAxis").name("zAxis");

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particles
  // particles.rotation.y = elapsedTime * 0.2;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
    if (parameters.zAxis) {
      particlesGeometry.attributes.position.array[i3 + 2] =
        Math.cos(elapsedTime + x * 5) * 2;
    } else {
      particlesGeometry.attributes.position.array[i3 + 2] =
        initialParticlesPosition[i3 + 2];
    }
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
