import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/index.js';

Vue.use(Router);

const whiteList = [

];

export const constantRouterMap = [];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRouterMap,
    mode: 'hash'
  });

const router = createRouter();

router.beforeEach((to, from, next) => {
  // 路由拦截
  const token = store.getters.token != '';
  if (token || whiteList.find((whitePath) => to.path == whitePath)) {
    next();
  } else {
    next({
      path: '/login'
    });
  }
});

export default router;
