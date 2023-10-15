// import { setupP5 /* setupThree */ } from "@/setup/genart";
import { setupScroll } from "@/setup/scroll";
import { setupTransition } from "@/setup/transition";
import { setupScreenshot } from "@/setup/screenShot";
import "./style.css";

/*
  Setup
*/
setupScreenshot({
  captureGenartContainer: true, // for P5.js and Three.js
  captureScreen: false, // for the entire screen
  triggerKey: "space" // press space to take a screenshot
});
setupScroll();
setupTransition();
// setupP5();
// setupThree();
