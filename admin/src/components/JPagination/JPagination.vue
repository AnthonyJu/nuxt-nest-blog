<template>
  <el-pagination
    class="mt-18px self-end"
    :disabled="loading"
    :current-page="current"
    :page-size="size"
    :total="total"
    :layout="layout"
    :background="true"
    :page-sizes="pageSizes"
    v-bind="$attrs"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
interface Props {
  current: number
  size: number
  total: number
  layout?: string
  pageSizes?: number[]
  loading?: boolean
}

// 默认第一页，每页15条
withDefaults(defineProps<Props>(), {
  current: 1,
  size: 15,
  total: 0,
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: () => [15, 30, 50, 100],
})

const emit = defineEmits(['update:current', 'update:size', 'handleSearch'])

/** 当前页变化 */
function handleSizeChange(val: number) {
  emit('update:size', val)
  emit('handleSearch')
}
/** 每页数量变化 */
function handleCurrentChange(val: number) {
  emit('update:current', val)
  emit('handleSearch')
}
</script>
