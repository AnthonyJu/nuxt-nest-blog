<template>
  <div class="j-icon-select my-8px flex-col-center">
    <div w-240px>
      <el-input
        v-model="query"
        size="small"
        placeholder="请输入关键字"
        clearable
        @keydown.enter="seachIcon"
      >
        <template #append>
          <el-button @click="seachIcon">
            <Iconify v-show="loading" icon="eos-icons:loading" />
            <Iconify v-show="!loading" icon="majesticons:search-line" />
          </el-button>
        </template>
      </el-input>
    </div>
    <el-scrollbar v-show="iconList.length" height="200px" mt-20px>
      <el-space wrap>
        <Iconify
          v-for="item in iconList"
          :key="item"
          :icon="item"
          cursor-pointer
          class="hover:text-$el-color-primary"
          style="font-size: 28px;"
          @click="handleClick(item)"
        />
      </el-space>
    </el-scrollbar>
    <el-empty v-show="iconList.length === 0" :image-size="80" />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['select'])

const query = ref('')
const iconList = ref<string[]>([])
const loading = ref(false)

function seachIcon() {
  if (!query.value) {
    ElMessage.warning('请输入关键字')
    return
  }
  loading.value = true
  axios
    .get(`https://api.iconify.design/search?query=${query.value}&limit=1000`)
    .then((res) => {
      iconList.value = res.data.icons
    })
    .finally(() => {
      loading.value = false
    })
}

function handleClick(icon: string) {
  emit('select', icon)
}
</script>

<style lang="scss">
.j-icon-select {
  .el-input-group--append > .el-input__wrapper {
    padding-left: 16px;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }

  .el-input-group__append {
    padding: 0 16px 0 14px;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
}
</style>
