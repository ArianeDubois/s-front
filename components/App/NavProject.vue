<script setup lang="ts">
import { projectsQuery } from '~/queries'

// Explicitly not using `computed` here
const page = usePage().value

const { data } = await useKql(projectsQuery)
const children = data.value?.result?.children
const pageIndex = children?.findIndex(({ id }: any) => id === page?.id)
</script>

<template>
  <nav class="next-prev">
    <AppProject v-if="pageIndex !== undefined && pageIndex > 0" :project="children[pageIndex - 1]" :excerpt="false"
      :is-left="true" />
    <AppProject v-if="pageIndex !== undefined && pageIndex < children.length - 1" :project="children[pageIndex + 1]"
      :excerpt="false" />
  </nav>
</template>

<style scoped>
.next-prev {
  width: 100%;
  height: 100%;
}
</style>
