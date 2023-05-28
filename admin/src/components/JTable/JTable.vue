<template>
  <el-table v-loading="loading" stripe border v-bind="$attrs">
    <!-- 多选列 -->
    <el-tableColumn v-if="selection" type="selection" width="55" align="center" />
    <!-- 序号列 -->
    <el-tableColumn v-if="index" type="index" label="序号" width="55" align="center" />
    <!-- 循环columns -->
    <el-tableColumn v-for="col in columns" :key="col.prop" align="center" min-width="100px" show-overflow-tooltip v-bind="col">
      <template #default="scope">
        <span v-if="col.prop === 'createTime' || col.prop === 'updateTime'">
          {{ useDateFormat(scope.row[col.prop], 'YYYY-MM-DD HH:mm:ss').value }}
        </span>
        <!-- 自定义列内容 -->
        <slot v-if="col.slot" :name="col.prop" :row="scope.row" />
      </template>
    </el-tableColumn>
  </el-table>
</template>

<script setup lang="ts">
interface Props {
  index?: boolean
  selection?: boolean
  columns?: any[]
  loading?: boolean
}

// 默认展示序号列，隐藏多选列
withDefaults(defineProps<Props>(), {
  index: true,
  selection: false,
  loading: false,
})
</script>
