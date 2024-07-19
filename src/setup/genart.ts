import P5 from "p5";
import * as THREE from "three";
// @ts-ignore
import vertex from "@/shaders/vertex.glsl";
// @ts-ignore
import fragment from "@/shaders/fragment.glsl";
import palettes from "nice-color-palettes";

// 2D/3D generative art setup with P5.js
export function setupP5() {
  const container = document.getElementById("genart-container");

  const palette = palettes[Math.floor(Math.random() * palettes.length)];

  const colors = {
    bg: palette[0],
    rect1: palette[1],
    rect2: palette[2]
  };

  const sketch = (p: P5) => {
    p.setup = () => {
      if (!container) throw new Error("No container");

      const containerDimensions = container.getBoundingClientRect();
      const { width, height } = containerDimensions;

      const canvas = p.createCanvas(width, height);
      canvas.parent(container);
    };

    p.draw = () => {
      p.background(colors.bg);

      p.fill(colors.rect1);
      p.rect(100, 100, 100, 100);

      p.fill(colors.rect2);
      p.rect(200, 100, 100, 100);
    };
  };

  new P5(sketch);
}

// -------------------------------------------------------------------------------

// 2D/3D generative art setup with Three.js

export function setupThree() {
  const container = document.getElementById("genart-container");

  if (!container) throw new Error("No container");

  const containerDimensions = container.getBoundingClientRect();
  const { width, height } = containerDimensions;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
    // alpha: true
  });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  camera.position.z = 5;

  const animate = () => {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  animate();
}
