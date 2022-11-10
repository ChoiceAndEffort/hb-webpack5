// main.js
import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import axios from './ajax/axios';

// 挂载外部插件
Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  store,
  axios,
  render: (h) => h(App)
});
