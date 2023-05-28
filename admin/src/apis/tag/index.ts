import type { Res } from '@/interfaces/res'

export const Tag_URL = '/tag'

export interface Tag {
  id?: number
  name: string
  createTime?: string
  updateTime?: string
}

export function getAllTags(): Promise<Res<Tag[]>> {
  return request({
    url: `${Tag_URL}/all`,
    method: 'get',
  })
}

export default generateRestfulApi(Tag_URL)
