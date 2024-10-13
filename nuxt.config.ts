import { siteQuery } from './queries'
import process from 'node:process'

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', 'nuxt-kql', '@nuxt/image'],
  // ssr: false,
  // target: 'server',

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
    formats: ['image/webp', 'image/jpeg'],
    lazy: true,
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
      routes: ['/', 'photography', 'photography/', '/sitemap.xml'],
    },
  },
  generate: {
    fallback: true,
  },
  head: {
    link: [
      {
        rel: 'preload',
        href: '/fonts/BebasNeue-Regular.woff2', // Le chemin vers ta police woff2
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/BebasNeue-Regular.woff', // Le chemin vers ta police woff
        as: 'font',
        type: 'font/woff',
        crossorigin: 'anonymous',
      },
    ],
  },
})
