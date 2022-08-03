import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

Vue.config.productionTip = false
Vue.config.port = 8082

// 导入全局样式表
import './assets/css/global.scss'
// 导入全局js
import global from './assets/js/global'
Vue.prototype.$global = global

// 导入axios
import axios from 'axios';
axios.defaults.headers['Cross-Method'] = 'CORS'
axios.defaults.withCredentials=true
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization =  'cookie' 
  return config
})
Vue.prototype.$http = axios

// 导入qs类库
import qs from 'qs'
Vue.prototype.$qs = qs

// 导入vue-cookies库
import VueCookies from 'vue-cookies';
Vue.prototype.$cookies = VueCookies
Vue.use(VueCookies)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
