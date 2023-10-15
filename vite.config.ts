import path from "path";
import { defineConfig } from "vite";

const __dirname = path.resolve();

/** @type {import('vite').UserConfig} */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src")
    }
  }
});
