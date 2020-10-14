<template>
  <div class="Search" :class="{ 'Search-small': isSmall }">
    <form class="Search_form" spellcheck="false" @submit.prevent="validateBeforeSubmit" autocomplete="false">
      <input ref="input" class="Search_input" :class="{ 'Search_input-open': isOpen }" v-model="search" type="text" :placeholder="$t('global.searchPlaceholder')" />
      <button @click="action" class="Cta Search_action">{{ $t('global.search') }} <i class="far fa-search-location"></i></button>
    </form>
  </div>
</template>

<script>
  import * as API from "@/config/graphql"

  export default {
    name: "Search",
    props: {
      isSmall: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        search: '',
        isOpen: true,
        continents: [],
        onProgress: false
      }
    },
    watch: {
      isSmall: {
        immediate: true,
        handler()
        {
          if(this.isSmall)
            this.isOpen = false
          else
            this.isOpen = true
        }
      },
      isOpen: {
        immediate: true,
        handler()
        {
          this.$emit('open-search', this.isOpen)
        }
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
    },
    methods: {
      action()
      {
        if(this.isOpen)
        {
          this.validateBeforeSubmit()
        }else{
          this.isOpen = true

          this.$nextTick( () => {
            this.$refs.input.focus()
          })
        }
      },
      validateBeforeSubmit()
      {
        this.$refs.input.blur()

        // Check and find if the text entered corresponds to a continent or a country
        if(this.search.length >= 1 && this.isOpen && !this.onProgress)
        {
          this.onProgress = true
          for (let i = 0; i < this.continents.length; i++) {
            const element = this.continents[i];

            if(this.$tools.slugify(element.name).indexOf(this.$tools.slugify(this.search)) > -1)
            {
              this.result = element
              break
            }
          }

          // If the search corresponds to a continent, we stop there. Otherwise, we search in countries (optim)

          if(!this.result)
          {
            for (let i = 0; i < this.countries.length; i++) {
              const element = this.countries[i];

              if(this.$tools.slugify(element.name).indexOf(this.$tools.slugify(this.search)) > -1)
              {
                this.result = element
                break
              }
            }
          }

          if(this.result){
            this.$router.push({ name: this.result.countries ? 'continent' : 'country', params: { code: this.result.code } })
          }else{
            // Show error message
            this.$refs.input.placeholder = this.$t('global.noResult')
            this.error = true
            setTimeout( () => {
              this.error = false
              this.$refs.input.placeholder = this.$t('global.searchPlaceholder')
            }, 1500)
          }

          this.reset()
        }
      },
      reset()
      {
        this.search = ''
        this.result = null
        this.onProgress = false

        if(this.isSmall && !this.error)
          this.isOpen = false
      }
    },
    created()
    {
      this.isOpen = false
    },
    mounted()
    {
      if(!this.isSmall)
        this.isOpen = true
    }
  }
</script>

<style lang="stylus" scoped>
.Search

  pointer-events auto
  position relative
  box-shadow: 0 0 10px 0 rgba(0,0,0,0.10);
  border-radius: 25px;
  background-color white
  height 45px

  @media $small

    position absolute
    top 22px
    right 20px
    height 37px

  &_form

    height 100%
    display flex
    flex-direction row
    font-size 14px
    align-items stretch

    @media $small

      font-size 12px

  &_input

    appearance none
    border 0px
    border-radius: 25px;
    background-color transparent
    width 0px
    padding 0px 0px
    box-sizing border-box
    font-family $fprimary
    height 100%
    font-weight 300
    font-size 14px
    color black 
    transition width 0.6s 0.2s $ease, padding 0.6s 0.2s $ease

    @media $small

      font-size 12px

    &-open

      width 250px
      padding 0px 20px

      @media $small

        width 200px
        padding 0px 10px

      @media $xsmall

        width 140px

  &_action

    border-radius 25px
    color white
    background-color $secondary
    width 120px
    font-size 14px
    font-weight 500

    @media $small

      font-size 12px
      width 80px

    &:hover

      i 

        transform scale(1.5)

    i

      margin-left 5px
      transition transform 0.3s $ease


*:placeholder, :placeholder, ::placeholder, input:placeholder, input::placeholder

  font-family $fprimary
  font-weight 300
  color $black
  font-style italic

</style>