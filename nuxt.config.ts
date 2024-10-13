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
      routes: ['/', 'photography', 'photography/**'],
    },
  },
  generate: {
    fallback: true,
  },
  hooks: {
    'render:route': async (url, result, context) => {
      if (url === '/') {
        const { $kql } = context.nuxtApp
        const carrouselData = await $kql({
          query: 'page("home").files.sortBy("sort", "asc")',
          select: {
            url: true,
            alt: true,
          },
        })

        // Boucle sur les images récupérées et ajoute-les dans le `head`
        const images = carrouselData.result || []
        const preloadLinks = images.map((image) => ({
          rel: 'preload',
          href: image.url,
          as: 'image',
        }))

        // Injecter dynamiquement les liens dans le head
        result.meta.push({
          link: preloadLinks,
        })
      }
    },
  },

  //preload dans le head les images du caroussel
  head: {
    link: [
      {
        rel: 'preload',
        href: '/fonts/BebasNeue-Regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/BebasNeue-Regular.woff',
        as: 'font',
        type: 'font/woff',
        crossorigin: 'anonymous',
      },
    ],
  },
})
