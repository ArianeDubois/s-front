import { siteQuery } from './queries'

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', 'nuxt-kql', '@nuxt/image'],

  // buildModules: [
  //   '@nuxt/image',
  //   {
  //     provider: 'static',
  //   },
  // ],

  image: {
    domains: ['http://s-back.test'],

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

  runtimeConfig: {
    public: {
      siteUrl: 'http://s-back.test',
    },
  },

  kql: {
    auth: 'bearer',
    prefetch: {
      // Currently only used to infer the type of the `site` query
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
