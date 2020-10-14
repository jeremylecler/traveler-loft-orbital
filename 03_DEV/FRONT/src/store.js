import Vue from 'vue'
import Vuex from 'vuex'
import * as MUTATION from '@/config/const.mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mousePosition: {x: 0, y: 0},
    scrollTop: 0,
  },
  mutations: {
    [MUTATION.SET_MOUSE_POSITION] (state, pos) {
      state.mousePosition = pos
    },
    [MUTATION.SET_SCROLL_TOP] (state, top) {
      state.scrollTop = top
    }
  },
  actions: {
    setMousePosition ({ state, commit }, pos) {
      commit(MUTATION.SET_MOUSE_POSITION, pos)
    },
    setScrollTop({ state, commit }, top) {
      commit(MUTATION.SET_SCROLL_TOP, top)
    }
  },
  getters: {
    
  }
})
