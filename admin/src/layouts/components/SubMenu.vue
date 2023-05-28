<template>
  <template v-for="menu in children" :key="menu.path">
    <el-sub-menu v-if="menu.children?.length" :index="menu.routePath">
      <template #title>
        <Iconify v-if="menu.icon" mr-5px h-16px w-16px :icon="menu.icon" />
        <span>{{ t(`menu.${menu.routeName}`) }}</span>
      </template>
      <SubMenu :children="menu.children" />
    </el-sub-menu>

    <el-menu-item v-else :key="menu.routePath!" :index="menu.routePath">
      <Iconify v-if="menu.icon" mr-5px h-16px w-16px :icon="menu.icon" />
      <span>{{ t(`menu.${menu.routeName}`) }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { Menus } from '@/stores/menu'

defineProps<{ children: Array<Menus> }>()
const { t } = useI18n()
</script>
