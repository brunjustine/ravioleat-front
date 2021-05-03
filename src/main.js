import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import JwPagination from 'jw-vue-pagination'
import * as VueGoogleMaps from "vue2-google-maps"

Vue.component('jw-pagination', JwPagination)


Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDJu2s8hlHZLoaGavJsXsCs8_k_jBSM2OQ",
    libraries: "places" // necessary for places input
  }
});


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

