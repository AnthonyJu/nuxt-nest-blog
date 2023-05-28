export const USER_URL = '/user'

export interface Role {
  id?: string
  username: string
  password?: string
  nikeName?: string
  role: string
  avatar?: string
  createTime?: string
  updateTime?: string
}

export default generateRestfulApi(USER_URL)
