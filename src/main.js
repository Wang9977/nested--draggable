// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App2'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// import router from './router'

Vue.config.productionTip = false

// vue-composition-api
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)
Vue.use(ElementUI)
/* eslint-disable no-new */

import CombineArea from '@/components/index'
Vue.use(CombineArea)
new Vue({
  render: (h) => h(App)
}).$mount('#app')
