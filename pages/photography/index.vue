<script setup>
const { $gsap, } = useNuxtApp();
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
        client: true,
        credit: true,
        color: true,
        cover: {
          query: 'page.content.cover.toFile.resize(900)',
          select: {
            url: true,
            alt: true,
            height: true,
            width: true,
          },
        },
        image: {
          query: 'page.images.sortBy("sort", "asc").first.resize(900)',
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

const allTags = ref([]);
await preloadComponents('ElementLazyImage')

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
const resizeHeight = ref(false);


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
        if (children.length % 2 !== 0) {
          oddProjects.push(children[0]);
        }
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

    $gsap.set('.page', {
      height: 'auto', onComplete: () => {
        resizeHeight.value = true
      }
    },);

  } else {
    selectedTag.value = tag;

    projectsList.forEach((project) => {
      const projectTags = project.getAttribute('data-tags')?.split(',').map(tag => tag.trim()) || [];
      $gsap.set(project, { transformOrigin: 'top' });
      $gsap.to('.projects', {
        scale: 0.65, duration: 0.001,
      }, 0);

      if (resizeHeight.value == false) {
        $gsap.set('.page', {
          height: document.querySelector('.projects').getBoundingClientRect().height * 0.65, onComplete: () => {
            resizeHeight.value = true
          }
        });
      }
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

const colors = ["#8c03fc", "#FE6000", "#9F91C7", "#5EC76A", "#8ae6f2", "#ff0a64"];
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
  const about = document.querySelector('.about-content');

  if (about) {
    about.style.color = randomColor;
    about.style.transition = "color 0.5s ease";
  }

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
})


onBeforeRouteLeave((to, from, next) => {
  if (window.innerWidth >= 720) {
    projects.value.classList.add('pointer-event-none');

    if (to.name.startsWith('photography')) {
      const project = projects.value.querySelector(`[data-slug="${to.params['id'][0]}"]:not(.clone)`);
      const imgbBCR = project.querySelector('img').getBoundingClientRect();
      const otherProjects = projects.value.querySelectorAll('.project');
      clonedImage.value = project.querySelector('.high-quality').cloneNode(true);
      clonedImage.value.style.position = "absolute"
      clonedImage.value.style.top = `${imgbBCR.top + window.scrollY}px`;
      clonedImage.value.style.left = `${imgbBCR.left}px`;
      clonedImage.value.style.width = `${imgbBCR.width}px`;
      clonedImage.value.style.height = `${imgbBCR.height}px`;
      clonedImage.value.style.zIndex = "10";
      clonedImage.value.style.opacity = "1";
      clonedImage.value.classList.add('transition-clone');
      document.body.appendChild(clonedImage.value);



      // $gsap.set(clonedImage.value, {
      //   position: 'absolute',
      //   top:imgbBCR.top + window.scrollY
      //   left: imgbBCR.left,
      //   width: imgbBCR.width,
      //   height: imgbBCR.height,
      //   zIndex: 10,
      //   opacity: 1,
      //   onComplete: () => {
      //     console.log(clonedImage.value)
      //   }
      // });


      otherProjects.forEach(otherProject => {
        if (otherProject !== project.closest('.project')) {
          $gsap.to(otherProject, { opacity: 0, duration: 0.15 });
        }
      });

      if (project.querySelector('.low-quality')) {
        $gsap.set('.low-quality', { opacity: 0 });
        $gsap.set(project.querySelector('.high-quality'), { opacity: 1 });
      }


      const margin = window.innerWidth >= 720 ? 200 : 20;


      const scaleX = (window.innerWidth - margin) / imgbBCR.width;

      const scaleY = window.innerHeight / imgbBCR.height;
      const scale = Math.min(scaleX, scaleY);


      const x = (window.innerWidth / 2) - (imgbBCR.left + (imgbBCR.width / 2));
      const y = (window.innerHeight / 2) - (imgbBCR.top + (imgbBCR.height / 2));


      var tl = $gsap.timeline()
      // var tl = $gsap.timeline({ delay: 0.25 })

      // tl.to(clonedImage.value, {
      //   opacity: 1,
      // })
      tl.to(project.querySelector('img:not(.transition-clone)'), {
        opacity: 0,
        // delay: 0.5
      })
      tl.to(clonedImage.value, {
        duration: 0.5,
        x: x,
        y: y,
        scale: scale,
        ease: "slow(0.7,0.7,false)",

        onComplete: () => {
          window.scrollTo(0, 0);

          $gsap.set(clonedImage.value, {
            top: imgbBCR.top
          })
          next();
        },
      }, "-=80%");
    }
  } else {
    next();

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
            :style="`width: 100%; position: relative;padding-top: ${project?.cover?.height / project?.cover?.width * 100}%`">
            <!-- <ElementLazyImage ref="lazyImage" :is-loading="true" :is-preload="true" :width="'100%'" :height="'100%'"
              :src="project?.cover?.url ?? project?.images?.[0].url" :lowQualitySrc="project?.cover?.url"
              :alt="project?.cover?.alt ?? project?.images?.[0]?.alt"
              :sizes="'25vw sm: 25vw md: 30vw lg: 30vw xl: 30vw'" /> -->
            <!-- <div class="lazy-image">
              <NuxtImg ref="imageRef" :src="src" :alt="alt" class="high-quality" :class="{ 'loaded': loaded }"
                @load="onLoad" format="webp" :width="width" :height="height" quality="80" :sizes="sizes"
                :loading="isLoading ? 'lazy' : 'eager'" :preload="isPreload" />
              <NuxtImg ref="lowQualityImageRef" :src="lowQualitySrc" :alt="alt" :style="{ 'opacity: 0': loaded }"
                class="low-quality" @load="onLowQualityLoad" format="webp" :width="auto" :height="auto" quality="10"
                sizes="xs:10px" :preload="isPreload" />
            </div> -->

            <div class="lazy-image" ref="lazyImage">
              <img :src="project?.cover?.url" :alt="project?.cover?.alt ?? project?.images?.[0]?.alt" loading="lazy"
                :srcset="`
                ${project?.cover?.url}?w=320 320w,
                ${project?.cover?.url}?w=640 640w,
                ${project?.cover?.url}?w=768 768w,
                ${project?.cover?.url}?w=1024 1024w,
                ${project?.cover?.url}?w=1280 1280w,
                ${project?.cover?.url}?w=1536 1536w
              `" sizes="(max-width: 640px) 20vw, (min-width: 641px) 25vw" style="width: 100%; height: auto;" />
            </div>


            <!-- <ElementLazyImage v-else :is-preload="false" :is-loading="true" ref="lazyImage"
              :height="project.cover.height" :width="project.cover.width"
              :src="project?.cover?.url ?? project?.images?.[0].url" :lowQualitySrc="project?.cover?.url"
              :alt="project?.cover?.alt ?? project?.images?.[0]?.alt" :sizes="'25vw sm:25vw md:30vw lg:30vw xl:30vw'" /> -->


            <figcaption class="caption" :style='{ color: project.color }'>
              <div v-if="project.title">
                Projet: {{ project.title }}
              </div>
              <div v-if="project.client">
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
  font-family: "Bebas";
  font-size: var(--font-base);
  text-transform: uppercase;
  mix-blend-mode: difference;
  z-index: 50;
  top: 2px;
}


@media screen and (max-width: 720px) {
  .button-images-infos {
    font-size: var(--font-base-xs);
  }
}

@media screen and (max-width: 720px) {
  .button-images-infos {
    display: none;
  }
}

.button-images-infos:hover:before,
.button-images-infos:hover:after {
  opacity: 1;
}

.button-images-infos:before {
  position: fixed;
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
  font-family: 'Bebas';
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
    gap: var(--padding-x-sm);
    margin: var(--padding-x) -30%;

  }
}

.project {
  object-fit: contain;
  position: relative;
  transform-origin: center;
  font-size: var(--font-base);
  transition: transform 0.2s;
}

@media screen and (max-width: 720px) {
  .project {
    font-size: var(--font-base-xs);
  }
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
  width: 25%;
  font-size: var(--font-base);
  text-transform: uppercase;
  z-index: -1;
}

@media screen and (max-width: 720px) {
  .caption {
    font-size: var(--font-base-xs);
  }
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
  bottom: 0;
  left: 5px;
  right: 5px;
  border-radius: 5px;
  opacity: 0.8;
  mix-blend-mode: difference;
  z-index: 90;
  transform: translateY(-50%);
}

.filters ul {
  text-transform: uppercase;
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 0 var(--padding-x);
  justify-content: space-between;
  width: 100%;
  margin: auto;
  /* gap: 60px; */
  flex-wrap: wrap;
  z-index: 80;
  transform: translateY(50%);
  font-family: "Bebas";
  font-size: var(--font-base);
  text-transform: uppercase;
}


@media screen and (max-width: 720px) {
  .filters ul {
    font-size: var(--font-base-xs);
    width: auto;
  }

  .filters {
    width: auto;
  }
}

.filters li {
  cursor: pointer;
}

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
