<script setup lang="ts">
import '~/assets/css/main.css'

// Récupération des données SEO depuis Kirby
const { data: seoData } = await useKql({
  query: 'site',
  select: {
    meta_title: true,
    meta_description: true,
    meta_keywords: true,
    og_title: true,
    og_description: true,
    og_image: {
      query: 'site.content.og_image.toFile',
      select: {
        url: true,
      },
    },
    canonical_url: true,
  },
});

// const seo = computed(() => seoData.value?.result);
const seo = seoData.value?.result;
setPage(seo);
useSeoMeta({
  googleSiteVerification: 'hzP1KD6gnn_J6FiKczgwacVEuM8ANGkgNAZt0gAa7Wc',
  keywords: seo?.meta_keywords,
  title: seo?.meta_title,
  ogTitle: seo?.meta_title,
  description: `${seo?.meta_description}`,
  ogDescription: `${seo?.meta_description}`,
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <Html lang="en">

  <Head>
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  </Head>

  <Body>
    <AppHeader />
    <main class="main">
      <NuxtPage />
    </main>
  </Body>

  </Html>
</template>

<style>
/* Styles personnalisés */
</style>
