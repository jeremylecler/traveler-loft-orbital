export default {
  install (Vue, options) {
    const $tools = {

      isMobile () {
        return window.innerWidth < 800
      },

      isTouchDevice () {
        return (('ontouchstart' in window) ||
             ('ontouchstart' in document.documentElement) ||
             (navigator.MaxTouchPoints > 0) ||
             (navigator.msMaxTouchPoints > 0))
      },

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

      shuffleArray(arr){ 
        return arr.map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map(a => a[1]);
      },

      randomNumber(min, max) {
        return Math.floor(min + Math.random()*(max + 1 - min))
      },

      disableScroll()
      {
        let top = window.scrollY || document.documentElement.scrollTop
        console.log(top)
        document.body.style.top =  - top + 'px';
        document.body.style.position = 'fixed';
      },

      enableScroll() {
        const top = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(top || '0') * -1);
      },
    }

    Vue.prototype.$tools = $tools
    Vue.$tools = $tools
  }
}
