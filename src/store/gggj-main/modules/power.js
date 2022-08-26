// import router from '@/router/index'
// import constantRouterMap from '@/router/index'

const state = {
  menuList: [],
  menuLevel1Active: 1 // 一级菜单当前选中项
}

const mutations = {
  SET_MENU_LIST: (state, arr) => {
    /*     const defaultmenu = [{
            action: "/index",
            icon: "organization",
            name: "首页",
        }]*/
    state.menuList = [...arr]
    // constantRouterMap.push({
    //   path: '/personmanagement',
    //   component: () => import('@/views/productionManagement/home.vue')
    // })
    // router.addRoutes(constantRouterMap)
    // console.log('---data.powerList-*----111', router);
  },
  SET_MENU_LEVEL1_ACTIVE: (state, index) => {
    state.menuLevel1Active = index;
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
