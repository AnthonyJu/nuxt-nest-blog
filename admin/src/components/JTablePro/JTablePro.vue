<template>
  <div full flex-col>
    <!-- 检索表单 -->
    <JForm
      v-if="formOption"
      v-bind="formOption"
      is-search
      :loading="loading"
      @search="handleSearch"
    >
      <template v-for="{ prop } in formSlots" :key="prop" #[prop]="scope">
        <slot :name="prop" :row="scope.form" />
      </template>

      <template #toolbar>
        <el-button v-if="addNew" type="primary" @click="addFn()">新增</el-button>
        <slot name="toolbar" />
      </template>
    </JForm>

    <!-- 表格数据 -->
    <JTable v-if="tableOption" v-bind="tableOption" :loading="loading" :data="data">
      <template
        v-for="{ prop } in tableSlots.filter((v) => v.prop !== 'control')"
        :key="prop"
        #[prop]="scope"
      >
        <slot :name="prop" :row="scope.row" />
      </template>

      <template v-if="isRestful || tableSlots.find((v) => v.prop === 'control')" #control="scope">
        <slot name="control" :row="scope.row" />

        <el-button v-if="dialogOption" type="primary" link @click="editFn(scope.row)">修改</el-button>
        <el-popconfirm title="确定要删除吗?" @confirm="deleteFn(scope.row.id)">
          <template #reference>
            <el-button type="primary" link>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </JTable>

    <!-- 分页 -->
    <JPagination
      v-if="!noPagenation"
      v-bind="paginationOption"
      v-model:current="current"
      v-model:size="size"
      :loading="loading"
      :total="total"
      @handle-search="handleSearch"
    />

    <!-- 弹窗 -->
    <JDialog
      v-if="dialogOption"
      v-bind="dialogOption"
      v-model:visible="visible"
      v-model:dialogForm="dialogForm"
      :title="title"
      :loading="dialogLoading"
      @on-submit="dialogSubmit"
      @on-closed="initDialogForm"
    >
      <template v-for="{ prop } in dialogSlots" :key="prop" #[prop]="scope">
        <slot :name="`dialog-${prop}`" :row="scope.form" />
      </template>
    </JDialog>
  </div>
</template>

<script setup lang="ts">
interface Props {
  url: string
  isRestful?: boolean
  addNew?: boolean
  formOption?: Record<string, any>
  tableOption?: Record<string, any>
  noPagenation?: boolean
  paginationOption?: Record<string, any>
  dialogOption?: Record<string, any>
  dataFormator?: Function
}
interface Slots {
  prop: string
  label: string
  [key: string]: any
}

const props = withDefaults(defineProps<Props>(), {
  addNew: true,
})
const emit = defineEmits(['onOriginDataChange'])
const API = generateRestfulApi(props.url)

// 计算需要自定义的表单插槽
const formSlots = computed<Slots[]>(() => {
  return props.formOption?.forms.filter((v: any) => v.type === 'slot')
})

// 计算需要自定义的表格插槽
const tableSlots = computed<Slots[]>(() => {
  return props.tableOption?.columns.filter((v: any) => v.slot)
})

// 计算需要自定义的弹窗插槽
const dialogSlots = computed<Slots[]>(() => {
  return props.dialogOption?.forms.filter((v: any) => v.type === 'slot')
})

const current = ref(1)
const size = ref(15)
const total = ref(0)
const loading = ref(false)
const data = ref<any[]>([])

// 检索表单
async function handleSearch(page: number = current.value, params: Record<string, any> = {}) {
  loading.value = true
  const form = JSON.parse(JSON.stringify(params))
  for (const key in form) form[key] = form[key].toString()

  const limit = props.noPagenation ? 0 : size.value
  API.get({ ...form, page, limit })
    .then((res: any) => {
      if (props.dataFormator) data.value = props.dataFormator(res.data.data.data)
      else data.value = res.data.data.data
      total.value = res.data.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

// 定义弹窗
const title = ref('')
const visible = ref(false)
const dialogLoading = ref(false)
const dialogForm = ref<Record<string, any>>({})

// 若是有弹窗，则初始化弹窗表单
if (props.dialogOption) initDialogForm()
function initDialogForm() {
  const form: Record<string, any> = {}
  props.dialogOption!.forms.forEach((item: Record<string, any>) => {
    form[item.prop] = item.value ?? ''
  })
  dialogForm.value = form
}

function addFn() {
  title.value = '新增'
  visible.value = true
}
function editFn(row: Record<string, any>) {
  title.value = '编辑'
  dialogForm.value = JSON.parse(JSON.stringify(row))
  visible.value = true
}
function deleteFn(id: string) {
  const message = ElMessage({
    message: 'loading...',
    icon: 'TODO',
    duration: 0,
  })
  API.delete(id)
    .then(() => {
      ElMessage.success('删除成功')
      handleSearch()
      emit('onOriginDataChange', 'delete')
    })
    .finally(() => {
      message.close()
    })
}
function dialogSubmit() {
  dialogLoading.value = true
  if (dialogForm.value?.id) {
    API.update(dialogForm.value.id, dialogForm.value)
      .then(() => {
        visible.value = false
        ElMessage.success('修改成功')
        handleSearch()
        emit('onOriginDataChange', 'update')
      })
      .finally(() => {
        dialogLoading.value = false
      })
  }
  else {
    API.create(dialogForm.value!)
      .then(() => {
        visible.value = false
        ElMessage.success('新增成功')
        handleSearch()
        emit('onOriginDataChange', 'create')
      })
      .finally(() => {
        dialogLoading.value = false
      })
  }
}

// 若表单不存在，则直接请求数据，否则数据请求将在表单检组建中触发
onMounted(() => {
  if (!props.formOption) handleSearch()
})

// 暴露给父组件的方法
defineExpose({ dialogForm, addFn, data })
</script>
