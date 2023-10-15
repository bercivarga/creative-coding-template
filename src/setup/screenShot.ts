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

async function takeFullScreenshot() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const video = document.createElement("video");

  if (!context) throw new Error("No context");

  try {
    const captureStream = await navigator.mediaDevices.getDisplayMedia();
    video.srcObject = captureStream;
    context.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
    const frame = canvas.toDataURL("image/png");
    captureStream.getTracks().forEach(track => track.stop());

    const link = document.createElement("a");
    link.href = frame;
    link.download = "screenshot.png";
    link.click();

    video.remove();

    console.log("📸 Took screenshot");
  } catch (err) {
    console.error("Error: " + err);
  }
}
