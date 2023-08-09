import { resolve } from "path";
import { defineConfig } from "vite";
export default defineConfig({
  root: "src/",
  publicDir: "../static/",
  base: "./",
  server: {
    host: true,
  },
  build: {
    outDir: "../dist",
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        "03-basic-scene": resolve(__dirname, "src/03-basic-scene/index.html"),
        "04-local-server": resolve(
          __dirname,
          "src/04-local-server/src/index.html"
        ),
        "05-transform-objects": resolve(
          __dirname,
          "src/05-transform-objects/src/index.html"
        ),
        "06-animations": resolve(__dirname, "src/06-animations/src/index.html"),
        "07-cameras": resolve(__dirname, "src/07-cameras/src/index.html"),
        "08-fullscreen-and-resizing": resolve(
          __dirname,
          "src/08-fullscreen-and-resizing/src/index.html"
        ),
        "09-geometries": resolve(__dirname, "src/09-geometries/src/index.html"),
        "10-debug-ui": resolve(__dirname, "src/10-debug-ui/src/index.html"),
        "11-textures": resolve(__dirname, "src/11-textures/src/index.html"),
        "12-materials": resolve(__dirname, "src/12-materials/src/index.html"),
        "13-3d-text": resolve(__dirname, "src/13-3d-text/src/index.html"),
        "14-go-live": resolve(__dirname, "src/14-go-live/src/index.html"),
        "15-lights": resolve(__dirname, "src/15-lights/src/index.html"),
        "16-shadows": resolve(__dirname, "src/16-shadows/src/index.html"),
        "17-haunted-house": resolve(
          __dirname,
          "src/17-haunted-house/src/index.html"
        ),
        "18-particles": resolve(__dirname, "src/18-particles/src/index.html"),
        "19-galaxy-generator": resolve(
          __dirname,
          "src/19-galaxy-generator/src/index.html"
        ),
        "20-scroll-based-animation": resolve(
          __dirname,
          "src/20-scroll-based-animation/src/index.html"
        ),
        "21-physics": resolve(__dirname, "src/21-physics/src/index.html"),
      },
    },
  },
});
