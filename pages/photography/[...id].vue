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

onBeforeRouteLeave((to, from, next) => {
  if (document.querySelector('.transition-clone')) {
    document.querySelectorAll('.transition-clone').forEach(el => {
      el.remove();
    })
    next();
  }
})

const imageLoad = () => {
  $gsap.to('header', {
    opacity: 1,
  });
  if (document.querySelector('.transition-clone')) {
    $gsap.to('.transition-clone', {
      opacity: 0, duration: 0.5,
      onComplete: document.querySelectorAll('.transition-clone').forEach(el => {
        el.remove();
      }),
    });
  }
  if (document.querySelector('.low-quality')) {
    $gsap.set('.low-quality', { opacity: 0 });
  }
}
onMounted(() => {
  window.scrollTo(0, 0);
  $gsap.to('.infos', { opacity: 1, duration: 0.5 });

});
</script>,
<template>


  <article>
    <div class="grid">
      <ul class="album-gallery">
        <li v-for="(image, index) in page?.gallery ?? []" :key="index">
          <figure>
            <NuxtImg v-if="index === 0" @load="imageLoad()" loading="eager" :src="image.url" :alt="image.alt"
              width="auto" height="auto" quality="80" format="webp" sizes="xs:1080px" />
            <NuxtImg v-else loading="lazy" :src="image.url" :alt="image.alt" width="auto" height="auto" quality="80"
              format="webp" sizes="xs:1080px" />
          </figure>
        </li>
      </ul>
    </div>

    <ul ref="infos" class="infos">
      <li class="icon">
        <ElementIconPiment />
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
  z-index: 30;
  mix-blend-mode: difference
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
  gap: 5px;
}

.infos .value .key {
  margin-top: 12px;
  font-family: "Maison Neue";
  font-size: 0.9rem;
  line-height: 1.3;
}

.infos .title {
  width: 100%;
  justify-content: center;
  margin: auto;
}

figure {
  height: 100vh;
  position: relative;
  width: auto;
}

img {
  height: 100%;
  width: 100%;
  object-fit: contain;

}
</style>
