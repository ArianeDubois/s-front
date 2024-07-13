<script setup>
const { $gsap, $ScrollTrigger } = useNuxtApp()

const { data } = await useKql({
  query: 'page("photography")',
  select: {
    id: true,
    title: true,
    intendedTemplate: true,
    subheadline: true,
    children: {
      query: 'page.children.listed',
      select: {
        id: true,
        title: true,
        cover: {
          query: 'page.content.cover.toFile',
          select: {
            url: true,
            alt: true,
          },
        },
        image: {
          query: 'page.images.first',
          select: {
            url: true,
            alt: true,
          },
        },
      },
    },
  },
})

const page = data.value?.result
setPage(page)

const leftGridProjects = ref([]);
const rightGridProjects = ref([]);
const onEnter = ref(false)
const reorderedProjects = ref([]);
const projects = ref(null)
const project = ref(null);

const processProjects = () => {


  if (page.children) {
    const children = page.children;

    const evenProjects = children.filter((project, index) => index % 2 === 0).reverse();
    const oddProjects = children.filter((project, index) => index % 2 !== 0).reverse();
    let evenIndex = 0;
    let oddIndex = 0;

    for (let i = 0; i < children.length; i++) {
      if (i == 0) {
        reorderedProjects.value.unshift(oddProjects[0]);
        oddProjects.shift();
      }

      reorderedProjects.value.push(children[i]);

      if ((i + 1) % 2 === 0) {
        if (evenIndex < evenProjects.length) {
          reorderedProjects.value.push(evenProjects[evenIndex]);
          evenIndex++;
        }
        if (oddIndex < oddProjects.length) {
          reorderedProjects.value.push(oddProjects[oddIndex]);
          oddIndex++;
        }
      }
    }
  }
}


processProjects();

definePageMeta({
  pageTransition: {
    name: 'zoom',
    onEnter: (el, done) => {
      console.log('enter')

    },
    onAfterEnter: (el) => { }
  }
})


const test = () => {
  console.log('tex');
}

onBeforeRouteLeave((to, from, next) => {
  projects.value.classList.add("pointer-event-none")
  if (to.name.startsWith('photography')) {

    const thumb = projects.value.querySelector(`[data-slug="${to.params['id'][0]}"]`);
    const thumbBCR = thumb.getBoundingClientRect()
      ;

    console.log(thumbBCR)
    //-229 donc pour aller à droite c'est - et à gauchce c''est +'
    console.log(projects.value.getBoundingClientRect());

    const windowCenterX = window.innerWidth / 3;
    const windowCenterY = window.innerHeight / 3;

    const thumbCenterX = thumbBCR.left + thumbBCR.width / 2;
    const thumbCenterY = thumbBCR.top + thumbBCR.height / 2;

    const dx = thumbCenterX;
    const dy = windowCenterY - thumbCenterY;

    $gsap.to(projects.value, {
      duration: 1,
      x: dx,
      y: dy,
      scale: (1.5),
      ease: 'power2.inOut',
    });
  }

  // thumb.appendChild(clone)

})
onMounted(() => {
  onEnter.value = true
})

</script>

<template>
  <div class="page">
    <Transition name="zoom" enter-from-class="zoom-from" enter-active-class="zoom-to" @enter="test()">
      <ul class="projects" v-if="onEnter" ref="projects">
        <li v-for="(project, index) in reorderedProjects" :key="index" :data-slug="`${project.id.split('/')[1]}`"
          class="project">
          <NuxtLink :to="`/${project.id}`">
            <figure>
              <img :src="project?.cover?.url ?? project?.images?.[0]?.url
                " :alt="project?.cover?.alt ?? project?.images?.[0]?.alt" />
            </figure>
          </NuxtLink>
          <div>{{ index }}</div>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style>
.page {
  overflow: hidden;
  font-family: "Maison Neue";
}

.projects {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 20px;
  margin: 0 -25%;
  transform: scale(1);
  transform-origin: top;
  transition: transform 0.8s ease-in-out;
}

.project {
  object-fit: contain;
  position: relative;
}

.zoom-to {
  transform: scale(0.7);
}
</style>
