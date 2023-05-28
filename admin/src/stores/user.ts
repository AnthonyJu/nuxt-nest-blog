import { authLogin } from '@/apis/login'
import type { LoginInfo } from '@/interfaces/login'
import userApi from '@/apis/system/user'
import { router } from '~/modules/router'

interface UserInfo {
  id: number
  username: string
  nikeName: string
  avatar: string
  role: string
  access_token: string
}

export const useUserStore = defineStore(
  'user',
  () => {
    const isLogin = ref(false)
    const userInfo = ref<UserInfo>()
    const menuStore = useMenuStore()
    const roleStore = useRoleStore()

    function getUserInfo() {
      userApi.one(userInfo.value!.id).then((res) => {
        userInfo.value = {
          ...res.data.data,
          access_token: userInfo.value?.access_token,
        }
      })
    }

    function handleLogin(data: LoginInfo) {
      return authLogin(data).then(async (res) => {
        isLogin.value = true
        userInfo.value = res.data.data
        roleStore.getRoleList()
        await menuStore.getMenu()
        router.replace('/')
      })
    }

    function handleLogout() {
      return new Promise((resolve, _reject) => {
        isLogin.value = false
        userInfo.value = undefined
        router.replace('/login')
        resolve(true)
      })
    }

    return {
      isLogin,
      userInfo,
      getUserInfo,
      handleLogin,
      handleLogout,
    }
  },
  {
    persist: {
      enabled: true,
    },
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
