// 计划管理vuex
const state = {
  queryData: undefined
}

const mutations = {
  QUERY_DATA(state, eventName) {
    // console.log('-----修改了参数吗',eventName);
    state.queryData = eventName;
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

