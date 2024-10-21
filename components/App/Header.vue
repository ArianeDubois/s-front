<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const route = useRoute();
const site = useSite();


const { data: aboutData } = await useKql({
  query: 'page("about")',
  select: {
    title: true,
    address: true,
    email: true,
    phone: true,
    description: true,
    social: 'page("about").social.toStructure()'

  },
});

const about = computed(() => aboutData?.value?.result);

const listedChildren = computed(() =>
  (site.value?.children ?? []).filter((i) => i.isListed),
);

const showAbout = ref(false);
const showImageInfos = ref(false);

const toggleAbout = () => {
  showAbout.value = !showAbout.value;
};

</script>

<template>
  <header class="header">
    <a href="/photography" class="title">
      <h1>Simon Guittet</h1>
    </a>

    <nav class="menu">
      <a href="/" class="menu-item">Gallerie</a>

      <NuxtLink class="menu-item" to="/photography">Projets</NuxtLink>

      <button class="menu-item" @click="toggleAbout">À propos</button>
    </nav>
  </header>



  <div :style="{ opacity: showAbout ? 0.9 : 0, pointerEvents: showAbout ? 'auto' : 'none' }" class="about-overlay "
    @click.self="toggleAbout">

    <div class="icon">
      <ElementIconPiment />
    </div>

    <div class="about-content">

      <div class="col" v-html="about.address"></div>


      <div class="col">
        <div>
          <a :href="`mailto:${about.email}`">
            {{ about.email }}
          </a>
          <div v-html="about.phone"></div>
        </div>
      </div>

      <div class="col social" v-if="about && about.social && about.social.length">
        <div v-for="link in about.social" :key="link.url">
          <a :href="link.url" target="_blank">{{ link.platform.trim() }}</a>
        </div>
      </div>
    </div>

    <div class="description">
      <div v-html="about.description"></div>
    </div>


  </div>
</template>

<style scoped>
.header {
  padding: 0px;
  padding-right: 5px;
  position: fixed;
  display: flex;
  justify-content: center;
  gap: var(--padding-x);
  z-index: 50;
  top: 2px;
  left: 0;
  right: 0;
  font-family: "Bebas";
  font-size: var(--font-base);
  text-transform: uppercase;
  mix-blend-mode: difference;
  /* color: #8c03fc; */
}

@media screen and (max-width: 720px) {
  .header {
    justify-content: flex-end;
    font-size: var(--font-base-xs);
  }
}

.header .title {
  flex: 1;
  position: absolute;
  top: 0;
  left: 5px;
}

button {
  text-transform: uppercase;
}

.menu {
  display: flex;
  gap: var(--padding-x);
}

.about-overlay {
  position: fixed;
  top: -1px;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.description {
  text-align: center;
  font-size: var(--font-base);
  max-width: 500px;
  padding: 0 20px;
  /* color: inherit !important; */
}

.icon {
  color: inherit !important;

}

@media screen and (max-width: 720px) {
  .about-content {
    font-size: var(--font-base-xs);
  }
}

.about-content {
  font-size: var(--font-base);
  text-align: center;
  padding: 30px;
  width: 55%;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
}

@media screen and (max-width: 1256px) {
  .about-content {
    justify-content: space-around;
    width: 80%;
  }
}

@media screen and (max-width: 850px) {
  .about-overlay .is-active {
    justify-content: center;
  }

  .about-overlay {
    gap: 30px;
  }

  .about-content {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .col {
    flex-direction: column;
    text-align: center !important;
    align-items: center !important;
  }

  .description {
    font-size: var(--font-base);
  }
}

.about-overlay .is-active {
  opacity: 0.9;
}

.overlay-bg {
  position: fixed;
  inset: 0;
  background-color: transparent;
  z-index: 30;
}

@media screen and (min-width: 850px) {
  .col {
    gap: 10px;
  }
}

.col {
  display: flex;
  justify-content: center;
  margin: auto;
  align-items: start;
  text-align: center;
  /* color: inherit !important; */
  flex: 1;

}


.col p {
  display: block;
}

.menu-item:hover:before,
.menu-item:hover:after {
  opacity: 1;
}

.menu-item {
  position: relative;
}

.menu-item:before {
  position: absolute;
  transition: opacity 0.1s ease-in;
  left: -8px;
  top: -2px;
  bottom: 0;
  content: '[';
  font-size: 1.2em;
  opacity: 0;
}

.menu-item:after {
  position: absolute;
  transition: opacity 0.1s ease-in;
  right: -8px;
  top: -2px;
  bottom: 0;
  content: ']';
  font-size: 1.2em;
  opacity: 0;
}

.col.social {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
</style>
