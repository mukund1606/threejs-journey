import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

gui.add(ambientLight, "intensity").min(0).max(1).step(0.001).name("Ambient");

// Directional light
const directionalLight = new THREE.DirectionalLight(0xff00cc, 1);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Directional");
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001).name("X");
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001).name("Y");
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001).name("Z");

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
scene.add(hemisphereLight);

gui
  .add(hemisphereLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Hemisphere");

// Point light
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

gui.add(pointLight, "intensity").min(0).max(1).step(0.001).name("Point");
gui.add(pointLight.position, "x").min(-5).max(5).step(0.001).name("X");
gui.add(pointLight.position, "y").min(-5).max(5).step(0.001).name("Y");
gui.add(pointLight.position, "z").min(-5).max(5).step(0.001).name("Z");
gui.add(pointLight, "distance").min(0).max(10).step(0.001).name("Distance");
gui.add(pointLight, "decay").min(0).max(10).step(0.001).name("Decay");

// RectArea light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
scene.add(rectAreaLight);
rectAreaLight.lookAt(new THREE.Vector3());

gui.add(rectAreaLight, "intensity").min(0).max(10).step(0.001).name("RectArea");
gui.add(rectAreaLight.position, "x").min(-5).max(5).step(0.001).name("X");
gui.add(rectAreaLight.position, "y").min(-5).max(5).step(0.001).name("Y");
gui.add(rectAreaLight.position, "z").min(-5).max(5).step(0.001).name("Z");
gui.add(rectAreaLight, "width").min(0).max(10).step(0.001).name("Width");
gui.add(rectAreaLight, "height").min(0).max(10).step(0.001).name("Height");

// Spot light
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 6, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

scene.add(spotLight.target);
spotLight.target.position.x = -0.75;

gui.add(spotLight, "intensity").min(0).max(10).step(0.001).name("Spot");
gui.add(spotLight.position, "x").min(-5).max(5).step(0.001).name("X");
gui.add(spotLight.position, "y").min(-5).max(5).step(0.001).name("Y");
gui.add(spotLight.position, "z").min(-5).max(5).step(0.001).name("Z");
gui.add(spotLight, "distance").min(0).max(10).step(0.001).name("Distance");
gui
  .add(spotLight, "angle")
  .min(0)
  .max(Math.PI * 0.5)
  .step(0.001)
  .name("Angle");
gui.add(spotLight, "penumbra").min(0).max(1).step(0.001).name("Penumbra");
gui.add(spotLight, "decay").min(0).max(10).step(0.001).name("Decay");

/**
 * Helpers
 */

// Hemisphere light helper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);
gui.add(hemisphereLightHelper, "visible").name("Hemisphere Helper");

// Directional light helper
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);
gui.add(directionalLightHelper, "visible").name("Directional Helper");

// Point light helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);
gui.add(pointLightHelper, "visible").name("Point Helper");

// Spot light helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

window.requestAnimationFrame(() => {
  spotLightHelper.update();
});

gui
  .add(spotLightHelper, "visible")
  .name("Spot Helper")
  .onChange(() => {
    spotLightHelper.visible ? spotLightHelper.update() : null;
  });

// RectArea light helper
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);
gui.add(rectAreaLightHelper, "visible").name("RectArea Helper");

// Grid helper
const gridHelper = new THREE.GridHelper(5, 50);
gridHelper.visible = false;
scene.add(gridHelper);
gui.add(gridHelper, "visible").name("Grid Helper");

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
