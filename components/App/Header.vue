<script setup lang="ts">
const route = useRoute()
const site = useSite()

const listedChildren = computed(() =>
  (site.value?.children ?? []).filter((i) => i.isListed),
)
</script>

<template>
  <header class="header">
    <NuxtLink class="logo" to="/">
      {{ site.title }}
    </NuxtLink>

    <nav class="menu">
      <NuxtLink v-for="item in listedChildren" :key="item.id" :to="`/${item.id}`" :aria-current="route.path.startsWith(`/${item.id}`) ? 'page' : undefined
        ">
        {{ item.title }}
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  padding: 10px;
  position: fixed;
  display: flex;
  justify-content: center;
  gap: var(--padding-x);
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  font-family: "Maison Neue";
  font-size: 15px;
  text-transform: uppercase;
}

.menu {
  display: flex;
  gap: var(--padding-x);
}
</style>
