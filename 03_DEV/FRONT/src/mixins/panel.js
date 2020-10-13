import MouseParallax from '@/components/MouseParallax'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  data() {
    return {
      isSticky: false,
      settings: {
        suppressScrollX: true
      }
    }
  },
  components: { 
    MouseParallax,
    VuePerfectScrollbar
  },
  methods: 
  {
    onScroll(e)
    {
      const s = this.$el.scrollTop

      if(s >= 1)
      {
        this.isSticky = true
      }else{
        this.isSticky = false
      }
    }
  },
}
