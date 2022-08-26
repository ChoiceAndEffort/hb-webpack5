import { elementVariables } from 'gggj_lib';
const defaultSettings = require('@/settings.js')

const state = {
  lang: defaultSettings.lang,
  theme: elementVariables?.theme || '#1678FF',
  visitedViews: []
}

const mutations = {
  SET_LANG: (state, lang) => {
    state.lang = lang;
  },
  SET_THEME: (state, theme) => {
    state.theme = theme;
  },
  ADD_VISITEDVIEWS: (state, tag) => {
    state.visitedViews.push(tag)
  },
  DELETE_VISITEDVIEWS: (state, index) => {
    state.visitedViews.splice(index, 1);
  },
  CLEAN_VISITEDVIEWS: (state, index) => {
    state.visitedViews.splice(0, state.visitedViews.length);
  },
  RESET_VISITEDVIEWS: (state, index) => {
    state.visitedViews = []
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
