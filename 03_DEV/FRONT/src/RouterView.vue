<template>
  <transition v-on:leave="leave" v-on:enter="enter" mode="out-in" appear>
    <router-view ref="currentView" />
  </transition>
</template>

<script>
  // Language management
  export default {
    methods: {
      enter(el, done)
      {
        this.$refs.currentView.transitionEnter(done)
      },
      leave(el, done)
      {
        this.$refs.currentView.transitionLeave(done)
      }
    }
  }
</script>