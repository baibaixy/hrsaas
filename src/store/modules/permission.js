import router, { asyncRoutes, constantRoutes } from '@/router'
export default {
  namespaced: true,
  state: {
    routes: [], //我们自己维护的路由规则，所有路由规则（静态路由+筛选后的动态路由）
    points: []
  },
  mutations: {
    setRoutes(state, routes) {
      state.routes = [...constantRoutes, ...routes]
    },
    setPoints(state, payload) {
      state.points = payload
    }
  },
  actions: {
    filterRoutes(context, roles) {
      const routes = asyncRoutes.filter((item) => {
        console.log(item.meta.id)
        return roles.menus.includes(item.meta.id)
      })
      context.commit('setRoutes', routes)

      router.addRoutes([
        ...routes,
        { path: '*', redirect: '/404', hidden: true }
      ])
    },
    setPointsAction(context, points) {
      context.commit('setPoints', points)
    }
  }
}
