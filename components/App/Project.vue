<script setup lang="ts">
const { $gsap, $ScrollTrigger } = useNuxtApp();

defineProps<{
  project?: Record<string, any>
  excerpt?: boolean
  isLeft?: boolean
  width?: number
  height?: number

}>()

const prev = ref(null);
const next = ref(null);
</script>

<template>
  <article :ref="`${isLeft ? 'prev' : 'next'}`"
    :class="`${isLeft ? 'project-excerpt__left' : 'project-excerpt__right'} project-excerpt`">
    <NuxtLink :to="`/${project?.id}`" prefetch>
      <figure>
        <NuxtImg :data-width="width" :data-height="height" format="webp" :preload="true"
          :sizes="'400px sm:600px md:600px lg:500px xl:800px'" quality="80"
          :src="project.cover.url ?? project.images[0].url" alt="" />
      </figure>
    </NuxtLink>
  </article>
</template>

<style scoped>
.project-excerpt {
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100vh;
  overflow: hidden;
  /* max-height: 100vh;*/
  /* width: calc(100% - 200px); */
  width: 100%;
  margin: 0 100px;
  object-fit: contain;
}

/* 100px de marge */
.project-excerpt__left {
  /* transform: translateX(calc(-100% + 200px)); */
  transform: translateX(-100%);

  right: 0;
  left: 0;

}

.project-excerpt__right {
  left: 0;
  right: 0;
  /* transform: translateX(calc(100% - 200px)); */
  transform: translateX(100%);
}

.project-excerpt__right:not(.transition-nav-clone) img {
  max-width: calc(100vw - 200px);

  object-position: center;
  /* transform: trans; */
}

.project-excerpt__left:not(.transition-nav-clone) img {
  max-width: calc(100vw - 200px);

  object-position: center;
}

figure {
  display: flex;
  justify-content: center;
}

figure,
img {
  height: 100%;
  width: 100%;


  /* width: auto;
  max-width: calc(100vw - 100px); */
  object-fit: contain;
  /* display: inline-block; */
}
</style>
