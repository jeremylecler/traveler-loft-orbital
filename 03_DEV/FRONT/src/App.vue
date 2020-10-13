<template>
  <div id="Site">

    <transition name="map">
      <Map ref="map" v-show="$route.name != 'home'" @map-ready="$refs.loader.onMapReady()" />
    </transition>

    <main role="main" id="Main">
      <router-view ref="currentView" v-if="isLoaded" key="view" />
      <transition name="fade" mode="out-in">
        <Loader ref="loader" v-if="!isLoaded" key="loader" @load-complete="onLoadAllCompleted" />
      </transition>
    </main>

    <Header ref="header" v-if="isLoaded" />
  </div>
</template>

<script>

import { mapGetters, mapState, mapActions } from 'vuex'

import vhCheck from 'vh-check'
import FastClick from 'fastclick'

import LocalSwitcher from '@/components/LocalSwitcher'
import Map from '@/components/partials/Map'
import Header from '@/components/partials/Header'
import Loader from '@/components/partials/Loader'

export default {
  components: { 
    LocalSwitcher,
    Map,
    Header,
    Loader
  },
  data () {
    return {
      cache: null,
      isLoaded: false
    }
  },
  methods: {
    ...mapActions([
      'setMousePosition',
      'setScrollTop'
    ]),
    onLoadAllCompleted(files)
    {
      this.cache = files
      this.isLoaded = true
    },
    onScroll(e)
    {
      const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
      this.setScrollTop(scrollTop)
    },
    onResize(){
      this.$nextTick(() => {
        vhCheck({ 
          cssVarName: 'vh',
          force: true,
          bind: true
        })
      })
    }
  },
  mounted () {
    if ('addEventListener' in document) {
      document.addEventListener('DOMContentLoaded', () => {
        FastClick.attach(document.body)
      }, false)
    }

    var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && !navigator.userAgent.match('CriOS')
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    var isIE = navigator.userAgent.indexOf('MSIE ') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)
    var isEdge = navigator.userAgent.indexOf('Edge') > 0

    if (isSafari) { document.body.classList.add('safari') }
    if (isFirefox) { document.body.classList.add('firefox') }
    if (isIE) { document.body.classList.add('ie') }
    if (isEdge) { document.body.classList.add('edge') }

    window.addEventListener('resize', this.onResize)
    window.addEventListener('orientationchange', this.onResize)
    this.onResize()

    this.$raf.init()
    this.$scroll.active()

    // ACTIVE MOUSE PARALLAX
    if (this.$tools.isTouchDevice()) {
      window.addEventListener('devicemotion', (e) => {
        const accel = e.accelerationIncludingGravity
        this.setMousePosition({x: accel.x * 50, y: accel.y * 50})
      })
    }
    else {
      window.addEventListener('mousemove', (e) => {
        this.setMousePosition({x: e.clientX, y: e.clientY})
      })
    }

    document.body.addEventListener('scroll', this.onScroll)
  }

}
</script>

<style lang="stylus">

@import './styles/all'
@import './styles/settings'
@import './styles/global'
@import './styles/animations'
@import './styles/swiper-bundle'

// GENERIC
global-reset()
reset-html5()

</style>
