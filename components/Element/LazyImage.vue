<script setup lang="ts">
import { ref } from 'vue';
const { $gsap, } = useNuxtApp();
// $gsap.registerPlugin($ScrollTrigger);

const props = defineProps({
  src: String,
  lowQualitySrc: String,
  alt: String,
  sizes: String,
  isLoading: Boolean
});

const loaded = ref(false);
const imageRef = ref(null);  // Référence pour la haute qualité
const lowQualityImageRef = ref(null);  // Référence pour la basse qualité
const onLoad = () => {
  loaded.value = true;
};

const onLowQualityLoad = () => {
};

onMounted(() => {
  const animateLoadingImages = () => {
    const images = document.querySelectorAll('.loading-screen .loading-images img');
    $gsap.to(images, {
      scale: 1,
      stagger: 0.5,
      // repeat: -1,
      ease: 'power2.out',
    });
  };

})
</script>

<template>
  <div class="lazy-image">
    <NuxtImg ref="imageRef" :src="src" :alt="alt" class="high-quality" :class="{ 'loaded': loaded }" @load="onLoad"
      format="webp" width="auto" height="auto" quality="80" :sizes="sizes" :loading="isLoading ? 'lazy' : 'eager'" />
    <NuxtImg ref="lowQualityImageRef" :src="lowQualitySrc" :alt="alt" :style="{ 'opacity: 0': loaded }"
      class="low-quality" @load="onLowQualityLoad" format="webp" width="auto" height="auto" quality="10"
      sizes="xs:10px" />
  </div>
</template>



<style scoped>
.loading-screen .low-quality,
.loading-screen .high-quality {
  object-fit: cover;
}


.lazy-image {
  /* position: relative; */
  position: absolute;
  inset: 0;
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.low-quality {
  filter: blur(50px);
  transform: scale(1.1);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* transition: opacity 0.5s ease; */
  z-index: -1;
}

/* .clone .lazy-image img {
  height: 100%;
  width: 100%;
  object-fit: cover !important;
} */

.high-quality {
  opacity: 0;
  /* transition: opacity 0.5s ease; */
  width: 100%;
  height: 100%;
}

.high-quality.loaded {
  opacity: 1;
}


body.infos-is-active .high-quality.loaded {
  opacity: 0;
  z-index: 0;
}


/* .opacity-0 {
  opacity: 0;
} */

img {
  object-fit: contain;
}


/* .album-gallery li:not(.cover):nth-child(2) figure img {
  object-position: left;
}


.album-gallery li:not(.cover):nth-child(6) img {
  object-position: right;
} */
</style>
