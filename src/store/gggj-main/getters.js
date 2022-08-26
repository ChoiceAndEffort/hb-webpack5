const getters = {
  token: (state) => state.user.token,
  menuList: (state) => state.power.menuList,
  menuLevel1Active: (state) => state.power.menuLevel1Active,
  lang: (state) => state.app.lang,
  theme: (state) => state.app.theme,
  visitedViews: (state) => state.app.visitedViews
};
export default getters;
