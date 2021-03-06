import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/cascade-stacked-1',
      name: 'cascade-stacked-1',
      component: () => import(/* webpackChunkName: "cascade-stacked-1" */ './views/CascadeStackedView.vue')
    },
    {
      path: '/cascade-stacked-2',
      name: 'cascade-stacked-2',
      component: () => import(/* webpackChunkName: "cascade-stacked-2" */ './views/CascadeStackedComparisonView.vue')
    },
    {
      path: '/cascade-stacked-3',
      name: 'cascade-stacked-3',
      component: () => import(/* webpackChunkName: "cascade-stacked-3" */ './views/CascadeStackedView2.vue')
    },
    {
      path: '/multibar',
      name: 'multibar',
      component: () => import(/* webpackChunkName: "multibar" */ './views/MultiBarView.vue')
    },
    {
      path: '/multibar2',
      name: 'multibar2',
      component: () => import(/* webpackChunkName: "multibar2" */ './views/MultiBarView2.vue')
    },
    {
      path: '/multibar3',
      name: 'multibar3',
      component: () => import(/* webpackChunkName: "multibar3" */ './views/MultiBarView3.vue')
    }
  ]
})
