<template>
  <router-link tag="button" :to="link" class="Cta" v-if="link">
    <div class="Cta_ico" v-if="ico">
      <i :class="ico"></i>
      <i :class="ico"></i>
    </div>
    <div class="Cta_content"><span v-html="content"></span></div>
  </router-link>

  <button class="Cta" v-else>
    <div class="Cta_ico" v-if="ico">
      <i :class="ico"></i>
      <i :class="ico"></i>
    </div>
    <div class="Cta_content" v-html="content"></div>
  </button>
</template>

<script>
  export default {
    name: "Cta",
    props: {
      link: {
        type: Object
      },
      content: {
        type: String,
        required: true
      },
      ico: {
        type: String
      }
    }
  }
</script>

<style lang="stylus" scoped>
.Cta

  appearance none
  color white
  background-color transparent
  border 0px
  border-radius 0px
  cursor pointer
  display flex
  flex-direction row
  align-items center
  box-shadow none

  &:hover

    .Cta

      &_ico

        i

          transform translateX(215%)

        i:first-child

          transform translate(-50%, -50%)

      &_content

        border-color $secondary
        color white

        &:before

          transform translateX(0%)

  &_content

    font-weight 500
    font-size: 16px;
    padding 10px 30px
    border 2px solid black 
    color black
    border-radius 25px
    overflow hidden
    min-height 50px
    box-sizing border-box
    text-align: center;
    display flex
    flex-direction row
    align-items center
    margin-left 10px
    position relative
    backface-visibility hidden
    transition border-color 0.2s $ease, color 0.2s 0.05s $ease

    span

      position relative

    &:before

      content ''
      position absolute
      top 0px
      left 0px
      width 100%
      height 100%
      transform-origin left center
      background-color $secondary
      transform translateX(-100%)
      border-radius 25px
      transition transform 0.3s $ease

  &_ico
    
    width 50px
    height 50px
    display flex
    flex-direction column
    align-items center
    justify-content center
    background-color $secondary
    border-radius 50%
    position relative
    overflow hidden

    i

      display block
      font-size 25px
      line-height 25px
      margin auto auto
      transition 0.3s $ease

      &:first-child

        position absolute
        top 50%
        left 50%
        transform translate(-215%, -50%)

.safari

  .Cta

    &_content:before

      transform none!important
      opacity 0
      transition opacity 0.4s $ease

    &:hover

      .Cta

        &_content:before

          opacity 1!important
</style>