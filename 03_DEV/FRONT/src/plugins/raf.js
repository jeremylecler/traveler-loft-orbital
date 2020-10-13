import raf from 'raf'

let rafs = {}

export default {
  install (Vue, options) {
    const $raf = {

      init () {
        rafs = {}
        Vue.prototype.$raf.animate()
      },

      create (cb) {
        const id = Math.round(Math.random() * 1000000000)
        rafs[id] = cb
        return id
      },

      cancel (id) {
        if (rafs[id]) { delete rafs[id] }
      },

      animate () {
        for (const e in rafs) {
          rafs[e]()
        }
        raf(Vue.prototype.$raf.animate)
      }
    }

    Vue.prototype.$raf = $raf
    Vue.$raf = $raf
  }
}
