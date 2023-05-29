<template>
  <div v-html="data?.data.content" />
</template>

<script setup lang='ts'>
import { apiPrefix } from '~~/constants'

const url = useRequestURL()
const { data, pending, execute, error } = await useFetch(`${apiPrefix}/blog${url.pathname}`) as any
</script>

<style lang='scss' scoped></style>
