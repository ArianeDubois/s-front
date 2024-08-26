<script setup lang="ts">
const { $gsap } = useNuxtApp()

const { data } = await useKql({
  query: `page("${useRoute().path}")`,
  select: {
    id: true,
    title: true,
    client: true,
    credit: true,
    tags: true,
    year: true,
    intendedTemplate: true,
    // description: true,
    subheadline: true,

    gallery: {
      query: 'page.images.sortBy("sort", "asc")',
      select: {
        resized: {
          query: 'file.resize(2000)',
          select: ['url'],
        },
        width: true,
        height: true,
        url: true,
        alt: true,
      },
    },
    cover: {
      query: 'page.content.cover.toFile',
      select: {
        resized: {
          query: 'file.resize(2000)',
          select: ['url'],
        },
        alt: true,
      },
    },
  },
})
//
const page = data.value?.result
setPage(page)
const infos = ref(null);

const imageLoad = () => {
  console.log('imageload')
  // if (document.querySelector('.transition-clone')) {
  //   document.querySelector('.transition-clone').remove();
  // }
  // document.querySelector('.transition-clone').remove()
}
onMounted(() => {
  $gsap.to('.infos', { opacity: 1, duration: 0.5 });
});
</script>

<template>


  <article>
    <div class="grid">
      <ul class="album-gallery">
        <li v-for="(image, index) in page?.gallery ?? []" :key="index">
          <figure>
            <NuxtImg @load="imageLoad()" :loading="index == 0 ? 'eager' : 'lazy'" :src="image.url" :alt="image.alt"
              width="auto" height="auto" quality="80" format="webp" sizes="xs:1080px" />
          </figure>
        </li>
      </ul>
    </div>

    <ul ref="infos" class="infos">
      <li class="icon"><svg width="106" height="57" viewBox="0 0 106 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.671 26.1176C18.1288 26.1176 17.9268 27.8148 18.0186 28.6633C18.5694 28.9462 19.8913 29.5119 20.7726 29.5119C21.8741 29.5119 22.9758 32.9063 24.6282 33.1891C25.9501 33.4154 27.933 34.0377 28.7592 34.3206C29.31 35.2635 30.7972 37.2624 32.3394 37.715C34.2673 38.2807 40.8769 39.4121 48.0373 41.3922C55.1978 43.3722 67.3154 39.9779 69.794 38.8464C72.2727 37.715 75.8529 34.8863 78.0561 34.3206C79.8187 33.868 80.0757 32.2463 79.9839 31.492C79.0659 29.2291 77.0647 24.477 76.4037 23.5718C75.5775 22.4404 72.5481 23.289 71.4465 23.5718C70.3448 23.8547 64.5614 27.8148 63.1844 28.6633C61.8074 29.5119 56.5748 28.6633 52.7192 28.6633C49.6347 28.6633 45.1915 29.7948 43.3555 30.3605C42.4375 30.3605 39.7202 30.1908 36.1951 29.5119C31.7886 28.6634 24.9036 24.7033 23.802 24.7033C22.7004 24.7033 21.5988 26.1176 19.671 26.1176Z"
            fill="#ADADAD" />
          <path
            d="M77 26.1429C78.2727 25.4354 80.8182 23.9143 80.8182 23.4898C80.8182 23.0653 78.6364 19.4218 77.5455 17.6531C77.3636 17.1224 77 16.0082 77 15.7959C77 15.5837 78.0909 15.1769 78.6364 15C80.0909 16.9456 83 21.102 83 22.1633C83 23.4898 82.7273 24.551 82.4545 24.8163C82.2364 25.0286 79.1818 27.1156 77.8182 28M18.0186 28.6633C17.9268 27.8148 18.1288 26.1176 19.671 26.1176C21.5988 26.1176 22.7004 24.7033 23.802 24.7033C24.9036 24.7033 31.7886 28.6634 36.1951 29.5119C39.7202 30.1908 42.4375 30.3605 43.3555 30.3605C45.1915 29.7948 49.6347 28.6633 52.7192 28.6633C56.5748 28.6633 61.8074 29.5119 63.1844 28.6633C64.5614 27.8148 70.3449 23.8547 71.4465 23.5718C72.5481 23.289 75.5775 22.4404 76.4037 23.5718C77.0647 24.477 79.0659 29.2291 79.9839 31.492C80.0757 32.2463 79.8187 33.868 78.0561 34.3206C75.8529 34.8863 72.2727 37.7149 69.794 38.8464C67.3154 39.9779 55.1978 43.3722 48.0373 41.3922C40.8769 39.4121 34.2672 38.2807 32.3394 37.715C30.7972 37.2624 29.31 35.2635 28.7592 34.3206C27.933 34.0377 25.9501 33.4154 24.6282 33.1891C22.9758 32.9063 21.8741 29.5119 20.7726 29.5119C19.8913 29.5119 18.5694 28.9462 18.0186 28.6633ZM105 28.5C105 43.6878 81.7188 56 53 56C24.2812 56 1 43.6878 1 28.5C1 13.3122 24.2812 1 53 1C81.7188 1 105 13.3122 105 28.5Z"
            stroke="#ADADAD" stroke-width="2" />
        </svg>
      </li>
      <li class="value title">
        <div>{{ page.title }}</div>
        <div class="key">Titre <br />du projet</div>
      </li>

      <li v-if="page.client" class="value">
        <div>{{ page.client }}</div>
        <div class="key">Client</div>
      </li>

      <li v-if="page.credit" class="value">
        <div>{{ page.credit }}</div>
        <div class="key">Crédit<br /> photo</div>
      </li>

      <li v-if="page.year" c class="value">
        <div>{{ page.year }}</div>
        <div class="key">Année <br />de réalisation</div>
      </li>
    </ul>
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

.infos {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0 30px;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
}

.infos .icon {
  margin-bottom: 30px;
}

.infos .value {
  font-family: "Maison Neue";
  font-size: 50px;
  text-transform: uppercase;
  display: flex;
  align-items: start;
  gap: 10px;
}

.infos .value .key {
  font-family: "Maison Neue";
  font-size: 1rem;
}

.infos .title {
  width: 100%;
  justify-content: center;
  margin: auto;
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
