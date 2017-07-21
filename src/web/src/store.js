import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  users: undefined,
  currentUser: undefined
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  setUser (state, user) {
    state.currentUser = user
  },
  setUsers (state, users) {
    state.users = users
  }
}

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  setUser: ({ commit }, user) => commit('setUser', user),
  setUsers: ({ commit }, users) => commit('setUsers', users)
}

// getters are functions
const getters = {
  currentUser: state => state.currentUser,
  users: state => state.users
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
