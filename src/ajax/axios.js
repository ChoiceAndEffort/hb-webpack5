import axios from 'axios';
import { Message } from 'element-ui';
import store from '@/store/index.js';

let baseUrl = '';
// 判断不同环境

/* axios默认设置*/
function setAxiosDefault() {
  axios.defaults.baseURL = baseUrl; // 默认基础路径
  axios.defaults.withCredentials = true; // 跨域请求时是否需要使用凭证
  axios.defaults.timeout = 3000; // 超时时间
  axios.defaults.headers = {
    'Access-Control-Allow-Origin': '*'
  };
}

setAxiosDefault();

/* 请求拦截*/
axios.interceptors.request.use(
  function(config) {
    // 添加token
    config.headers.Token = store.getters.token;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

/* 响应拦截*/
axios.interceptors.response.use(
  function(response) {
    const res = response.data;
    // 根据返回的状态码进行处理
    if (res.code === 0) {
      // 如果状态码为0, 直接返回数据
      return res;
    } else {
      // 如果返回的状态码为其他, 弹出错误提示, 并返回数据
      Message({
        message: res.msg || 'Error',
        type: 'error'
      });
      requestError(res.code);
      return Promise.reject(res);
    }
  },
  function(error) {
    Message({
      message: error,
      type: 'error'
    });
    return Promise.reject(error);
  }
);

// 对错误码进行处理
function requestError(code) {
  if (code === 401 || code === 403) {
    window.location.reload();
  }
}

export default axios;
