<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { EffectFade } from 'swiper/modules';

// const img = useImage()

const swiperLeft = ref(null);
const swiperRight = ref(null);
const swiperLittle = ref(null);
const imageLoaded = ref(false)
const leftArrowSvg = ref(null);
const rightArrowSvg = ref(null);

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
  },
})

const carrouselImages = carrouselData.value?.result || []

const setSecondSwiper = (right) => {
  swiperRight.value = right;
};
const setFirstSwiper = (left) => {
  swiperLeft.value = left;
};
const setLittleSwiper = (little) => {
  swiperLittle.value = little;
};

const slidePrev = (swiper) => {
  swiper.slidePrev();
  setTimeout(() => {
    swiperRight.value.slidePrev();
  }, 100);
  swiperLittle.value.slidePrev();
}
const slideNext = (swiper) => {
  swiper.slideNext();
  setTimeout(() => {
    swiperLeft.value.slideNext();
  }, 100);
  swiperLittle.value.slideNext();
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
    sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw',
    modifiers: {
      format: 'webp',
      quality: 70,
      height: props.height
    }
  })
})

onMounted(() => {
  leftArrowSvg.value = 'data:image/svg+xml;base64,' + window.btoa('<svg width="31" height="27" viewBox="0 0 31 27" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M31 15.8722L16.0737 15.8722C13.5058 15.8722 11.1518 15.9257 7.88838 15.7652C9.38636 17.4237 11.9543 19.9916 14.2548 22.2921L18.9092 27L13.4523 27L7.24639 20.4196C5.10643 18.1192 2.80597 15.9257 0.879998 13.8392C2.80597 11.8598 5.10643 9.55929 7.24639 7.25883L13.4523 0.67844L18.9092 0.678439L14.2548 5.38636C11.9543 7.68682 9.38636 10.3618 7.88838 11.9133C11.1518 11.8598 13.5058 11.8063 16.0737 11.8063L31 11.8063L31 15.8722Z" fill="#777"/> </svg>');
  rightArrowSvg.value = 'data:image/svg+xml;base64,' + window.btoa('<svg width="31" height="27" viewBox="0 0 31 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.879883 11.8063L15.8061 11.8063C18.3741 11.8063 20.7281 11.7528 23.9915 11.9133C22.4935 10.2548 19.9256 7.68682 17.6251 5.38636L12.9707 0.67844L18.4276 0.67844L24.6335 7.25883C26.7735 9.55929 29.0739 11.7528 30.9999 13.8392C29.0739 15.8187 26.7735 18.1192 24.6335 20.4196L18.4276 27L12.9707 27L17.6251 22.2921C19.9256 19.9916 22.4935 17.3167 23.9915 15.7652C20.7281 15.8187 18.3741 15.8722 15.8061 15.8722L0.879883 15.8722L0.879883 11.8063Z" fill="#777"/></svg>');
})
</script>

<template>

  <div v-if="carrouselImages">
    <div class="swipers">
      <Swiper :speed="0" :modules="[EffectFade]" effect="fade" :loop="true" :slides-per-view="1" :slides-per-group="1"
        :space-between="0" :style="`cursor: url(${leftArrowSvg}), auto`" @click="slidePrev" @swiper="setFirstSwiper">
        <SwiperSlide v-for=" ( image, index  ) in  carrouselImages " :key="index">
          <figure>
            <NuxtImg loading="lazy" :src="image.url" :alt="image.alt || 'Image description'" width="auto" height="auto"
              quality="80" format="webp" sizes="xs:100vw" />
          </figure>
        </SwiperSlide>
      </Swiper>

      <Swiper :speed="0" :modules="[EffectFade]" effect="fade" :loop="true" :initialSlide="1" :slides-per-view="1"
        :slides-per-group="1" :space-between="0" @swiper="setSecondSwiper"
        :style="`cursor: url(${rightArrowSvg}), auto`" @click="slideNext">

        <SwiperSlide v-for="( image, index ) in  carrouselImages " :key="index">
          <figure>
            <NuxtImg loading="lazy" :src="image.url" :alt="image.alt || 'Image description'" width="auto" height="auto"
              quality="80" format="webp" sizes="xs:100vw" />
          </figure>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<style scoped>
.swipers {
  position: fixed;
  display: flex;
  inset: 0;
}


.swiper {
  width: 50%;
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


.swiper:not(.overlay-image) img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover
}


.swiper.overlay-image {
  position: fixed;
  top: 50%;
  height: 100%;
  right: 25%;
  width: 15%;
  transform: translate(50%, -50%);
  pointer-events: none;
}

.swiper.overlay-image .swiper-wrapper {
  width: 100%;
  height: 100%;
}

.swiper.overlay-image figure {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
