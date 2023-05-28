<template>
  <JContainer>
    <JTablePro
      ref="JTableProRef"
      is-restful
      no-pagenation
      :url="MENU_URL"
      :form-option="formOption"
      :table-option="tableOption"
      :dialog-option="dialogOption"
      :data-formator="dataFormator"
      @on-origin-data-change="handleOriginDataChange"
    >
      <!-- table slot start -->
      <template #icon="scope">
        <Iconify :icon="scope.row.icon" />
      </template>

      <template #name="scope">
        <span v-if="scope.row.routeName"> {{ t(`menu.${scope.row.routeName}`) }}</span>
      </template>

      <template #permission="scope">
        <el-tag v-for="id in scope.row.permission" :key="id" type="success" mx-2px>
          {{ roleStore.roleList.find((v) => v.value === id)?.label }}
        </el-tag>
      </template>

      <template #control="scope">
        <el-button type="primary" link @click="addWithParentId(scope.row.id)">新增</el-button>
      </template>
      <!-- table slot end -->

      <!-- dialog slot start -->
      <template #dialog-parentId="scope">
        <el-cascader
          v-model="scope.row.parentId"
          class="w-full"
          :options="menuOptions"
          :props="{ checkStrictly: true, emitPath: false }"
          placeholder="请选择"
          clearable
        />
      </template>

      <template #dialog-index="scope">
        <el-input-number v-model="scope.row.index" :min="0" />
        <el-tooltip content="排序为0，则不在侧边栏展示" placement="top">
          <Iconify ml-10px icon="ep:info-filled" />
        </el-tooltip>
      </template>

      <template #dialog-icon="scope">
        <el-input
          ref="virtualRef"
          v-model="scope.row.icon"
          readonly
          placeholder="请选择菜单图标"
          @blur="handleBlur"
        >
          <template #append><Iconify cursor-pointer :icon="scope.row.icon || 'fe:search-plus'" /></template>
        </el-input>
      </template>

      <template #dialog-routePath="scope">
        <el-select
          v-model="scope.row.routePath"
          class="w-full"
          placeholder="请选择"
          no-data-text="无新路由"
          @change="handleRoutePathChange"
        >
          <el-option
            v-for="item in routeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
    <!-- dialog slot end -->
    </JTablePro>

    <el-popover
      ref="popoverRef"
      v-model:visible="visible"
      :width="350"
      :virtual-ref="virtualRef"
      trigger="click"
      placement="bottom"
      virtual-triggering
    >
      <JIconSelect @select="handleIconSelect" />
    </el-popover>
  </JContainer>
</template>

<script setup lang="ts">
import type { Menu } from '@/apis/system/menu'
import { MENU_URL } from '@/apis/system/menu'
import { listToTree } from '@/utils/listToTree'
import paths from '~pages'

defineOptions({ name: 'system-menu' })

const { t, locale } = useI18n()
const menuStore = useMenuStore()
function handleOriginDataChange() {
  menuStore.getMenu()
}

// 新增子菜单，默认选中父级id
const JTableProRef = ref<any>()
function addWithParentId(id: number) {
  JTableProRef.value.dialogForm.parentId = id.toString()
  JTableProRef.value.addFn()
}

// popover图标选择
const visible = ref(false)
const virtualRef = ref()
const popoverRef = ref()
function handleBlur() {
  unref(popoverRef)?.popperRef?.delayHide?.()
}
function handleIconSelect(icon: string) {
  JTableProRef.value.dialogForm.icon = icon
  visible.value = false
}

// 角色options
const roleStore = useRoleStore()
if (!roleStore.roleList.length) roleStore.getRoleList()

// 路由options
const originRoute = ref<Menu[]>([])
const whiteList = ['/login', '/401', '/:notFound(.*)*']
const routeOptions = computed(() => {
  const filterPaths = paths
    .filter(item => !whiteList.includes(item.path))
    .map(item => ({ label: item.path, value: item.path, name: item.name }))

  filterPaths.forEach((item) => {
    const splitValue = item.value.split('/')
    if (splitValue.length > 2) {
      for (let i = 1; i < splitValue.length; i++) {
        const value = splitValue.slice(0, i + 1).join('/')
        if (!filterPaths.find(v => v.value === value))
          filterPaths.push({ label: value, value, name: value.replace('/', '').replaceAll('/', '-') })
      }
    }
  })

  // 返回按照路由地址的第二个参数的第一个字母排序
  return filterPaths
    .filter(item => !originRoute.value.find((v: Menu) => v.routePath === item.value))
    .reverse()
    .sort((a, b) => a.value.split('/')[1].charCodeAt(0) - b.value.split('/')[1].charCodeAt(0))
})

// 路由地址改变
function handleRoutePathChange(value: string) {
  const item = routeOptions.value.find(v => v.value === value)
  JTableProRef.value.dialogForm.routeName = item?.name
}

// 格式化数据
function dataFormator(data: Menu[]) {
  originRoute.value = JSON.parse(JSON.stringify(data))
  return listToTree(data)
}

// 菜单options
const menuOptions = ref<any[]>([])
watch([originRoute, locale], ([val]) => {
  const list = val.map(item => ({
    parentId: item.parentId,
    label: t(`menu.${item.routeName}`),
    value: item.id?.toString(),
  }))
  menuOptions.value = listToTree(list, 'value')
})

// 定义搜索表单
const formOption = reactive({
  forms: [
    { prop: 'routePath', label: '路由地址', type: 'input' },
    { prop: 'permission', label: '权限标志', type: 'select', options: roleStore.roleList, multiple: true },
  ],
})

// 定义表格
const tableOption = reactive({
  index: false,
  rowKey: 'id',
  columns: [
    { prop: 'index', label: '菜单排序', width: 120 },
    { prop: 'icon', label: '菜单图标', slot: true },
    { prop: 'name', label: '菜单名称', slot: true },
    { prop: 'routeName', label: '路由名称' },
    { prop: 'routePath', label: '路由地址' },
    { prop: 'permission', label: '权限标志', slot: true },
    { prop: 'control', label: '操作', width: 180, slot: true },
  ],
})

// 定义弹窗
const dialogOption = reactive({
  width: 700,
  formOptions: { labelWidth: 80 },
  forms: [
    { prop: 'parentId', label: '上级菜单', type: 'slot', span: 12 },
    { prop: 'index', label: '菜单排序', type: 'slot', value: 1, span: 12 },
    { prop: 'icon', label: '菜单图标', type: 'slot', span: 12 },
    { prop: 'routePath', label: '路由地址', type: 'slot', span: 12 },
    {
      prop: 'routeName',
      label: '路由名称',
      type: 'input',
      placeholder: '选择路由地址自动生成',
      readonly: true,
      span: 12,
    },
    {
      prop: 'permission',
      label: '权限标志',
      type: 'select',
      value: [],
      options: roleStore.roleList,
      multiple: true,
      span: 12,
    },
  ],
  rules: {
    index: [{ required: true, message: '请输入菜单排序', trigger: ['change'] }],
    icon: [{ required: true, message: '请选择菜单图标', trigger: ['change'] }],
    name: [{ required: true, message: '请输入菜单名称', trigger: ['change'] }],
    routeName: [{ required: true, message: '请选择路由地址', trigger: ['change'] }],
    routePath: [{ required: true, message: '请选择路由地址', trigger: ['change'] }],
    permission: [{ required: true, message: '请选择权限标志', trigger: ['change'] }],
  },
})
</script>
