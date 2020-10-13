<template>
  <div class="ContinentsSwiper">
    <swiper class="ContinentsSwiper_swiper" ref="mySwiper" :options="swiperOptions" :cleanup-styles-on-destroy="false" @slideChangeTransitionStart="onTransitionStart" @reachEnd="onEnd"> 
      <swiper-slide class="ContinentsSwiper_slide" v-for="continent in continents" :key="continent.code" >
        <ContinentItem ref="cards" :data="continent" @mouseover.native="onMouseOver(continent.code)" @mouseleave.native="onMouseLeave" :class="{ 'ContinentItem-focus': continents[realIndex - 1].code == continent.code }" />
      </swiper-slide>
    </swiper>

    <div class="ContinentsSwiper_navigation">

      <div class="ContinentsSwiper_navigation_actions">
        <div class="Cta Cta_circle Cta_transparent left" @click="previous">
          <i class="far fa-angle-left"></i>
        </div>
        <div class="Cta Cta_circle Cta_transparent right" @click="next">
          <i class="far fa-angle-right"></i>
        </div>
      </div>

      <div class="ContinentsSwiper_navigation_sep">
        <div class="ContinentsSwiper_navigation_sep_progress" :style="{ width: progress + '%' }"></div>
      </div>

      <div class="ContinentsSwiper_navigation_step">
        0
        <transition name="counter" mode="out-in">
          <span :key="realIndex">{{ realIndex }}</span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import * as API from "@/config/graphql"
  import ContinentItem from '@/components/ContinentItem'

  export default {
    name: "ContinentsSwiper",
    data() {
      return {
        isInit: false,
        continents: [],
        realIndex: 1,
        progress: 0,
        autoplayInterval: null,
        swiperOptions: {
          spaceBetween: 30,
          slidesPerView: 'auto',
          grabCursor: true
        }
      }
    },
    apollo: {
      continents: {
        query: API.GET_CONTINENTS
      },
    },
    components: {
      ContinentItem
    },
    watch: {
      continents: {
        immediate: true,
        handler()
        {
          if(this.continents.length > 0)
          {
            this.$nextTick( () => {
              this.onMouseOver(this.continents[0].code)
              this.setAutoplay()
              this.enter()
            })
          }
        }
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.$swiper
      }
    },
    methods: {
      onMouseOver(code)
      {
        clearInterval(this.autoplayInterval)
        this.$emit('current-continent', code.toLowerCase())
      },
      onMouseLeave()
      {
        this.setAutoplay()
      },
      next()
      {
        this.swiper.slideNext()
      },
      previous()
      {
        this.swiper.slidePrev()
      },
      setAutoplay()
      {
        clearInterval(this.autoplayInterval)
        this.autoplayInterval = setInterval( () => {
          if(this.progress == 100)
          {
            this.swiper.slideTo(0)
          }else{
            this.next()
          }
        }, 4000)
      },
      onTransitionStart(e)
      {
        this.realIndex = e.activeIndex + 1
        this.progress = e.progress * 100

        this.$emit('current-continent', this.continents[this.swiper.activeIndex].code)

        this.setAutoplay()
      },
      onEnd(e)
      {
        this.progress = 100
      },
      enter()
      {
        setTimeout( () => {
          var s = 0 
          console.log(this.$refs.cards)
          TweenMax.staggerFromTo(this.$el.querySelectorAll('.ContinentsSwiper_slide'), 0.6, { x: '200%', opacity: 0 }, { x: '0%', opacity: 1, ease: Circ.easeOut, onComplete: () => { this.$refs.cards[s].enter(); s = s + 1 } }, 0.08)
          
          TweenMax.fromTo(this.$el.querySelectorAll('.Cta_circle'), 0.5, { scale: 0.3, opacity: 0 }, { delay: 0.8, scale: 1, opacity: 1, ease: Quint.easeOut })
          TweenMax.fromTo(this.$el.querySelectorAll('.Cta_circle i'), 0.6, { scale: 0.1, opacity: 0 }, { delay: 0.9, scale: 1, opacity: 1, ease: Quint.easeOut })
          
          TweenMax.fromTo(this.$el.querySelector('.ContinentsSwiper_navigation_sep'), 1, { scaleX: 0 }, { delay: 0.8, scaleX: 1, ease: Quint.easeOut })
          TweenMax.fromTo(this.$el.querySelector('.ContinentsSwiper_navigation_step'), 0.6, { opacity: 0 }, { delay: 1.4, opacity: 1, ease: Quint.easeOut })
        }, 900)
      },
      leave()
      {
        var slides = this.$el.querySelectorAll('.ContinentsSwiper_slide')
        slides = Array.prototype.slice.call(slides).reverse()
        TweenMax.staggerTo(slides, 0.3, { x: '200%', opacity: 0, ease: Circ.easeIn }, 0.05)
        
        TweenMax.to(this.$el.querySelectorAll('.Cta_circle'), 0.2, { delay: 0.3, scale: 0.3, opacity: 0, ease: Quint.easeIn })
        // TweenMax.fromTo(this.$el.querySelectorAll('.Cta_circle i'), 0.6, { scale: 0.1, opacity: 0 }, { delay: 0.9, scale: 1, opacity: 1, ease: Quint.easeOut })
        
        TweenMax.to(this.$el.querySelector('.ContinentsSwiper_navigation_sep'), 0.2, { delay: 0.1, scaleX: 0, ease: Quint.easeIn })
        TweenMax.to(this.$el.querySelector('.ContinentsSwiper_navigation_step'), 0.2, { opacity: 0, ease: Quint.easeIn })
        
      }
    },
    beforeDestroy()
    {
      clearInterval(this.autoplayInterval)
    },
  }
</script>

<style lang="stylus">
.ContinentsSwiper

  max-width 50vw

  @media $medium

    max-width none

  &_navigation
    
    position relative
    display flex
    flex-direction row
    align-items center
    justify-content space-between
    padding 40px 40px 40px 0px

    @media $medium

      padding 40px 40px 40px 40px

    @media $small

      padding 20px 20px

    &_actions

      display flex
      flex-direction row
      align-items center
      justify-content space-between

      .Cta

        backdrop-filter: blur(2px);
        opacity 0

      .right

        margin 0px 0px 0px 15px

    &_sep

      height 2px 
      background-color rgba(0,0,0,0.25)
      width 100%
      margin 0px 40px 0px 30px
      position relative
      transform scaleX(0)
      transform-origin center left

      @media $small

        margin 0px 20px 0px 15px

      &_progress

        width 0px
        transition 0.6s $ease
        height 100%
        position absolute
        top 0px
        left 0px
        background-color black

    &_step

      font-weight 300
      font-size: 80px;
      color: black;
      letter-spacing: -8px;
      text-align: left;
      min-width 85px
      opacity 0
      display flex
      flex-direction row

      @media $small

        font-size 50px
        min-width 50px

      span 

        display table

  &_swiper

    width 100%
    padding-right 40px
    box-sizing border-box

    @media $medium

      padding-left 40px

    @media $small

      padding-left 20px
      padding-right 20px

  &_slide

    width 250px
    opacity 0
</style>