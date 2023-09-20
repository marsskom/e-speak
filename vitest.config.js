import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { alias } from "./helpers/alias";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ["./components"],
    }),
    AutoImport({
      imports: ["vue", "vitest", "pinia"],
      dirs: ["./composables", "./stores", "./utils"],
      dts: true,
    }),
  ],
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
