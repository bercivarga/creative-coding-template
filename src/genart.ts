import P5 from "p5";

export function setupGenart() {
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
