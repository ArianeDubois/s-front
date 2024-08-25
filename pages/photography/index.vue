<script setup>
const { $gsap, $ScrollTrigger } = useNuxtApp();

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
});

const page = data.value?.result;
setPage(page);

const leftGridProjects = ref([]);
const rightGridProjects = ref([]);
const onEnter = ref(false);
const reorderedProjects = ref([]);
const projects = ref(null);
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
};

processProjects();

definePageMeta({
  pageTransition: {
    name: 'zoom',
    onEnter: (el, done) => {
      console.log('enter');
    },
    onAfterEnter: (el) => { },
  },
});

const test = () => {
  console.log('tex');
};

const loadMoreProjects = () => {
  // Append the projects to the end to create an infinite scroll effect
  reorderedProjects.value.push(...reorderedProjects.value.slice(0, 10));
};

const handleScroll = () => {
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const windowWidth = window.innerWidth;
  const fullWidth = document.documentElement.scrollWidth;

  if (scrollLeft + windowWidth >= fullWidth - 100) {
    loadMoreProjects();
  }
};

onMounted(() => {
  onEnter.value = true;
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

onBeforeRouteLeave((to, from, next) => {
  projects.value.classList.add('pointer-event-none');
  if (to.name.startsWith('photography')) {
    const thumb = projects.value.querySelector(`[data-slug="${to.params['id'][0]}"]`);
    const thumbBCR = thumb.getBoundingClientRect();
    const imgbBCR = thumb.querySelector('img').getBoundingClientRect();

    // Cachez tous les autres projets sauf celui cliqué
    const otherProjects = projects.value.querySelectorAll('.project');
    otherProjects.forEach(project => {
      if (project !== thumb.closest('.project')) {
        $gsap.to(project, { opacity: 0, duration: 0.5 });
      }
    });
    const scale = window.innerHeight / imgbBCR.height;

    // Appliquer la transformation au projet cliqué
    $gsap.to(thumb.closest('.project'), {
      duration: 1,
      x: window.innerWidth / 2 - thumbBCR.left - thumbBCR.width / 2,
      y: window.innerHeight / 2 - thumbBCR.top - thumbBCR.height / 2,
      scale: scale,
      ease: 'power2.inOut',
      onComplete: next
    });
  }

  // next();
});
</script>


<template>
  <div class="page">
    <Transition name="zoom" enter-from-class="zoom-from" enter-active-class="zoom-to" @enter="test">
      <ul class="projects" v-if="onEnter" ref="projects">
        <li v-for="(project, index) in reorderedProjects" :key="index" :data-slug="`${project.id.split('/')[1]}`"
          class="project">
          <NuxtLink :to="`/${project.id}`">
            <figure>
              <img :src="project?.cover?.url ?? project?.images?.[0]?.url"
                :alt="project?.cover?.alt ?? project?.images?.[0]?.alt" />
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
  font-family: 'Maison Neue';
}

.projects {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  margin: 0 -25%;
  transform: scale(1);
  transform-origin: top;
  transition: transform 0.8s ease-in-out;
}

.project {
  object-fit: contain;
  position: relative;
  transform-origin: top center;

}

.project img {
  transform-origin: top left;
}

.zoom-to {
  transform: scale(0.7);
}
</style>
