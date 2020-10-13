export default {
  data () {
    return {
      _isVisible: false,
      _isEnter: false
    }
  },
  methods: {

    onScrollUpdate (position) {

      if (!this.$el) return
      this.rect = this.$el.getBoundingClientRect()
      if (!this.rect) return
      const rect = this.rect
      let p = -rect.top / (rect.height - window.innerHeight)
      let pv = -(rect.top - window.innerHeight) / (rect.height + window.innerHeight)

      let isEnter = p > 0 && p < 1
      let isVisible = pv > 0 && pv < 1
      if (isVisible && !this._isVisible) { this._isVisible = true; this.onVisible() }
      if (!isVisible && this._isVisible) { this._isVisible = false; this.onUnVisible() }
      if (isEnter && !this._isEnter) { this._isEnter = true; this.onEnter() }
      if (!isEnter && this._isEnter) { this._isEnter = false; this.onExit() }

      p = Math.min(1, Math.max(0, p))
      pv = Math.min(1, Math.max(0, pv))
      this.onProgress(p, pv)
    },
    onProgress (p, pv) {

    },
    onVisible () {

    },
    onUnVisible () {

    },
    onEnter () {

    },
    onExit () {

    }
    // onResize () {
    //   this.rect = this.$el.getBoundingClientRect()
    // }
  },
  mounted () {
    // window.addEventListener('resize', this.onResize)
    // this.onResize()
    this.$scroll.getInstance().on('update', this.onScrollUpdate)
  },
  beforeDestroy () {
    // window.removeEventListener('resize', this.onResize)
    this.$scroll.getInstance().off('update', this.onScrollUpdate)
  }
}
