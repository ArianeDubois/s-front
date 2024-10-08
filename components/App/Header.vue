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
    social: {
      platform: true,
      url: true,
    },
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



  <div :style="{ opacity: showAbout ? 0.8 : 0, pointerEvents: showAbout ? 'auto' : 'none' }" class="about-overlay "
    @click="toggleAbout">
    <div class="about-content">
      <div class="col">
        <p>Simon Guittet</p>
        <div v-html="about.address"></div>
      </div>

      <div class="col">
        <p>Contact</p>
        <div>
          <div v-html="about.email"></div>
          <div v-html="about.phone"></div>
        </div>
      </div>

      <div class="col">
        <p>Instagram</p>
        <p>@lacuisineduzin</p>
      </div>
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
  opacity: 0.8;
  z-index: 100;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: opacity 0.3s ease;
}

@media screen and (max-width: 720px) {
  .about-content {
    font-size: var(--font-base-xs);
  }
}

.about-content {
  font-size: var(--font-base);
  text-align: center;
  padding: 20px;
  width: 55%;
  text-transform: uppercase;
  display: flex;
  justify-content: space-around;

}

.about-overlay .is-active {
  opacity: 0.8;
}

.overlay-bg {
  position: fixed;
  inset: 0;
  background-color: transparent;
  z-index: 30;
}

.col {
  display: flex;
  align-items: start;
  gap: 10px;
  text-align: left;
  color: inherit !important;
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
</style>
