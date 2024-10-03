import { siteQuery } from './queries'
import process from 'node:process'

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', 'nuxt-kql', '@nuxt/image'],
  // ssr: true, // Activer SSR
  // target: 'server', // Utiliser un serveur pour le rendu
  // buildModules: [
  //   '@nuxt/image',
  //   {
  //     provider: 'static',
  //   },
  // ],

  // app: {
  //   pageTransition: { name: 'zoom' },
  // },

  image: {
    // domains: ['http://s-back.test'],
    domains: ['http://preprod.arianedubois.fr/s-back'],

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
      siteUrl: process.env.KIRBY_BASE_URL,
    },
  },

  kql: {
    auth: 'bearer',
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
