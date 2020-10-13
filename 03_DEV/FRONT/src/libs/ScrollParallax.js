import EventEmitter from 'tiny-emitter'
import raf from 'raf'

class ScrollParallax extends EventEmitter {
  constructor () {
    super()

    this.update = this.update.bind(this)
    this.animate = this.animate.bind(this)
    this.resize = this.resize.bind(this)
    this.unactive = this.unactive.bind(this)
    this.active = this.active.bind(this)
    // this.get = this.get.bind(this);
    // this.set = this.set.bind(this);
    // this.add = this.add.bind(this);
    this._elts = []
  }

  static add (elt, def, before, after, limit, gap, options) {
    if (!elt) return

    if (limit == null) { limit = 2 }
    if (gap == null) { gap = 0 }

    ScrollParallax.instance._elts.push({
      elt: elt,
      'default': ScrollParallax.getProp(def),
      before: ScrollParallax.getProp(before),
      after: ScrollParallax.getProp(after),
      limit: limit,
      gap: gap,
      options: options,
      top: 0
    })
  }

  static set (elt, def, before, after, limit, gap, options) {
    if (limit == null) { limit = 2 }
    if (gap == null) { gap = 0 }

    let d = ScrollParallax.get(elt)
    if (d) {
      d['default'] = ScrollParallax.getProp(def)
      d.before = ScrollParallax.getProp(before)
      d.after = ScrollParallax.getProp(after)
      d.limit = limit
      d.gap = gap
      d.options = options
    } else {
      ScrollParallax.add(elt, def, before, after, limit, gap, options)
    }

    if (this._isActive) { ScrollParallax.instance.update(1, true) }
  }

  static remove (elt) {
    // ScrollParallax.set(elt, {}, {}, {})

    let ref = ScrollParallax.instance._elts
    let len = ref.length
    let r = null
    for (let i = 0; i < len; i++) {
      r = ref[i]
      if (r.elt === elt) {
        elt.style.webkitTransform = null
        elt.style.MozTransform = null
        elt.style.msTransform = null
        elt.style.OTransform = null
        elt.style.transform = null
        elt.style.opacity = null
        ScrollParallax.instance._elts.splice(i, 1)
        return
      }
    }
    return null
  }

  static get (elt) {
    let ref = ScrollParallax.instance._elts
    let len = ref.length
    let r = null
    for (let i = 0; i < len; i++) {
      r = ref[i]
      if (r.elt === elt) {
        return r
      }
    }
    return null
  }

  static getProp (obj) {
    let props = ['x', 'y', 'opacity', 'rotate']
    let len = props.length
    let p = null
    for (let i = 0; i < len; i++) {
      p = props[i]
      if (obj[p] == null) {
        if (p !== 'opacity') {
          obj[p] = 0
        }
      }
    }
    return obj
  }

  active () {
    if (this._isActive) {
      return
    }
    this._isActive = true
    this.scrollY = 0

    this.container = window
    this.resize()
    this.update()
    this.requestId = raf(this.animate)

    window.addEventListener('resize', this.resize)
  }

  unactive () {
    if (!this._isActive) {
      return
    }
    this._isActive = false
    if (this.requestId != null) {
      if (this.requestId) { raf.cancel(this.requestId) }
    }

    window.removeEventListener('resize', this.resize)
  }

  resize () {
    // let results = []
    let len = this._elts.length
    let r = null
    for (let i = 0; i < len; i++) {
      r = this._elts[i]
      r.top = r.elt.getBoundingClientRect().top + this.container.scrollTop
      // results.push(r.height = r.elt.offsetHeight)
    }

    this.update(0, true)
    // return results
  }

  animate () {
    this.update(0.3)
    return this.requestId = window.requestAnimationFrame(this.animate)
  }

  update (coeff, force = false) {
    this.wh = window.innerHeight

    var d, el, i, len, p, pA, pAOld, prc, r, ref, results, s, so, sr, stop, sx, sy, tr, x, y
    if (coeff == null) {
      coeff = 1
    }

    stop = false

    var s = this.container.scrollTop

    if (Math.abs(s - this.scrollY) < 0.02 && !force) return

    this.scrollY = s

    // let cf = this.scrollTop - this.scrollY
    let cf = 0
    ref = this._elts
    // results = []
    var dep
    for (i = 0, len = ref.length; i < len; i++) {
      r = ref[i]
      el = r.elt

      dep = el
      if (r.options && r.options.depend != null) {
        dep = r.options.depend
      }

      // const cTop = -this.scrollY + r.top

      // el.setAttribute('data-top', el.getBoundingClientRect().top)
      // el.setAttribute('data-cTop', cTop)

      p = 1 - (((dep.getBoundingClientRect().top + dep.offsetHeight / 2) + cf) / window.innerHeight) * 2
      // p = 1 - (((cTop + dep.offsetHeight / 2) + cf) / window.innerHeight) * 2
      p += r.gap
      pA = Math.max(0, Math.min(r.limit, Math.abs(p)))
      d = r.before
      if (p > 0) {
        d = r.after
      }
      pAOld = pA
      prc = 0
      if (d.prc != null) {
        prc = d.prc
      }
      pA = Math.max(0, (pA - prc) / (1 - prc))
      x = d.x
      y = d.y
      if (typeof x === 'string' && dep.parentNode) {
        x = (parseInt(x) / 100) * dep.parentNode.offsetWidth
      }
      if (typeof y === 'string' && dep.parentNode) {
        y = (parseInt(y) / 100) * dep.parentNode.offsetHeight
      }

      sx = pA * (x - r['default'].x) + r['default'].x
      sy = pA * (y - r['default'].y) + r['default'].y

      sr = pA * (d.rotate - r['default'].rotate) + r['default'].rotate
      so = Math.max(0, pA * (d.opacity - r['default'].opacity) + r['default'].opacity)
      tr = 'translate3d( ' + Math.round(sx) + 'px, ' + Math.round(sy) + 'px, 0) rotate( ' + sr + 'deg )'
      el.style.webkitTransform = tr
      el.style.MozTransform = tr
      el.style.msTransform = tr
      el.style.OTransform = tr
      el.style.transform = tr
      if (d.opacity != null) {
        el.style.opacity = so
        // results.push(el.style.filter = 'alpha(opacity=' + (so * 100) + ')')
      } else {
        // results.push(void 0)
      }
    }

    this.emit('update', window.pageYOffset)
    // return results
  }

  emitUpdate () {
    this.emit('update', window.pageYOffset)
  }

  position (scrollTop) {
    this.scrollTop = scrollTop
    if (!this._isActive) {
      return
    }
    this.wh = window.innerWidth
    return this.scrollTop
  }

  static init () {
    ScrollParallax.__instance = new ScrollParallax()
  }

  static get instance () {
    return ScrollParallax.__instance
  }
}

ScrollParallax.__instance = null

export default ScrollParallax
