<template>
  <div class="sticky left-0 top-0 z-10 h-60px w-full flex-center">
    <div class="full max-w-100ch flex-b-c">
      <!-- Logo -->
      <div class="logo ml-15px h-40px w-110px" />
      <div class="flex-center">
        <!--  Nav -->
        <nav v-if="width > 500" class="flex gap-15px text-14px">
          <router-link
            v-for="item in navList"
            :key="item.path"
            :to="item.path"
            class="hover:text-#c784ed dark:hover:text-#57f0e6"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Theme Switch -->
        <ThemeSwitch mx-15px />

        <!-- DropDown -->
        <DropDown v-if="width <= 500" :list="navList" mr-15px />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeSwitch from './components/theme-switch.vue'
import DropDown from './components/drop-down.vue'

const { width } = useWindowSize()

const navList = [
  {
    name: '首页',
    path: '/',
  },
  {
    name: '归档',
    path: '/',
  },
  {
    name: '密语',
    path: '/cryptolalia',
  },
  {
    name: '实验室',
    path: '/',
  },
  {
    name: '留言板',
    path: '/',
  },
  {
    name: '关于',
    path: '/about',
  },
]
</script>

<style lang="scss" scoped>
.logo {
  background-image: url('@/assets/logo.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 110px;
}

.dark .logo {
  background-image: url('@/assets/logo-dark.png');
}
</style>
