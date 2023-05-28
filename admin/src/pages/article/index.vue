<template>
  <JContainer>
    <JTablePro
      is-restful
      :add-new="false"
      :url="ARTICLE_URL"
      :form-option="formOption"
      :table-option="tableOption"
    >
      <template #toolbar>
        <el-button type="primary" @click="$router.push('/article/write')">新增</el-button>
      </template>

      <template #tags="{ row }">
        <el-tag v-for="tag in row.tags.split(',')" :key="tag.id" mx-2px>
          {{ tag }}
        </el-tag>
      </template>

      <template #control="{ row }">
        <el-button
          type="primary"
          link
          @click="$router.push({ path: `/article/write`, query: { id: row.id } })"
        >
          修改
        </el-button>
      </template>
    </JTablePro>
  </JContainer>
</template>

<script setup lang="ts">
import { ARTICLE_URL } from '@/apis/article/index'

defineOptions({ name: 'my-article' })

const formOption = reactive({
  forms: [
    { prop: 'title', label: '标题', type: 'input' },
  ],
})

const tableOption = reactive({
  columns: [
    { prop: 'title', label: '标题' },
    { prop: 'authorName', label: '作者' },
    { prop: 'tags', label: '标签', slot: true },
    { prop: 'createTime', label: '创建时间' },
    { prop: 'updateTime', label: '更新时间' },
    { prop: 'control', label: '操作', width: 120, slot: true },
  ],
})
</script>
