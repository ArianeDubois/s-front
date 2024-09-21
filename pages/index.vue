<script setup lang="ts">
const { $gsap } = useNuxtApp();

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

import { EffectCreative, Navigation, Pagination } from 'swiper/modules';

const swiperLeft = ref(null);
const swiperRight = ref(null);
const leftArrowSvg = ref(null);
const rightArrowSvg = ref(null);

// Variables for managing loading
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

const { data: carrouselData, error: carrouselError } = await useKql({
  query: 'page("home").files',
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
  console.log(
    `Image loaded: ${imageLoadedCountLeft.value}/${totalImages.value}`
  );
};

const loadImageRight = () => {
  imageLoadedCountRight.value++;
  console.log(
    `Image loaded: ${imageLoadedCountRight.value}/${totalImages.value}`
  );
};

// Function to preload an image
const preloadImage = (slide) => {
  const img = slide.querySelector('img');
  if (img && !img.complete) {
    const src = img.getAttribute('src');
    const newImg = new Image();
    newImg.src = src;
    newImg.onload = () => {
      console.log(`Image preloaded: ${src}`);
    };
  }
};

// Function called before the transition starts
const beforeTransition = (swiper) => {
  const nextIndex = swiper.activeIndex;
  const nextSlide = swiper.slides[nextIndex];

  // Preload the next image
  preloadImage(nextSlide);

  // Set initial GSAP state for the next image
  const img = nextSlide.querySelector('img');
  if (img) {
    $gsap.set(img, { scale: 0, opacity: 0 });
  }
};

// Function called after the transition ends
const slideChangeTransitionEnd = (swiper) => {
  const activeSlide = swiper.slides[swiper.activeIndex];

  // Animate the image in the active slide
  const img = activeSlide.querySelector('img');
  if (img) {
    $gsap.to(img, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
    });
  }
};

onMounted(() => {
  document.querySelectorAll('.swiper-pagination-fraction').forEach((el) => {
    el.style.mixBlendMode = 'difference';
  });
  const customCursor = document.getElementById('custom-cursor');
  const showCursor = () => {
    customCursor.style.opacity = 1;
  };

  const hideCursor = () => {
    customCursor.style.opacity = 0;
  };
  const handleMouseMove = (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseenter', showCursor);
  document.addEventListener('mouseleave', hideCursor);

  if (allImagesLoadedRight.value && allImagesLoadedLeft.value) {
    // Initialize animations on the initial active slides
    console.log('left')

    const activeSlideLeft =
      swiperLeft.value.slides[swiperLeft.value.activeIndex];
    const imgLeft = activeSlideLeft.querySelector('img');
    if (imgLeft) {
      $gsap.set(imgLeft, { scale: 0, opacity: 0 });
      $gsap.to(imgLeft, { scale: 1, opacity: 1, duration: 0.5 });
    }

    const activeSlideRight =
      console.log('right')
    swiperRight.value.slides[swiperRight.value.activeIndex];
    const imgRight = activeSlideRight.querySelector('img');
    if (imgRight) {
      $gsap.set(imgRight, { scale: 0, opacity: 0 });
      $gsap.to(imgRight, { scale: 1, opacity: 1, duration: 0.5 });
    }
  }
});
</script>
<template>
  <div>
    <!-- Loading Screen -->
    <div v-if="!allImagesLoadedRight || !allImagesLoadedLeft" class="loading-screen">
      <div class="piment-el">
        <ElementIconPiment />
      </div>
      <p>Simon Guittet</p>
    </div>

    <!-- Swiper Carousels -->
    <div v-if="carrouselImages" class="swipers">
      <div class="swiper-left">
        <Swiper :pagination="{ type: 'fraction' }" :initialSlide="1" :speed="400"
          :modules="[EffectCreative, Pagination]" effect="creative" :creative-effect="{
            limitProgress: 1,
            prev: { scale: 3 },
            next: { scale: 0 },
          }" :loop="true" :space-between="0" :style="`cursor: url(${leftArrowSvg}), auto`" @click="slidePrev"
          @swiper="setFirstSwiper" @slideChange="slideChange" @slideChangeTransitionStart="beforeTransition"
          @slideChangeTransitionEnd="slideChangeTransitionEnd">
          <SwiperSlide v-for="(image, index) in carrouselImages" :key="index">
            <figure>
              <NuxtImg :src="image.url" :alt="image.alt || 'Image description'" width="auto" height="auto" quality="80"
                format="webp" sizes="xs:1800px" @load="loadImageLeft" />
            </figure>
            <figcaption class="caption">
              <div v-if="image.project">Projet: {{ image.project }}</div>

              <div v-if="image.client">Client: {{ image.client }}</div>

              <div v-if="image.photographer">
                Crédit photo: {{ image.photographer }}
              </div>
            </figcaption>
          </SwiperSlide>
        </Swiper>
      </div>

      <div class="swiper-right">
        <Swiper :pagination="{ type: 'fraction' }" :speed="400" :modules="[EffectCreative, Pagination]"
          effect="creative" :creative-effect="{
            limitProgress: 1,
            prev: { scale: 3 },
            next: { scale: 0 },
          }" :loop="true" :initialSlide="1" :space-between="0" @swiper="setSecondSwiper" @slideChange="slideChange"
          :style="`cursor: url(${rightArrowSvg}), auto`" @click="slideNext"
          @slideChangeTransitionStart="beforeTransition" @slideChangeTransitionEnd="slideChangeTransitionEnd">
          <SwiperSlide v-for="(image, index) in carrouselImages" :key="index">
            <figure>
              <div class="swiper-zoom-container" data-swiper-zoom="5">
                <NuxtImg :src="image.url" :alt="image.alt || 'Image description'" width="auto" height="auto"
                  quality="80" format="webp" sizes="xs:1800px" @load="loadImageRight" />
              </div>
            </figure>
            <figcaption class="caption">
              <div v-if="image.project">Projet: {{ image.project }}</div>

              <div v-if="image.client">Client: {{ image.client }}</div>

              <div v-if="image.photographer">
                Crédit photo: {{ image.photographer }}
              </div>
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

.custom-cursor {
  mix-blend-mode: difference;
  position: absolute;
  pointer-events: none;
  font-family: 'Maison Neue';
  font-size: var(--font-base);
  text-transform: uppercase;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease;
  opacity: 0;
} */

.loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255);
  z-index: 1000;
  font-size: 1.5rem;
  font-weight: bold;
}



body.infos-is-active .swiper-slide-active figure:after {
  content: '';
  position: fixed;
  inset: 0;
  background-color: white;
  opacity: 0.8;
}

body.infos-is-active .swiper-right .swiper-slide-active figure:after {
  transform: scale(2);
}



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
  font-size: var(--font-base);
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
  object-fit: contain;
}

.swiper-left img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-right .swiper-slide-active figure {
  transform: scale(0.5);
}

.swiper-left .swiper-slide-active figure {
  transform: scale(1.1);
}
</style>
