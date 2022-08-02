import { login } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: ''
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
    }
  },
  actions: {
    async getToken({ commit }, payload) {
      // console.log(payload)
      const res = await login(payload)

      // console.log(data)
      // const res = 'asfdsgfdgsfd'
      commit('setToken', res)
    }
  }
}
