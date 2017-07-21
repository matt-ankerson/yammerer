import Vue from 'vue'
import Router from 'vue-router'
import Channels from '@/components/Channels'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Channels', component: Channels }
  ]
})
