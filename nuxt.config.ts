// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from "pinia"
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from "pinia"
    ],
  },
  runtimeConfig: {
    secretToken: "",
  },
  $development: {
    devtools: { enabled: true },
  },
});
