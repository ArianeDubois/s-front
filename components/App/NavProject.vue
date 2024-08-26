<script setup lang="ts">
import { projectsQuery } from '~/queries'
const { $gsap, $ScrollTrigger } = useNuxtApp();

// Explicitly not using `computed` here
const page = usePage().value

const { data } = await useKql(projectsQuery)
const children = data.value?.result?.children
const pageIndex = children?.findIndex(({ id }: any) => id === page?.id)
const prevEl = ref(null)
const nextEl = ref(null)
const navEl = ref(null)

onBeforeRouteUpdate((to, from, next) => {
  //Prev
  if (to.fullPath == '/' + children[pageIndex - 1].id) {
    const thumbWidth = prevEl.value.$el.getBoundingClientRect().width;
    const translataValue = (window.innerWidth / 2) - (window.innerWidth * 4 / 100) + thumbWidth / 2;
    $gsap.to(navEl.value.parentElement, { x: translataValue, duration: 0.5, onComplete: next });

  }
  //Next
  else if (to.name === 'photography-id') {
    console.log(next)

    const thumbWidth = nextEl.value.$el.getBoundingClientRect().width;
    const translataValue = (window.innerWidth / 2) - (window.innerWidth * 4 / 100) + thumbWidth / 2;
    $gsap.to(navEl.value.parentElement, {
      x: -translataValue, duration: 0.5, onComplete: next
    });
  }
  // next();
})
</script>

<template>
  <nav class="next-prev" ref="navEl">
    <AppProject ref="prevEl" v-if="pageIndex !== undefined && pageIndex > 0" :project="children[pageIndex - 1]"
      :excerpt="false" :is-left="true" />
    <AppProject ref="nextEl" v-if="pageIndex !== undefined && pageIndex < children.length - 1"
      :project="children[pageIndex + 1]" :excerpt="false" />
  </nav>
</template>

<style scoped>
.next-prev {
  width: 100%;
  height: 100%;
}
</style>
