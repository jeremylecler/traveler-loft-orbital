import Vue from 'vue'
import Router from 'vue-router'

import App from '@/App'
import RouterView from '@/RouterView'
import i18n from "@/plugins/i18n"

import Home from '@/views/Home'
import Map from '@/views/Map'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      redirect: i18n.locale
    },
    {
      path: "/:locale",
      component: RouterView,
      children: [
        {
          path: 'continents',
          name: 'continents',
          component: Map
        },
        {
          path: 'continents/:code',
          name: 'continent',
          component: Map
        },
        {
          path: 'countries/:code',
          name: 'country',
          component: Map
        },
        {
          path: '',
          name: 'home',
          component: Home
        }
      ]
    }
  ]
})
