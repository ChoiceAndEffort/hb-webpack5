import Vue from 'vue'
import Router from 'vue-router'
// import Index from '@/views/index.vue'
import Layout from '@/Layout'
import store from '@/store/index.js';

// import Home from '@/views/productionManagement/home.vue'
// import {
//   AppMain
// } from 'gggj_lib'
import Index from '@/views/productionManagement/index.vue'

Vue.use(Router)

const whiteList = ['/login', '/retrieval-password', '/404'];

export const constantRouterMap = [{
    path: '/',
    name: 'index',
    redirect: '/login',
    component: Index
  },
  {
    path: '/index',
    name: 'systemindex',
    component: () => import('@/views/userInfos/enterprise.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/userInfos/login.vue')
  }, {
    path: '/retrieval-password',
    name: 'retrieval-password',
    component: () => import('@/views/userInfos/retrieval-password.vue')
  }, {
    path: '/register',
    name: 'register',
    component: () => import('@/views/userInfos/register.vue')
  },

  {
    path: '/layout/production-management/',
    name: 'index',
    component: Index,
    // 重定向
    redirect: '/layout/production-management/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/productionManagement/home.vue'),
      meta: {
        title: '首页'
      }
    }]
  },

  {
    path: '/layout/*',
    component: Layout
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

const cheangeAreaData = (data) => {
  for (var i = 0; i < data.length; i++) {
    for (var j in data[i]) {
      if (j == 'action') {
        data[i]['path'] = data[i].action;
        data[i]['component'] = "() => import('@/views/productionManagement/project/project-float.vue')";
        // delete data[i].action;
      }
      if (j == 'children') {
        if (data[i].children) {
          if (data[i].children.length > 0) {
            cheangeAreaData(data[i].children)
          }
        } else {
          delete data[i].children;
        }
      }
    }
  }
  return data
}

let addRoutes = [{
  path: 'project/project-info',
  component: () => import('@/views/productionManagement/home.vue')
}]

// let dealList = constantRouterMap.concat(cheangeAreaData(firstList))
let dealList = constantRouterMap.concat(addRoutes)
router.matcher = new Router().matcher
router.addRoutes(dealList)

console.log('总的路由数据----------', dealList);
// dealList.forEach(item => {
//   // router.matcher = new Router().matcher
//   router.addRoute(item)
// })

router.beforeEach((to, from, next) => { // 路由拦截
  const token = store.getters.token != '';
  if (token || whiteList.find(whitePath => to.path == whitePath)) {
    next()
    //  next({
    //   ...to,
    //   replace: true
    // })
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

export default router