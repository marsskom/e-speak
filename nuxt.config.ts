// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-vuefire",
    "@tailvue/nuxt",
    "@nuxt/content",
  ],
  plugins: [{ src: "~/plugins/fontawesome.js", mode: "client" }],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from "pinia"
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from "pinia"
    ],
  },
  vuefire: {
    appCheck: {
      debug: process.env.NODE_ENV !== "production",
      isTokenAutoRefreshEnabled: true,
      provider: "ReCaptchaV3",
      key: process.env.GOOGLE_RECAPTCHA_KEY,
    },
    auth: {
      enabled: true,
      sessionCookie: true,
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MSS_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
  },
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
  runtimeConfig: {
    openAi: {
      secretKey: "",
    },
  },
  $development: {
    devtools: { enabled: true },
  },
});
