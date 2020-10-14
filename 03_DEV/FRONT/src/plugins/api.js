import axios from 'axios'
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions'
import store from '../store'
import i18n from "@/plugins/i18n"

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL_EXCHANGE,
  // headers: { 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' },
  adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter))
})

const API = {
  EXCHANGE: '/latest?base=:base'
}

function url (path, ...segments) {
  let i = 0
  const { state } = store
  const uri = path.replace(/:\w+/g, () => {
    let s = segments[i]
    i += 1
    return s
  })

  return uri
}

export default {
  install (Vue, options) {
    const $api = {
      getExchange(base) {
        return http.get(url(API.EXCHANGE, base))
      }
    }

    Vue.prototype.$api = $api
    Vue.$api = $api
  }
}
