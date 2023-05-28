<template>
  <div>
    <el-card class="w-50%">
      <template #header>
        <div flex-b-c>
          <span>个人信息</span>
          <el-button type="primary" link @click="visible = true">
            <Iconify icon="ep:edit" />
          </el-button>
        </div>
      </template>
      <el-space>
        <el-avatar
          class="bg-$el-color-primary"
          :src="userStore.userInfo?.avatar || avatar"
          :size="80"
        />
        <div flex-col>
          <div p-6px>
            <span>用户名：</span>
            <span>{{ userStore.userInfo?.username }}</span>
          </div>
          <div p-6px>
            <span>用户身份：</span>
            <span>{{ role }}</span>
          </div>
        </div>
      </el-space>
    </el-card>
    <JDialog
      v-bind="dialogOption"
      v-model:visible="visible"
      v-model:dialogForm="dialogForm"
      title="修改个人信息"
      :loading="dialogLoading"
      @on-submit="handleSubmit"
      @on-closed="resetFile"
    >
      <template #avatar>
        <div class="avatar-uploader flex-center" @click="open()">
          <Iconify
            v-if="avatarSrc"
            class="delete-icon text-red-400 hover:text-red-600"
            icon="ep:delete"
            @click.stop="resetFile"
          />
          <img v-if="avatarSrc" :src="avatarSrc" class="block h-100px w-100px">
          <div v-else class="icon-box flex-center"><div icon="ep:plus" /></div>
        </div>
      </template>
      <template #oldPassword="scope">
        <el-input
          v-model="scope.form.oldPassword"
          type="password"
          placeholder="请输入原密码"
          autocomplete="new-password"
          show-password
        />
      </template>
      <template #newPassword="scope">
        <el-input
          v-model="scope.form.newPassword"
          type="password"
          placeholder="请输入新密码"
          autocomplete="new-password"
          show-password
        />
      </template>
    </JDialog>
  </div>
</template>

<script setup lang='ts'>
import userApi from '@/apis/system/user'
import avatar from '@/assets/avatar.png'
import { uploadAvatar } from '@/apis/upload'

defineOptions({ name: 'personal' })

const userStore = useUserStore()
const roleStore = useRoleStore()
if (!roleStore.roleList.length) roleStore.getRoleList()

const role = computed(() => {
  const role = roleStore.roleList.find(item => item.value === userStore.userInfo?.role)
  return role?.label ?? '未知'
})

const visible = ref(false)
const dialogLoading = ref(false)
const dialogForm = ref({
  username: userStore.userInfo?.username,
  oldPassword: '',
  newPassword: '',
})

function validateNewPassword(rule: any, value: any, callback: any) {
  const oldPassword = dialogForm.value.oldPassword
  if (oldPassword === '' && value === '') callback()
  else if (oldPassword === '') callback(new Error('请先输入原密码'))
  else if (value === '') callback(new Error('请输入新密码'))
  else if (value.length < 5) callback(new Error('密码长度不能小于5位'))
  else if (value.length > 10) callback(new Error('密码长度不能大于10位'))
  else if (value === oldPassword) callback(new Error('新密码不能与原密码相同'))
  else callback()
}
function validateUsername(rule: any, value: any, callback: any) {
  if (value.length < 2) callback(new Error('用户名长度不能小于2位'))
  else if (value.length > 8) callback(new Error('用户名长度不能大于8位'))
  else callback()
}
const dialogOption = reactive({
  width: 380,
  formOptions: { labelWidth: 65 },
  forms: [
    {
      type: 'slot',
      label: '头像',
      prop: 'avatar',
      span: 24,
    },
    {
      type: 'input',
      label: '用户名',
      prop: 'username',
      span: 24,
    },
    {
      type: 'slot',
      label: '原密码',
      prop: 'oldPassword',
      span: 24,
    },
    {
      type: 'slot',
      label: '新密码',
      prop: 'newPassword',
      span: 24,
    },
  ],
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'change', validator: validateUsername }],
    newPassword: [{ trigger: ['change', 'blur'], validator: validateNewPassword }],
  },
})

// 头像
const file = ref<File>()
const avatarSrc = computed(() => {
  if (file.value) return URL.createObjectURL(file.value)
  return userStore.userInfo?.avatar
})
const { files, open, reset } = useFileDialog({ accept: 'image/*', multiple: false })
watch(files, () => {
  if (files.value?.length) {
    let flag = false
    let message = ''
    if (!files.value[0].type.includes('image')) {
      flag = true
      message = '上传头像只能是图片格式!'
    }
    if (files.value[0].size > 2 * 1024 * 1024) {
      flag = true
      message = '上传头像大小不能超过 2MB!'
    }
    if (flag) {
      ElMessage.error(message)
      reset()
      return
    }
    file.value = files.value[0]
  }
})

// 重置与提交
function resetFile() {
  reset()
  file.value = undefined
}
async function handleSubmit() {
  const params: Record<string, any> = {
    username: dialogForm.value.username,
  }
  if (dialogForm.value.oldPassword) {
    params.newPassword = dialogForm.value.newPassword
    params.oldPassword = dialogForm.value.oldPassword
  }
  if (file.value) {
    const res = await uploadAvatar({ file: file.value!, rmFile: userStore.userInfo?.avatar })
    params.avatar = res.data.data
  }
  dialogLoading.value = true
  userApi.update(userStore.userInfo!.id, params).then(() => {
    visible.value = false
    ElMessage.success('修改成功')
    userStore.getUserInfo()
  }).finally(() => {
    dialogLoading.value = false
  })
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);

  .delete-icon {
    position: absolute;
    top: 3px;
    right: 3px;
    display: none;
    font-size: 16px;
    cursor: pointer;
  }

  &:hover {
    border-color: var(--el-color-primary);

    .delete-icon {
      display: block;
    }
  }
}
</style>
