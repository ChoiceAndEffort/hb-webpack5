import axios from 'axios';
import {
  Message
} from 'element-ui'
import store from '@/store/index.js'
import router from '@/router/index.js'
const defaultSettings = require('@/settings.js')

let baseUrl = ''
// 判断不同环境

console.log('********', process.env.NODE_ENV);
console.log('********', process.env);

if (['production', 'show'].includes(process.env.NODE_ENV)) {
  baseUrl = defaultSettings.productionApi;
} else if (['test'].includes(process.env.NODE_ENV)) {
  baseUrl = defaultSettings.testApi;
} else if (process.env.NODE_ENV === 'development') {
  baseUrl = defaultSettings.developmentApi;
}

/* axios默认设置*/
function setAxiosDefault() {
  axios.defaults.baseURL = baseUrl // 默认基础路径
  axios.defaults.withCredentials = true; // 跨域请求时是否需要使用凭证
  axios.defaults.timeout = defaultSettings.timeout; // 超时时间
  axios.defaults.headers = {
    'Access-Control-Allow-Origin': '*'
  }
}

setAxiosDefault();

/* 请求拦截*/
axios.interceptors.request.use(function(config) {
  // 添加token
  config.headers.Token = store.getters.token;
  return config;
}, function(error) {
  return Promise.reject(error);
});

/* 响应拦截*/
axios.interceptors.response.use(function(response) {
  const res = response.data
  // 根据返回的状态码进行处理
  if (res.code === 0) { // 如果状态码为0, 直接返回数据
    return res;
  } else { // 如果返回的状态码为其他, 弹出错误提示, 并返回数据
    Message({
      message: res.msg || 'Error',
      type: 'error'
    })
    requestError(res.code);
    return Promise.reject(res)
  }
}, function(error) {
  Message({
    message: error,
    type: 'error'
  })
  return Promise.reject(error)
});

// 对错误码进行处理
function requestError(code) {
  if (code === 401 || code === 403) { // 如果返回码为需要登录, 则通过vuex进行退出登录处理
    store.commit('user/SET_TOKEN', '') // 清空token
    store.commit('user/SET_USERINFO', {}); // 清空用户信息
    router.push('/login')
    window.location.reload();
  }
}

export default axios
