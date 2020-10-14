import raf from 'raf'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      el: null,
      rect: null,
      parallaxActive: true,
      rafHandle: null,
      position: {x: 0, y: 0},
      realPosition: {x: 0, y: 0},
      ratio: 30,
      indice: 0.05,
      isActive: false,
      isVisible: false,
      timeReplace: null,
      scrollTopUpdated: 0
    }
  },
  computed: {
    ...mapState([
      'mousePosition',
      'scrollTop'
    ])
  },
  methods: {
    animate () {
      const top = this.rect.top - (this.scrollTop - this.scrollTopUpdated)

      this.position.x = this.isActive ? Math.floor((this.mousePosition.x - (this.rect.left + (this.rect.width / 2))) / this.ratio) : 0
      this.position.y = this.isActive ? Math.floor((this.mousePosition.y - (top + (this.rect.height / 2))) / this.ratio) : 0

      const dx = (this.position.x - this.realPosition.x) * this.indice
      const dy = (this.position.y - this.realPosition.y) * this.indice

      if (this.isVisible) {
        this.realPosition.x += dx
        this.realPosition.y += dy
      } else {
        this.realPosition.x = this.position.x
        this.realPosition.y = this.position.y
      }

      if (top > -50 && top < window.innerHeight + 50) {
        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) { this.update() }
        this.isVisible = true
      } else {
        this.isVisible = false
      }
    },
    update () {
      const tr = 'translate3d( ' + this.realPosition.x + 'px, ' + this.realPosition.y + 'px, 0px )'
      this.el.style.webkitTransform = tr
      this.el.style.MozTransform = tr
      this.el.style.msTransform = tr
      this.el.style.OTransform = tr
      this.el.style.transform = tr
    },
    replace () {
      this.rect = this.el.getBoundingClientRect()
      this.scrollTopUpdated = this.scrollTop
    },
    startParallax () {
      this.el = this.el ? this.el : this.$el
      this.replace()

      // if (this.$tools.isTouchDevice()) return

      this.destroyParallax()
      this.isActive = true
      // this.onMouseMove()
      this.rafHandle = this.$raf.create(this.animate)
      window.addEventListener('resize', this.replace)

      setInterval(() => {
        this.replace()
      }, 100)

      if (this.timeReplace) clearInterval(this.timeReplace)
      this.timeReplace = setInterval(() => {
        this.replace()
      }, 2000)
    },
    stopParallax () {
      this.isActive = false
      if (this.timeReplace) clearInterval(this.timeReplace)
      this.timeReplace = null
      window.removeEventListener('resize', this.replace)
    },
    destroyParallax () {
      this.stopParallax()
      if (this.timeReplace) clearInterval(this.timeReplace)
      this.timeReplace = null
      if (this.rafHandle) { this.$raf.cancel(this.rafHandle) }
    }
  },
  mounted () {
    // if (!this.$tools.isTouchDevice()) { this.startParallax() }
    this.$nextTick( () => {
      if(this.parallaxActive)
        this.startParallax()
    })
  },
  beforeDestroy () {
    this.destroyParallax()

    this.realPosition.x = 0
    this.realPosition.y = 0

    this.position.x = 0
    this.position.y = 0
  }
}
