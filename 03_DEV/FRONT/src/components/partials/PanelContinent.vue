<template>
  <VuePerfectScrollbar tag="aside" class="Panel PanelContinent" :settings="settings" ref="scroll" v-if="continent" :class="{ 'Panel-sticky': isSticky }" @ps-scroll-y="onScroll">
    <div class="Panel_media" :style="{ backgroundImage: 'url(' + media + ')' }"></div>
    <div class="Panel_wrapper">
      <h2 v-html="continent.name"></h2>
      <div class="Table">
        <div class="Table_col">
          <h4>{{ $t('zoom.spoken') }}</h4>
        </div>
        <div class="Table_col">
          <p v-html="languages.join(' / ')"></p>
        </div>
      </div>
    </div>

    <div class="Panel_sep"></div>

    <div class="Panel_wrapper Panel_wrapper-small">
      <h4>{{ $t('global.countries') }} ( {{ continent.countries.length }} )</h4>

      <div class="PanelContinent_countries">
        <CountryPush v-for="country in continent.countries" :key="country.code" :data="country" @mouseenter.native="onMouseOver(country)" @mouseleave.native="onMouseLeave(country)" />
      </div>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
  import * as API from "@/config/graphql"
  import panel from "@/mixins/panel"

  import CountryPush from '@/components/CountryPush'

  export default {
    name: "PanelContinent",
    mixins: [ panel ],
    data () {
      return {
        continent: null
      }
    },
    apollo: {
      continent: {
        query: API.GET_CONTINENT,
        variables () {
          return {
            code: this.$route.params.code.toUpperCase(),
          }
        },
      },
    },
    components: {
      CountryPush
    },
    computed: {
      languages()
      {
        const languages = []
        this.continent.countries.forEach(c => {
          c.languages.forEach(l => {
            if(languages.indexOf(l.name) <= -1)
              languages.push(l.name)
          })
        });

        return languages
      },
      media()
      {
        return '/assets/images/medias/' + this.continent.code.toLowerCase() + '-thumb.png'
      }
    },
    methods: {
      onMouseOver(country)
      {
        console.log(this.$parent.$parent.$parent)
        this.$parent.$parent.$parent.$refs.map.overCountry(country.code)
      },
      onMouseLeave(country)
      {
        console.log(this.$parent.$parent.$parent)
        this.$parent.$parent.$parent.$refs.map.blurCountry(country.code)
      }
    }
  }
</script>

<style lang="stylus" scoped>
.PanelContinent

  &_countries

    margin-top 40px
    display flex
    flex-direction row
    align-items stretch
    justify-content space-between
    flex-wrap wrap

    @media $large

      display block
</style>