// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import axios from './ajax/axios'
// import directivesArr from '@/directives/index';
import './styles/changeBodyELeStyle.scss';
// import { elementVariables, gggjCommon } from 'gggj_lib';

// 生产模块的main.js文件迁移
import '@/utils/productionManagement/filter'; // 时间过滤
import '@/assets/productionManagement/styles/common.css'
import onlyNumber from '@/directives/productionManagement/inputNumber.js'; // 限制input输入最大最小值
import commonJs from '@/assets/productionManagement/comjs/common.js' // 公共js方法 字典表方法
import echartFn from '@/views/productionManagement/components/chart/index.js' // 封装echart数据方法
import echartPanel from '@/views/productionManagement/components/chart/index.vue' // 封装chart组件
import * as echarts from 'echarts'

// 挂载外部插件
Vue.use(ElementUI)
Vue.use(onlyNumber); // 添加此行=>使用该全局指令

// 挂载全局方法
// Vue.ajax = Vue.prototype.$ajax = ajax
Vue.prototype.$echarts = echarts
Vue.prototype.commonJs = commonJs
Vue.prototype.$echartFn = echartFn

// 挂载全局组件
Vue.component(echartPanel.name, echartPanel)

// 挂载全局指令
// directivesArr.forEach(item => {
//   Vue.directive(item.name, item.directiveObj)
// });

new Vue({
  el: '#app',
  router,
  store,
  axios,
  render: (h) => h(App)
})
