import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { TweenMax } from 'gsap'

import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'
import raf from '@/plugins/raf'
import filters from '@/plugins/filters'
import api from '@/plugins/api'
import tools from '@/plugins/tools'
import scroll from '@/plugins/scroll'
import VueHead from 'vue-head'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
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
const httpLink = createHttpLink({
  uri: process.env.VUE_APP_API_URL
})
const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

Vue.use(VueApollo)
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})


Vue.config.productionTip = false;

Vue.use(raf)
Vue.use(tools)
Vue.use(scroll)
Vue.use(api)
Vue.use(VueHead, {
  complement: 'Traveler',
  separator: '•'
})
Vue.use(VueAwesomeSwiper)


router.beforeEach((to, from, next) => {
  // Check languages 
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
