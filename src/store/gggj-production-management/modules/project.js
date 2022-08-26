const state = {
  projectEvents: [],
  projectQueryData: undefined
}

const mutations = {
  ADD_EVENT(state, eventName) {
    if (!state.projectEvents.find(value => value == eventName)) {
      state.projectEvents.push(eventName);
    }
  },
  QUERY_DATA(state, eventName) {
    state.projectQueryData = eventName;
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

