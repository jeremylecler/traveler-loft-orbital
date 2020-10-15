<template>
  <div class="Page Loader">
    <div class="Loader_ico">
      <div class="Loader_ico_back"></div>
      <div class="Loader_ico_stroke"></div>
      <img src="/assets/images/globe.svg" alt="Loading" />
    </div>

    <h4>{{ $t('global.load') }}<br></small><small>{{ $t('global.loadMore') }}</small></h4>
  </div>
</template>

<script>
  export default {
    name: "Loader",
    data() {
      return {
        mapReady: false,
        filesLoaded: false
      }
    },
    methods: {
      leaveTransition()
      {
        TweenMax.to(this.$el.querySelector('.Loader_ico'), 0.8, { opacity: 0, scale: 0.7, ease: Quint.easeIn })
        TweenMax.to(this.$el.querySelector('.Loader_ico_back'), 0.6, { scale: 1.8, ease: Quint.easeIn })
        TweenMax.to(this.$el.querySelector('h4'), 0.4, { opacity: 0,  ease: Quint.easeIn })
      },
      loadingComplete()
      {
        console.log('loadComplete 100%')
        this.leaveTransition()
        
        setTimeout( () => {
          this.$emit('load-complete')
        }, 1000)
      },
      load()
      {
        // Preloading site assets
        var preloader = require('preloader');
        var loader = preloader({
          xhrImages: false
        });

        loader.on('complete', () => {
          this.filesLoaded = true
          this.checkLoad()
        } );

        loader.add('/assets/images/logo.svg')
        loader.add('/assets/images/globe.svg')
        loader.add('/assets/images/country-details-back.jpg')

        loader.add('/assets/images/medias/oc-thumb.png')
        loader.add('/assets/images/medias/sa-thumb.png')
        loader.add('/assets/images/medias/af-thumb.png')
        loader.add('/assets/images/medias/as-thumb.png')
        loader.add('/assets/images/medias/eu-thumb.png')
        loader.add('/assets/images/medias/an-thumb.png')
        loader.add('/assets/images/medias/oc-thumb.png')

        loader.add('/assets/images/medias/oc-cover.png')
        loader.add('/assets/images/medias/sa-cover.png')
        loader.add('/assets/images/medias/af-cover.png')
        loader.add('/assets/images/medias/as-cover.png')
        loader.add('/assets/images/medias/eu-cover.png')
        loader.add('/assets/images/medias/an-cover.png')
        loader.add('/assets/images/medias/oc-cover.png')

        loader.load()
      },
      onMapReady()
      {
        // If the map is initialized, check that the assets are loaded
        this.mapReady = true
        this.checkLoad()
      },
      checkLoad()
      {
        // If the map is initialized and the files loaded, then the site is loaded
        if(this.filesLoaded && this.mapReady)
          this.loadingComplete()
      },
    },
    mounted()
    {
      this.load()
    }
  }
</script>

<style lang="stylus" scoped>
.Loader

  background-color white
  cursor wait

  h4

    position absolute
    top 58%
    left 0px
    width 100vw
    text-align center

    @media $small

      top 62%

    @media $xsmall

      top 68%

  &_ico

    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)

    &_back

      position absolute
      background-color $primary
      width 100%
      border-radius 50%
      height 100%
      left 0px
      transform scale(1.4)

    &_stroke

      position absolute
      border 2px dotted $primary
      box-sizing border-box
      width 180%
      border-radius 50%
      height 180%
      left -40%
      top -40%
      animation rotate 1s linear infinite


    img

      width 50px
      display block
      height 50px
      position relative
</style>