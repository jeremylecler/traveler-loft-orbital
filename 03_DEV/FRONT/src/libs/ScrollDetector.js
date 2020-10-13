class ScrollDetector {
  constructor () {
    this._dict = {}

    this.callbackTop = this.callbackTop.bind(this)
    this.callbackBottom = this.callbackBottom.bind(this)
  }

  static observe (element, id) {
    element.dataset.id = id

    let o = ScrollDetector.instance.updateObserve(element)
    return o.cb
  }

  static unobserve (id) {
    let s = ScrollDetector.__instance

    if (s._dict[id]) {
      let o = s._dict[id]
      if (o.top) o.top.unobserve(o.element)
      if (o.bottom) o.bottom.unobserve(o.element)
    }
  }

  static refresh () {
    let s = ScrollDetector.instance

    for (let id in s._dict) {
      s.updateObserve(s._dict[id].element, id)
    }
  }

  updateObserve (element) {
    let id = element.dataset.id
    ScrollDetector.unobserve(id)

    let vh = window.innerHeight

    const optionsTop = {
      root: null,
      rootMargin: `${vh}px 0px -${vh}px 0px`,
      threshold: 0
    }

    const optionsBottom = {
      root: null,
      rootMargin: `-${vh}px 0px ${vh}px 0px`,
      threshold: 0
    }

    if (!this._dict[id]) { this._dict[id] = {} }

    this._dict[id].top = new IntersectionObserver(this.callbackTop, optionsTop)
    this._dict[id].bottom = new IntersectionObserver(this.callbackBottom, optionsBottom)
    this._dict[id].element = element
    if (!this._dict[id].cb) { this._dict[id].cb = {} }

    this._dict[id].top.observe(element)
    this._dict[id].bottom.observe(element)

    return this._dict[id]
  }

  callbackTop (entries, observer) {
    const { isIntersecting, intersectionRatio, boundingClientRect, target } = entries[0]
    const { top, bottom } = boundingClientRect

    let id = target.dataset.id
    let p = (Math.floor(intersectionRatio * 100)) + '%'
    let o = this._dict[id]

    if (bottom > -1) {
      if (isIntersecting) {
        o.cb.enter(p)
        o.state = 'enter'
      } else if (o.state === 'enter') {
        o.cb.exit(p)
        o.state = 'exit'
      }
    }
  }

  callbackBottom (entries, observer) {
    const { isIntersecting, intersectionRatio, boundingClientRect, target } = entries[0]
    const { top, bottom } = boundingClientRect

    let id = target.dataset.id
    let p = (Math.floor(intersectionRatio * 100)) + '%'
    let o = this._dict[id]

    if (top < 1) {
      if (isIntersecting) {
        o.cb.enter(p)
        o.state = 'enter'
      } else if (o.state === 'enter') {
        o.cb.exit(p)
        o.state = 'exit'
      }
    }
  }

  static init () {
    ScrollDetector.__instance = new ScrollDetector()
  }

  static get instance () {
    return ScrollDetector.__instance
  }
}

ScrollDetector.__instance = null

export default ScrollDetector
