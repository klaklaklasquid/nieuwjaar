import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { Shape } from "three";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// tekst
const vbTekst = "hier wil ik een tekst";

const nogNietTijd =
  "Het is nog geen 24:00 in belgie,\nKom terug op het juiste tijdstip";

const deel1 = [
  "Hey Herman,",
  "Het jaar zit erop voor mij,\nen natuurlijk schrijven we dan\neen berichtje naar de mensen die\nwe liefhebben.",
  "Ik wil je bedanken voor\nde tijd en momenten die\nje met mij hebt gedeeld.",
  "Vanaf onze eerste ontmoeting\ntot nu heb ik genoten\nvan elk moment met jou.",
  "Jij bent een prachtmens.",
  "Jij betekent heel veel voor mij.",
  "Dus nogmaals dank je wel,\nlieve Herman.",
  "Nu ga ik door naar 2025,\nmet hoop en vreugde\nop een prachtig jaar\nen nog veel mooie momenten\nsamen met jou.",
];

const deel2 = [
  "Hey Herman, daar zijn we weer!",
  "Maar nu ben je ook aanwezig\nin het nieuwe jaar 2025.",
  "Ik houd het kort en bondig",
  "Ik ben blij dat je er bent.\nMogen we samen een prachtig\n2025 beleven.",
  "Dus nogmaals dank je wel,\nlieve Herman.",
  "Laten we een schitterend\n2025 vieren!",
];

/**
 * Fonts
 */
const fontLoader = new FontLoader();
let font;
let material;

/**
 * Create Heart Shape
 */
const createHeartShape = () => {
  const x = 0,
    y = 0;
  const heartShape = new Shape();
  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
  heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
  heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
  heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

  const geometry = new THREE.ShapeGeometry(heartShape);
  const heartMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const heartMesh = new THREE.Mesh(geometry, heartMaterial);
  heartMesh.position.set(0, 0, 0);
  heartMesh.rotation.z = Math.PI; // Rotate the heart to display it correctly
  heartMesh.scale.set(0.2, 0.2, 0.2); // Make the heart 5 times smaller
  return heartMesh;
};

/**
 * Display Text Animation
 */
const displayText = (textArray) => {
  let index = 0;
  let previousText = null;

  const displayNextText = () => {
    if (previousText) {
      scene.remove(previousText);
    }

    if (index < textArray.length) {
      const textGeometry = new TextGeometry(textArray[index], {
        font: font,
        size: 0.5,
        depth: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      textGeometry.center();

      const text = new THREE.Mesh(textGeometry, material);
      scene.add(text);
      previousText = text;

      index++;
      setTimeout(displayNextText, index === 1 ? 2000 : 5000); // Display the first index faster
    } else {
      const heartMesh = createHeartShape();
      scene.add(heartMesh);
    }
  };

  displayNextText();
};

/**
 * Check Time and Display Text
 */
const checkTimeAndDisplayText = () => {
  const now = new Date();
  const hours = now.getHours();
  //   const minutes = now.getMinutes();
  //   const hours = 23; // temporary variable for testing

  if (hours === 23) {
    displayText(deel1);
  } else if (hours === 24 || hours === 0) {
    displayText(deel2);
  } else {
    const textGeometry = new TextGeometry(nogNietTijd, {
      font: font,
      size: 0.5,
      depth: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);
  }
};

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (loadedFont) => {
  font = loadedFont;
  // Material
  material = new THREE.MeshNormalMaterial();

  // Check time and display text
  checkTimeAndDisplayText();
});

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
camera.position.z = 13;
camera.position.y = 2;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Camera animation
  const radius = 5;
  camera.position.x = radius * Math.cos(elapsedTime * 0.1) - 5;
  camera.position.y = radius * Math.sin(elapsedTime * 0.1) - 2;
  camera.lookAt(scene.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// check
