import Vue from 'vue'
import Router from 'vue-router'
// import Index from '@/views/index.vue'
import Layout from '@/Layout'
import store from '@/store/index.js';
import productionManagement from './productionManagement.js';
import fms from './fms'

Vue.use(Router)

const whiteList = ['/login', '/retrieval-password', '/404', '/register', '/libView', '/uploadTest'];

export const constantRouterMap = [{
  path: '/',
  name: 'index',
  redirect: '/login'
  // component: Index
},
{
  path: '/index',
  name: 'systemindex',
  component: () => import('../views/userInfos/enterprise.vue')
}, {
  path: '/login',
  name: 'login',
  component: () => import('../views/userInfos/login.vue')
}, {
  path: '/retrieval-password',
  name: 'retrieval-password',
  component: () => import('../views/userInfos/retrieval-password.vue')
}, {
  path: '/register',
  name: 'register',
  component: () => import('../views/userInfos/register.vue')
}, {
  path: '/libView',
  name: 'libView',
  component: () => import('../views/libView/index.vue')
},
{
  path: '/uploadTest',
  name: 'uploadTest',
  component: () => import('../views/fileUpload/index.vue')
}, {
  path: '/layout/*',
  component: Layout,
  children: [
    ...productionManagement,
    ...fms

  ]
}
]

const createRouter = () => new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap,
  mode: 'hash'
})

const router = createRouter()
let firstList = store.state.power.menuList
console.log('-----所有的路由', firstList);

router.beforeEach((to, from, next) => { // 路由拦截
  const token = store.getters.token != '';
  if (token || whiteList.find(whitePath => to.path == whitePath)) {
    next()
  } else {
    next({
      path: '/login'
    })
  }
})

// 解决vue路由重复导航错误
// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

router.beforeResolve((to, from, next) => {
  addVisitedViews(to);
  next();
})

function addVisitedViews(to) {
  let tabsArr = store.getters.menuList[store.getters.menuLevel1Active]?.children;
  if (whiteList.find(whitePath => to.path == whitePath)) return // 白名单
  if (store.getters.visitedViews.find(item => to.path == item.path)) return // 已有
  if (tabsArr[0].action == to.path) return // 首页
  store.commit('app/ADD_VISITEDVIEWS', {
    hash: to.hash,
    meta: to.meta,
    params: to.params,
    path: to.path,
    query: to.query
  });
  // treeForeach(tabsArr,to.path, to);
}

// function treeForeach(tree, path, to) { // 权限比对
//   tree.forEach(item => {
//     if (item.action == path) {
//       store.commit('app/ADD_VISITEDVIEWS', {
//         hash: to.hash,
//         meta: to.meta,
//         params: to.params,
//         path: path,
//         query: to.query
//       });
//     }
//     item.children && treeForeach(item.children, path, to);
//   })
// }

export default router
