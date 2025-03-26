// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  site: {
    indexable: process.env.NODE_ENV === "production",
    url: process.env.SITE_URL,
    name: "ADA Voice Assistant",
  },
  typescript: {
    typeCheck: true,
    shim: false,
    strict: true,
    tsConfig: {
      compilerOptions: {
        baseUrl: "./",
      },
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/global/index" as *;',
        },
      },
    },
  },
  nitro: {
    compressPublicAssets: {
      brotli: true,
    },
    preset: "bun",
  },
  alias: {
    "@components": "~/components/",
    "@assets": "~/assets/",
    "@stores": "~/stores/",
  },
  imports: {
    dirs: ["stores"],
  },
  css: ["~/assets/styles/base/index.scss"],
  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL,
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
  modules: [
    "@nuxtjs/google-fonts",
    "@nuxt/fonts",
    "@nuxtjs/fontaine",
    "@nuxtjs/color-mode",
    "@nuxt/icon",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@nuxtjs/seo",
    "nuxt-security",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/eslint",
    "@nuxt/test-utils",
  ],
  googleFonts: {
    families: {
      Roboto: "400..700",
    },
    preload: true,
  },
  fonts: {
    families: [
      {
        name: "Arlon-Bold",
      },
    ],
    provider: "local",
  },
  fontMetrics: {
    fonts: ["Roboto", { family: "Roboto" }],
  },
  colorMode: {
    classSuffix: "-theme",
  },
  image: {
    domains: [new URL(process.env.API_BASE_URL!).hostname],
  },
  security: {
    headers: {
      crossOriginEmbedderPolicy: "unsafe-none",
      contentSecurityPolicy: {
        "img-src": ["'self'", "data:", "blob:", process.env.API_BASE_URL!],
      },
      permissionsPolicy: {
        fullscreen: ["self"],
      },
    },
    enabled: process.env.NODE_ENV === "production",
  },
  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    strategy: "no_prefix",
    lazy: true,
    langDir: "locales",
    defaultLocale: "pl-PL",
    locales: [
      {
        code: "pl-PL",
        file: "pl-PL.json",
        language: "pl-PL",
        name: "Polski",
      },
      {
        code: "en-US",
        file: "en-US.json",
        language: "en-US",
        name: "English",
      },
    ],
    baseUrl: process.env.SITE_URL,
  },
});
