import { siteQuery } from './queries'
import process from 'node:process'

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', 'nuxt-kql', '@nuxt/image'],
  buildModules: ['@nuxt/image'],

  // ssr: true,
  // target: 'server',
  site: {
    url: 'simonguitet.com',
    name: 'Awesome Site',
    description: 'Welcome to my awesome site!',
    defaultLocale: 'en', // not needed if you have @nuxtjs/i18n installed
  },
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
    // provider: 'ipx',
    // ipx: {
    //   fetchOptions: {
    //     timeout: 1500, // Augmente le délai à 15 secondes
    //   },
    // },
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
  // sitemap: {
  //   hostname: 'https://simonguittet.com',
  //   routes: async () => {
  //     const { $kql } = useNuxtApp()
  //     const response = await $kql({
  //       query: 'site.index',
  //       select: {
  //         slug: true,
  //       },
  //     })

  //     // Map the response to create the routes for the sitemap
  //     return response.result.map((page) => `/${page.slug}`)
  //   },
  // },

  nitro: {
    prerender: {
      routes: ['/', '/photography'],
    },
    output: {
      publicDir: 'dist', // Forcer la génération dans le dossier dist
    },
  },

  routeRules: {
    '/**': { prerender: true },
    '/photography/cotes-de-porc': { prerender: false },
    '/photography/varda': { prerender: false },
    '/photography/planche-sucree': { prerender: false },
  },

  generate: {
    fallback: true,
  },
  //PRELOADS
  // hooks: {
  //   'render:route': async (url, result, context) => {
  //     if (url === '/') {
  //       const { $kql } = context.nuxtApp
  //       const carrouselData = await $kql({
  //         query: 'page("home").files.sortBy("sort", "asc")',
  //         select: {
  //           url: true,
  //           alt: true,
  //         },
  //       })

  //       // Boucle sur les images récupérées et ajoute-les dans le head
  //       const images = carrouselData.result || []
  //       const preloadLinks = images.map((image) => ({
  //         rel: 'preload',
  //         href: image.url,
  //         as: 'image',
  //       }))

  //       // Injecter dynamiquement les liens dans le head
  //       result.meta.push({
  //         link: preloadLinks,
  //       })
  //     }
  //     if (url === '/photography') {
  //       const { $kql } = context.nuxtApp

  //       // Récupération des images de couverture via la requête KQL
  //       const { result: pageData } = await $kql({
  //         query: 'page("photography").children.listed',
  //         select: {
  //           cover: {
  //             query: 'page.content.cover.toFile',
  //             select: {
  //               url: true,
  //               alt: true,
  //             },
  //           },
  //         },
  //       })

  //       // Récupérer toutes les images de couverture
  //       const covers = pageData
  //         .map((project) => project.cover)
  //         .filter((cover) => cover?.url)

  //       // Créer les balises de préchargement pour les images
  //       const preloadLinks = covers.map((cover) => ({
  //         rel: 'preload',
  //         href: cover.url,
  //         as: 'image',
  //       }))

  //       // Injecter les balises de préchargement dans le head
  //       result.meta.push({
  //         link: preloadLinks,
  //       })
  //     }
  //   },
  // },

  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-0THPN5WRZC',
      },
      googleTagManager: {
        id: 'GTM-5DLGB6XV',
      },
    },
  },

  head: {
    script: [
      {
        hid: 'gtm',
        innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5DLGB6XV');`,
        type: 'text/javascript',
        charset: 'utf-8',
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      gtm: ['innerHTML'],
    },
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
