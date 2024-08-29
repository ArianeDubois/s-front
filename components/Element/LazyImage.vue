<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  src: String,
  lowQualitySrc: String,
  alt: String,
});

const loaded = ref(false);

const onLoad = () => {
  loaded.value = true;
};

const onLowQualityLoad = () => {
  // Optional: Any additional logic when the low-quality image loads
};
</script>

<template>
  <div class="lazy-image">
    <!-- Image floutée en basse qualité -->


    <!-- Image de haute qualité -->
    <NuxtImg :src="src" :alt="alt" class="high-quality" :class="{ 'loaded': loaded }" @load="onLoad" format="webp"
      width="auto" height="auto" quality="80" sizes="xs:600px" />
    <NuxtImg :src="lowQualitySrc" :alt="alt" :style="{ 'opacity: 0': loaded }" class="low-quality"
      @load="onLowQualityLoad" format="webp" width="auto" height="auto" quality="10" sizes="xs:10px" />

  </div>
</template>



<style scoped>
.lazy-image {
  /* position: relative; */
  position: absolute;
  inset: 0;
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.low-quality {
  filter: blur(20px);
  transform: scale(1.1);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease;
  z-index: -1;
}

/* .clone .lazy-image img {
  height: 100%;
  width: 100%;
  object-fit: cover !important;
} */

.high-quality {
  opacity: 0;
  transition: opacity 0.5s ease;
  width: 100%;
  height: 100%;
}

.high-quality.loaded {
  opacity: 1;
}

.opacity-0 {
  opacity: 0;
}
</style>
