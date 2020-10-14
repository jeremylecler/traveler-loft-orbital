<template>
  <div class="ExchangeInput">
    <h4 v-html="$t('zoom.convert')"></h4>

    <div class="ExchangeInput_rows">
      
      <transition name="fade">
        <div class="ExchangeInput_row" v-if="keys && exchangeRates">
          <p>{{ $t('zoom.before') }}</p>
          <input type="number" min="0" class="ExchangeInput_input ExchangeInput_input" v-model="value" />
          <div class="ExchangeInput_input_wrapper">
            <select class="ExchangeInput_input" v-model="type1" @change="change">
              <option value="EUR">EUR</option>
              <option v-for="(rate, i) in Object.keys(keys.rates)" :key="i" :value="rate">{{ rate }}</option>
            </select>
            <i class="far fa-angle-down"></i>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div class="ExchangeInput_row" v-if="keys && exchangeRates">
          <p>{{ $t('zoom.after') }}</p>
          <input type="number" class="ExchangeInput_result ExchangeInput_input" disabled="true" v-model="result" />
          <div class="ExchangeInput_input_wrapper">
            <select class="ExchangeInput_input" v-model="type2">
              <option value="EUR">EUR</option>
              <option v-for="(rate, i) in Object.keys(keys.rates)" :key="i" :value="rate">{{ rate }}</option>
            </select>
            <i class="far fa-angle-down"></i>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script>
  export default {
    name: "ExchangeInput",
    data() {
      return {
        value: 1,
        type1: "EUR",
        type2: "USD",
        exchangeRates: null,
        keys: null
      }
    },
    computed: {
      result()
      {
        return this.value * this.exchangeRates.rates[this.type2].toFixed(2)
      }
    },
    methods: {
      change()
      {
        this.$api.getExchange(this.type1).then( resp => {
          this.exchangeRates = resp.data
        })
      }
    },
    created()
    {
      this.$api.getExchange('EUR').then( resp => {
        this.keys = resp.data
      })
      this.change()
    }
  }
</script>

<style lang="stylus">
.ExchangeInput

  min-height 130px

  &_rows

    display flex
    flex-direction row
    align-items center
    flex-wrap wrap

  &_row

    display flex
    flex-direction row
    align-items stretch
    margin-top 20px
    margin-bottom 30px
    margin-right 30px
    position relative

    @media $medium

      width 100%

  h4

    margin-bottom 40px

  p

    position absolute
    top -30px
    left 0px

  select

    padding-right 35px
    color white
    background-color $primary

  input

    width 100px

    @media $medium

      width 100%

  &_input

    background-color white
    appearance none
    border 0px 
    color black
    font-size 14px
    font-family $fprimary
    height 50px
    border-radius 25px
    box-shadow 0px 2px 8px rgba(0,0,0,0.15)
    padding 0px 25px

    &_wrapper

      position relative
      display table
      color white
      margin-left 15px

      i

        position absolute
        top 50%
        transform translateY(-50%)
        right 15px
</style>