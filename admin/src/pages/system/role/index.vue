<template>
  <JContainer>
    <JTablePro
      is-restful
      :url="ROLE_URL"
      :form-option="formOption"
      :table-option="tableOption"
      :dialog-option="dialogOption"
      @on-origin-data-change="onOriginDataChange"
    />
  </JContainer>
</template>

<script setup lang="ts">
import { ROLE_URL } from '@/apis/system/role'

defineOptions({ name: 'system-role' })

const roleStore = useRoleStore()
function onOriginDataChange() {
  roleStore.getRoleList()
}

const formOption = reactive({
  forms: [
    { prop: 'name', label: '角色名称', type: 'input' },
  ],
})

const tableOption = reactive({
  columns: [
    { prop: 'name', label: '角色名称' },
    { prop: 'createTime', label: '创建时间' },
    { prop: 'updateTime', label: '更新时间' },
    { prop: 'control', label: '操作', width: 160, slot: true },
  ],
})

const dialogOption = reactive({
  width: 465,
  formOptions: { labelWidth: 80 },
  forms: [
    { prop: 'name', label: '角色名称', type: 'input', span: 20 },
  ],
  rules: {
    name: [{ required: true, message: '请输入角色名称', trigger: ['change'] }],
  },
})
</script>
