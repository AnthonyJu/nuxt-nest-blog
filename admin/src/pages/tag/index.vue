<template>
  <JContainer>
    <JTablePro
      is-restful
      :url="Tag_URL"
      :form-option="formOption"
      :table-option="tableOption"
      :dialog-option="dialogOption"
    />
  </JContainer>
</template>

<script setup lang="ts">
import { Tag_URL } from '@/apis/tag/index'

defineOptions({ name: 'tag-manager' })

const formOption = reactive({
  forms: [
    { prop: 'name', label: '标签名称', type: 'input' },
  ],
})

const tableOption = reactive({
  columns: [
    { prop: 'name', label: '标签名称' },
    { prop: 'createTime', label: '创建时间' },
    { prop: 'updateTime', label: '更新时间' },
    { prop: 'control', label: '操作', width: 150, slot: true },
  ],
})

const dialogOption = reactive({
  title: '标签名称',
  width: '400px',
  forms: [
    { prop: 'name', label: '字段', type: 'input' },
  ],
})
</script>
