const getters = {
  // token: state => state.user.token,
  // menuList: state => state.power.menuList,
  // menuLevel1Active: state => state.power.menuLevel1Active,
  enterpriseId: state => state.user.userInfo.enterpriseId,
  projectEvents: state => state.project.projectEvents,
  queryData: state => state.planManagement.queryData,
  projectQueryData: state => state.project.projectQueryData
}
export default getters
