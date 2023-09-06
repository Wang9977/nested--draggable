import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'

Vue.config.productionTip = false

// vue-composition-api
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)
Vue.use(ElementUI)

import CombineArea from '@/components/index'
Vue.use(CombineArea)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
