<template>
  <ElForm ref="formRef" :model="form" :rules="rules" inline v-bind="$attrs">
    <!-- 检索条件 -->
    <template v-for="{ prop, label, type, options, ...otherProps } in forms" :key="prop">
      <!-- 输入框 -->
      <el-form-item v-if="type === 'input'" :label="label" :prop="prop">
        <el-input v-model="form[prop]" placeholder="请输入" clearable v-bind="otherProps" />
      </el-form-item>

      <!-- 选择器 -->
      <el-form-item v-if="type === 'select'" :label="label" :prop="prop">
        <el-select v-model="form[prop]" placeholder="请选择" clearable v-bind="otherProps">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 自定义 -->
      <el-form-item v-if="type === 'slot'" :label="label" :prop="prop">
        <slot :name="prop" :form="form" />
      </el-form-item>
    </template>

    <!-- 搜索与重置 -->
    <el-form-item v-if="isSearch" id="formBtn" class="!mr-0">
      <el-button :loading="loading" :icon="Search" type="primary" @click="search">搜索</el-button>
      <el-button :icon="RefreshLeft" @click="formRef!.resetFields()">重置</el-button>
    </el-form-item>

    <!-- 工具栏 -->
    <el-form-item class="!mr-0" float-right pl-80px>
      <slot name="toolbar" />
    </el-form-item>
  </ElForm>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus'
import { RefreshLeft, Search } from '@element-plus/icons-vue'

interface Props {
  isSearch?: boolean
  loading?: boolean
  forms?: Record<string, any>[]
  rules?: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['search'])

// 定义表单ref
const form: Record<string, any> = reactive({})
const formRef = ref<InstanceType<typeof ElForm>>()

// 组装表单数据
props.forms!.forEach((item) => {
  form[item.prop] = item.value
})

// 搜索
function search() {
  // 校验表单，校验不通过则不执行搜索
  formRef.value?.validate().then(() => {
    emit('search', 1, form)
  })
}

// 默认渲染结束后执行搜索
onMounted(() => {
  search()
})
</script>
