<template>
  <VuePerfectScrollbar tag="aside" class="Panel PanelCountry" :settings="settings" ref="scroll" v-if="country" :class="{ 'Panel-sticky': isSticky }" @ps-scroll-y="onScroll">
    <div class="Panel_wrapper PanelCountry_title">
      <p class="big"><span v-html="country.emoji"></span><span v-if="country.native != country.name" v-html="country.native"></span></p>
      <h2 v-html="country.name"></h2>
    
      <Cta :link="{ name: 'continent', params: { code: country.continent.code } }" :ico="'far fa-arrow-right'" :content="$t('global.explore') + ' ' + country.continent.name" />
    </div>
    <div class="Panel_wrapper Panel_wrapper-small PanelCountry_details">
      <div class="PanelCountry_details_col">
        <p class="big"><b><i class="fad fa-map-pin"></i> {{ $t('zoom.capital') }}</b> {{ country.capital }}</p>
        <p class="big"><b><i class="fad fa-comment-smile"></i> {{ $t('zoom.spoken') }}</b> {{ languages.join(' / ') }}</p>
      </div>

      <div class="PanelCountry_details_col">
        <p><b>{{ $t('zoom.population') }}</b> {{ $tools.randomNumber(18, 92) }} {{ $t('zoom.populationMore') }}</p>
        <p><b>{{ $t('zoom.gdp') }}</b> {{ $tools.randomNumber(18, 46) }} {{ $t('zoom.gdpMore') }}</p>
        <p><b>{{ $t('zoom.co2') }}</b> {{ $tools.randomNumber(2, 8) }} {{ $t('zoom.co2More') }}</p>
      </div>
    </div>

    <div class="Panel_wrapper Panel_wrapper-small PanelCountry_exchange">
      <ExchangeInput ref='exchange' />
    </div>

    <div class="Panel_sep"></div>

    <div class="Panel_wrapper Panel_wrapper-small PanelCountry_states" v-if="country.states && country.states.length > 0">
      <h4>{{ $t('zoom.states') }}</h4>
      <p v-html="states.join(' / ')"></p>
    </div>

    <div class="Panel_sep" v-if="country.states && country.states.length > 0"></div>

    <div class="Panel_wrapper Panel_wrapper-small PanelCountry_others">
      <h4>{{ $t('global.exploreOther') }} {{ country.continent.name }}</h4>
      <div class="PanelCountry_countries">
        <CountryPush v-for="country in suggestedCountries" :key="country.code" :data="country" @mouseenter.native="onMouseOver(country)" @mouseleave.native="onMouseLeave(country)" />
      </div>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
  import * as API from "@/config/graphql"
  import panel from "@/mixins/panel"

  import CountryPush from '@/components/CountryPush'
  import Cta from '@/components/Cta'
  import ExchangeInput from '@/components/ExchangeInput'

  export default {
    name: "PanelCountry",
    mixins: [ panel ],
    data () {
      return {
        country: null
      }
    },
    apollo: {
      country: {
        query: API.GET_COUNTRY,
        variables () {
          return {
            code: this.$route.params.code.toUpperCase(),
          }
        },
      },
    },
    components: {
      CountryPush,
      Cta,
      ExchangeInput
    },
    computed: {
      suggestedCountries()
      {
        return this.$tools.shuffleArray(this.country.continent.countries).slice(0, 2)
      },
      languages()
      {
        const languages = []
        this.country.languages.forEach(l => {
          if(languages.indexOf(l.name) <= -1)
            languages.push(l.name)
        });

        return languages
      },
      states()
      {
        const states = []
        this.country.states.forEach(l => {
          if(states.indexOf(l.name) <= -1)
            states.push(l.name)
        });

        return states
      }
    },
    methods: {
      onMouseOver(country)
      {
        // Colorize the country on the map
        this.$parent.$parent.$parent.$refs.map.overCountry(country.code)
      },
      onMouseLeave(country)
      {
        // Decolorize the country on the map
        this.$parent.$parent.$parent.$refs.map.blurCountry(country.code)
      }
    },
    beforeDestroy()
    {
      // Decolorize the country on the map
      this.$parent.$parent.$parent.$refs.map.blurCountry(this.country.code.toUpperCase())
    },
    mounted()
    {
      setTimeout( () => {
        // Colorize the country on the map
        this.$parent.$parent.$parent.$refs.map.overCountry(this.$route.params.code.toUpperCase())
      }, 1000)
    }
  }
</script>

<style lang="stylus" scoped>
.PanelCountry

  &_title

    p

      margin-bottom 5px

      span:first-child

        margin-right 10px
        font-size 25px
        position relative
        top 2px

  &_states

    p

      margin-top 40px

  &_countries

    margin-top 40px
    display flex
    flex-direction row
    align-items stretch
    justify-content space-between
    flex-wrap wrap

    @media $large

      display block

  &_details

    background-color $primary
    background-image url('/assets/images/country-details-back.jpg')
    background-size cover
    background-position center right
    display flex
    flex-direction row
    align-items center
    justify-content space-between

    @media $large

      display block

    &_col

      &:last-child

        margin-right auto
        margin-left auto

        @media $large

          margin 20px 0px 0px 0px
          padding-top 20px
          border-top 1px solid rgba(255,255,255,0.3)

    p
      
      color white
      margin-bottom 10px
      font-weight 300

      i 

        min-width 23px
        text-align center
        margin-right 10px

      &:last-child

        margin-bottom 0px

      b

        font-weight 500
</style>