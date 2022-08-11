import router from '@/router'
import store from '@/store'

const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token
  if (token) {
    if (!store.state.user.userInfo.userId) {
      //调用用户信息接口
      await store.dispatch('user/getUserInfo')
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
