<template>
  <router-link :to="{ name: 'country', params: { code: data.code } }" class="CountryPush">
    <div class="CountryPush_content">
      <div class="CountryPush_content_emoji" v-html="data.emoji"></div>
      <div class="CountryPush_content_title">
        <p class="CountryPush_content_name big" v-html="data.name"></p>
        <p class="CountryPush_content_native" v-html="data.native" v-if="data.native != data.name"></p>
      </div>
    </div>

    <button class="Cta Cta_action">
      <i class="far fa-arrow-right"></i>
      <i class="far fa-arrow-right"></i>
    </button>
  </router-link>
</template>

<script>
  export default {
    name: "CountryPush",
    props: {
      data: {
        type: Object,
        required: true
      }
    },
  }
</script>

<style lang="stylus" scoped>
.CountryPush

  background: #FFFFFF;
  box-shadow: 0px 2px 10px rgba(0,0,0,0.10);
  border-radius: 40px;
  padding 20px 20px 20px 20px
  box-sizing border-box
  width calc(50% - 10px)
  display flex
  flex-direction row
  align-items center
  justify-content space-between
  margin-bottom 15px
  color black
  text-decoration none
  cursor pointer
  transition box-shadow 0.25s $ease

  @media $large

    width 100%

  &_content

    display flex
    flex-direction row
    align-items center
    justify-content space-between
    margin-right 20px

    &_native

      color $black!important

    &_emoji

      font-size 25px
      margin-right 10px

  p

    color black

  &:hover

    box-shadow: 0px 0px 5px rgba(0,0,0,0.10);

    i

      transform translateX(280%)

    i:first-child

      transform translate(-50%, -50%)


</style>