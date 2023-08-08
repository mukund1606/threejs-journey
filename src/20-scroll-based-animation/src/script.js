import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";

THREE.ColorManagement.enabled = false;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
// gradientTexture.magFilter = THREE.NearestFilter;
const particlesTexture = textureLoader.load("/textures/particles/9.png");

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
  lightIntensity: 2.5,
  easingEffect: 2,
  particulesSize: 0.1,
  animateDuration: 1.5,
  xRotationSpeed: 0.1,
  yRotationSpeed: 0.12,
};

gui
  .addColor(parameters, "materialColor")
  .name("Material Color")
  .onChange(() => {
    material.color.set(parameters.materialColor);
    particlesMaterial.color.set(parameters.materialColor);
  });
gui
  .add(parameters, "lightIntensity")
  .min(0)
  .max(10)
  .step(0.01)
  .name("Light Intensity")
  .onChange(() => {
    directionalLight.intensity = parameters.lightIntensity;
  });

gui
  .add(parameters, "easingEffect")
  .min(1)
  .max(5)
  .step(0.05)
  .name("Easing Effect");

gui
  .add(parameters, "particulesSize")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Particles Size")
  .onChange(() => {
    particlesMaterial.size = parameters.particulesSize;
    particlesMaterial.needsUpdate = true;
  });

gui
  .add(parameters, "animateDuration")
  .min(0)
  .max(5)
  .step(0.05)
  .name("Animation Duration");

gui
  .add(parameters, "xRotationSpeed")
  .min(0)
  .max(1)
  .step(0.001)
  .name("X Rotation Speed");

gui
  .add(parameters, "yRotationSpeed")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Y Rotation Speed");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

// Meshes

const objectsDistance = 4;
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */
// Geometry
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 10;
  positions[i3 + 1] =
    objectsDistance * 0.4 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i3 + 2] = (Math.random() - 0.5) * 10;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// Material
console.log(particlesTexture);
const particlesMaterial = new THREE.PointsMaterial({
  alphaMap: particlesTexture,
  transparent: true,
  depthWrite: false,
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: parameters.particulesSize,
});

// Points
const particles = new THREE.Points(geometry, particlesMaterial);
scene.add(particles);

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight(
  0xffffff,
  parameters.lightIntensity
);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

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

// Camera Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);
  if (newSection !== currentSection) {
    currentSection = newSection;
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: parameters.animateDuration,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

/**
 * Cursor
 */

const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = clock.getElapsedTime();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Animate Camera
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * parameters.easingEffect * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * parameters.easingEffect * deltaTime;

  // Animate Meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * parameters.xRotationSpeed;
    mesh.rotation.y += deltaTime * parameters.yRotationSpeed;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
