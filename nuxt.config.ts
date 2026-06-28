export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseKey: '',
    },
  },
  imports: {
    dirs: [
      'composables/**',
    ],
  },
  vite: {
    optimizeDeps: {
      include: [
        'ws',
      ],
    },
  },
})