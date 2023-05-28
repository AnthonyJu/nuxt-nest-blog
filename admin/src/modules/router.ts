import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import type { App } from 'vue'
import NProgress from 'nprogress'
import pages from '~pages'

const routes = setupLayouts(pages)

export const router = createRouter({ routes, history: createWebHashHistory() })

const WhiteList: string[] = ['/login', '/401', '/404']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (WhiteList.includes(to.path)) next()
  else if (!useUserStore().isLogin) next('/login')
  else if (!pages.some(el => el.path === to.path)) next('/404')
  else if (!useMenuStore().allMenu.find(item => item.routePath === to.path)) next('/401')
  else next()
})

router.afterEach(() => {
  NProgress.done()
})

export default (app: App) => app.use(router)
