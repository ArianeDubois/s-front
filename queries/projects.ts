import type { KirbyQuerySchema } from '#nuxt-kql'

export const projectsQuery: KirbyQuerySchema = {
  query: 'page("photography")',
  select: {
    title: true,
    intendedTemplate: true,
    subheadline: true,
    children: {
      query: 'page.children.listed',
      select: {
        id: true,
        title: true,
        tags: 'page.tags.split(",")',
        text: 'page.text.toBlocks.excerpt(280)',
        published: 'page.date.toDate',
        cover: {
          query: 'page.content.cover.toFile',
          select: ['id', 'url'],
        },
        images: {
          query: 'page.images',
          select: ['id', 'uuid', 'url', 'alt'],
        },
      },
    },
  },
}
