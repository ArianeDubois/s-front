<script setup lang="ts">
const { $gsap, $ScrollTrigger } = useNuxtApp();

defineProps<{
  project?: Record<string, any>
  excerpt?: boolean
  isLeft?: boolean

}>()

const prev = ref(null);
const next = ref(null);

onMounted(() => {
  $gsap.to(next.value, {
    duration: 1,
    x: "-80%)",
    ease: 'power2.inOut',
  });
  $gsap.to(prev.value, {
    duration: 1,
    x: "-80px",
    ease: 'power2.inOut',
  });
});

</script>

<template>
  <article :ref="`${isLeft ? 'prev' : 'next'}`"
    :class="`${isLeft ? 'project-excerpt__left' : 'project-excerpt__right'} project-excerpt`">
    <NuxtLink :to="`/${project?.id}`">
      <figure>
        <img :src="project?.cover?.url ?? project?.images?.[0]?.url" alt="" />
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
  width: auto;
  /* transform: translateX(-80%); */
}

.project-excerpt__left {
  transform: translateX(180px);
  right: 100%;

}

.project-excerpt__right {
  left: -100%;
  transform: translateX(-100%);

}

figure,
img {
  width: auto;
  height: 100%;
}
</style>
