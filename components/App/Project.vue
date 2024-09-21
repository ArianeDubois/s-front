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
onMounted(() => {
  if (next.value) {
    $gsap.to(next.value, {
      duration: 1,
      x: "0",
      ease: 'power2.inOut',
    });
  }
  if (prev.value) {
    $gsap.to(prev.value, {
      duration: 1,
      x: "0",
      ease: 'power2.inOut',
    });
  }
});

</script>

<template>
  <article :ref="`${isLeft ? 'prev' : 'next'}`"
    :class="`${isLeft ? 'project-excerpt__left' : 'project-excerpt__right'} project-excerpt`">
    <NuxtLink :to="`/${project?.id}`">
      <figure>
        <NuxtImg :data-width="width" :data-height="height" format="webp" sizes="xs:1080px" quality="80"
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
  width: calc(100% - 200px);
  object-fit: contain;
}

/* 100px de marge */
.project-excerpt__left {
  transform: translateX(-70px);
  right: calc(100% - 70px);
}

.project-excerpt__right {
  left: calc(100% - 70px);
  transform: translateX(70px);
}

.project-excerpt__right:not(.transition-clone) img {

  object-position: left;
  /* transform: trans; */
}

.project-excerpt__left:not(.transition-clone) img {
  object-position: right;
}

figure,
img {
  height: 100%;
  width: 100%;
  /* width: auto;
  max-width: calc(100vw - 100px); */
  object-fit: contain;
  display: inline-block;
}
</style>
