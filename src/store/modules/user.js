import { login, getUserInfoApi, getUserDetail } from '@/api/user'
import { resetRouter } from '@/router'
import { setTokenTime } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    async getToken({ commit }, payload) {
      // console.log(payload)
      const res = await login(payload)

      // console.log(data)
      // const res = 'asfdsgfdgsfd'
      commit('setToken', res)
      setTokenTime()
    },
    async getUserInfo({ commit }) {
      const userInfo = await getUserInfoApi()
      const userDatail = await getUserDetail(userInfo.userId)
      // const res = { name: '张三' }
      commit('setUserInfo', { ...userInfo, ...userDatail })
      return userInfo
    },
    logout({ commit }) {
      commit('setToken', ''), commit('setUserInfo', {})
      resetRouter()
      commit('permission/setRoutes', [], { root: true })
    }
  }
}
