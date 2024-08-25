<script setup lang="ts">
// const { $gsap } = useNuxtApp()

const { data } = await useKql({
  query: `page("${useRoute().path}")`,
  select: {
    id: true,
    title: true,
    intendedTemplate: true,
    // description: true,
    subheadline: true,
    gallery: {
      query: 'page.images.sortBy("sort", "filename")',
      select: {
        resized: {
          query: 'file.resize(800)',
          select: ['url'],
        },
        width: true,
        height: true,
        url: true,
        alt: true,
      },
    },
  },
})

// Set the current page data for the global page context
const page = data.value?.result
setPage(page)
</script>

<template>
  <article>
    <div class="grid">
      <ul class="album-gallery">
        <li v-for="(image, index) in page?.gallery ?? []" :key="index">
          <figure>
            <img :src="image.url" :alt="image.alt" />
          </figure>
        </li>
      </ul>
    </div>
    <LazyAppNavProject />
  </article>
</template>

<style scoped>
.album-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 100px;
  gap: 30px;
}

figure {
  height: 100vh;
  width: auto;
}

img {
  height: 100%;
  width: 100%;
  object-fit: contain;

}
</style>
