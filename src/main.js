import Vue from 'vue'
import App from './App.vue'
import Router from './router'
import Axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './config/axios.js'


Vue.prototype.$axios=Axios
Axios.defaults.headers.post['Content-Type']='application/json';
Vue.config.productionTip = false;
Axios.defaults.withCredentials=true;
Vue.use(ElementUI);

new Vue({
  router:Router,
  render: h => h(App)
}).$mount('#app')
