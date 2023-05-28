<template>
  <main ref="scroll" class="relative full items-center" overflow="x-hidden y-auto">
    <Header :class="{ header: y > 0 }" />
    <article class="m-auto max-w-70ch w-full p-15px" :style="{ minHeight }">
      <router-view />
    </article>
    <Footer />
    <Background />
  </main>
</template>

<script setup lang="ts">
import Header from './components/header/index.vue'
import Footer from './components/footer.vue'
import Background from './components/background.vue'

const scroll = ref<HTMLElement>()
const { y } = useScroll(scroll)

const { height } = useWindowSize()
const minHeight = computed(() => {
  return `${height.value - 60 - 60 - 30}px`
})
</script>

<style lang="scss" scoped>
.header {
  background-image: radial-gradient(transparent 1px,var(--bg-color) 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
}
</style>
