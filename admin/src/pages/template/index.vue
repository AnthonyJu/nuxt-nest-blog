<template>
  <JContainer>
    <JTablePro
      is-restful
      :url="Template_URL"
      :form-option="formOption"
      :table-option="tableOption"
      :dialog-option="dialogOption"
    />
  </JContainer>
</template>

<script setup lang="ts">
import { Template_URL } from '@/apis/template/index'

defineOptions({ name: 'template-manager' })

const formOption = reactive({
  forms: [
    { prop: 'filed', label: '字段', type: 'input' },
  ],
})

const tableOption = reactive({
  columns: [
    { prop: 'filed', label: '字段' },
    { prop: 'createTime', label: '创建时间' },
    { prop: 'updateTime', label: '更新时间' },
    { prop: 'control', label: '操作', width: 150, slot: true },
  ],
})

const dialogOption = reactive({
  title: '标签',
  width: '50%',
  forms: [
    { prop: 'filed', label: '字段', type: 'input' },
  ],
})
</script>
