// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import 'element-ui/lib/theme-default/index.css'
import VueResource from 'vue-resource'
import fetch from './assets/js/fecth'
import pub from './assets/js/pub'

Vue.config.productionTip = false

window.Vue = Vue;
Vue.use(VueResource);
Vue.use(Element)
Vue.use(fetch,{Message:Element.Message});
Vue.use(pub);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
