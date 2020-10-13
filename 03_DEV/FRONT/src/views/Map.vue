<template>
  <div id="MapPage" class="MapPage" data-view>

    <transition name="panel-left" appear>
      <PanelContinent ref="continent" class="Panel-left" :key="$route.params.code" v-if="$route.name == 'continent'"/>
    </transition>
    <transition name="panel-left" appear>
      <PanelCountry ref="country" class="Panel-left" :key="$route.params.code" v-if="$route.name == 'country'"/>
    </transition>

  </div>
</template>

<script>
import * as API from "@/config/graphql"
import page from "@/mixins/page"

import PanelContinent from '@/components/partials/PanelContinent'
import PanelCountry from '@/components/partials/PanelCountry'

export default {
  name: 'MapPage',
  mixins: [ page ],
  data () {
    return {
      
    }
  },
  apollo: {
    
  },
  components: { 
    PanelContinent,
    PanelCountry
  },
  head: {
    title: function() {
      return {
        inner: this.$t('home.cta')
      }
    }
  },
  methods: {
    transitionEnter(done)
    {
      done()
      // TweenMax.staggerFromTo(this.$el.querySelectorAll('Panel'), 0.6, { opacity: 0, y: 40 }, { delay: 0.5, opacity: 1, y: 0, ease: Quint.easeOut, onComplete: () => { done() } }, 0.1)
    },
    transitionLeave(done)
    {
      TweenMax.to(this.$el.querySelectorAll('.Panel'), 0.5, { x: "-105%", ease: Quint.easeIn, onComplete: () => { done() } })
    }
  },
  mounted () {
    
  }
}
</script>

<style lang="stylus">

.MapPage

  min-height 0px

</style>
