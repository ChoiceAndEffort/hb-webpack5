module.exports = {
  /**
    * @type {string}
    * @description 网站标题
    */
  //   title: '',

  /**
    * @type {string} zh中文 | en英文
    * @description 当前语言
    */
  lang: 'zh',

  /**
    * @type {number}
    * @description 请求超时时间，毫秒（默认2分钟）
    */
  timeout: 1200000,

  /**
    * @type {string}
    * @description 备案号
    */
  caseNumber: '备案号：鄂ICP备2020017363号-2',
  /**
    * @type {array}
    * @description 路由白名单
    */
  whiteList: ['/login', '/retrieval-password', '/404'],
  /**
    * @type {string}
    * @description 自己的ip
    */
  myNextwork: '//localhost',
  /**
    * @type {string}
    * @description 开发环境请求地址
    */
  developmentApi: 'http://192.168.20.151:9099',
  // developmentApi: 'https://test-erp.gggjpg.com:2222',
  /**
    * @type {string}
    * @description 生产环境请求地址
    */
  productionApi: 'https://erp-api.gggjpg.com:9999',
  /**
    * @type {string}
    * @description 测试环境请求地址
    */
  testApi: 'https://test-erp.gggjpg.com:2222',
  /**
    * @type {string}
    * @description 生产管理模块路由前缀
    */
  routeBasePMS: '/layout/production-management',
  /**
    * @type {string}
    * @description gggjui模块路由前缀
    */
  routeBaseGggjUi: '/layout/gggj-ui',
  /**
    * @type {string}
    * @description 供应链模块路由前缀
    */
  routeBaseScm: '/layout/scm',
  /**
    * @type {string}
    * @description 合同模块路由前缀
    */
  routeBaseContract: '/layout/contract',
  /**
    * @type {string}
    * @description 督办模块路由前缀
    */
  routeBaseTss: '/layout/tss',
  /**
    * @type {string}
    * @description 督办模块路由前缀
    */
  routeBaseCrm: '/layout/crm',
  /**
    * @type {string}
    * @description 信息门户模块路由前缀
    */
  routeBaseWfs: '/layout/wfs',
  /**
    * @type {string}
    * @description 财务管理服务模块路由前缀
    */
  routeBaseFms: '/layout/fms',
  /**
    * @type {string}
    * @description 后台管理服务模块路由前缀
    */
  routeBaseEms: '/layout/ems'
}
