<template>
  <div class="OnVisible">
    <slot></slot>
  </div>
</template>

<script>
  import scrollUpdate from '@/mixins/scrollUpdate' 

  export default {
    name: "OnVisible",
    data() {
      return {
        isVisible: false
      }
    },  
    mixins: [ scrollUpdate ], 
    methods: {
      onVisible()
      {
        if(this.isVisible) return
        this.isVisible = true
        console.log(this.$el, 'isVisible')
      },
      onUnVisible()
      {
        if(!this.isVisible) return
        this.isVisible = false
        console.log(this.$el, 'onUnVisible')
      },
    }
  }
</script>

<style lang="stylus" scoped>

</style>