import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { alias } from "./helpers/alias";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      reportsDirectory: "./tests/runtime/coverage",
    },
  },
  root: ".",
  esbuild: {
    tsconfigRaw: "{}",
  },
  resolve: {
    alias,
  },
});
