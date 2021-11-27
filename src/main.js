import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

//mixins
import modelLoader from './mixins/modelLoader' 

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    modelLoader,
  },
})

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
