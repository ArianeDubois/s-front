<script setup>
const { $gsap, $ScrollTrigger } = useNuxtApp();

const { data } = await useKql({
  query: 'page("photography")',
  select: {
    id: true,
    title: true,
    tags: true,
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
            height: true,
            width: true,
          },
        },
        image: {
          query: 'page.images.sortBy("sort", "asc").first',
          select: {
            url: true,
            alt: true,
            height: true,
            width: true,
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
const clonedImage = ref(null);

const processProjects = () => {
  if (page.children) {
    const children = page.children;

    const evenProjects = children.filter((project, index) => index % 2 === 0).reverse();
    const oddProjects = children.filter((project, index) => index % 2 !== 0).reverse();
    let evenIndex = 0;
    let oddIndex = 0;

    for (let i = 0; i < children.length; i++) {
      if (i == 0) {
        reorderedProjects.value.unshift({ ...oddProjects[0], isClone: true });
        oddProjects.shift();
      }

      reorderedProjects.value.push(children[i]);

      if ((i + 1) % 2 === 0) {
        if (evenIndex < evenProjects.length) {
          reorderedProjects.value.push({ ...evenProjects[evenIndex], isClone: true });
          evenIndex++;
        }
        if (oddIndex < oddProjects.length) {

          reorderedProjects.value.push({ ...oddProjects[oddIndex], isClone: true });
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
    },
    onLeave(el, done) {
      done();
    },
  },
});

const test = () => {
  console.log('tex');
};

onMounted(() => {
  onEnter.value = true;
});


onBeforeRouteLeave((to, from, next) => {
  projects.value.classList.add('pointer-event-none');

  if (document.querySelector('.low-quality')) {
    $gsap.set('.low-quality', { opacity: 0 });
  }
  if (to.name.startsWith('photography')) {
    const thumb = projects.value.querySelector(`[data-slug="${to.params['id'][0]}"]:not(.clone)`);
    const thumbBCR = thumb.getBoundingClientRect();
    const imgbBCR = thumb.querySelector('img').getBoundingClientRect();
    // Cachez tous les autres projets sauf celui cliqué
    const otherProjects = projects.value.querySelectorAll('.project');



    otherProjects.forEach(project => {
      if (project !== thumb.closest('.project')) {
        $gsap.to(project, { opacity: 0, duration: 0.15 });
      }
    });

    const scaleX = (window.innerWidth - 200) / imgbBCR.width;
    const scaleY = window.innerHeight / imgbBCR.height;
    const scale = Math.min(scaleX, scaleY);


    const scaledWidth = thumbBCR.width * scale;
    const scaledHeight = thumbBCR.height * scale;
    const x = (window.innerWidth / 2) - (imgbBCR.left + (imgbBCR.width / 2));
    const y = (window.innerHeight / 2) - (imgbBCR.top + (imgbBCR.height / 2));
    $gsap.to('.index', {
      opacity: 0
    })

    clonedImage.value = thumb.querySelector('img').cloneNode(true);
    clonedImage.value.classList.add('transition-clone')
    document.body.appendChild(clonedImage.value);


    $gsap.set(clonedImage.value, {
      position: 'absolute',
      top: imgbBCR.top + window.scrollY,
      left: imgbBCR.left,
      width: imgbBCR.width,
      height: imgbBCR.height,
      zIndex: 10,
    });

    var tl = $gsap.timeline({ delay: 0.25 })

    $gsap.set(thumb.querySelector('img'), {
      opacity: 0,
      delay: 0.25,
    })

    tl.to(clonedImage.value, {
      // duration: 0.7,
      duration: 0.7,
      x: x,
      y: y,
      scale: scale,
      ease: 'power2.inOut',

      onComplete: () => {
        window.scrollTo(0, 0);

        $gsap.set(clonedImage.value, {
          top: imgbBCR.top
        })
        next();
      },
    });
    // $gsap.set(thumb.querySelector('img'), {
    //   opacity: 0,
    // })
    // $gsap.to(thumb.querySelector('img'), {
    //   duration: 1,
    //   x: x,
    //   y: y,
    //   scale: scale,
    //   ease: 'power2.inOut',
    //   onComplete: () => {
    //     next();
    //   }
    // });
  }
});
</script>


<template>
  <div class="page">
    <Transition name="zoom" enter-from-class="zoom-from" enter-active-class="zoom-to" @enter="test">
      <ul class="projects" v-if="onEnter" ref="projects">

        <li v-for="(project, index) in reorderedProjects" :key="index" :data-slug="`${project.id.split('/')[1]}`"
          :class="['project', { clone: project.isClone, 'pointer-events-none': project.isClone }]">
          <NuxtLink :to="`/${project.id}`">
            <figure
              :style="`width: 100%; position: relative;padding-top: ${project?.image?.height / project?.image?.width * 100}%`">
              <ElementLazyImage :src="project?.cover?.url ?? project?.images?.[0].url"
                :lowQualitySrc="project?.image?.url" :alt="project?.cover?.alt ?? project?.images?.[0]?.alt"
                :sizes="'xs:600px'" />
              <!-- <NuxtImg loading="lazy" :src="project?.image?.url ?? project?.images?.[0]?.url"
                :alt="project?.cover?.alt ?? project?.images?.[0]?.alt" width="auto" height="auto" quality="80"
                format="webp" sizes="xs:600px" /> -->
              <figcaption class="caption">
                <div>
                  Projet: {{ project.title }}
                </div>
                <div>
                  Client: {{ project.client }}
                </div>
                <div>
                  Crédit photo: {{ project.credit }}
                </div>
              </figcaption>
            </figure>
          </NuxtLink>
          <div class="index">{{ index }}</div>
        </li>
      </ul>
    </Transition>

  </div>
</template>

<style scoped>
.pointer-events-none {
  pointer-events: none;
}

.page {
  overflow: hidden;
  font-family: 'Maison Neue';
}

.projects {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--padding-x);
  margin: var(--padding-x) -25%;
  transform: scale(1);
  transform-origin: top;
  transition: transform 0.8s ease-in-out;
}

.project {
  object-fit: contain;
  position: relative;
  transform-origin: center;
  font-size: var(--font-base);
}

figure {
  position: relative;
  overflow: hidden;
}

.caption {
  opacity: 0;
  position: absolute;
  top: 5px;
  left: 5px;
  width: 100%;
  color: black;
  font-size: var(--font-base);
  text-transform: uppercase;
}


body.infos-is-active .caption {
  opacity: 1;
  z-index: 100;
}


body.infos-is-active figure:after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: white;
  opacity: 0.8;
}

body.infos-is-active li {
  pointer-events: none;
}

.zoom-to {
  transform: scale(0.7);
}

/* .clone figure {
  height: 100%;
  object-fit: cover;
  padding-top: 0 !important;
}

.clone .lazy-image {
  height: 100%;
  width: 100%;
  object-fit: cover !important;

}

.clone .lazy-image img {
  height: 100%;
  width: 100%;
  object-fit: cover !important;

} */
</style>
