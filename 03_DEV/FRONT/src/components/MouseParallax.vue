<template>
    <div class="MouseParallax">
        <slot/>
    </div>
</template>

<script>
    import mouseParallax from '@/mixins/mouseParallax'
    export default {
        name: "MouseParallax",
       mixins: [ mouseParallax ],
       props: [ 'r' ],
       created()
       {
            this.ratio = this.r ? this.r : this.ratio
       }
    }
</script>

<style lang="stylus" scoped>
.MouseParallax

    will-change transform
</style>