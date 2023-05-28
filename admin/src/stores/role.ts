import roleAPI from '@/apis/system/role'
import type { Option } from '@/interfaces/option'

export const useRoleStore = defineStore('role', () => {
  const roleList = ref<Option[]>([])

  function getRoleList() {
    roleAPI.get().then((res) => {
      const data = res.data.data.data
      roleList.value = data.map((item: any) => ({ label: item.name, value: item.id!.toString() }))
    })
  }

  return {
    roleList,
    getRoleList,
  }
},
{
  persist: {
    enabled: true,
  },
},
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useRoleStore, import.meta.hot))
