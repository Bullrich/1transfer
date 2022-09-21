import { defineConfig } from "vite";

export default defineConfig({
  server: {
    open: "/index.html",
  },
  build: {
    outDir: "../public",
    emptyOutDir: true
  },
  root: "src",
});
