max-width: calc(100vw - 200px); */
<script setup lang="ts">
// import { projectsQuery } from '~/queries'
const { $gsap, $ScrollTrigger } = useNuxtApp();

// Explicitly not using `computed` here
const page = usePage().value

// const { data } = await useKql(projectsQuery)

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
                url: true,
                cover: {
                    query: 'page.content.cover.toFile',
                    select: {
                        url: true,
                        alt: true,
                        height: true,
                        width: true,
                    },
                }
            },
        },
    },
})

const children = data.value?.result?.children
const pageIndex = children?.findIndex(({ id }: any) => id === page?.id)
const prevEl = ref(null)
const nextEl = ref(null)
const navEl = ref(null)
const cloneLeft = ref(null)
const cloneRight = ref(null)

onBeforeRouteUpdate((to, from, next) => {
    //Prev

    if (pageIndex > 0 && to.fullPath == '/' + children[pageIndex - 1].id && window.innerWidth > 1023) {
        const thumbWidth = prevEl.value.$el.getBoundingClientRect().width;
        const thumbImage = prevEl.value.$el
        const offsetX = (window.innerWidth - 100) * 0.5


        cloneLeft.value = thumbImage.cloneNode(true);
        cloneLeft.value.classList.add('transition-nav-clone')
        document.body.appendChild(cloneLeft.value);
        navEl.value.parentElement.classList.add('is-transitionning')
        document.body.style.scrollbarWidth = 'none'

        $gsap.to('header', {
            opacity: 0,
        });
        $gsap.to('.infos', {
            opacity: 0,
        });
        $gsap.to('.scroll-cta', {
            opacity: 0,
        });

        var tl = $gsap.timeline({ duration: 0.3 })

        tl.to(navEl.value.parentElement, {
            scale: 0.5,
        });

        tl.to(navEl.value.parentElement, {
            x: ((offsetX)),
        });

        tl.to(thumbImage, {
            scale: 2,
        });
        tl.to(navEl.value.parentElement.querySelector('figure'), {
            transformOrigin: 'left'
        }, "-=100%")
        tl.to(navEl.value.parentElement.querySelector('figure'), {
            scale: 2,
        }, "-=100%");
        tl.to(navEl.value.parentElement.querySelector('figure'), {
            opacity: 0,
        })
        tl.to(cloneLeft.value, {
            opacity: 1,
            onComplete: next
        })

    }

    //Next
    else if (pageIndex >= 0 && to.fullPath == '/' + children[pageIndex + 1].id && window.innerWidth > 1023) {
        const thumbWidth = nextEl.value.$el.getBoundingClientRect().width;
        const thumbImage = nextEl.value.$el
        const offsetX = (window.innerWidth + 100) * 0.5


        cloneRight.value = thumbImage.cloneNode(true);
        cloneRight.value.style.width = `${thumbWidth}px`;
        cloneRight.value.setAttribute('style', 'transform: translateX(0) !important; margin-left: 0 !important;');
        cloneRight.value.style.opacity = '0';
        cloneRight.value.classList.add('transition-nav-clone');

        document.body.appendChild(cloneRight.value);
        navEl.value.parentElement.classList.add('is-transitionning');
        document.body.style.scrollbarWidth = 'none';

        $gsap.to('.infos', {
            opacity: 0,
        });
        $gsap.to('header', {
            opacity: 0,
        });
        $gsap.to('.scroll-cta', {
            opacity: 0,
        });

        $gsap.set(navEl.value.parentElement, {
            transformOrigin: 'center center'
        });

        var tl = $gsap.timeline({ duration: 0.3 })

        tl.to(navEl.value.parentElement, {
            scale: 0.5,
        });

        tl.to(navEl.value.parentElement, {
            x: -((offsetX)),
        });

        tl.to(thumbImage, {
            scale: 2,
        });
        tl.to(navEl.value.parentElement.querySelector('figure'), {
            transformOrigin: 'right'
        }, "-=100%")
        tl.to(navEl.value.parentElement.querySelector('figure'), {
            scale: 2,
        }, '-=100%');

        tl.to(navEl.value.parentElement.querySelector('figure'), {
            opacity: 0,
        })
        tl.to(cloneRight.value, {
            opacity: 1,
            onComplete: next
        })

    } else {
        next()
    }
    // next();
})
</script>

<template>
    <nav class="next-prev" ref="navEl">
        <AppProject ref="prevEl" v-if="pageIndex !== undefined && pageIndex > 0" :project="children[pageIndex - 1]"
            :excerpt="false" :is-left="true" :width="children[pageIndex - 1]?.cover?.width"
            :height="children[pageIndex - 1]?.cover?.height" />
        <AppProject ref="nextEl" v-if="pageIndex !== undefined && pageIndex < children.length - 1"
            :project="children[pageIndex + 1]" :excerpt="false" :width="children[pageIndex - 1]?.cover?.width"
            :height="children[pageIndex - 1]?.cover?.height" />

    </nav>

</template>

<style scoped>
body {
    scroll-behavior: smooth;
}

.next-prev {
    width: 100%;
    height: 100%;
}

.transition-clone {
    position: absolute;
    inset: 0;
    opacity: 0;
    object-fit: contain;
    opacity: 0;
    z-index: 10;
    object-position: center;
    margin: 0;
}
</style>
