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
const cloneLeft = ref(null)
const cloneRight = ref(null)

onBeforeRouteUpdate((to, from, next) => {

  console.log(navEl.value.parentElement)
  //Prev

  if (pageIndex > 0 && to.fullPath == '/' + children[pageIndex - 1].id) {
    const thumbWidth = prevEl.value.$el.getBoundingClientRect().width;
    const thumbImage = prevEl.value.$el

    cloneLeft.value = thumbImage.cloneNode(true);
    cloneLeft.value.classList.add('transition-clone')
    document.body.appendChild(cloneLeft.value);

    $gsap.to(thumbImage, {
      opacity: 0,
    });

    $gsap.to('header', {
      opacity: 0,
    });

    $gsap.set(cloneLeft.value, {
      position: 'absolute',
      top: thumbImage.getBoundingClientRect().top,
      left: thumbImage.getBoundingClientRect().left,
      right: thumbImage.getBoundingClientRect().right,
      bottom: thumbImage.getBoundingClientRect().bottom,
      width: thumbImage.getBoundingClientRect().width,
      height: thumbImage.getBoundingClientRect().height,
      zIndex: 10,
    });

    const translateValue = (window.innerWidth / 2) - 70 + thumbWidth / 2;
    $gsap.to(navEl.value.parentElement, {
      x: translateValue, duration: 0.4,

    });
    $gsap.to(cloneLeft.value, {
      x: translateValue, duration: 0.4,
      onComplete: () => {
        next();
      },
    });
  }
  //Next
  if (pageIndex >= 0 && to.fullPath == '/' + children[pageIndex + 1].id) {

    const thumbWidth = nextEl.value.$el.getBoundingClientRect().width;
    const thumbImage = nextEl.value.$el

    cloneRight.value = thumbImage.cloneNode(true);
    cloneRight.value.classList.add('transition-clone')
    document.body.appendChild(cloneRight.value);

    $gsap.to(thumbImage, {
      opacity: 0,
    });

    $gsap.to('header', {
      opacity: 0,
    });

    $gsap.set(cloneRight.value, {
      position: 'absolute',
      top: thumbImage.getBoundingClientRect().top,
      left: thumbImage.getBoundingClientRect().left,
      right: thumbImage.getBoundingClientRect().right,
      bottom: thumbImage.getBoundingClientRect().bottom,
      width: thumbImage.getBoundingClientRect().width,
      height: thumbImage.getBoundingClientRect().height,
      zIndex: 10,
    });


    const translateValue = - ((window.innerWidth / 2) - 70 + thumbWidth / 2);

    $gsap.to(cloneRight.value, {
      x: translateValue, duration: 0.7,
    });

    $gsap.to(navEl.value.parentElement, {
      x: translateValue, duration: 0.7, onComplete: () => {
        next();
      },
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
