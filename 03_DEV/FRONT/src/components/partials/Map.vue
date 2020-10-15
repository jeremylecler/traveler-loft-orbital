<template>
  <section class="Map" :class="{ 'Map_zoom': $route.name != 'continents' && $route.name != 'home' }">
    <div id="chartdiv" ref="map" class="Map_world"></div>

    <div class="Map_controls" v-if="!onUpdate">
      <button @click="zoomIn" :disabled="chart.zoomLevel >= 2" class="Cta Cta_circle"><i class="far fa-plus"></i></button>
      <button @click="zoomOut" :disabled="chart.zoomLevel <= 0.8" class="Cta Cta_circle"><i class="far fa-minus"></i></button>
    </div>

    <transition name="fade">
      <div class="Map_tooltip" v-if="tooltip && lastSelected && currentContinent" ref="tooltip" :style="{ left: position.x - 145 + 'px', top: position.y + 'px' }" :key="lastSelected.id">
        <div class="Map_tooltip_media" :style="{ backgroundImage: 'url(' + media + ')' }"></div>
        <div class="Map_tooltip_overlay"></div>
        <div class="Map_tooltip_content">
          <div class="Map_tooltip_content_countries"><img src="/assets/images/globe.svg" /> <span>{{ currentContinent.countries.length }} {{ $t('global.countries') }}</span></div>
          <h3 v-html="lastSelected.name"></h3>
          <a>{{ $t('global.exploreThe') }} continent <i class="fa fa-arrow-right"></i></a>
        </div>
      </div>
      <div class="Map_tooltip Map_tooltip-country" v-else-if="tooltip && lastSelected && currentCountry" ref="tooltip" :style="{ left: position.x - 145 + 'px', top: position.y + 'px' }" :key="lastSelected.id">
        <div class="Map_tooltip_content">
          <p><span v-html="currentCountry.emoji" class="big"></span> <span v-html="currentCountry.continent"></span></p>
          <h3 v-html="lastSelected.name"></h3>
          <a>{{ $t('global.exploreThe') }} {{ $t('global.country') }} <i class="fa fa-arrow-right"></i></a>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="Map_load" v-show="onUpdate"><i class="fad fa-spinner-third"></i></div>
    </transition>
    
    <transition name="fade">
      <button class="Cta Map_toggle" v-if="$route.name == 'continents'" @click="toggleDetails">
        <transition name="fade" mode="out-in">
          <span v-if="!detailsCountries" key="zi">{{ $t('global.toggleCountries') }} <i class="far fa-search-plus"></i></span>
          <span v-else key="zo">{{ $t('global.toggleContinents') }} <i class="far fa-search-minus"></i></span>
        </transition>
      </button>
    </transition>

  </section>
</template>

<script>
  import * as API from "@/config/graphql"

  import * as am4core from "@amcharts/amcharts4/core";
  import * as am4maps from "@amcharts/amcharts4/maps";
  import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
  import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
  import am4themes_animated from "@amcharts/amcharts4/themes/animated";

  am4core.useTheme(am4themes_animated);

  const continentsAssociation = [ {
    "id": "africa",
    "code": "af"
  }, {
    "id": "asia",
    "code": "as",
    "zoomLevel": 2,
    "zoomGeoPoint": {
      "latitude": 46,
      "longitude": 89
    }
  }, {
    "id": "oceania",
    "code": "oc",
  }, {
    "id": "europe",
    "code": "eu",
  }, {
    "id": "antartica",
    "code": "an",
    "zoomLevel": 1.2,
    "zoomGeoPoint": {
      "latitude": -75,
      "longitude": -0.07
    }
  }, 
  {
    "id": "northAmerica",
    "code": "na",
  }, {
    "id": "southAmerica",
    "code": "sa",
  }]

  import { mapState, mapGetters } from 'vuex'

  export default {
    name: "Map",
    data() {
      return {
        detailsCountries: false,
        onUpdate: true,
        chartReady: false,
        continents: [],
        lastTarget: null,
        countriesSerie: null,
        countryTemplate: null,
        continentsSerie: null,
        continentTemplate: null,
        chart: null,
        tooltip: false,
        position: { x: null, y: null },
        lastSelected: null
      }
    },
    apollo: {
      continents: {
        query: API.GET_MAP
      },
    },
    computed: {
      countries()
      {
        const countries = []
        this.continents.forEach( continent => {
          continent.countries.forEach(co => { 
            co.continent = continent.name
            countries.push(co)
          })
        })
        return countries
      },
      media()
      {
        if(this.currentContinent)
          return '/assets/images/medias/' + this.currentContinent.code.toLowerCase() + '-thumb.png'
        else
          return null
      },
      currentContinent()
      {
        if(this.continents.length > 0)
          return this.continents.find(c => c.name.toLowerCase() == this.lastSelected.name.toLowerCase())
        else
          return null
      },
      currentCountry()
      {
        return this.countries.find(c => c.code.toLowerCase() == this.lastSelected.id.toLowerCase())
      }
    },
    watch: {
      continents: {
        immediate: true,
        handler()
        {
          if(this.continents.length > 0)
          {
            // When the data is retrieved with the API, then initialize the map
            this.initChart()
          }
        }
      },
      $route: {
        immediate: true,
        handler()
        {
          if(this.chartReady && this.$route.name != 'home')
          {
            // If the route changes, then zoom in on the map
            this.zoom()
          }
        }
      }
    },
    methods: {
      toggleDetails()
      {
        this.detailsCountries = !this.detailsCountries
        
        this.zoomToggle(this.detailsCountries)

        if(this.detailsCountries)
        {
          this.zoomIn()
        }else{
          this.chart.goHome()
        }
      },
      overCountry(code)
      {
        // Colorize the country on the map
        const last = this.countriesSerie.getPolygonById(code.toUpperCase())
        if(last)
          last.isActive = true;
      },
      blurCountry(code)
      {
        // Decolorize the country on the map
        const last = this.countriesSerie.getPolygonById(code.toUpperCase())
        if(last)
          last.isActive = false;
      },
      zoom()
      {
        // Zoom in on a continent or country
        if(this.$route.name == 'home' || this.$tools.isMobile()) return

        if(this.$route.name != 'continents')
        {   
          if(this.$route.name == 'continent'){
            // Zoom in on a continent
            // check if continent exist
            let r = continentsAssociation.find(c => c.code == this.$route.params.code.toLowerCase())
            if(r)
              this.lastTarget = this.continentsSerie.getPolygonById(r.id)
            else
              this.$router.push({ name: 'continents' })
          }else{
            // Zoom in on a country
            this.lastTarget = this.countriesSerie.getPolygonById(this.$route.params.code.toUpperCase())
          }

          setTimeout( () => {
            this.chart.zoomToMapObject(this.lastTarget);
            this.zoomToggle(this.$route.name == 'continent' || this.$route.name == 'country' ? true : false)
          }, 305)
        }else{
          if(this.$route.name == 'continents')
          {
            // Reset zoom position
            this.detailsCountries = false
            this.zoomToggle(false)
            this.chart.goHome()
          }
        }
        
      },
      zoomIn() {
        this.chart.zoomIn();
      },
      zoomOut() {
        this.chart.zoomOut();
      },
      closeTooltip()
      {
        if (this.tooltip) {
          this.$el.removeEventListener('mousemove', this.onMouseMove)
          this.tooltip = false
        }
      },
      createCountriesSerie()
      {
        // Generation of the different countries on the map according to the API data
        return new Promise((resolve, reject) => {
          // Init amchart geo data
          this.countriesSerie = this.chart.series.push( new am4maps.MapPolygonSeries() )
          this.countriesSerie.name = 'CountriesSerie'
          this.countriesSerie.visible = false;
          this.countriesSerie.geodata = am4geodata_worldLow;
          this.countriesSerie.useGeodata = true

          // Add only existing countries in the API
          this.countriesSerie.include = this.countries.map(c => c.code.toUpperCase())

          // Style definition
          this.countryTemplate = this.countriesSerie.mapPolygons.template
          this.countryTemplate.applyOnClones = true;
          this.countryTemplate.fill = am4core.color("#ffffff");
          this.countryTemplate.stroke = am4core.color("#D6D6D6")
          this.countryTemplate.nonScalingStroke = true;
          this.countryTemplate.strokeOpacity = 1;
          
          // Style rollover
          let ss = this.countryTemplate.states.create("hover");
          ss.properties.fill = am4core.color("#FEA400");
          this.countryTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;

          let ff = this.countryTemplate.states.create("active");
          ff.properties.fill = am4core.color("#FEA400");

          // Initialization of events
          this.countryTemplate.events.on("over", ev => {
            this.lastSelected = ev.target.dataItem.dataContext
            this.tooltip = true
            
            this.position = { x: Number(ev.event.layerX), y: Number(ev.event.layerY) }
            this.$el.addEventListener('mousemove', this.onMouseMove)
          })

          this.countryTemplate.events.on("out", ev => {
            this.tooltip = false
          })

          this.countryTemplate.events.on("hit", ev => {
            this.lastSelected = ev.target.dataItem.dataContext
            this.$router.push({ name: 'country', params: { code: ev.target.dataItem.dataContext.id.toLowerCase() } })
          })

          resolve('Success!');
        })
      },
      createContinentsSerie()
      {
        // Generation of the different continents on the map according to the API data
        return new Promise((resolve, reject) => {
          // Init amchart geo data
          this.continentsSerie = this.chart.series.push( new am4maps.MapPolygonSeries() )
          this.continentsSerie.name = 'ContinentsSerie'
          this.continentsSerie.geodata = am4geodata_continentsLow;
          this.continentsSerie.useGeodata = true

          // Add only existing continents in the API
          this.continentsSerie.data = continentsAssociation;

          // Style definition
          this.continentsSerie.mapPolygons.template.fill = am4core.color("#ffffff");
          this.continentsSerie.mapPolygons.template.stroke = am4core.color("#D6D6D6")
          this.continentsSerie.mapPolygons.template.propertyFields.fill = "fill";
          this.continentsSerie.dataFields.zoomLevel = "zoomLevel";
          this.continentsSerie.dataFields.zoomGeoPoint = "zoomGeoPoint";
          this.continentTemplate = this.continentsSerie.mapPolygons.template;
          this.continentTemplate.properties.fillOpacity = 0.8; 
          this.continentTemplate.propertyFields.fill = "color";
          this.continentTemplate.nonScalingStroke = true;

          // Style rollover
          let continentHover = this.continentTemplate.states.create("hover");
          continentHover.properties.opacity = 0.3
          this.continentTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;

          // Initialization of events
          this.continentsSerie.mapPolygons.template.events.on("over", ev => {
            if(this.$route.name != 'continents' || ev.event.buttons > 0) return

            this.lastSelected = ev.target.dataItem.dataContext
            this.tooltip = true
            
            this.position = { x: Number(ev.event.layerX), y: Number(ev.event.layerY) }
            this.$el.addEventListener('mousemove', this.onMouseMove)
          })

          this.continentsSerie.mapPolygons.template.events.on("hit", event => {
            if(this.$route.name != 'continents') return
            if (!this.countriesSerie.visible) this.countriesSerie.visible = true;

            this.lastSelected = event.target.dataItem.dataContext

            if(this.currentContinent){
              this.$router.push({ name: 'continent', params: { code: this.currentContinent.code.toLowerCase() } })
            }
          })

          this.continentsSerie.mapPolygons.template.events.on("out", ev => {
            if(this.$route.name != 'continents') return
            this.tooltip = false
          })

          resolve('Success!');
        })
      },
      zoomToggle(state)
      {
        if(state)
        {
          this.continentsSerie.hide()
        }else{
          this.continentsSerie.show()
        }
      },
      onMouseMove(ev)
      {
        this.position = { x: Number(ev.clientX), y: Number(document.body.classList.contains('edge') ? ev.layerY + 80 : ev.layerY) }
      },
      initEvents()
      {
        this.chart.chartContainer.events.on("hit", this.closeTooltip)
        this.$el.addEventListener("mouseleave", this.closeTooltip)

        this.chart.seriesContainer.events.disableType("doublehit");
        this.chart.chartContainer.background.events.disableType("doublehit");
      },
      setChart()
      {
        // Basic map configuration
        // this.chart.chartContainer.wheelable = false
        this.chart.maxZoomLevel = 3;
        this.chart.minZoomLevel = 0.8;
        this.chart.chartContainer.preventDragOut = true;
        this.chart.preventDragOut = true;
        this.chart.homeZoomLevel = 1.15;
        this.initEvents()
      },
      initChart()
      {
        this.chart = am4core.create("chartdiv", am4maps.MapChart);

        // Set map definition
        this.chart.geodata = am4geodata_worldLow

        // Set projection
        this.chart.projection = new am4maps.projections.Mercator();
        
        // Data generation
        this.createCountriesSerie().then( () => { console.log('createCountriesSerie complete') })
        this.createContinentsSerie().then( () => { console.log('createContinentsSerie complete') })

        this.setChart()

        this.chart.events.on("ready", () => {
          console.log('Map is ready')
          this.chartReady = true
          this.onUpdate = false
          this.zoom()
          this.$emit('map-ready')
        })
      }
    },
    beforeDestroy()
    {
      this.$el.removeEventListener('mousemove', this.onMouseMove)
    }
  }
</script>

<style lang="stylus">

.Map
  
  height 100vh
  height calc(100vh - var(--vh, 0px));
  width 100vw
  background-color #F9F9F9
  position fixed
  top 0px
  right 0px
  overflow hidden

  &_toggle

    height 40px
    position absolute!important
    width 190px
    left 40px
    bottom 40px
    z-index 6
    background-color $secondary!important
    color white!important

    @media $small

      bottom 20px
      left 20px
      font-size 12px
      width 170px

    &:hover

      i

        transform scale(1.4)

    i

      margin-left 5px
      transition 0.3s $ease

  #chartdiv

    position relative
    will-change transform
    transform translate3d(0,0,0)
    transition transform 0.3s linear
    width: 100%;
    position absolute
    bottom 0px
    right 0px
    height: 100%;
    cursor move

  &_zoom

    #chartdiv

      transform translate3d(22.5vw,0px,0px)!important

      @media $medium

        transform none!important

  &_load

    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    font-size 30px
    color $blue
    z-index 6
    animation rotate 1.5s linear infinite

  &_controls

    position absolute
    z-index 6
    right 40px
    bottom 40px
    display flex
    flex-direction row

    @media $small

      bottom 20px
      right 20px

    button 

      height 40px
      width 40px

      i

        font-size 14px

      &:first-child

        margin-right 20px

      &:disabled

        opacity 0.5
        pointer-events none

  &_tooltip

    position absolute
    z-index 10
    width 90%
    max-width 310px
    pointer-events none
    border-radius 25px
    z-index 5
    overflow hidden
    display flex
    flex-direction column
    align-items flex-start
    justify-content flex-end
    box-shadow: 0 3px 15px 0 rgba(0,0,0,0.1);
    box-sizing border-box
    transform translate3d(0%, -105%,0)
    transform-origin center bottom
    backface-visibility hidden
    will-change left, top
    font-size 15px
    line-height 22px
    color white

    &-country

      background-color white
      color black
      overflow visible

      &:after

        content ''
        width: 0; 
        height: 0; 
        border-right: 8px solid transparent;
        border-left: 8px solid transparent;
        border-top: 8px solid white;
        position absolute
        left 50%
        top calc(100% - 1px)
        transform translateX(-50%)

      .Map_tooltip_content

        padding-top 25px

      p

        margin-bottom 5px

        span

          &:first-child

            margin-right 5px

          &:last-child

            position relative
            top -1px

    &_content

      padding 55px 25px 25px 25px
      margin 0px 0px!important
      position relative
      box-sizing border-box

      &_countries

        margin-bottom 10px
        font-size 14px
        line-height 14px

        span

          display inline-block

        img

          display inline-block
          vertical-align middle
          width 14px
          margin-right 5px
          position relative
          top -2px

    &_overlay

      background-image: linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.8) 98%);
      height 100%
      width 100%
      position absolute
      left 0px
      bottom 0px

    &_media

      background-size: cover
      border-radius 25px
      background-position center
      height 100%
      width 100%
      position absolute
      left 0px
      bottom 0px

    &_country

      color $dark
      font-weight bold
      margin-bottom 10px

    &_content

      // font-weight bold
      margin-bottom 10px

    &_respondents

      margin-bottom 10px

    &_noData

      margin-bottom 10px
      color $orange
      font-style italic
      font-size 13px

    a

      text-decoration none
      font-weight 500
      display block
      margin 0px 0px
      margin-top 15px
      i, svg

        margin-left 5px
        display inline-block
        color $blue
        font-size 12px
        transition 0.4s $ease


*[aria-labelledby="id-79-title"]
  display none

.ammapDescriptionWindow 
  background-color: white;
  padding 30px 25px
  box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
  border-radius: 4px;
  font-size: 15px;
  line-height 22px

.ammapDescriptionTitle

  font-size 20px
</style>