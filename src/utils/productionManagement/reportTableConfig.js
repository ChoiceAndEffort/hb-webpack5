// 车间报表表头数据
export const reportConfig = {
  // 考勤日报表
  clockingin: [
    {
      slot: 'serial',
      attrs: {
        prop: 'serial',
        label: '序号',
        align: 'center',
        width: '70'
      }
    },
    {
      attrs: {
        prop: 'profession',
        label: '出勤工种',
        align: 'left',
        width: '500'
      }
    },
    {
      attrs: {
        prop: 'shouldbe',
        label: '应到人数',
        align: 'right',
        width: ''
      }
    },

    {
      slot: 'actual',
      attrs: {
        prop: 'actual',
        label: '实到人数',
        align: 'right',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'absenteeism',
        label: '缺勤人数',
        align: 'right',
        width: ''
      }
    }
  ],
  // 项目计划与进度情况
  projectPlan: [
    {
      slot: 'serial',
      attrs: { label: '序号', type: 'serial', width: '50', align: 'center' }
    },
    {
      attrs: {
        prop: 'engineeringProjectName',
        label: '项目名称',
        align: 'center',
        width: '250'
      }
    },
    {
      attrs: {
        prop: 'couplingName',
        label: '联段',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'workingProcedureName',
        label: '工序',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'processName',
        label: '工艺',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'totalWorkload',
        label: '计划工作量(吨)',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: '',
        label: '计划开始时间',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: '',
        label: '计划结束时间',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: '',
        label: '计划工期(天)',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'planWorkload',
        label: '日计划工量(吨)',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'craft',
        label: '完成比例(%)',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'cumulativeCompletion',
        label: '累计完成(吨)',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'craft',
        label: '累计完成比例(%)',
        align: 'center',
        width: ''
      }
    }
  ],
  // 目标对比与人均效能
  objectiveComparison: [
    {
      prop: 'workingProcedureName',
      label: '工序',
      align: 'center'
    },
    {
      prop: 'processName',
      label: '工艺',
      align: 'center',
      width: ''
    },
    {
      prop: '',
      label: '计划工作量(吨)',
      align: 'center',
      width: '120'
    },
    {
      prop: 'planCycle',
      label: '计划周期(天)',
      align: 'center',
      width: '110'
    },
    {
      prop: 'planWorkload',
      label: '日计划工程量(吨)',
      align: 'center',
      width: '130'
    },
    {
      prop: 'plandaypro',
      label: '当日完成量',
      align: 'center',
      width: '',
      children: [
        {
          id: 610,
          label: '重量(吨)',
          prop: 'f',
          width: ''
        },
        {
          id: 620,
          label: '物量(米/件)',
          prop: 'g',
          width: '100'
        },
        {
          id: 630,
          label: '产值(元)',
          prop: 'g',
          width: '100'
        }
      ]
    },
    {
      prop: '',
      label: '完成比例(%)',
      align: 'center',
      width: ''
    },
    {
      prop: '',
      label: '当日出勤(人)',
      align: 'center',
      width: ''
    },
    {
      prop: 'averageWorklad',
      label: '人均产量(吨)',
      align: 'center',
      width: ''
    },
    {
      prop: '',
      label: '人均产值(吨)',
      align: 'center',
      width: ''
    },
    {
      prop: '',
      label: '累计完成量',
      align: 'center',
      width: '',
      children: [
        {
          id: 610,
          label: '重量(吨)',
          prop: 'cumulativeCompletion',
          width: ''
        },
        {
          id: 620,
          label: '物量(米/件)',
          prop: '',
          width: '100'
        },
        {
          id: 630,
          label: '产值(元)',
          prop: '',
          width: '100'
        }
      ]
    },
    {
      prop: 'plandaypro',
      label: '累计完成比例(%)',
      align: 'center',
      width: ''
    },
    {
      prop: 'cumulativeAttendanceNum',
      label: '累计出勤(人/天)',
      align: 'center',
      width: ''
    },
    {
      prop: 'cumulativeAverageWorkload',
      label: '累计人均产量(吨)',
      align: 'center',
      width: ''
    },
    {
      prop: '',
      label: '累计人均产值(元)',
      align: 'center',
      width: ''
    }
  ],
  // 项目派工及成本情况
  projectDispatching: [
    {
      id: 200,
      label: '项目',
      prop: 'engineeringProjectName',
      width: '250'
    },
    {
      id: 300,
      label: '联段',
      prop: 'couplingName',
      width: ''
    },

    {
      id: 400,
      label: '工序',
      prop: 'workingProcedureName',
      width: ''
    },
    {
      id: 500,
      label: '工艺',
      prop: 'processName',
      width: ''
    },
    {
      id: 600,
      label: '计划工作量',
      prop: '',
      width: '',
      children: [
        {
          id: 610,
          label: '工单数量',
          prop: 'planWorkload',
          width: ''
        },
        {
          id: 620,
          label: '工单金额(元)',
          prop: 'planAmount',
          width: '110'
        }
      ]
    },
    {
      id: 700,
      label: '派工',
      prop: '',
      width: '',
      children: [
        {
          id: 710,
          label: '当日派工',
          prop: 'h',
          width: '',
          children: [
            {
              id: 711,
              label: '工单数量',
              prop: 'orderWorkload',
              width: '110'
            },
            {
              id: 712,
              label: '工单金额(元)',
              prop: 'orderAmount',
              width: '110'
            }
          ]
        },
        {
          id: 720,
          label: '累计派工',
          prop: '',
          width: '',
          children: [
            {
              id: 721,
              label: '工单数量',
              prop: 'cumulativeOrderAmount',
              width: '110'
            },
            {
              id: 722,
              label: '工单金额(元)',
              prop: 'cumulativeOrderWorkload',
              width: '110'
            }
          ]
        },
        {
          id: 730,
          label: '完成比例(%)',
          prop: 'orderCompletionRate',
          width: '110'
        }
      ]
    },
    {
      id: 800,
      label: '报工',
      prop: '',
      width: '',
      children: [
        {
          id: 810,
          label: '当日报工',
          prop: '',
          width: '',
          children: [
            {
              id: 811,
              label: '工单数量',
              prop: 'workWorkload',
              width: '110'
            },
            {
              id: 812,
              label: '工单金额(元)',
              prop: 'workAmount',
              width: '110'
            },
            {
              id: 813,
              label: '质量奖(元)',
              prop: 'qualityRewardValid',
              width: '100'
            },
            {
              id: 814,
              label: '进度奖(元)',
              prop: 'progressRewardValid',
              width: '100'
            }
          ]
        },
        {
          id: 820,
          label: '累计报工',
          prop: '',
          width: '',
          children: [
            {
              id: 821,
              label: '工单数量',
              prop: 'cumulativeWorkWorkload',
              width: '110'
            },
            {
              id: 822,
              label: '工单金额(元)',
              prop: 'cumulativeWorkAmount',
              width: '110'
            },
            {
              id: 823,
              label: '质量奖(元)',
              prop: 'cumulativeQualityRewardValid',
              width: '100'
            },
            {
              id: 824,
              label: '进度奖(元)',
              prop: 'cumulativeProgressRewardValid',
              width: '100'
            }
          ]
        },
        {
          id: 830,
          label: '完成比例(%)',
          prop: 'workCompletionRate',
          width: '110'
        }
      ]
    },
    {
      id: 900,
      label: '人均产量(吨)',
      prop: 'averageWorkload',
      width: '110'
    },
    {
      id: 1000,
      label: '人均产值(吨)',
      prop: 'averageAmount',
      width: '110'
    }
  ],
  // 实到人员
  actuallyRealizedPerson: [
    {
      slot: 'serial',
      attrs: {
        prop: 'serial',
        label: '序号',
        align: 'center',
        width: '70'
      }
    },
    {
      attrs: {
        prop: 'staffName',
        label: '姓名',
        align: 'center',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'staffId',
        label: '工号',
        align: 'left',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'shop',
        label: '车间',
        align: 'left',
        width: ''
      }
    },
    {
      attrs: {
        prop: 'craftName',
        label: '工种',
        align: 'left',
        width: ''
      }
    }
  ]
}

// 产值表头
export const outputConfig = {
  // 产值父表
  mainConfig: [
    { attrs: { label: '序号', 'min-width': '25%', type: 'index', width: '50' }},
    { attrs: { label: '厂区', 'min-width': '25%', prop: 'plantAreaName' }},
    { attrs: { label: '车间名称', 'min-width': '25%', prop: 'workshopName' }},
    { attrs: { label: '产值标准（元）', 'min-width': '25%', prop: 'planedWorkOutputValue' }},
    { attrs: { label: '完成工序吨产量（t）', 'min-width': '30%', prop: 'totalWorkOutput' }},
    { attrs: { label: '本月实际产值（元）', 'min-width': '25%', prop: 'totalWorkOutputValue' }},
    // { attrs: { label: "临时派工产值（元）", 'min-width': '25%', prop: "temporaryProduct" } },
    { attrs: { label: '本月报工工费（元）', 'min-width': '25%', prop: 'totalWorkLaborCost' }},
    // { attrs: { label: "临时派工工费（元）", 'min-width': '25%', prop: "temporaryCost" } },
    { attrs: { label: '合计产值（元）', 'min-width': '25%', prop: 'totalWorkOutputValue' }},
    { attrs: { label: '合计工费（元）', 'min-width': '25%', prop: 'totalWorkLaborCost' }},
    { attrs: { label: '产值标准对比（元）', 'min-width': '25%', prop: 'planedWorkOutputContrast' }},
    { attrs: { label: '产值工费差（元）', 'min-width': '25%', prop: 'diffOfOutputValueAndCost' }},
    { attrs: { label: '年度累计产值（元）', 'min-width': '25%', prop: 'addUpWorkOutputValue' }},
    { slot: 'btn', attrs: { label: '操作', align: 'center', width: '200px', fixed: 'right' }}
  ]
}
// 转序列表表头
export const conversionSection = {
  detail: [
    { slot: 'serial', attrs: { label: '序号', 'min-width': '25%', type: 'serial', width: '50' }},
    { attrs: { label: '项目名称', 'min-width': '25%', prop: 'engineeringProjectName' }},
    { attrs: { label: '联段名称', 'min-width': '25%', prop: 'couplingName' }},
    { attrs: { label: '物料编号', 'min-width': '25%', prop: 'materialNumber ' }},
    { attrs: { label: '高度(mm)', 'min-width': '30%', prop: 'height' }},
    { attrs: { label: '宽度(mm)', 'min-width': '25%', prop: 'width' }},
    { attrs: { label: '长度(mm)', 'min-width': '25%', prop: 'length' }},
    { attrs: { label: '数量(件)', 'min-width': '25%', prop: 'switchAmount' }},
    { attrs: { label: '重量(kg)', 'min-width': '25%', prop: 'weight' }}
    // { attrs: { label: "存放位置", 'min-width': '25%', prop: "location" } },
  ]
}
