export const ROLE_URL = '/role'

export interface Role {
  id?: string
  name: string
  description: string
  createTime?: string
  updateTime?: string
}

export default generateRestfulApi(ROLE_URL)
