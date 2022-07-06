import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp
  const router = useRouter()
  const route = useRoute()

  vueApp.directive('hoist-html', (el) => {
    if (el.tagName === 'TEMPLATE') {
      el.replaceWith(el.content)
    } else {
      el.replaceWith(...el.children)
    }
  })

  vueApp.directive('handle-anchors', {
    mounted(el) {
      el.addEventListener('click', handleAnchors)
      // window.addEventListener('hashchange', navigate)
    },

    beforeUnmount(el) {
      el.removeEventListener('click', handleAnchors)
      // window.removeEventListener('hashchange', navigate)
    },
  })

  function navigate() {
    if (route.hash) {
      document.querySelector(route.hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function handleAnchors(
    event: MouseEvent & {
      target: HTMLElement
    }
  ) {
    const link = event.target.closest('a')

    if (
      !event.defaultPrevented &&
      link &&
      event.button === 0 &&
      link.target !== '_blank' &&
      link.rel !== 'external' &&
      !link.download &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      const url = new URL(link.href)
      const { origin, pathname: path, hash } = url

      if (origin !== window.location.origin) return
      event.preventDefault()

      if (hash && (!path || path === route.path)) {
        window.history.replaceState({}, '', link.href)
        navigate()
      } else {
        router.push({ path, hash })
      }
    }
  }
})
