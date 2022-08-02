import router from '@/router'
import store from '@/store'

const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  if (token) {
    store.dispatch('user/getUserInfo')
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
