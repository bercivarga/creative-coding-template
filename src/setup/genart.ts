import P5 from "p5";
import * as THREE from "three";

// 2D/3D generative art setup with P5.js
export function setupP5() {
  const container = document.getElementById("genart-container");

  const sketch = (p: P5) => {
    p.setup = () => {
      if (!container) throw new Error("No container");

      const containerDimensions = container.getBoundingClientRect();
      const { width, height } = containerDimensions;

      const canvas = p.createCanvas(width, height);
      canvas.parent(container);
    };

    p.draw = () => {
      p.background(220);

      p.fill(255, 0, 0);
      p.rect(100, 100, 100, 100);

      p.fill(0, 255, 0);
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
    antialias: true
    // alpha: true
  });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
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
