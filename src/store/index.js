import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createLogger from 'vuex/dist/logger';
import getters from './getters';

import gggjMainStoreModules from './gggj-main/index'
import gggjProductionManagement from './gggj-production-management/index'

Vue.use(Vuex);

const modules = {
  ...gggjMainStoreModules,
  ...gggjProductionManagement
}
console.log('----------------', modules, getters);
const store = new Vuex.Store({
  modules,
  getters,
  strict: true,
  plugins: [createPersistedState({
    // 需要本地持久储存的数据
    paths: [
      'user.loginInfo' // 记住用户登录账号密码
    ]
  }), createPersistedState({
    storage: window.sessionStorage,
    // 需要本地持久储存的数据
    paths: [
      'user.token',
      'user.userInfo',
      'power.menuList'
    ]
  }), createLogger()]
});

export default store;
