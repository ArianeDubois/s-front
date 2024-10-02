<script setup>
const { $gsap, $ScrollTrigger } = useNuxtApp();
const selectedTag = ref(null); // Tag sélectionné

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
        tags: true,
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

const allTags = ref([]); // Stocker tous les tags uniques

if (page.children) {
  page.children.forEach((child) => {
    if (typeof child.tags === 'string') {
      const childTags = child.tags.split(',').map(tag => tag.trim());

      childTags.forEach((tag) => {
        if (tag && !allTags.value.includes(tag)) {
          allTags.value.push(tag);
        }
      });
    }
  });
}

const leftGridProjects = ref([]);
const rightGridProjects = ref([]);
const onEnter = ref(false);
const reorderedProjects = ref([]);
const projects = ref(null);
const project = ref(null);
const clonedImage = ref(null);
const showImageInfos = ref(false);
const imageWrapper = ref(null);
const filters = ref(null);
const lazyImage = ref(null);


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
const filterProjectsByTag = (tag) => {
  const projectsList = projects.value.querySelectorAll('.project');

  const tl = $gsap.timeline();

  if (selectedTag.value === tag) {
    selectedTag.value = null;

    projectsList.forEach((project) => {
      tl.to('.projects', { scale: 1, duration: 0.01 }, 0);
      tl.to(project, { scale: 1, opacity: 1, duration: 0.2 }, 0);
    });

  } else {
    selectedTag.value = tag;

    projectsList.forEach((project) => {
      const projectTags = project.getAttribute('data-tags')?.split(',').map(tag => tag.trim()) || [];
      $gsap.set(project, { transformOrigin: 'top' });
      $gsap.to('.projects', {
        scale: 0.65, duration: 0.001,
        onComplete: () => {
          $gsap.set('.page', { height: document.querySelector('.projects').getBoundingClientRect().height * 0.65 });
        }
      }, 0);

      $gsap.set('.page', { height: document.querySelector('.projects').getBoundingClientRect().height * 0.65 });

      tl.to('.project', { scale: 0.65, duration: 0.2 }, 0);

      if (projectTags.includes(tag)) {

        tl.to(project, { opacity: 1, duration: 0.2 }, 0);
        tl.to('.project.clone', { opacity: 0.2, duration: 0.2 }, 0);
      }
      else {
        tl.to(project, { opacity: 0.2, duration: 0.2 }, 0);
        tl.to('.project.clone', { opacity: 0.2, duration: 0.2 }, 0);
      }
    });
  }
};


// definePageMeta({
//   pageTransition: {
//     name: 'zoom',
//     onEnter: (el, done) => {
//     },
//     onLeave(el, done) {
//       done();
//     },
//   },
// });

const toggleImageInfos = () => {
  showImageInfos.value = !showImageInfos.value;
};

watch(showImageInfos, (newValue) => {
  if (newValue) {
    document.querySelector('body')?.classList.add('infos-is-active');

  } else {
    document.querySelector('body')?.classList.remove('infos-is-active');
  }
});

const colors = ["#FCDA52", "#8c03fc", "#FE6000", "#9F91C7", "#5EC76A", "#8ae6f2", "#ff0a64"];
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const applyRandomColorToHeader = () => {
  const header = document.querySelector('header');
  const randomColor = getRandomColor();
  if (header) {
    header.style.color = randomColor;
    header.style.transition = "color 0.5s ease";
  }
  const filters = document.querySelector('.filters');

  if (filters) {
    filters.style.color = randomColor;
    filters.style.transition = "color 0.5s ease";
  }
  const infos = document.querySelector('.button-images-infos');

  if (infos) {
    infos.style.color = randomColor;
    infos.style.transition = "color 0.5s ease";
  }
};

onMounted(() => {
  onEnter.value = true;
  applyRandomColorToHeader();
  nextTick(() => {
    lazyImage.value.forEach(img => {
      $gsap.to(img.$el.children[0], {
        opacity: 1,
        duration: 0.3,
        scrollTrigger: {
          trigger: img.$el,
          start: "top center",
          toggleActions: "play none none none",
        },
        ease: "slow(0.7,0.7,false)",
      });
    });
  })
  // if (showImageInfos.value) {
  //   document.querySelector('body')?.classList.add('infos-is-active');
  // }
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
  <button class="button-images-infos" @click="toggleImageInfos">Image infos</button>
  <div v-if="showImageInfos" class="overlay-bg" @click="toggleImageInfos" @mouseenter="toggleImageInfos"></div>


  <div class="page">
    <ul class="projects" v-if="onEnter" ref="projects">
      <li v-for="(project, index) in reorderedProjects" :key="index" :data-slug="`${project.id.split('/')[1]}`"
        :data-tags="project.tags"
        :class="['project', { clone: project.isClone, 'pointer-events-none': project.isClone }]">

        <NuxtLink :to="`/${project.id}`">
          <figure ref="imageWrapper"
            :style="`width: 100%; position: relative;padding-top: ${project?.image?.height / project?.image?.width * 100}%`">
            <ElementLazyImage ref="lazyImage" :src="project?.cover?.url ?? project?.images?.[0].url"
              :lowQualitySrc="project?.cover?.url" :alt="project?.cover?.alt ?? project?.images?.[0]?.alt"
              :sizes="'xs:600px'" />


            <figcaption class="caption">
              <div v-if="project.title">
                Projet: {{ project.title }}
              </div>
              <div v-if="project.clien">
                Client: {{ project.client }}
              </div>
              <div v-if="project.credit">
                Crédit photo: {{ project.credit }}
              </div>
            </figcaption>
          </figure>
        </NuxtLink>
      </li>
    </ul>

    <div class="filters" ref="filters">
      <ul>
        <li v-for="tag in allTags" :key="tag" @click="filterProjectsByTag(tag)"
          :class="{ active: selectedTag === tag }">
          {{ tag }}
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped>
.button-images-infos {
  position: fixed;
  right: 5px;
  text-transform: uppercase;
  font-family: "Maison Neue";
  font-size: var(--font-base);
  text-transform: uppercase;
  mix-blend-mode: difference;
  z-index: 50;
  top: -1px;
  /* color: #8c03fc; */
}


.button-images-infos:hover:before,
.button-images-infos:hover:after {
  opacity: 1;
}

.button-images-infos:before {
  position: absolute;
  transition: opacity 0.1s ease-in;
  left: -8px;
  top: -3px;
  bottom: 0;
  content: '[';
  font-size: 1.2em;
  opacity: 0;
}

.button-images-infos:after {
  position: absolute;
  transition: opacity 0.1s ease-in;
  right: -8px;
  top: -3px;
  bottom: 0;
  content: ']';
  font-size: 1.2em;
  opacity: 0;
}

.pointer-events-none {
  pointer-events: none;
}

.page {
  overflow: hidden;
  font-family: 'Maison Neue';
  margin-bottom: 20px
}

.projects {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--padding-x);
  margin: var(--padding-x) -20%;
  transform: scale(1);
  transform-origin: top;
  transition: transform 0.8s ease-in-out;

}

@media screen and (max-width: 720px) {
  .projects {
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--padding-x-sm);

  }
}

.project {
  object-fit: contain;
  position: relative;
  transform-origin: center;
  font-size: var(--font-base);
  transition: transform 0.2s;
}

figure {
  position: relative;
  overflow: hidden;
}

.title,
.tags {
  text-transform: uppercase;
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
  opacity: 0.6;
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

.icon {
  position: absolute;
  top: -150%;
  left: 50%;
  transform: translateX(-50%);
}

.filters {
  position: relative;
  display: flex;
  position: fixed;
  bottom: 7px;
  left: 5px;
  border-radius: 5px;
  width: 100%;
  opacity: 0.8;
  mix-blend-mode: difference;
  z-index: 100;

}

.filters ul {
  text-transform: uppercase;
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: var(--padding-x);
  justify-content: space-between;
  width: 100%;
  margin: auto;
  /* gap: 60px; */
  z-index: 80;
  transform: translateY(50%);
  font-family: "Maison Neue";
  font-size: var(--font-base);
  text-transform: uppercase;
}

.filters li {
  margin-bottom: 10px;
  cursor: pointer;

}

/* .filters li:nth-child(1) {
  font-family: "Gaya";
  font-size: 0.9em;
}

.filters li:nth-child(2) {
  font-family: "Tobias";
  font-size: 0.9em;
}

.filters li:nth-child(3) {
  font-family: "Mango";
  font-size: 1em;
}

.filters li:nth-child(4) {
  font-family: "Gaya";
  font-size: 0.9em;
}

.filters li:nth-child(5) {
  font-family: "Tobias";
  font-size: 0.9em;
}

.filters li:nth-child(6) {
  font-family: "Mango";
  font-size: 1em;
}

.filters li:nth-child(7) {
  font-family: "Gaya";
  font-size: 0.9em;
}

.filters li:nth-child(8) {
  font-family: "Tobias";
  font-size: 0.9em;
}

.filters li:nth-child(9) {
  font-family: "Mango";
  font-size: 1em;
} */

.filters li.active:before,
.filters li.active:after {
  opacity: 1;
}

.filters li:hover:before,
.filters li:hover:after {
  opacity: 1;
}

.filters li {
  position: relative;
}

.filters li:before {
  position: absolute;
  transition: opacity 0.1s ease-in;
  left: -8px;
  top: -3px;
  bottom: 0;
  content: '[';
  font-size: 1.2em;
  opacity: 0;
}

.filters li:after {
  position: absolute;
  transition: opacity 0.1s ease-in;
  right: -8px;
  top: -3px;
  bottom: 0;
  content: ']';
  font-size: 1.2em;
  opacity: 0;
}
</style>
