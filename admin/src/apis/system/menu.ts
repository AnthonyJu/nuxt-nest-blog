export const MENU_URL = '/menu'

export interface Menu {
  id?: number
  parentId?: string
  index: number
  icon: string
  name: string
  routeName: string
  routePath: string
  permission: string[]
}

export default generateRestfulApi(MENU_URL)
