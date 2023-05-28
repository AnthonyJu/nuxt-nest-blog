<template>
  <JContainer v-loading="loading" class="flex">
    <div flex-1>
      <Toolbar
        ref="toolbar"
        :editor="editorRef"
        :default-config="toolbarConfig"
      />
      <Editor
        v-model="article.content"
        :style="{ height: `${editorHeight}px` }"
        :default-config="editorConfig"
        @on-created="handleCreated"
      />
    </div>
    <div w-386px flex-col gap-10px pl-16px>
      <!-- 文章标题 -->
      <el-input v-model="article.title" placeholder="请输入文章标题" />

      <!-- 文章标签 -->
      <el-select
        v-model="article.tags"

        filterable allow-create multiple
        placeholder="请选择文章标签"
        @change="handleTagChange"
      >
        <el-option
          v-for="item in tagList"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>

      <!-- 文章封面 -->
      <div class="avatar-uploader flex-center" @click="open()">
        <img v-if="article.poster" object="cover" :src="article.poster" block full>
        <div v-else flex-col-center>
          <Iconify icon="ep-upload-filled" class="text-50px text-$el-color-primary" />
          <div mt-16px text-14px text-gray-500>点击上传文章封面</div>
        </div>
      </div>

      <!-- 发表文章 -->
      <el-button type="primary" @click="submit">
        发表文章
      </el-button>
    </div>
  </JContainer>
</template>

<script setup lang='ts'>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor } from '@wangeditor/editor'
import toolbarConfig from './toolbarConfig'
import editorConfig from './editorConfig'
import ArticleApi, { publishArticles } from '@/apis/article/index'
import '@wangeditor/editor/dist/css/style.css'
import type { Tag } from '@/apis/tag/index'
import TagApi, { getAllTags } from '@/apis/tag/index'
import { uploadFile } from '@/apis/upload'

defineOptions({ name: 'article-write' })

const route = useRoute()
const router = useRouter()

// 动态计算编辑器高度
const toolbar = ref()
const { height } = useWindowSize()
const { height: toolbarHeight } = useElementSize(toolbar)
const editorHeight = computed(() => {
  const h = height.value - 140 - toolbarHeight.value
  return h > 300 ? h : 300
})

// 编辑器实例
const editorRef = shallowRef<IDomEditor>()
function handleCreated(editor: IDomEditor) {
  editorRef.value = editor
}

// 文章表单
const article = reactive({ title: '', content: '', tags: [], poster: '' })

// 文章标签
const tagList = ref<Tag[]>([])
useRequest(getAllTags, {
  onSuccess: (res) => {
    tagList.value = res.data.data
  },
})
function handleTagChange(val: string[]) {
  // 如果新添加的标签不存在于标签列表中，则添加到标签列表中
  const newTag = val[val.length - 1]
  if (newTag && !tagList.value.find(item => item.name === newTag)) {
    // 添加到数据库
    TagApi.create({ name: newTag }).then((res) => {
      if (res.data.status === 200) {
        // 添加到标签列表
        tagList.value.push(res.data.data)
      }
    })
  }
}

// 文章封面
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
      article.poster = ''
      reset()
    }
    else {
      article.poster = URL.createObjectURL(files.value[0])
    }
  }
})

// 发表文章
const { loading, run } = useRequest(publishArticles, {
  manual: true,
  onSuccess: () => {
    ElMessage.success('发表成功')
    router.push('/article')
  },
})
async function submit() {
  if (article.title === '') {
    ElMessage.warning('请输入文章标题')
  }
  else if (editorRef.value?.getText() === '' && editorRef.value.isEmpty()) {
    ElMessage.warning('请输入文章内容')
  }
  else if (article.poster === '') ElMessage.warning('请上传文章封面')
  else {
    if (files.value) {
      const res = await uploadFile({ file: files.value[0] })
      article.poster = res.data.data
    }
    const params = { ...article, tags: article.tags.join(',') }
    if (route.query.id) {
      ArticleApi.update(route.query.id as string, params).then((res) => {
        if (res.data.status === 200) {
          ElMessage.success('更新成功')
          router.push('/article')
        }
      })
    }
    else {
      run(params)
    }
  }
}

// 如果是编辑文章，则获取文章内容
if (route.query.id) {
  // 编辑文章
  ArticleApi.one(route.query.id as string).then((res) => {
    if (res.data.status === 200) {
      const { title, content, poster, tags } = res.data.data
      article.title = title
      article.content = content
      article.tags = tags.split(',')
      article.poster = poster
    }
  })
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style lang="scss" scoped>
::v-deep(.w-e-toolbar) {
  border: 1px solid var(--w-e-toolbar-border-color);
  border-radius: 5px 5px 0 0;
}

::v-deep(.w-e-text-container) {
  border: 1px solid var(--w-e-toolbar-border-color);
  border-top: none;
  border-radius: 0 0 5px 5px;
}

::v-deep(.w-e-drop-panel) {
  width: fit-content;
}

.avatar-uploader {
  position: relative;
  width: 100%;
  height: 258px;
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
