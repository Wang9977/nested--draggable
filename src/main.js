// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import router from './router'

Vue.config.productionTip = false

// vue-composition-api
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
