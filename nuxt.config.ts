import { siteQuery } from './queries'
import process from 'node:process'

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', 'nuxt-kql', '@nuxt/image'],
  ssr: true,
  target: 'server',

  image: {
    // domains: ['http://s-back.test'],
    domains: ['preprod.arianedubois.fr'],

    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
    },
  },
  // plugins: ['~/plugins/gsap.js'],
  gsap: {
    extraPlugins: {
      scrollTrigger: true,
      scrollTo: true,
    },
  },

  runtimeConfig: {
    public: {
      siteUrl:
        process.env.KIRBY_BASE_URL ||
        'http://preprod.arianedubois.fr/s-back/public',
    },
  },

  kql: {
    auth: 'bearer',
    baseURL:
      process.env.KIRBY_BASE_URL ||
      'http://preprod.arianedubois.fr/s-back/public',
    prefetch: {
      kirbySite: siteQuery,
    },
  },

  nitro: {
    prerender: {
      // Prerender the index page
      routes: ['/'],
    },
  },
})
