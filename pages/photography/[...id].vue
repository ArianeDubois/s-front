<script setup lang="ts">
const { $gsap } = useNuxtApp();
const router = useRouter();

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
const content = ref(null)

const onLoad = () => {
  loaded.value = true;
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
  loaded.value = true;
  document.body.style.overflow = 'auto'

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
      onComplete: () => document.querySelectorAll('.transition-nav-clone').forEach(el => el.remove()
        // document.querySelector('.albumg-gallery').style.position = "static";
      ),
    });
  }

  if (document.querySelector('.low-quality')) {
    $gsap.set('.low-quality', { objectFit: 'contain' });
  }
};

onMounted(() => {
  if (!loaded.value) {
    document.body.style.overflow = 'hidden'
  }
  $gsap.to(infos.value, { opacity: 1, duration: 0.25 });
  if (page?.color) {
    if (document.querySelector('.about-content')) {
      $gsap.set('.about-content .col', { color: page.color });
    }
    $gsap.set('header', { color: page.color });
    $gsap.set('body', { color: page.color });
  }

  $gsap.to(content.value.children, {
    opacity: 1,
    stagger: 0.1
  })
  nextTick(() => {
    if (lazyImage.value) {
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
    }
  })
});
</script>

<template>
  <article>
    <div class="grid">
      <ul class="album-gallery">
        <li v-for="(image, index) in page?.gallery ?? []" :key="index" :class="index === 0 ? 'cover' : 'images'">
          <figure v-if="index === 0" class="cover">
            <NuxtImg @load="imageLoad()" loading="eager" :preload="true" :src="image.url" :alt="image.alt"
              :width="image.width" :height="image.height" quality="80" format="webp"
              :sizes="'70vw sm:70vw md:70vw lg:50vw xl:50vw'" />
          </figure>

          <figure class="lazy-wrapper" v-else
            :style="`width: auto; position: relative; overflow: hidden; aspect-ratio: ${image.width} / ${image.height}; display: flex; justify-content: center; align-items: center; margin:auto`">
            <ElementLazyImage ref="lazyImage" :is-loading="true" :src="image.url" :lowQualitySrc="image.url"
              :alt="image.alt" :sizes="'100vw sm:100vw md:100vw lg:70vw xl:70vw'" />
          </figure>
        </li>
      </ul>
    </div>


    <div ref="infos" class="infos">
      <NuxtLink :style="`color: ${page.color}; pointer-events:${children[pageIndex - 1] ? 'auto' : 'none'}`"
        :to="'/' + (children[pageIndex - 1] ? children[pageIndex - 1].id : children[children.length - 1].id)"
        class="button-nav">PREV</NuxtLink>

      <ul class="content" :style="`color: ${page.color}`" ref="content">
        <li class="icon">
          <ElementIconPiment />
        </li>
        <li class="value title">
          <div>{{ page.title }} </div>
          <div class="key">Titre <br />du projet </div>
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
html {
  scrollbar-width: none;
}

body::-webkit-scrollbar {
  display: none;
}

.album-gallery {
  margin: 0 100px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

@media screen and (max-width: 720px) {
  .album-gallery {
    margin: 0 10px;

  }
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

@media screen and (max-width: 720px) {
  .infos {
    width: auto;
  }

  .content {
    order: 1;
    width: 100%;
    flex-basis: 100%;
  }

  .button-nav:nth-child(1) {
    order: 2;
    flex: 1;
  }

  .button-nav:last-child {
    order: 3;
    flex: 1;
    display: flex;
    justify-content: flex-end
  }
}

.infos .icon {
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  transform: scale(0.9);
}

.infos .value,
.button-nav {
  /* color: #8c03fc; */
  font-family: "Bebas";
  font-size: var(--font-big);
  line-height: 0.85;
  text-transform: uppercase;
  display: flex;
  align-items: flex-start;
  gap: 5px;
}

@media screen and (max-width: 1280px) {
  .infos .icon {
    transform: scale(0.7) translateY(10px);
  }

  .infos .value,
  .button-nav {
    font-size: var(--font-big-lg);
  }
}


@media screen and (max-width: 720px) {
  .album-gallery {
    margin-top: 30px;
    gap: 10px;

  }

  .cover {
    margin-bottom: -3px;
  }

  .infos {
    gap: 10px;
  }

  .infos .icon {
    transform: scale(0.6) translateY(30px);
  }

  .infos .value,
  .button-nav {
    font-size: var(--font-big-xs);
  }

  .infos .value,
  .infos .value .key {
    text-align: center;
  }

  .infos .value {
    flex-direction: column-reverse;
    align-items: center;
  }

  .infos .value.title {
    width: 100%;

  }

  .content {
    gap: 10px 30px;
    align-items: end;
  }
}

.infos .value .key {
  font-family: "Bebas";
  font-size: 0.25em;
  line-height: 1;

}

.content li {
  opacity: 0;
}

figure {
  max-height: 100vh;
  position: relative;
  overflow: hidden;
}

.cover {
  width: 100%;
}

@media screen and (min-width: 720px) {
  .cover {
    height: 100vh;
  }
}

li:first-child:last-child .cover {
  /* height: calc(100vh - 30px); */
  height: 100%;
  position: fixed;
  inset: 0;
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
