<script setup lang="ts">
import '~/assets/css/main.css'
import '~/assets/css/medium-zoom.css'


</script>

<template>
  <Html lang="en">

  <Head>
    <Link rel="icon" href="/favicon.ico" type="image/x-icon" />
  </Head>

  <Body>
    <AppHeader />

    <main class="main">
      <NuxtPage />
    </main>

  </Body>

  </Html>
</template>

<style>
/* .infos-is-active .overlay-bg {
  position: absolute;
  inset: 0;
  background-color: white;
  z-index: 30;
  opacity: 0;
  pointer-events: none;
}

.infos-is-active .overlay-bg {
  opacity: 0.8;
} */
</style>
