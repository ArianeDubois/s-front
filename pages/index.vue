<script setup lang="ts">
const { $gsap } = useNuxtApp();
const img = useImage();

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

import { EffectCreative, Navigation, Pagination, Autoplay } from 'swiper/modules';

const swiperLeft = ref(null);
const swiperRight = ref(null);
const leftArrowSvg = ref(null);
const rightArrowSvg = ref(null);
const loading = ref(true);
const autoplayComplete = ref(false);

const imageLoadedCountLeft = ref(0);
const imageLoadedCountRight = ref(0);
const totalImages = ref(0);
const allImagesLoadedLeft = computed(
  () => imageLoadedCountLeft.value >= totalImages.value
);
const allImagesLoadedRight = computed(
  () => imageLoadedCountRight.value >= totalImages.value
);

const { data } = await useKql({
  query: 'page("home")',
  select: {
    id: true,
    title: true,
    intendedTemplate: true,
    headline: true,
    subheadline: true,
  },
});

const page = data.value?.result;
setPage(page);
const { data: carrouselData } = await useKql({
  query: 'page("home").files.sortBy("sort", "asc")',
  select: {
    filename: true,
    url: true,
    alt: true,
    width: true,
    height: true,
    project: true,
    client: true,
    photographer: true,
  },
});

const carrouselImages = carrouselData.value?.result || [];
totalImages.value = carrouselImages.length;

const setSecondSwiper = (right) => {
  swiperRight.value = right;
};

const setFirstSwiper = (left) => {
  swiperLeft.value = left;
};

const slidePrev = (swiper) => {
  swiper.slideNext();
  swiperRight.value.slideNext();
};

const slideNext = (swiper) => {
  swiper.slideNext();
  swiperLeft.value.slideNext();
};

const loadImageLeft = () => {
  imageLoadedCountLeft.value++;
};

const loadImageRight = () => {
  imageLoadedCountRight.value++;
};

// MOUSSE
const animateMouseFollow = () => {
  const images = Array.from(document.querySelectorAll('.loading-screen .loading-images img')).slice(0, 6);

  document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    images.forEach((image, index) => {
      const staggerDelay = index * 0.1;
      $gsap.to(image, {
        x: (mouseX - window.innerWidth / 2) * 0.5,
        y: mouseY / 2 + (index * 5),
        delay: staggerDelay,
        ease: 'power3.out',
      });
    });
  });
};

const animateLoadingImages = () => {
  const images = Array.from(document.querySelectorAll('.loading-screen .loading-images img')).slice(0, 6);

  $gsap.to(images, {
    scale: 1,
    stagger: 0.15,
    ease: 'power2.out',
    //OU AU CLIC
    onComplete: () => {
      setTimeout(() => {
        loading.value = false;
      }, 3000);

    }
  });
};

const colors = ["#FCDA52", "#8c03fc", "#FE6000", "#9F91C7", "#5EC76A", "#8ae6f2", "#ff0a64"];
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const applyRandomColorToHeader = () => {
  const header = document.querySelector('header');
  const about = document.querySelector('.about-overlay');
  const captions = document.querySelectorAll('.caption');
  const randomColor = getRandomColor();
  if (header) {
    header.style.color = randomColor;
    header.style.transition = "color 0.5s ease";
  }
  if (about) {
    about.style.color = randomColor;
    about.style.transition = "color 0.5s ease";
  }



  document.querySelector('.icon-piment').style.color = randomColor;
  document.querySelector('.icon-piment').style.transition = "color 0.5s ease";

  document.querySelectorAll('.swiper-pagination').forEach(el => {
    el.style.color = randomColor;
    el.style.transition = "color 0.5s ease";
  });
};
const onClick = () => {
  loading.value = false;
};
onMounted(() => {
  applyRandomColorToHeader();
  animateLoadingImages();
  animateMouseFollow();
});
</script>

<template>
  <div>
    <div v-if="loading" class="loading-screen" @click="onClick">
      <div class="loading-images">
        <figure v-for="(image, index) in carrouselImages" :key="index"
          :style="`pointer-events: none; aspect-ratio: ${image.width}/${image.height};`">
          <NuxtImg :preload="true" :src="image.url" :alt="image.alt || 'Image description'" width="100%" height="100%"
            quality="80" format="webp" sizes="300px" @load="loadImageRight" />
        </figure>

        <div class="icon-piment">
          <ElementIconPiment />
        </div>
      </div>
    </div>

    <div class="swipers">
      <div class="swiper-left">
        <Swiper :pagination="{ type: 'fraction' }" :initialSlide="1" :speed="400"
          :modules="[EffectCreative, Pagination, Autoplay]" effect="creative" :breakpoints="{
            '720': {
              creativeEffect: {
                limitProgress: 1,
                prev: { scale: 3 },
                next: { scale: 0 },
              },
            },

            '1024': {
              creativeEffect: {
                limitProgress: 1,
                prev: { scale: 2 },
                next: { scale: 0 },
              }
            }

          }" :creative-effect="{
            limitProgress: 1,
            prev: { scale: 4 },
            next: { scale: 0 },
          }" :loop="true" :space-between="0" :style="`cursor: url(${leftArrowSvg}), auto`" @click="slidePrev"
          @swiper="setFirstSwiper">
          <SwiperSlide v-for="(image, index) in carrouselImages" :key="index" :loadPrevNext="true"
            :loadPrevNextAmount="4">
            <figure :style="`aspect-ratio: ${image.width}/${image.height};`">
              <NuxtImg fit="cover" :preload="true" :src="image.url" :alt="image.alt || 'Image description'"
                :width="image.width" :height="image.height" quality="80" format="webp" sizes="100vw lg:50vw"
                @load="loadImageLeft" />
            </figure>

            <figcaption class="caption">
              <div v-if="image.project">Projet: {{ image.project }}</div>
              <div v-if="image.client">Client: {{ image.client }}</div>
              <div v-if="image.photographer">Crédit photo: {{ image.photographer }}</div>
            </figcaption>
          </SwiperSlide>
        </Swiper>
      </div>

      <div class="swiper-right">
        <Swiper :pagination="{ type: 'fraction' }" :speed="400" :modules="[EffectCreative, Pagination, Autoplay]"
          effect="creative" :breakpoints="{
            '720': {
              creativeEffect: {
                limitProgress: 1,
                prev: { scale: 3 },
                next: { scale: 0 },
              },
            },
            '1024': {
              creativeEffect: {
                limitProgress: 1,
                prev: { scale: 2 },
                next: { scale: 0 },
              }
            }

          }" :creative-effect="{
            limitProgress: 1,
            prev: { scale: 2 },
            next: { scale: 0 },
          }" :loop="true" :initialSlide="1" :space-between="0" :loadPrevNext="true" :loadPrevNextAmount="4"
          @swiper="setSecondSwiper" :style="`cursor: url(${rightArrowSvg}), auto;`" @click="slideNext">
          <SwiperSlide v-for="(image, index) in carrouselImages" :key="index">
            <figure>
              <div class="swiper-zoom-container" data-swiper-zoom="1"
                :style="`aspect-ratio: ${image.width}/${image.height};`">
                <NuxtImg fit="cover" :preload="true" :src="image.url" :alt="image.alt || 'Image description'"
                  :width="image.width" :height="image.height" quality="80" format="webp" sizes="150vw lg:75vw"
                  @load="loadImageRight" />
              </div>
            </figure>

            <figcaption class="caption">
              <div v-if="image.project">Projet: {{ image.project }}</div>
              <div v-if="image.client">Client: {{ image.client }}</div>
              <div v-if="image.photographer">Crédit photo: {{ image.photographer }}</div>
            </figcaption>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

    <div id="custom-cursor" class="custom-cursor">Next</div>
  </div>
</template>



<style scoped>
/* .swiper {
  cursor: none !important;
}
*/
.custom-cursor {
  mix-blend-mode: difference;
  position: absolute;
  pointer-events: none;
  font-family: 'Bebas';
  font-size: var(--font-base);
  text-transform: uppercase;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease;
  opacity: 0;
}

.loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255);
  z-index: 1000;
  font-family: "Bebas";
  font-size: var(--font-base);
  text-transform: uppercase;
  font-weight: bold;
}


@media screen and (max-width: 720px) {
  .loading-screen {
    font-size: var(--font-base-xs);
  }
}

.loading-screen .loading-images {
  position: relative;
  width: 200px;
  min-height: 300px;
  margin-bottom: 5px;
}

.icon-piment {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -10;
  mix-blend-mode: difference;
}

.loading-screen .loading-images figure {
  height: 100%;
  width: 100%;
  position: absolute;
  inset: 0;
  object-fit: cover;
  margin-bottom: 5px;
}

.loading-screen .loading-images img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transform: scale(0);
}

.loading-screen .loading-images figure:first img {
  transform: scale(1);
}

/* body.infos-is-active .swiper-slide-active figure:after {
  content: '';
  position: fixed;
  inset: 0;
  background-color: white;
  opacity: 0.8;
} */

/* body.infos-is-active .swiper-right .swiper-slide-active figure:after {
  transform: scale(2);
} */



.caption {
  opacity: 0;
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  margin-left: 10px;
  color: black;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-transform: uppercase;
}


body.infos-is-active .caption {
  opacity: 1;
}

.swiper-wrapper {
  align-items: center !important;
}

.swipers {
  position: fixed;
  display: flex;
  flex-direction: row-reverse;
  inset: 0;
}

.swiper-left,
.swiper-right {
  width: 50%;
  height: 100%;
  overflow: hidden;
}



@media screen and (max-width: 1024px) {
  .swiper-left {
    display: none;
  }

  .swiper-right {
    width: 100%;
  }
}


.swiper-left .swiper,
.swiper-right .swiper {
  height: 100%;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.swiper-slide figure {
  position: relative;
  width: 100%;
  height: 100%;
}


.swiper-right img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain !important;
  /* object-fit: cover; */
}

.swiper-left img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover !important;
}


.swiper-right .swiper-slide-active figure {
  transform: scale(0.5);
}

.swiper-right figure {
  transition: all 0.2s;
}

.swiper-left .swiper-slide-active figure {
  transform: scale(1);
}
</style>
