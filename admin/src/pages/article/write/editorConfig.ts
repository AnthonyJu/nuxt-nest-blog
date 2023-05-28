import type { IEditorConfig } from '@wangeditor/editor'
import { uploadFile } from '@/apis/upload'

type InsertFnType = (url: string, alt?: string, href?: string) => void

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    fontSize: {
      fontSizeList: ['14px', '16px', '18px', '20px', '24px'],
    },
    codeSelectLang: {
      // TODO
      // codeLangs: [],
    },
    uploadImage: {
      customUpload,
      base64LimitSize: 100 * 1024,
      allowedFileTypes: ['image/*'],
    },
    uploadVideo: {
      customUpload,
      allowedFileTypes: ['video/*'],
    },
  },
}

async function customUpload(file: File, insertFn: InsertFnType) {
  const res = await uploadFile({ file })
  insertFn(location.origin + res.data.data)
}

export default editorConfig
