<script setup lang="ts">


const { data } = await useKql({
  query: 'page("home")',
  select: {
    id: true,
    title: true,
    intendedTemplate: true,
    // description: true,
    headline: true,
    subheadline: true,
  },
})

const page = data.value?.result
setPage(page)

const { data: photographyData } = await useKql({
  query: 'page("photography").children.listed',
  select: {
    id: true,
    title: true,
    cover: {
      query: 'page.content.cover.toFile',
      select: {
        resized: {
          query: 'file.resize(800, 800)',
          select: ['url'],
        },
        alt: true,
      },
    },
    image: {
      query: 'page.images.first',
      select: {
        resized: {
          query: 'file.resize(1024, 1024)',
          select: ['url'],
        },
        alt: true,
      },
    },
  },
})
</script>

<template>
  <div>
    <AppIntro />

    <ul class="home-grid">
      <li v-for="(album, index) in photographyData?.result ?? []" :key="index">
        <NuxtLink :to="`/${album.id}`">
          <figure>
            <NuxtImg loading="lazy" :src="album?.cover?.resized?.url ?? album?.images?.[0]?.resized?.url"
              :alt="album?.cover?.alt ?? album?.images?.[0]?.alt" width="auto" height="auto" quality="80" format="webp"
              sizes="xs:600px" />
            <figcaption>
              <span>
                <span class="example-name">{{ album.title }}</span>
              </span>
            </figcaption>
          </figure>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* .home-grid {
  display: grid;
  list-style: none;
  grid-gap: 1.5rem;
  line-height: 0;
  grid-template-columns: repeat(1, 1fr);
  grid-auto-flow: dense;
}

.home-grid li {
  position: relative;
  --cols: 1;
  --rows: 1;

  overflow: hidden;
  background: #000;
  line-height: 0;
}

.home-grid li:first-child {
  --cols: 2;
  --rows: 2;
}

.home-grid li:nth-child(5) {
  --cols: 2;
}

.home-grid li:nth-child(6) {
  --rows: 2;
}

.home-grid li:nth-child(7) {
  --cols: 2;
}

.home-grid a {
  display: block;
  height: 10rem;
}

.home-grid img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
}

.home-grid figcaption {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  color: #fff;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  line-height: 1;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
}

@media screen and (min-width: 45em) {
  .home-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .home-grid li {
    grid-column-start: span var(--cols);
    grid-row-start: span var(--rows);
  }

  .home-grid a {
    padding-bottom: 52.65%;
  }
} */
</style>
