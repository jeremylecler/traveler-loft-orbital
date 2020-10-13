<template>
  <router-link tag="article" :to="{ name: 'continent', params: { code: data.code } }" class="ContinentItem">
    <div class="ContinentItem_media" :style="{ backgroundImage: 'url(' + media + ')' }"></div>
    <div class="ContinentItem_overlay"></div>
    <div class="ContinentItem_content">
      <div class="ContinentItem_content_countries"><img src="/assets/images/globe.svg" /> <span>{{ data.countries.length }} {{ $t('global.countries') }}</span></div>
      <h3 v-html="data.name"></h3>
    </div>
  </router-link>
</template>

<script>
  export default {
    name: "ContinentItem",
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    computed: {
      media()
      {
        return '/assets/images/medias/' + this.data.code.toLowerCase() + '-thumb.png'
      }
    },
    methods: {
      enter()
      {
        TweenMax.fromTo(this.$el.querySelector('.ContinentItem_overlay'), 0.6, { y: '100%' }, { y: '0%', ease: Quint.easeOut })

        TweenMax.fromTo(this.$el.querySelector('.ContinentItem_content_countries img'), 0.6, { scale: 0 }, { delay: 0.1, scale: 1, ease: Quint.easeOut })
        TweenMax.fromTo(this.$el.querySelector('.ContinentItem_content_countries span'), 0.4, { x: -15, opacity: 0 }, { delay: 0.1, x: 0, opacity: 1, ease: Quint.easeOut })

        TweenMax.fromTo(this.$el.querySelector('.ContinentItem_content h3'), 0.4, { y: 30, opacity: 0 }, { delay: 0.2, y: 0, opacity: 1, ease: Quint.easeOut })
      }
    }
  }
</script>

<style lang="stylus" scoped>
.ContinentItem

  position relative
  width 100%
  height 390px
  border-radius 25px
  overflow hidden
  display flex
  flex-direction column
  align-items flex-start
  justify-content flex-end
  cursor pointer
  background-color white
  backface-visibility hidden
  color white

  @media $small

    height 40vh

  &:hover, &-focus

    .ContinentItem

      &_overlay

        height 100%

  &-focus

    .ContinentItem

      &_media

        opacity 0.5

  &:hover

    .ContinentItem

      &_media

        transform scale(1.1)

  &_content

    padding 35px 25px
    position relative
    min-height 156px
    box-sizing border-box

    @media $small

      min-height 110px

    h3

      opacity 0

    &_countries

      margin-bottom 10px
      font-size 14px
      line-height 14px

      span

        display inline-block
        opacity 0

      img

        display inline-block
        vertical-align middle
        width 14px
        margin-right 5px
        transform scale(0)
        position relative
        top -2px

  &_overlay

    background-image: linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.6) 98%);
    height 70%
    width 100%
    position absolute
    left 0px
    bottom 0px
    transform translateY(100%)
    transition height 0.2s $ease

  &_media

    background-size: cover
    border-radius 25px
    background-position center
    height 100%
    width 100%
    position absolute
    left 0px
    bottom 0px
    transition transform 0.4s $ease, opacity 0.4s $ease

</style>