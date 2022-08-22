import router, { asyncRoutes } from '@/router'
import store from '@/store'

const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token
  if (token) {
    if (!store.state.user.userInfo.userId) {
      //调用用户信息接口
      const { roles } = await store.dispatch('user/getUserInfo')
      console.log(roles.menus)
      // console.log(asyncRoutes)
      await store.dispatch('permission/filterRoutes', roles)
      await store.dispatch('permission/setPointsAction', roles.points)
      next(to.path)
    }
    if (to.path === '/login') return next('/')
    next()
  } else {
    const isClude = whiteList.includes(to.path)
    if (isClude) {
      next()
    } else {
      next('/login')
    }
  }
})
