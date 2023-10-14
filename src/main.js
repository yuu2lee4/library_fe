import * as Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

window.Vue = Vue

/* eslint-disable no-new */
const app = Vue.createApp(App)
app.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}

//app.use(VueResource)
app.use(Element, {
  locale: zhCn,
})
.use(router)
.use(store)
.mount('#app')
