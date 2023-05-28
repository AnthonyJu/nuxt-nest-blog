import { useUserStore } from './user'
import menuAPI from '@/apis/system/menu'
import type { Menu } from '@/apis/system/menu'
import { listToTree } from '@/utils/listToTree'

export interface Menus extends Menu {
  children?: Menu[]
}

export const useMenuStore = defineStore(
  'menu',
  () => {
    const allMenu = ref<Menu[]>([])
    const menu = ref<Menus[]>([])

    function getMenu() {
      const userStore = useUserStore()
      const role = userStore.userInfo!.role

      return menuAPI.get().then((res) => {
        const data: Menu[] = res.data.data.data
        allMenu.value = data.filter(item => item.permission.includes(role))
        menu.value = listToTree(allMenu.value.filter(item => item.index !== 0))
      })
    }

    return {
      menu,
      allMenu,
      getMenu,
    }
  },
  {
    persist: {
      enabled: true,
    },
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
