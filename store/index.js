export const state = () => ({
  storeIdLists: [],
  userType: '',
  email: '',
  message: ''
})

export const mutations = {
  setStoreIdLists (state, storeIdLists) {
    state.storeIdLists = storeIdLists
  },
  changeMessage(state, message) {
    state.message = message
}
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }) {
    await dispatch('storeDispatchFunc')
  },
  async storeDispatchFunc ({ commit }) {
    // const res = await this.$axios.get('/api/auth/applications/')
    // commit('setStoreIdLists', res.data)
  }
}