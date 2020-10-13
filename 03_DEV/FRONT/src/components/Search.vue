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
        default: false
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
      slugify(string) {
        const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
        const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
        const p = new RegExp(a.split('').join('|'), 'g')

        return string.toString().toLowerCase()
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
          .replace(/&/g, '-and-') // Replace & with 'and'
          .replace(/[^\w\-]+/g, '') // Remove all non-word characters
          .replace('-', '') // Replace multiple - with single -
          .replace(/^-+/, '') // Trim - from start of text
          .replace(/-+$/, '') // Trim - from end of text
      },
      action()
      {
        if(this.isOpen)
        {
          this.validateBeforeSubmit()
        }else{
          this.isOpen = true
        }
      },
      validateBeforeSubmit()
      {
        if(this.search.length >= 1 && this.isOpen && !this.onProgress)
        {
          console.log(this.slugify(this.search))
          this.onProgress = true
          for (let i = 0; i < this.continents.length; i++) {
            const element = this.continents[i];

            if(this.slugify(element.name).indexOf(this.slugify(this.search)) > -1)
            {
              this.result = element
              break
            }
          }

          if(!this.result)
          {
            for (let i = 0; i < this.countries.length; i++) {
              const element = this.countries[i];

              if(this.slugify(element.name).indexOf(this.slugify(this.search)) > -1)
              {
                this.result = element
                break
              }
            }
          }

          if(this.result){
            this.$router.push({ name: this.result.countries ? 'continent' : 'country', params: { code: this.result.code } })
          }else{
            this.$refs.input.placeholder = this.$t('global.noResult')

            setTimeout( () => {
              this.$refs.input.placeholder = this.$t('global.searchPlaceholder')
            }, 1500)
          }

          this.search = ''
          this.result = null
          this.onProgress = false
        }
      }
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

  &_form

    height 100%
    display flex
    flex-direction row
    font-size 14px
    align-items stretch

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

    &-open

      width 240px
      padding 0px 20px

  &_action

    border-radius 25px
    color white
    background-color $secondary
    width 120px
    font-size 14px
    font-weight 500

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