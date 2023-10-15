type KeyboardEventKey = "space" | "enter" | "escape" | "backspace";

interface ScreenShotOptions {
  captureGenartContainer?: boolean;
  captureScreen?: boolean;
  triggerKey?: KeyboardEventKey;
}

export function setupScreenshot(options: ScreenShotOptions) {
  const {
    captureGenartContainer = false,
    captureScreen = false,
    triggerKey = "space"
  } = options;

  const key = triggerKey.toLowerCase();

  document.addEventListener("keydown", event => {
    let pressedKey = event.key.toLowerCase();

    if (pressedKey === " " || pressedKey === "spacebar") {
      pressedKey = "space";
    }

    if (pressedKey === key) {
      console.log("📸 Taking screenshot");
      if (captureScreen) takeFullScreenshot();
      if (captureGenartContainer) takeGenartScreenshot();
    }
  });
}

function takeGenartScreenshot() {
  const container = document.getElementById("genart-container");

  if (!container) throw new Error("No container");

  // Take the canvas within the container and convert it to a data URL
  const canvas = container.querySelector("canvas");
  if (!canvas) throw new Error("No canvas");

  const dataURL = canvas.toDataURL("image/png");

  // Create an anchor tag with the data URL as the href
  const link = document.createElement("a");
  link.href = dataURL;

  // Download the image
  link.download = "genart.png";
  link.click();
}

function takeFullScreenshot() {
  // Take a screenshot of the entire page with vanilla js
  // https://stackoverflow.com/a/45718176/114157

  const body = document.body;
  if (!body) throw new Error("No body");

  const html = document.documentElement;
  if (!html) throw new Error("No html");

  const width = Math.max(
    body.scrollWidth,
    body.offsetWidth,
    html.clientWidth,
    html.scrollWidth,
    html.offsetWidth
  );

  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("No context");

  const img = new Image();

  img.onload = () => {
    context.drawImage(img, 0, 0);
  };

  img.src = canvas.toDataURL("image/png");

  const dataURL = canvas.toDataURL("image/png");

  const link = document.createElement("a");

  link.href = dataURL;
  link.download = "screenshot.png";
  link.click();
}
