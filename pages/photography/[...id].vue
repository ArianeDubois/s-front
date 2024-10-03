<script setup lang="ts">
const { $gsap } = useNuxtApp();
const router = useRouter(); // Utilisation de useRouter pour la navigation

// Récupération des données du projet actuel
const { data } = await useKql({
  query: `page("${useRoute().path}")`,
  select: {
    id: true,
    title: true,
    client: true,
    credit: true,
    tags: true,
    color: true,
    year: true,
    intendedTemplate: true,
    subheadline: true,
    gallery: {
      query: 'page.images.sortBy("sort", "asc")',
      select: {
        resized: {
          query: 'file.resize(2000)',
          select: ['url', 'width', 'height', 'alt'],
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
        width: true,
        height: true,
        resized: {
          query: 'file.resize(2000)',
          select: ['url', 'width', 'height', 'alt'],
        },
        alt: true,
      },
    },
  },
});

const page = data.value?.result;
setPage(page);

// Récupération des enfants (projets) de la page "photography"
const { data: dataChildren } = await useKql({
  query: 'page("photography")',
  select: {
    id: true,
    title: true,
    tags: true,
    intendedTemplate: true,
    subheadline: true,
    children: {
      query: 'page.children.listed',
      select: {
        id: true,
        title: true,
        url: true,
        cover: {
          query: 'page.content.cover.toFile',
          select: {
            url: true,
            alt: true,
            height: true,
            width: true,
          },
        },
      },
    },
  },
});

const children = dataChildren.value?.result?.children || [];
const pageIndex = children.findIndex(({ id }) => id === page?.id);

const infos = ref(null);
const loaded = ref(false);
const lazyImage = ref(null);

const onLoad = () => {
  // loaded.value = true;
};

onBeforeRouteLeave((to, from, next) => {
  if (document.querySelector('.transition-clone')) {
    document.querySelectorAll('.transition-clone').forEach(el => el.remove());
  }
  next();
});

onBeforeRouteUpdate((to, from, next) => {
  if (document.querySelector('.transition-nav-clone')) {
    $gsap.to('.transition-clone', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => document.querySelectorAll('.transition-nav-clone').forEach(el => el.remove()),
    });
  }

  if (document.querySelector('.transition-clone')) {
    document.querySelectorAll('.transition-clone').forEach(el => el.remove());
  }
  next();
});

const imageLoad = () => {
  $gsap.to('header', {
    opacity: 1,
  });

  if (document.querySelector('.transition-clone')) {
    $gsap.to('.transition-clone', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => document.querySelectorAll('.transition-clone').forEach(el => el.remove()),
    });
  }

  if (document.querySelector('.transition-nav-clone')) {
    $gsap.to('.transition-clone', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => document.querySelectorAll('.transition-nav-clone').forEach(el => el.remove()),
    });
  }

  if (document.querySelector('.low-quality')) {
    $gsap.set('.low-quality', { objectFit: 'contain' });
  }
};

onMounted(() => {
  $gsap.to(infos.value, { opacity: 1, duration: 0.25 });
  if (page?.color) {
    $gsap.to('header', { color: page.color, duration: 0.5 });
  }

  nextTick(() => {
    lazyImage.value.forEach(img => {
      $gsap.to(img.$el.children[0], {
        opacity: 1,
        scrollTrigger: {
          trigger: img.$el,
          start: "top center",
          end: "+=100",
          scrub: true
        },
        ease: 'power2.out',
      });
    });
  })
});
</script>

<template>
  <article>
    <div class="grid">
      <ul class="album-gallery">
        <li v-for="(image, index) in page?.gallery ?? []" :key="index" :class="index === 0 ? 'cover' : 'images'">
          <figure v-if="index === 0" class="cover">
            <NuxtImg @load="imageLoad()" loading="eager" :src="image.url" :alt="image.alt" width="auto" height="auto"
              quality="80" format="webp" sizes="xs:1080px" />
          </figure>

          <figure class="lazy-wrapper" v-else
            :style="`height: 100vh; width: auto; position: relative; overflow: hidden; aspect-ratio: ${image.width} / ${image.height}; display: flex; justify-content: center; align-items: center; margin:auto`">
            <ElementLazyImage ref="lazyImage" :src="image.url" :lowQualitySrc="image.url" :alt="image.alt"
              :sizes="'xs:1200px'" />
          </figure>
        </li>
      </ul>
    </div>


    <div ref="infos" class="infos">
      <NuxtLink :style="`color: ${page.color}; pointer-events:${children[pageIndex - 1] ? 'auto' : 'none'}`"
        :to="'/' + (children[pageIndex - 1] ? children[pageIndex - 1].id : children[children.length - 1].id)"
        class="button-nav">PREV</NuxtLink>

      <ul class="content" :style="`color: ${page.color}`">
        <li class="icon">
          <ElementIconPiment />
        </li>
        <li class="value title">
          <div>{{ page.title }}</div>
          <div class="key">Titre <br />du projet</div>
        </li>

        <li v-if="page.credit" class="value">
          <div>{{ page.credit }}</div>
          <div class="key">Crédit<br /> photo</div>
        </li>

        <li v-if="page.year" c class="value">
          <div>{{ page.year }}</div>
          <div class="key">Année <br />de réalisation</div>
        </li>

        <li v-if="page.client" class="value">
          <div>{{ page.client }}</div>
          <div class="key">Client</div>
        </li>
      </ul>
      <NuxtLink :style="`color: ${page.color}; opacity:${children[pageIndex + 1] ? 1 : 0} `"
        :to="'/' + (children[pageIndex + 1] ? children[pageIndex + 1].id : '0')" class="button-nav">Next</NuxtLink>
    </div>
    <LazyAppNavProject />
  </article>
</template>

<style scoped>
.album-gallery {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.album-gallery li {
  width: 100%;
  max-height: 100vh;
  object-fit: contain;
  position: relative;

}

li.images {
  object-fit: contain;
}

/* .album-gallery li:not(.cover):nth-child(2) {
  width: 60%;
}


.album-gallery li:not(.cover):nth-child(3) {
  width: 20%;
}

.album-gallery li:not(.cover):nth-child(4) {
  width: 100%;
}

.album-gallery li:not(.cover):nth-child(5) {
  width: 20%;
}

.album-gallery li:not(.cover):nth-child(6) {
  width: 60%;
}

.album-gallery li:not(.cover):nth-child(7) {
  width: 20%;
}

.album-gallery li:not(.cover):nth-child(6) {
  width: 60%;
}

.album-gallery li:not(.cover):nth-child(9) {
  width: 33.33%;
}

.album-gallery li:not(.cover):nth-child(10) {
  width: 33.33%;
}


.album-gallery li:not(.cover):nth-child(11) {
  width: 33.33%;
}

.album-gallery li:not(.cover):nth-child(12) {
  width: 20%;
}

.album-gallery li:not(.cover):nth-child(13) {
  width: 20%;
}

.album-gallery li:not(.cover):nth-child(14) {
  width: 60%;
}

.album-gallery li.cover {
  width: 100%;
  margin: 0 100px;

} */

.infos {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: end;
  flex-wrap: wrap;
  gap: 0 30px;
  bottom: 0;
  left: 5px;
  right: 5px;
  opacity: 0;
  z-index: 30;
  /* transform: translateY(50%); */
  mix-blend-mode: difference;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  gap: 0 30px;
  z-index: 30;
  mix-blend-mode: difference;
}

.infos .icon {
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  transform: scale(0.9);
  /* color: #8c03fc; */

}

.infos .value,
.button-nav {
  /* color: #8c03fc; */

  font-family: "Maison Neue";
  font-size: 80px;
  line-height: 1;
  text-transform: uppercase;
  display: flex;
  align-items: flex-start;
  /* flex-direction: row-reverse; */
  gap: 5px;
}

.infos .value .key {
  margin-top: 10px;
  font-family: "Maison Neue";
  font-size: 0.9rem;
  line-height: 1.1;
  /* text-align: right; */
}

.infos .title {
  /* width: 100%; */
  /* justify-content: center;
  margin: auto; */
}

figure {
  height: 100vh;
  position: relative;
  width: auto;
  overflow: hidden;

}


img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.is-transitionning .images {
  display: none;
}
</style>
