<script setup lang="ts">
defineProps<{
  project?: Record<string, any>
  excerpt?: boolean
}>()

</script>

<template>
  <article class="project-excerpt">
    <NuxtLink :to="`/${project?.id}`">
      <header>
        <figure class="img" style="--w: 16; --h: 9">
          <img :src="project?.cover?.url ?? project?.images?.[0]?.url" alt="" />
        </figure>

        <h2 class="project-excerpt-title">{{ project?.title }}</h2>
      </header>

      <div v-if="excerpt" class="project-excerpt-text">
        {{ project?.text }}
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.project-excerpt {
  line-height: 1.5em;
}

.project-excerpt header {
  margin-bottom: 1.5rem;
}

.project-excerpt figure {
  margin-bottom: 0.5rem;
}

.project-excerpt-title {
  font-weight: 600;
}

.project-excerpt-date {
  color: var(--color-text-grey);
}
</style>
