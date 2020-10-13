import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { TweenMax, ScrollToPlugin } from 'gsap/all'
import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'
import raf from '@/plugins/raf'
import filters from '@/plugins/filters'
import tools from '@/plugins/tools'
import scroll from '@/plugins/scroll'
import VueHead from 'vue-head'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
import VueAwesomeSwiper from 'vue-awesome-swiper'

// Multilingual configuration
import i18n from "@/plugins/i18n";
import getStartingLocale from "@/utils/i18n/get-starting-locale"
import { supportedLocalesInclude } from "@/utils/i18n/supported-locales"
import {
  setDocumentDirectionPerLocale,
  setDocumentLang
} from "@/utils/i18n/document"

// Apollo configuration
Vue.use(VueApollo)
const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_API_URL
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false;

Vue.use(raf)
Vue.use(tools)
Vue.use(scroll)
Vue.use(VueHead, {
  complement: 'Traveler',
  separator: '•'
})
Vue.use(VueAwesomeSwiper)

router.beforeEach((to, from, next) => {
  // Langs gestion
  if (to.params.locale === from.params.locale) {
    next()
    return
  }

  const locale = to.params.locale

  if (supportedLocalesInclude(locale)) {
    i18n.locale = locale
    setDocumentLang(locale)
    setDocumentDirectionPerLocale(locale)

    next()
  }else{
    next({ name: to.name, params: { locale: getStartingLocale() } })
  }
})

const app = new Vue({
  router,
  store,
  i18n,
  apolloProvider,
  render: h => h(App)
})

app.$mount('#Site')
