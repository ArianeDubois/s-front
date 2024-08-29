<script setup lang="ts">
const { $gsap } = useNuxtApp()

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
// import 'swiper/css/pagination';

import { EffectCreative, Navigation, Pagination } from 'swiper/modules';

const swiperLeft = ref(null);
const swiperRight = ref(null);
const leftArrowSvg = ref(null);
const rightArrowSvg = ref(null);

// Variables pour gérer le chargement
const imageLoadedCountLeft = ref(0);
const imageLoadedCountRight = ref(0);
const totalImages = ref(0);
const allImagesLoadedLeft = computed(() => imageLoadedCountLeft.value >= totalImages.value);
const allImagesLoadedRight = computed(() => imageLoadedCountRight.value >= totalImages.value);

const { data } = await useKql({
  query: 'page("home")',
  select: {
    id: true,
    title: true,
    intendedTemplate: true,
    headline: true,
    subheadline: true,
  },
})

const page = data.value?.result
setPage(page)

const { data: carrouselData, error: carrouselError } = await useKql({
  query: 'page("home").files',
  select: {
    filename: true,
    url: true,
    alt: true,
    width: true,
    height: true,
    project: true,  // Récupère le titre du projet
    client: true,  // Récupère le nom du client
    photographer: true,  // Récupère le crédit photo
    width: true,
    height: true,
  },
})

const carrouselImages = carrouselData.value?.result || []

totalImages.value = carrouselImages.length;

const setSecondSwiper = (right) => {
  swiperRight.value = right;
};

const slideChange = (swiper) => {
}

const setFirstSwiper = (left) => {
  swiperLeft.value = left;
};

const slidePrev = (swiper) => {
  swiper.slideNext();
  // swiperRight.value.params.creativeEffect.limitProgress = 2;
  // swiperRight.value.update();
  swiperRight.value.slideNext();
}
const slideNext = (swiper) => {
  swiper.slideNext();
  // swiperRight.value.params.creativeEffect.limitProgress = 1;
  // swiperRight.value.update();
  swiperLeft.value.slideNext();

}

const props = defineProps({
  height: { type: [Number, String], default: 500 },
  src: {
    type: String,
    default: '/img/header-bg.jpg'
  }
})

const img = useImage()
const _srcset = computed(() => {
  return img.getSizes(props.src, {
    modifiers: {
      format: 'webp',
      quality: 80,
      height: props.height
    }
  })
})

const loadImageLeft = () => {
  imageLoadedCountLeft.value++;
  console.log(`Image loaded: ${imageLoadedCountLeft.value}/${totalImages.value}`);
}

const loadImageRight = () => {
  imageLoadedCountRight.value++;
  console.log(`Image loaded: ${imageLoadedCountRight.value}/${totalImages.value}`);
}

onBeforeRouteLeave((to, from, next) => {
  var tl = $gsap.timeline({ duration: 0.5 }
  );

  tl.to('.swiper-right .swiper-slide-active img', {
    scale: 0,
  })
  tl.to('.swiper-left .swiper-slide-active img', {
    scale: 0,
  })
  tl.to('.swiper-right .swiper-slide-active img', {
    scale: 0,
    onComplete: next()
  })
})


onMounted(() => {
  document.querySelectorAll('.swiper-pagination-fraction').forEach(el => {
    el.style.mixBlendMode = 'difference';
  })

  if (allImagesLoadedRight && allImagesLoadedLeft) {
    $gsap.set('.swiper-right .swiper-slide-active img', {
      opacity: 0
    });
    $gsap.fromTo('.swiper-right .swiper-slide-active img', {
      scale: 0,
      opacity: 0

    }, {
      scale: 1,
      opacity: 1,
      delay: 0.4
    });
    $gsap.fromTo('.swiper-left .swiper-slide-active img', {
      scale: 0,
    }, {
      scale: 1,
    });

    $gsap.fromTo('.swiper-right .swiper-zoom-container img', {
      scale: 0.5,
    }, {
      scale: 1,
    });
  }
  // leftArrowSvg.value = 'data:image/svg+xml;base64,' + window.btoa('<svg width="31" height="27" viewBox="0 0 31 27" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M31 15.8722L16.0737 15.8722C13.5058 15.8722 11.1518 15.9257 7.88838 15.7652C9.38636 17.4237 11.9543 19.9916 14.2548 22.2921L18.9092 27L13.4523 27L7.24639 20.4196C5.10643 18.1192 2.80597 15.9257 0.879998 13.8392C2.80597 11.8598 5.10643 9.55929 7.24639 7.25883L13.4523 0.67844L18.9092 0.678439L14.2548 5.38636C11.9543 7.68682 9.38636 10.3618 7.88838 11.9133C11.1518 11.8598 13.5058 11.8063 16.0737 11.8063L31 11.8063L31 15.8722Z" fill="#777"/> </svg>');
  // rightArrowSvg.value = 'data:image/svg+xml;base64,' + window.btoa('<svg width="31" height="27" viewBox="0 0 31 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.879883 11.8063L15.8061 11.8063C18.3741 11.8063 20.7281 11.7528 23.9915 11.9133C22.4935 10.2548 19.9256 7.68682 17.6251 5.38636L12.9707 0.67844L18.4276 0.67844L24.6335 7.25883C26.7735 9.55929 29.0739 11.7528 30.9999 13.8392C29.0739 15.8187 26.7735 18.1192 24.6335 20.4196L18.4276 27L12.9707 27L17.6251 22.2921C19.9256 19.9916 22.4935 17.3167 23.9915 15.7652C20.7281 15.8187 18.3741 15.8722 15.8061 15.8722L0.879883 15.8722L0.879883 11.8063Z" fill="#777"/></svg>');
})
</script>

<template>
  <div>
    <!-- Écran de chargement -->
    <!-- <div v-if="!allImagesLoadedRight || !allImagesLoadedLeft" class="loading-screen">
      <ElementIconPiment />
      <p>Simon Guittet</p>
    </div> -->

    <!-- Carrousel Swiper -->
    <div v-if="carrouselImages" class="swipers">
      <div class="swiper-left">
        <Swiper :pagination="{
          type: 'fraction',
        }" :initialSlide="1" :speed="400" :modules="[EffectCreative, Pagination]" effect="creative" :creative-effect="{
          limitProgress: 1,
          prev: {
            scale: 3,
          },
          next: {
            scale: 0,
          }
        }" :loop="true" :space-between="0" :style="`cursor: url(${leftArrowSvg}), auto`" @click="slidePrev"
          @swiper="setFirstSwiper" @slideChange="slideChange">
          <SwiperSlide v-for=" ( image, index  ) in carrouselImages " :key="index">
            <figure>
              <NuxtImg loading="lazy" :src="image.url" :alt="image.alt || 'Image description'" width="auto"
                height="auto" quality="80" format="webp" sizes="xs:1800px" @load="loadImageLeft" />

            </figure>
            <figcaption class="caption">
              <div v-if="image.project">
                Projet: {{ image.project }}
              </div>

              <div v-if="image.client">
                Client: {{ image.client }}
              </div>

              <div v-if="image.photographer">
                Crédit photo: {{ image.photographer }}
              </div>
            </figcaption>
          </SwiperSlide>
        </Swiper>
      </div>

      <div class="swiper-right">
        <Swiper :pagination="{
          type: 'fraction',
        }" :speed="400" :modules="[EffectCreative, Pagination]" effect="creative" :creative-effect="{
          limitProgress: 1,
          prev: {
            scale: 3,
          },
          next: {
            scale: 0,
          }
        }" :loop="true" :initialSlide="1" :space-between="0" @swiper="setSecondSwiper" @slideChange="slideChange"
          :style="`cursor: url(${rightArrowSvg}), auto`" @click="slideNext">
          <SwiperSlide v-for="( image, index ) in carrouselImages " :key="index">
            <figure>
              <div class="swiper-zoom-container" data-swiper-zoom="5">
                <NuxtImg :src="image.url" :alt="image.alt || 'Image description'" width="auto" height="auto"
                  quality="80" format="webp" sizes="xs:1800px" @load="loadImageRight" />
              </div>
            </figure>
            <figcaption class="caption">
              <div v-if="image.project">
                Projet: {{ image.project }}
              </div>

              <div v-if="image.client">
                Client: {{ image.client }}
              </div>

              <div v-if="image.photographer">
                Crédit photo: {{ image.photographer }}
              </div>
            </figcaption>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
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
