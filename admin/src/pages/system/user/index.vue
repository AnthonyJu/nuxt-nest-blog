<template>
  <JContainer>
    <JTablePro
      is-restful
      :url="USER_URL"
      :form-option="formOption"
      :table-option="tableOption"
      :dialog-option="dialogOption"
    >
      <template #avatar="scope">
        <el-avatar class="bg-$el-color-primary align-middle" :src="scope.row.avatar || avatar" />
      </template>

      <template #role="scope">
        <el-tag type="success">
          {{ roleStore.roleList.find((v) => v.value === scope.row.role)?.label }}
        </el-tag>
      </template>
    </JTablePro>
  </JContainer>
</template>

<script setup lang="ts">
import { USER_URL } from '@/apis/system/user'
import avatar from '@/assets/avatar.png'

defineOptions({ name: 'system-user' })

// 角色options
const roleStore = useRoleStore()
if (!roleStore.roleList.length) roleStore.getRoleList()

const formOption = reactive({
  forms: [
    { prop: 'username', label: '用户名称', type: 'input' },
    { prop: 'role', label: '权限标志', type: 'select', options: roleStore.roleList, multiple: true },
  ],
})

const tableOption = reactive({
  columns: [
    { prop: 'avatar', label: '用户名头像', slot: true },
    { prop: 'username', label: '用户名称' },
    { prop: 'role', label: '用户角色', slot: true },
    { prop: 'createTime', label: '创建时间' },
    { prop: 'updateTime', label: '更新时间' },
    { prop: 'control', label: '操作', width: 160, slot: true },
  ],
})

const dialogOption = reactive({
  width: 400,
  formOptions: { labelWidth: 80 },
  forms: [
    { prop: 'username', label: '用户名称', type: 'input' },
    { prop: 'role', label: '用户角色', type: 'select', options: roleStore.roleList },
  ],
  rules: {
    username: [{ required: true, message: '请输入角色名称', trigger: ['change'] }],
    role: [{ required: true, message: '请输入角色名称', trigger: ['change'] }],
  },
})
</script>

<style lang="scss">
.avatar-uploader {
  .avatar {
    display: block;
    width: 80px;
    height: 80px;
  }

  .el-upload {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }

  .el-icon.avatar-uploader-icon {
    width: 80px;
    height: 80px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>
