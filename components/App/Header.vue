<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const route = useRoute();
const site = useSite();

const listedChildren = computed(() =>
  (site.value?.children ?? []).filter((i) => i.isListed),
);

const showAbout = ref(false);
const showImageInfos = ref(false);

const toggleAbout = () => {
  showAbout.value = !showAbout.value;
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

onMounted(() => {
  if (showImageInfos.value) {
    document.querySelector('body')?.classList.add('infos-is-active');
  }
});
</script>

<template>
  <header class="header">
    <nav class="menu">
      <a href="/">Simon Guittet</a>

      <NuxtLink to="/photography">Projets</NuxtLink>

      <button @click="toggleAbout">À propos</button>

      <button @click="toggleImageInfos">Image infos</button>
    </nav>
  </header>

  <div v-if="showImageInfos" class="overlay-bg" @click="toggleImageInfos"></div>


  <div v-if="showAbout" class="about-overlay" @click="toggleAbout">
    <div class="about-content">
      <div class="col">
        <p>Simon Guittet</p>
        <div>
          <p>Styliste Culinaire,</p>
          <p>Set Designer</p>
        </div>
      </div>

      <div class="col">
        <p>Contact</p>
        <div>
          <p>simonguittet@mail.com</p>
          <p>+ 33 6 73 09 71 01</p>
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
  position: fixed;
  display: flex;
  justify-content: center;
  gap: var(--padding-x);
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  font-family: "Maison Neue";
  font-size: var(--font-base);
  text-transform: uppercase;
  mix-blend-mode: difference
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
  top: 0;
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

.about-content {
  color: black;
  font-size: var(--font-base);
  text-align: center;
  padding: 20px;
  width: 55%;
  text-transform: uppercase;
  display: flex;
  justify-content: space-around;
  /* gap: 60px; */
}

.about-overlay .is-active {
  opacity: 0.8;
}

.overlay-bg {
  position: fixed;
  inset: 0;
  background-color: transparent;
  z-index: 30;
  /* pointer-events: none; */
}

.col {
  display: flex;
  align-items: start;
  gap: 10px;
  text-align: left;
}

.col p {
  display: block;
}
</style>
