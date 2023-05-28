<template>
  <el-dialog v-model="dialogVisible" class="j-dialog" v-bind="$attrs" @closed="handleClose">
    <ElForm ref="formRef" :model="form" :rules="rules" :disabled="loading" v-bind="formOptions">
      <!-- 检索条件 -->
      <el-row :gutter="20">
        <el-col
          v-for="{ span = 24, prop, label, type, options, ...otherProps } in forms"
          :key="prop"
          :span="span"
        >
          <!-- 输入框 -->
          <el-form-item v-if="type === 'input'" :label="label" :prop="prop">
            <el-input v-model="form[prop]" placeholder="请输入" v-bind="otherProps" />
          </el-form-item>

          <!-- 选择器 -->
          <el-form-item v-if="type === 'select'" :label="label" :prop="prop">
            <el-select v-model="form[prop]" placeholder="请选择" clearable w-full v-bind="otherProps">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <!-- 自定义 -->
          <el-form-item v-if="type === 'slot'" :label="label" :prop="prop">
            <slot :name="prop" :form="form" />
          </el-form-item>
        </el-col>
      </el-row>
    </ElForm>
    <template #footer>
      <el-button :disabled="loading" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus'

const props = defineProps<{
  dialogForm?: any
  visible?: boolean
  loading?: boolean
  forms?: Record<string, any>[]
  rules?: Record<string, any>
  formOptions?: Record<string, any>
}>()

const emit = defineEmits(['update:visible', 'update:dialogForm', 'onSubmit', 'onClosed'])

const form = useVModel(props, 'dialogForm', emit)
const dialogVisible = useVModel(props, 'visible', emit)
const formRef = ref<InstanceType<typeof ElForm>>()

function handleClose() {
  emit('onClosed')
  formRef.value!.resetFields()
}
function submit() {
  formRef.value!.validate((valid: boolean) => {
    if (valid) emit('onSubmit')
  })
}
</script>

<style lang="scss">
.j-dialog {
  .el-dialog__body {
    padding: var(--el-dialog-padding-primary) var(--el-dialog-padding-primary) 4px;
  }
}
</style>
