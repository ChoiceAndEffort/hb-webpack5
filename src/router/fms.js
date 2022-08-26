import Home from '@/views/fms/home.vue'
import {
  AppMain
} from 'gggj_lib'
import Index from '@/views/fms/index.vue'

const routes = [{
  path: '/layout/fms/',
  name: 'index',
  component: Index,
  redirect: '/layout/fms/home',
  children: [{
    path: 'home',
    name: 'home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: 'basedata',
    name: 'basedata',
    component: AppMain,
    redirect: 'basedata/voucher-word',
    children: [{
      path: 'voucher-word',
      name: 'voucher-word',
      component: () =>
        import('../views/fms/basedata/voucher-word/index.vue'),
      meta: {
        title: '凭证字',
        keepAlive: true
      }
    }, {
      path: 'voucher-word_add',
      name: 'voucher-word_add',
      component: () =>
        import('../views/fms/basedata/voucher-word/info.vue'),
      meta: {
        title: '添加凭证字'
      }
    }, {
      path: 'voucher-word_edit',
      name: 'voucher-word_edit',
      component: () =>
        import('../views/fms/basedata/voucher-word/info.vue'),
      meta: {
        title: '修改凭证字'
      }
    }, {
      path: 'bank-account_list',
      name: 'bank-account_list',
      component: () =>
        import('../views/fms/basedata/bank-account/index.vue'),
      meta: {
        title: '银行账户',
        keepAlive: true
      }
    }, {
      path: 'bank-account_add',
      name: 'bank-account_add',
      component: () =>
        import('../views/fms/basedata/bank-account/info.vue'),
      meta: {
        title: '添加银行账户'
      }
    }, {
      path: 'bank-account_edit',
      name: 'bank-account_edit',
      component: () =>
        import('../views/fms/basedata/bank-account/info.vue'),
      meta: {
        title: '修改银行账户'
      }
    }, {
      path: 'bank_list',
      name: 'bank_list',
      component: () =>
        import('../views/fms/basedata/bank/index.vue'),
      meta: {
        title: '银行信息',
        keepAlive: true
      }
    }, {
      path: 'bank_add',
      name: 'bank_add',
      component: () =>
        import('../views/fms/basedata/bank/info.vue'),
      meta: {
        title: '添加银行信息'
      }
    }, {
      path: 'bank_edit',
      name: 'bank_edit',
      component: () =>
        import('../views/fms/basedata/bank/info.vue'),
      meta: {
        title: '修改银行信息'
      }
    }, {
      path: 'currency_list',
      name: 'currency_list',
      component: () =>
        import('../views/fms/basedata/currency/index.vue'),
      meta: {
        title: '常用币种',
        keepAlive: true
      }
    }, {
      path: 'currency_add',
      name: 'currency_add',
      component: () =>
        import('../views/fms/basedata/currency/info.vue'),
      meta: {
        title: '添加币种'
      }
    }, {
      path: 'currency_edit',
      name: 'currency_edit',
      component: () =>
        import('../views/fms/basedata/currency/info.vue'),
      meta: {
        title: '修改币种'
      }
    }, {
      path: 'cash-flow-code_list',
      name: 'cash-flow-code_list',
      component: () =>
        import('../views/fms/basedata/cash-flow-code/index.vue'),
      meta: {
        title: '现金流量码',
        keepAlive: true
      }
    }, {
      path: 'cash-flow-code_add',
      name: 'cash-flow-code_add',
      component: () =>
        import('../views/fms/basedata/cash-flow-code/info.vue'),
      meta: {
        title: '添加现金流量码'
      }
    }, {
      path: 'cash-flow-code_edit',
      name: 'cash-flow-code_edit',
      component: () =>
        import('../views/fms/basedata/cash-flow-code/info.vue'),
      meta: {
        title: '修改现金流量码'
      }
    }, {
      path: 'summary_list',
      name: 'summary_list',
      component: () =>
        import('../views/fms/basedata/summary/index.vue'),
      meta: {
        title: '常用摘要列表',
        keepAlive: true
      }
    }, {
      path: 'summary_add',
      name: 'summary_add',
      component: () =>
        import('../views/fms/basedata/summary/info.vue'),
      meta: {
        title: '添加常用摘要'
      }
    }, {
      path: 'summary_edit',
      name: 'summary_edit',
      component: () =>
        import('../views/fms/basedata/summary/info.vue'),
      meta: {
        title: '修改常用摘要'
      }
    }, {
      path: 'aux-check-category_list',
      name: 'aux-check-category_list',
      component: () =>
        import('../views/fms/basedata/aux-check-category/index.vue'),
      meta: {
        title: '辅助核算项类别列表',
        keepAlive: true
      }
    }, {
      path: 'aux-check-category_add',
      name: 'aux-check-category_add',
      component: () =>
        import('../views/fms/basedata/aux-check-category/info.vue'),
      meta: {
        title: '添加辅助核算项类别'
      }
    }, {
      path: 'aux-check-category_edit',
      name: 'aux-check-category_edit',
      component: () =>
        import('../views/fms/basedata/aux-check-category/info.vue'),
      meta: {
        title: '修改辅助核算项类别'
      }
    }, {
      path: 'exchange-rate_list',
      name: 'exchange-rate_list',
      component: () =>
        import('../views/fms/basedata/exchange-rate/index.vue'),
      meta: {
        title: '汇率列表',
        keepAlive: true
      }
    }, {
      path: 'exchange-rate_add',
      name: 'exchange-rate_add',
      component: () =>
        import('../views/fms/basedata/exchange-rate/info.vue'),
      meta: {
        title: '添加汇率'
      }
    }, {
      path: 'exchange-rate_edit',
      name: 'exchange-rate_edit',
      component: () =>
        import('../views/fms/basedata/exchange-rate/info.vue'),
      meta: {
        title: '修改汇率'
      }
    }, {
      path: 'account-title',
      name: 'account-title',
      component: () =>
        import('../views/fms/basedata/account-title/index.vue'),
      meta: {
        title: '科目设置'
      }
    }, {
      path: 'aux-check-item_list',
      name: 'aux-check-item_list',
      component: () =>
        import('../views/fms/basedata/aux-check-item/index.vue'),
      meta: {
        title: '辅助核算项列表',
        keepAlive: true
      }
    }, {
      path: 'aux-check-item_add',
      name: 'aux-check-item_add',
      component: () =>
        import('../views/fms/basedata/aux-check-item/info.vue'),
      meta: {
        title: '添加辅助核算项'
      }
    }, {
      path: 'aux-check-item_edit',
      name: 'aux-check-item_edit',
      component: () =>
        import('../views/fms/basedata/aux-check-item/info.vue'),
      meta: {
        title: '修改辅助核算项'
      }
    }]
  }
  ]
}]

export default routes
