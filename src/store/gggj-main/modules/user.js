import router from '@/router/index.js'
const state = {
  token: '',
  userInfo: {},
  loginInfo: {
    account: '',
    password: ''
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, data) => {
    state.userInfo = data
  },
  SET_LOGININFO: (state, data) => {
    state.loginInfo = data
  },
  SET_ENTERPRISENAME: (state, data) => {
    state.userInfo.enterpriseName = data
  },
  SET_LOGINID: (state, data) => {
    state.userInfo.loginId = data
  }
}

const actions = {
  // 退出登录
  logout({
    commit,
    state
  }) {
    commit('SET_TOKEN', ''); // 清空token
    commit('SET_USERINFO', {}); // 清空用户信息
    router.push('/')
    window.location.reload();
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
