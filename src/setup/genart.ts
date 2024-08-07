import P5 from "p5";
import * as THREE from "three";
// @ts-ignore
// import vertex from "@/shaders/vertex.glsl";
// @ts-ignore
// import fragment from "@/shaders/fragment.glsl";
// import palettes from "nice-color-palettes";

// function pickRandom(arr: any[]) {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

// 2D/3D generative art setup with P5.js
export function setupP5() {
  const container = document.getElementById("genart-container");

  const TRANSPARENT = true;

  const sketch = (p: P5) => {
    const shapes: {
      x: number;
      y: number;
      size: number;
    }[] = [];

    const padding = 10;
    const minSize = 60;
    const maxSize = 120;
    let width: number;
    let height: number;
    let noiseOffset: number;

    function createShape(x: number, y: number): { x: number; y: number; size: number } | null {
      let size = p.random(minSize, maxSize);
      let attempts = 0;
      const maxAttempts = 50;

      while (attempts < maxAttempts) {
        let overlapping = false;
        for (const shape of shapes) {
          if (checkOverlap(x, y, size, shape.x, shape.y, shape.size)) {
            overlapping = true;
            break;
          }
        }

        if (!overlapping) {
          return { x, y, size };
        }

        size--;
        if (size < minSize) break;
        attempts++;
      }

      return null;
    }

    function checkOverlap(x1: number, y1: number, size1: number, x2: number, y2: number, size2: number): boolean {
      for (let dx = -width; dx <= width; dx += width) {
        for (let dy = -height; dy <= height; dy += height) {
          const d = p.dist(x1, y1, x2 + dx, y2 + dy);
          if (d < (size1 / 2 + size2 / 2 + padding)) {
            return true;
          }
        }
      }
      return false;
    }

    function drawFluidShape(x: number, y: number, size: number, offset: number) {
      p.push();
      p.translate(x, y);

      p.fill(0);
      p.beginShape();
      for (let a = 0; a < p.TWO_PI; a += 0.1) {
        const xoff = p.map(p.cos(a), -1, 1, 0, 1) + offset;
        const yoff = p.map(p.sin(a), -1, 1, 0, 1) + offset;
        const r = size / 2 * p.map(p.noise(xoff, yoff), 0, 1, 0.5, 1.5);
        const x = r * p.cos(a);
        const y = r * p.sin(a);
        p.curveVertex(x, y);
      }
      p.endShape(p.CLOSE);

      p.pop();
    }

    p.setup = () => {
      if (!container) throw new Error("No container");

      const containerDimensions = container.getBoundingClientRect();
      width = containerDimensions.width;
      height = containerDimensions.height;

      const canvas = p.createCanvas(width, height);
      canvas.parent(container);

      if (TRANSPARENT) {
        p.background(0, 0, 0, 0);
      } else {
        p.background(255); // White background
      }

      noiseOffset = p.random(1000);

      // Create shapes
      for (let i = 0; i < 500; i++) {
        const x = p.random(width);
        const y = p.random(height);
        const newShape = createShape(x, y);
        if (newShape) {
          shapes.push(newShape);
        }
      }

      p.noLoop();
      p.noStroke();

      // Draw shapes
      shapes.forEach(shape => {
        drawRepeatingShape(shape);
      });
    };

    function drawRepeatingShape(shape: { x: number; y: number; size: number }) {
      for (let dx = -width; dx <= width; dx += width) {
        for (let dy = -height; dy <= height; dy += height) {
          drawFluidShape(shape.x + dx, shape.y + dy, shape.size, noiseOffset);
        }
      }
    }
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
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
  });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const fragmentShader = `
   uniform vec2 uResolution;
uniform float uTime;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    
    // Create spiral effect
    float spiral = sin(20.0 * (angle - 0.5 * radius + 0.2 * uTime));
    
    // Add some variation
    float variation = sin(10.0 * radius - 5.0 * angle + 0.3 * uTime);
    
    // Combine effects
    float pattern = spiral * variation;
    
    // Generate color
    vec3 color = hsv2rgb(vec3(
        0.7 * pattern + 0.5 * radius + 0.2 * uTime,
        0.8,
        0.8 + 0.2 * sin(pattern * 3.14159)
    ));
    
    // Add some darker areas
    color *= 0.8 + 0.2 * sin(pattern * 5.0);
    
    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
  `;

  const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

  const uniforms = {
    uResolution: { value: new THREE.Vector2(width, height) },
    uTime: { value: 0.0 }
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms
  });

  // Create a plane that covers the entire view
  const geometry = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(geometry, material);
  scene.add(quad);

  function animate() {
    requestAnimationFrame(animate);
    uniforms.uTime.value += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  // Handle window resize
  window.addEventListener("resize", () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
    renderer.render(scene, camera);
  });
}
