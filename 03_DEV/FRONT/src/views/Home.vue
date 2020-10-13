<template>
  <div id="Home" class="Page Home" data-view>
    
    <div class="Home_background">
      <transition name="blur" appear>
        <div :key="currentContinent" class="Home_background_media">
          <MouseParallax :r="-30" class="Home_background_media_back" :style="{ backgroundImage: 'url(/assets/images/medias/' + currentContinent + '-cover.png)' }"></MouseParallax>
        </div>
      </transition>
      <div class="Home_background_overlay"></div>
    </div>

    <section class="Section Section_double">
      <div class="Section_col">
        <div class="Section_wrapper">
          <h2><span class="translate">WHERE</span><small class="translate">are we going today ?</small></h2>
          <p class="big translate">Explore the world and find the essential information that will allow you to plan your trip.</p>
          
          <Cta :link="{ name: 'continents' }" :ico="'far fa-arrow-right'" :content="'Explore the World'" class="translate" />
        </div>
      </div>

      <div class="Section_col">
        <ContinentsSwiper @current-continent="onCurrentContinent" ref="swiper" />
      </div>
    </section>

  </div>
</template>

<script>

import * as API from "@/config/graphql"
import page from "@/mixins/page"

import Cta from '@/components/Cta'
import ContinentsSwiper from '@/components/ContinentsSwiper'

export default {
  name: 'Home',
  mixins: [ page ],
  data () {
    return {
      currentContinent: null
    }
  },
  apollo: {
    
  },
  components: { 
    Cta,
    ContinentsSwiper
  },
  head: {
    title: function() {
      return {
        inner: "Home"
      }
    }
  },
  methods: {
    onCurrentContinent(code)
    {
      this.currentContinent = code
    },
    transitionEnter(done)
    {
      TweenMax.fromTo(this.$el, 0.2, { opacity: 0 }, { opacity: 1 })
      TweenMax.staggerFromTo(this.$el.querySelectorAll('.translate'), 0.6, { opacity: 0, y: 40 }, { delay: 0.5, opacity: 1, y: 0, ease: Quint.easeOut }, 0.1, () => { done() })
    },
    transitionLeave(done)
    {
      this.$refs.swiper.leave()
      TweenMax.staggerTo(this.$el.querySelectorAll('.translate'), 0.4, { opacity: 0, y: 40, ease: Quint.easeIn }, 0.08)
      TweenMax.to(this.$el, 0.25, { delay: 0.6, opacity: 0, onComplete: () => { done() } })
    }
  },
  mounted () {
    
  }
}
</script>

<style lang="stylus">

.Home

  color black
  background-color white
  display flex
  flex-direction column
  align-items center

  h2

    span, small

      display block

  &_background

    position absolute
    top 0px
    left 0px
    width 100%
    height 100%
    overflow hidden
    opacity 0.15

    &_media

      position absolute
      top -3%
      left -3%
      width 106%
      height 106%

      &_back

        background-size cover
        background-repeat no-repeat
        background-position top center
        background-image url('/assets/images/medias/na-cover.png')
        width 100%
        height 100%

    &_overlay

      background-image: radial-gradient(50% 50%, rgba(255,255,255,0.0) 60%, rgba(255,255,255,0.60) 100%);
      position absolute
      top -15%
      left 0%
      width 100%
      height 130%

  .Section

    margin-top auto
    margin-bottom 0px
    width 100vw

    &_wrapper

      padding-top 0px

      @media $medium

        padding-top 110px

      .Cta

        margin-top 50px

        &_content

          backdrop-filter: blur(2px);

    &_col:first-child

      max-width 610px
      min-height 571px

      @media $medium

        min-height auto
        max-width none

  p

    color black

</style>
