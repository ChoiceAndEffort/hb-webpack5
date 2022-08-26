import Home from '@/views/productionManagement/home.vue'
import {
  AppMain
} from 'gggj_lib'
import Index from '@/views/productionManagement/index.vue'

const routes = [{
  path: '/layout/production-management/',
  name: 'index',
  component: Index,
  // 重定向
  redirect: '/layout/production-management/home',
  children: [{
    path: 'home',
    name: 'home',
    component: Home,
    meta: {
      title: '首页'
    }
  }, { // 项目资料
    path: 'project',
    name: 'project',
    component: AppMain,
    redirect: 'project/project-info',
    children: [{
      path: 'project-float',
      name: 'project-float',
      component: () => import('@/views/productionManagement/project/project-float.vue')
    },
    {
      path: 'project-info',
      name: 'project-info',
      component: () => import('@/views/productionManagement/project/project-info.vue'),
      meta: {
        title: '项目列表',
        keepAlive: true
      }
    },
    {
      path: 'configure-outsourcing',
      name: 'configure-outsourcing',
      component: () => import('@/views/productionManagement/project/configure-outsourcing.vue'),
      meta: {
        title: '配置外协单位'
      }
    },
    {
      path: 'configurator-people',
      name: 'configurator-people',
      component: () => import('@/views/productionManagement/project/configurator-people.vue'),
      meta: {
        title: '配置人员',
        keepAlive: true
      }
    },
    {
      path: 'project-add',
      name: 'project-add',
      component: () => import('@/views/productionManagement/project/project-add.vue'),
      meta: {
        title: '新增项目'
      }
    },
    {
      path: 'project-edit',
      name: 'project-edit',
      component: () => import('@/views/productionManagement/project/project-add.vue'),
      meta: {
        title: '编辑项目'
      }
    }, {
      path: 'technology-set',
      name: 'technology-set',
      component: () => import('@/views/productionManagement/project/technology-set.vue'),
      meta: {
        title: '配置工艺定额'
      }
    }, {
      path: 'data-management',
      name: 'dataManagement',
      component: () => import('@/views/productionManagement/project/data-management.vue'),
      meta: {
        title: '数据管理',
        keepAlive: true
      }
    }, {
      path: 'details-management',
      name: 'details-management',
      component: () => import('@/views/productionManagement/project/details-management.vue'),
      meta: {
        title: '套图详细列表'
      }
    }, {
      path: 'check-data',
      name: 'check-data',
      component: () => import('@/views/productionManagement/project/check-data.vue'),
      meta: {
        title: '数据校验'
      }
    }, {
      path: 'edit-data',
      name: 'edit-data',
      component: () => import('@/views/productionManagement/project/edit-data.vue'),
      meta: {
        title: '数据管理查看',
        keepAlive: true
      }
    }, {
      path: 'edit-material',
      name: 'edit-material',
      component: () => import('@/views/productionManagement/project/edit-data-material.vue'),
      meta: {
        title: '物料数据编辑',
        keepAlive: true
      }
    }, {
      path: 'document-management',
      name: 'document-management',
      component: () => import('@/views/productionManagement/project/document-management.vue'),
      meta: {
        title: '文档管理',
        keepAlive: true
      }
    }, {
      path: 'document-add',
      name: 'document-add',
      component: () => import('@/views/productionManagement/project/document-add.vue'),
      meta: {
        title: '新增文档',
        keepAlive: true
      }
    },
    {
      path: 'quota-allocation',
      name: 'quota-allocation',
      component: () => import('@/views/productionManagement/project/quota-allocation.vue'),
      meta: {
        title: '定额配置',
        keepAlive: true
      }
    },
    {
      path: 'quota-edit',
      name: 'quota-edit',
      component: () => import('@/views/productionManagement/project/quota-edit.vue'),
      meta: {
        title: '定额编辑'
      }
    }
    ]
  }, { // 人事管理
    path: 'personmanagement',
    name: 'personmanagement',
    component: AppMain,
    redirect: 'personmanagement/person-index',
    children: [{
      path: 'role',
      name: 'role',
      component: () => import('@/views/productionManagement/personmanagement/role.vue'),
      meta: {
        title: '角色管理',
        keepAlive: true
      }
    },
    {
      path: 'power',
      name: 'power',
      component: () => import('@/views/productionManagement/personmanagement/power.vue'),
      meta: {
        title: '权限管理',
        keepAlive: true
      }
    },
    {
      path: 'department',
      name: 'department',
      component: () => import('@/views/productionManagement/personmanagement/department.vue'),
      meta: {
        title: '部门管理',
        keepAlive: true
      }
    },
    {
      path: 'postmanagement',
      name: 'postmanagement',
      component: () => import('@/views/productionManagement/personmanagement/postmanagement.vue'),
      meta: {
        title: '岗位管理',
        keepAlive: true
      }
    },
    {
      path: 'postRole',
      name: 'postRole',
      component: () => import('@/views/productionManagement/personmanagement/postRole.vue'),
      meta: {
        title: '岗位角色管理',
        keepAlive: true
      }
    },
    {
      path: 'workType',
      name: 'workType',
      component: () => import('@/views/productionManagement/personmanagement/workType.vue'),
      meta: {
        title: '工种管理',
        keepAlive: true
      }
    },
    {
      path: 'production-architecture',
      name: 'production-architecture',
      component: () => import('@/views/productionManagement/personmanagement/productionArchitecture.vue'),
      meta: {
        title: '生产组织架构'
      }
    },
    {
      path: 'administrative-structure',
      name: 'administrative-structure',
      component: () => import('@/views/productionManagement/personmanagement/administrativeStructure.vue'),
      meta: {
        title: '行政组织架构'
      }
    },
    {
      path: 'operating-count',
      name: 'operating-count',
      component: () => import('@/views/productionManagement/personmanagement/operating-count.vue'),
      meta: {
        title: '工费统计'
      }
    }, {
      path: 'person-add',
      name: 'person-add',
      component: () => import('@/views/productionManagement/personmanagement/person-add.vue'),
      meta: {
        title: '新增人员'
      }
    },
    /* 车间工费详情 */
    {
      path: 'workshop-details',
      name: 'workshop-details',
      component: () => import('@/views/productionManagement/personmanagement/workshop-details.vue'),
      meta: {
        title: '车间工费详情'
      }
    },
    /* 项目工费详情 */
    {
      path: 'project-details',
      name: 'project-details',
      component: () => import('@/views/productionManagement/personmanagement/project-details.vue'),
      meta: {
        title: '项目工费详情'
      }
    }

    ]
  }, { // 计划管理
    path: 'planmanagement',
    name: 'planmanagement',
    component: AppMain,
    redirect: 'planmanagement/project-plan-list',
    children: [{
      path: 'project-plan-list',
      name: 'project-plan-list',
      component: () => import('@/views/productionManagement/planmanagement/project-plan-list.vue'),
      meta: {
        title: '单项目施工计划'
      }
    },
    {
      path: 'project-plan-edit',
      name: 'project-plan-edit',
      component: () => import('@/views/productionManagement/planmanagement/project-plan-edit.vue'),
      meta: {
        title: '单项目施工计划修改'
      }
    }, {
      path: 'project-plan-nesting',
      name: 'project-plan-nesting',
      component: () => import('@/views/productionManagement/planmanagement/project-plan-nesting.vue'),
      meta: {
        title: '套料计划维护'
      }
    }, {
      path: 'project-plan-material',
      name: 'project-plan-material',
      component: () => import('@/views/productionManagement/planmanagement/project-plan-material.vue'),
      meta: {
        title: '物料计划维护'
      }
    }, {
      path: 'plan-index',
      name: 'plan-index',
      component: () => import('@/views/productionManagement/planmanagement/plan-index.vue'),
      meta: {
        title: '生产准备计划'
      }
    },
    {
      path: 'plan-add',
      name: 'plan-add',
      component: () => import('@/views/productionManagement/planmanagement/plan-add.vue'),
      meta: {
        title: '新增准备计划'
      }
    },
    {
      path: 'plan-view',
      name: 'plan-view',
      component: () => import('@/views/productionManagement/planmanagement/plan-view.vue'),
      meta: {
        title: '计划详情'
      }
    },
    {
      path: 'total-view',
      name: 'total-view',
      component: () => import('@/views/productionManagement/planmanagement/total-view.vue'),
      meta: {
        title: '计划详情'
      }
    },
    {
      path: 'plan-count',
      name: 'plan-count',
      component: () => import('@/views/productionManagement/planmanagement/plan-count.vue'),
      meta: {
        title: '企业产能评估'
      }
    },
    {
      path: 'approval-details',
      name: 'approval-details',
      component: () => import('@/views/productionManagement/planmanagement/approval-details.vue')
    },
    {
      path: 'completion-view',
      name: 'completion-view',
      component: () => import('@/views/productionManagement/planmanagement/completion-view.vue')
    },
    {
      path: 'completion-view',
      name: 'completion-view',
      component: () => import('@/views/productionManagement/planmanagement/completion-view.vue')
    },
    {
      path: 'plan-completed',
      name: 'plan-completed',
      component: () => import('@/views/productionManagement/planmanagement/plan-completed.vue')
    },
    {
      path: 'process-plan',
      name: 'process-plan',
      component: () => import('@/views/productionManagement/planmanagement/process-plan.vue')
    },
    {
      path: 'add-coatingPlan',
      name: 'add-coatingPlan',
      component: () => import('@/views/productionManagement/planmanagement/add-coatingPlan.vue')
    },
    {
      path: 'edit-coatingPlan',
      name: 'edit-coatingPlan',
      component: () => import('@/views/productionManagement/planmanagement/edit-coatingPlan.vue')
    },
    {
      path: 'working-procedure-index',
      name: 'working-procedure-index',
      component: () => import('@/views/productionManagement/planmanagement/working-procedure-index.vue'),
      meta: {
        title: '工序作业计划'
      }
    },
    {
      path: 'working-procedure-detail',
      name: 'working-procedure-detail',
      component: () => import('@/views/productionManagement/planmanagement/working-procedure-detail.vue'),
      meta: {
        title: '工序作业计划'
      }
    },
    {
      path: 'working-procedure-edit',
      name: 'working-procedure-edit',
      component: () => import('@/views/productionManagement/planmanagement/working-procedure-edit.vue'),
      meta: {
        title: '新增计划'
      }
    },
    {
      path: 'working-procedure-add',
      name: 'working-procedure-add',
      component: () => import('@/views/productionManagement/planmanagement/working-procedure-add.vue'),
      meta: {
        title: '编辑新增计划'
      }
    }
    ]
  }, { // 派工管理
    path: 'dispatchmanagement',
    name: 'dispatchmanagement',
    component: AppMain,
    redirect: 'dispatchmanagement/prefabrication',
    children: [{
      path: 'prefabrication',
      name: 'prefabrication',
      component: () => import('@/views/productionManagement/dispatchmanagement/prefabrication.vue'),
      meta: {
        title: '派工单预制'
      }
    }, {
      path: 'hosm',
      name: 'hosm',
      component: () => import('@/views/productionManagement/dispatchmanagement/hosm.vue'),
      meta: {
        title: '下料派工'
      }
    }, {
      path: 'hosms',
      name: 'hosms',
      component: () => import('@/views/productionManagement/dispatchmanagement/hosms.vue'),
      meta: {
        title: '下料选择人员'
      }
    }, {
      path: 'hosmv',
      name: 'hosmv',
      component: () => import('@/views/productionManagement/dispatchmanagement/hosmv.vue'),
      meta: {
        title: '工单详情'
      }
    }, {
      path: 'transport-dispatch',
      name: 'transport-dispatch',
      component: () => import('@/views/productionManagement/dispatchmanagement/transport-dispatch.vue'),
      meta: {
        title: '转运派工'
      }
    }, {
      path: 'transport-dispatch-add',
      name: 'transport-dispatch-add',
      component: () => import('@/views/productionManagement/dispatchmanagement/transport-dispatch-add.vue'),
      meta: {
        title: '转运派工配置'
      }
    }, {
      path: 'transport-dispatch-detail',
      name: 'transport-dispatch-detail',
      component: () => import('@/views/productionManagement/dispatchmanagement/transport-dispatch-detail.vue'),
      meta: {
        title: '转运派工详情'
      }
    }]
  }, { // 生产管理
    path: 'producemanage',
    name: 'producemanage',
    component: AppMain,
    redirect: 'producemanage/ex-factory',
    children: [{
      path: 'ex-factory',
      name: 'ex-factory',
      component: () => import('@/views/productionManagement/producemanage/ex-factory.vue'),
      meta: {
        title: '出厂管理'
      }
    },
    {
      path: 'ex-factory-detail',
      name: 'ex-factory-detail',
      component: () => import('@/views/productionManagement/producemanage/ex-factory-detail.vue'),
      meta: {
        title: '出厂清单'
      }
    },
    {
      path: 'ex-factory-add',
      name: 'ex-factory-add',
      component: () => import('@/views/productionManagement/producemanage/ex-factory-add.vue'),
      meta: {
        title: '新增运输需求'
      }
    },
    {
      path: 'turnOrder',
      name: 'turnOrder',
      component: () => import('@/views/productionManagement/producemanage/turnOrder.vue'),
      meta: {
        title: '转序管理'
      }
    },
    {
      path: 'turnOrderDetail',
      name: 'turnOrderDetail',
      component: () => import('@/views/productionManagement/producemanage/turnOrderDetail.vue'),
      meta: {
        title: '转序详情'
      }
    },
    {
      path: 'receive',
      name: 'receive',
      component: () => import('@/views/productionManagement/producemanage/receive.vue'),
      meta: {
        title: '转序接收'
      }
    },
    {
      path: 'receiveDetail',
      name: 'receiveDetail',
      component: () => import('@/views/productionManagement/producemanage/turnOrderDetail.vue'),
      meta: {
        title: '接收确认'
      }
    }
    ]
  }, { // 质量管理
    path: 'qualitymanagement',
    name: 'qualitymanagement',
    component: AppMain,
    redirect: 'qualitymanagement/quality-check',
    children: [{
      path: 'quality-check',
      name: 'quality-check',
      component: () => import('@/views/productionManagement/qualitymanagement/quality-check.vue'),
      meta: {
        title: '质量检验'
      }
    }, {
      path: 'qualityindex',
      name: 'qualityindex',
      component: () => import('@/views/productionManagement/qualitymanagement/qualityindex.vue'),
      meta: {
        title: '质量检验明细'
      }
    }]
  }, { // 报表管理
    path: 'reportmanagement',
    name: 'reportmanagement',
    component: AppMain,
    redirect: 'reportmanagement/workshop-report',
    children: [{
      path: 'workshop-report',
      name: 'workshop-report',
      component: () => import('@/views/productionManagement/reportmanagement/workshop-report.vue'),
      meta: {
        title: '车间报表'
      }
    },
    {
      path: 'detail-report',
      name: 'detail-report',
      component: () => import('@/views/productionManagement/reportmanagement/detail-report.vue'),
      meta: {
        title: '项目进度报表'
      }
    },
    {
      path: 'production-report',
      name: 'production-report',
      component: () => import('@/views/productionManagement/reportmanagement/production-report.vue'),
      meta: {
        title: '产量报表'
      }
    },
    {
      path: 'output-report',
      name: 'output-report',
      component: () => import('@/views/productionManagement/reportmanagement/output-report.vue'),
      meta: {
        title: '产值报表'
      }
    },
    {
      path: 'detail-item-report',
      name: 'detail-item-report',
      component: () => import('@/views/productionManagement/reportmanagement/detail-item-report.vue'),
      meta: {
        title: '项目详情'
      }
    },
    {
      path: 'detail-output-table',
      name: 'detail-output-table',
      component: () => import('@/views/productionManagement/reportmanagement/detail-output-table.vue'),
      meta: {
        title: '产值报表详情'
      }
    },
    {
      path: 'particulars-output-table',
      name: 'particulars-output-table',
      component: () => import('@/views/productionManagement/reportmanagement/particulars-output-table.vue'),
      meta: {
        title: '产值报表明细'
      }
    },
    {
      path: 'wage-table',
      name: 'wage-table',
      component: () => import('@/views/productionManagement/reportmanagement/wage-table.vue'),
      meta: {
        title: '工费表'
      }
    },
    {
      path: 'detail-wage-table',
      name: 'detail-wage-table',
      component: () => import('@/views/productionManagement/reportmanagement/detail-wage-table.vue'),
      meta: {
        title: '工费明细表'
      }
    }
    ]
  }, { // 运输配车管理
    path: 'transportmanage',
    name: 'transportmanage',
    component: AppMain,
    redirect: 'transportmanage/vehicle-manage',
    children: [{
      path: 'vehicle-manage',
      name: 'vehicle-manage',
      component: () => import('@/views/productionManagement/transportmanage/vehicle-manage.vue'),
      meta: {
        title: '运输配车',
        keepAlive: true
      }
    }, {
      path: 'vehicle-add',
      name: 'vehicle-add',
      component: () => import('@/views/productionManagement/transportmanage/vehicle-add.vue'),
      meta: {
        title: '新增配车'
      }
    }, {
      path: 'vehicle-detail',
      name: 'vehicle-detail',
      component: () => import('@/views/productionManagement/transportmanage/vehicle-add.vue'),
      meta: {
        title: '配车详情'
      }
    }]
  }, { // 系统管理
    path: 'systemManagement',
    name: 'systemManagement',
    component: AppMain,
    redirect: 'systemManagement/sysConfig',
    children: [{
      path: 'enterprise',
      name: 'enterprise',
      component: () => import('@/views/productionManagement/personmanagement/enterprise.vue'),
      meta: {
        title: '企业管理',
        keepAlive: true
      }
    }, {
      path: 'sysConfig',
      name: 'sysConfig',
      component: () => import('@/views/productionManagement/personmanagement/sysConfig.vue'),
      meta: {
        title: '系统配置',
        keepAlive: true
      }
    }, {
      path: 'modify-inspector',
      name: 'modify-inspector',
      component: () => import('@/views/productionManagement/systemManagement/modify-inspector.vue'),
      meta: {
        title: '配置检验人员',
        keepAlive: true
      }
    }, {
      path: 'dictionary',
      name: 'dictionary',
      component: () => import('@/views/productionManagement/systemManagement/dictionary.vue'),
      meta: {
        title: '字典管理',
        keepAlive: true
      }
    }, {
      path: 'costQuota',
      component: () => import('@/views/productionManagement/systemManagement/costQuota.vue'),
      name: 'costQuota',
      meta: {
        title: '工费定额'
      }
    }, {
      path: 'unitPrice',
      component: () => import('@/views/productionManagement/systemManagement/unitPrice.vue'),
      name: 'unitPrice',
      meta: {
        title: '工艺单价标准'
      },
      hidden: true
    }, {
      path: 'configurationProcess',
      component: () => import('@/views/productionManagement/systemManagement/configurationProcess.vue'),
      name: 'configurationProcess',
      meta: {
        title: '配置模板工序'
      },
      hidden: true
    }, {
      path: 'inspectioItem',
      component: () => import('@/views/productionManagement/systemManagement/inspectioItem.vue'),
      name: 'inspectioItem',
      meta: {
        title: '检验项目配置',
        keepAlive: true
      },
      hidden: true
    }, {
      path: 'inspection-configuration',
      component: () => import('@/views/productionManagement/systemManagement/inspection-configuration.vue'),
      name: 'inspection-configuration',
      meta: {
        title: '项目配置'
      },
      hidden: true
    }, {
      path: 'coating-configuration',
      component: () => import('@/views/productionManagement/systemManagement/coating-configuration.vue'),
      name: 'coating-configuration',
      meta: {
        title: '涂装用量配置'
      }
    }, {
      path: 'coating-config-detail',
      component: () => import('@/views/productionManagement/systemManagement/coating-config-detail.vue'),
      name: 'coating-config-detail',
      meta: {
        title: '配置页面'
      }
    }, {
      path: 'cooperative-supplier-manage',
      component: () => import('@/views/productionManagement/systemManagement/cooperative-supplier-manage.vue'),
      name: 'cooperative-supplier-manage',
      meta: {
        title: '合供方管理'
      }
    }, {
      path: 'cooperative-supplier-edit',
      component: () => import('@/views/productionManagement/systemManagement/cooperative-supplier-edit.vue'),
      name: 'cooperative-supplier-edit',
      meta: {
        title: '合格供方录入'
      }
    },
    {
      path: 'Workshop-output-allocation',
      name: 'Workshop-output-allocation',
      component: () => import('@/views/productionManagement/systemManagement/Workshop-output-allocation.vue'),
      meta: {
        title: '车间产值配置'
      }
    },
    {
      path: 'Workshop-allocation-select',
      name: 'Workshop-allocation-select',
      component: () => import('@/views/productionManagement/systemManagement/Workshop-allocation-select'),
      meta: {
        title: '联段产值配置'
      }
    },
    {
      path: 'Process-peak',
      name: 'Process-peak',
      component: () => import('@/views/productionManagement/systemManagement/Process-peak'),
      meta: {
        title: '工序峰值产能配置'
      }
    }
    ]
  }]
}]

export default routes
