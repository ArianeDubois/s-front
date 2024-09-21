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

    if (pageIndex > 0 && to.fullPath == '/' + children[pageIndex - 1].id) {
        const thumbWidth = prevEl.value.$el.getBoundingClientRect().width;
        const thumbImage = prevEl.value.$el

        cloneLeft.value = thumbImage.cloneNode(true);
        cloneLeft.value.classList.add('transition-clone')
        document.body.appendChild(cloneLeft.value);

        $gsap.to(thumbImage, {
            opacity: 0,
        });

        $gsap.to('header', {
            opacity: 0,
        });

        $gsap.set(cloneLeft.value, {
            position: 'absolute',
            top: thumbImage.getBoundingClientRect().top,
            left: thumbImage.getBoundingClientRect().left,
            right: thumbImage.getBoundingClientRect().right,
            bottom: thumbImage.getBoundingClientRect().bottom,
            width: thumbImage.getBoundingClientRect().width,
            height: thumbImage.getBoundingClientRect().height,
            zIndex: 10,
        });

        const translateValue = (window.innerWidth / 2) - 70 + thumbWidth / 2;
        $gsap.to(navEl.value.parentElement, {
            x: translateValue, duration: 0.4,

        });
        $gsap.to(cloneLeft.value, {
            x: translateValue, duration: 0.4,
            onComplete: () => {
                next();
                console.log('next')
            },
        });
    }

    //Next
    else if (pageIndex >= 0 && to.fullPath == '/' + children[pageIndex + 1].id) {
        const thumbWidth = nextEl.value.$el.getBoundingClientRect().width;
        const thumbImage = nextEl.value.$el

        cloneRight.value = thumbImage.cloneNode(true);
        cloneRight.value.classList.add('transition-clone')

        document.body.appendChild(cloneRight.value);
        navEl.value.parentElement.classList.add('is-transitionning')

        $gsap.to('header', {
            opacity: 0,
        });

        $gsap.set(navEl.value.parentElement, {
            transformOrigin: 'center center'
        });

        var tl = $gsap.timeline({ duration: 0.8 })

        tl.to(navEl.value.parentElement, {
            scale: 0.75,
        });

        tl.to("main", {
            scale: 0.75,
        });
        const imageWidth = parseFloat(thumbImage.querySelector('img').getAttribute('data-width'));
        const imageHeight = parseFloat(thumbImage.querySelector('img').getAttribute('data-height'));

        const containerWidth = thumbImage.getBoundingClientRect().width;
        const containerHeight = thumbImage.getBoundingClientRect().height;


        let scaledWidth, scaledHeight;

        if (imageWidth / imageHeight > containerWidth / containerHeight) {
            scaledWidth = containerWidth;
            scaledHeight = (imageHeight / imageWidth) * containerWidth;
        } else {
            scaledHeight = containerHeight;
            scaledWidth = (imageWidth / imageHeight) * containerHeight;
        }


        const toContain = (containerWidth - scaledWidth);
        console.log(toContain)
        // console.log(- ((window.innerWidth / 2) + (thumbWidth / 2)))

        tl.to(navEl.value.parentElement, {
            x: - ((window.innerWidth - 120 - toContain)),
        });

        tl.to(navEl.value.parentElement, {
            scale: 1,
        });

        tl.to("main", {
            scale: 1,
        }, '-=100%');
        tl.to(cloneRight.value, {
            opacity: 1,
            // onComplete: next
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
    max-height: 100vh;
    object-fit: contain;
    opacity: 0;
    z-index: 10;
    object-position: center;
    margin: 0 100px;
}
</style>
