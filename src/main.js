import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//mixins
import modelLoader from './mixins/modelLoader' 

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.mixin({
  methods: {
    modelLoader,
  },
})

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
