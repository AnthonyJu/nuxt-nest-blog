<template>
  <div v-html="data?.data.content" />
</template>

<script setup lang='ts'>
import { apiPrefix } from '~~/constants'

const route = useRoute()
const { data, pending, execute, error } = await useFetch(`${apiPrefix}/blog/article/${route.params.id}`) as any
</script>

<style lang='scss' scoped></style>
