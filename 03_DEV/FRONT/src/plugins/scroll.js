import ScrollParallax from '@/libs/ScrollParallax'

export default {
  install (Vue, options) {
    const $scroll = {
      active () {
        ScrollParallax.instance.active()
      },
      unactive () {
        ScrollParallax.instance.unactive()
      },
      add (elt, def, before, after, limit, gap, options) {
        ScrollParallax.add(elt, def, before, after, limit, gap, options)
      },
      set (elt, def, before, after, limit, gap, options) {
        ScrollParallax.set(elt, def, before, after, limit, gap, options)
      },
      remove (elt) {
        ScrollParallax.remove(elt)
      },
      get (elt) {
        ScrollParallax.get(elt)
      },
      getInstance () {
        return ScrollParallax.instance
      }
    }

    ScrollParallax.init()

    Vue.prototype.$scroll = $scroll
    Vue.$scroll = $scroll
  }
}
