<template>
  <div id="Home" class="Page Home" data-view>
    
    <div class="Home_background">
      <transition name="blur" appear>
        <div :key="currentContinent" class="Home_background_media" v-if="currentContinent">
          <MouseParallax :r="-30" class="Home_background_media_back" :style="{ backgroundImage: 'url(/assets/images/medias/' + currentContinent.toLowerCase() + '-cover.png)' }"></MouseParallax>
        </div>
      </transition>
      <div class="Home_background_overlay"></div>
    </div>

    <section class="Section Section_double">
      <div class="Section_col">
        <div class="Section_wrapper">
          <h2><span class="translate">{{ $t('home.titleTop') }}</span><small class="translate" v-html="$t('home.titleBottom')"></small></h2>
          <p class="big translate" v-html="$t('home.content')"></p>
          
          <Cta :link="{ name: 'continents' }" :ico="'far fa-arrow-right'" :content="$t('home.cta')" class="translate" />

          <div class="Home_languages">
            <p>
              <b>{{ $t('global.languages') }}</b> 
              <router-link :to="{ params: { locale: locale.code } }" :class="{ 'actif': $route.params.locale == locale.code }" v-for="locale in locales" :key="locale.code">{{ locale.name }}</router-link>
            </p>
          </div>
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
import { getSupportedLocales } from "@/utils/i18n/supported-locales"

import Cta from '@/components/Cta'
import ContinentsSwiper from '@/components/ContinentsSwiper'

export default {
  name: 'Home',
  mixins: [ page ],
  data () {
    return {
      currentContinent: null,
      locales: getSupportedLocales()
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
        inner: this.$t('home.title')
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
      TweenMax.staggerTo(this.$el.querySelectorAll('.translate'), 0.4, { opacity: 0, y: 40, ease: Quint.easeIn }, 0.05)
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

  &_languages

    position absolute
    bottom 40px
    left 40px

    @media $medium

      left unset
      right 40px

    @media $small

      left unset
      right unset
      bottom unset
      position relative
      margin-top 40px

    a

      color $black
      text-decoration none
      margin-left 10px

      &.actif

        color black

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
    background-color white
    opacity 0.3

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

      background-image: radial-gradient(50% 50%, rgba(255,255,255,0.0) 60%, rgba(255,255,255,1) 100%);
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

      max-width 690px
      min-height 571px
      position relative

      @media $medium

        min-height auto
        max-width none

  p

    color black

</style>
