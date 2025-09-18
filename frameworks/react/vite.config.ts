import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "arweave-renderer-react",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "@tanstack/react-query"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@tanstack/react-query": "ReactQuery",
        },
      },
    },
  },
});
