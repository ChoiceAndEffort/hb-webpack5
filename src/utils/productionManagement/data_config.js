import { tableTimeFilter } from './tool'
// 套料配置数据
export const NestingConfig = [
  {
    attrs: { label: '序号', type: 'index', width: '50' }
  },
  {
    attrs: {
      label: '套料图名称',
      prop: 'nestingName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '图纸数量',
      prop: 'totalPage',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '零件总重量（千克）',
      prop: 'sparePartsTotalWeight',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '原材料总重量（千克）',
      prop: 'rawMaterialTotalWeight',
      align: 'center'
    }
  },
  {
    slot: 'btn',
    attrs: { label: '操作', align: 'center', width: '80px' }
  }
];
// 物料配置数据
export const MaterialConfig = [
  { attrs: { label: '序号', type: 'index', fixed: 'left', width: '50' }},
  {
    attrs: {
      label: '物料编码',
      prop: 'materialCode',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料编号',
      prop: 'materialNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料材质',
      prop: 'materialQuality',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '高度(厚度/毫米)',
      prop: 'materialHeight',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '宽度(毫米)',
      prop: 'materialWidth',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '长度(毫米)',
      prop: 'materialLength',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料数量(件)',
      prop: 'materialAmount',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料重量(千克)',
      prop: 'materialWeight',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '对应工艺',
      prop: 'processName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '外表面面积(平方米)',
      prop: 'outsideArea',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '内表面面积(平方米)',
      prop: 'internalArea',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '顶板面面积(平方米)',
      prop: 'topArea',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '摩擦面面积(平方米)',
      prop: 'frictionArea',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '附属信息编号',
      prop: 'subsidiaryNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '附属信息类型',
      prop: 'subsidiaryName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '附属信息物量',
      prop: 'subsidiaryNum',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '单位',
      prop: 'unit',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '实际用量',
      prop: 'actual_amount',
      align: 'center'
    }
  }
  // {
  //     slot: "btn",
  //     attrs: { label: "操作", align: "center", fixed: "right", width: "80px" },
  // },
];
// BOM配置数据
export const BomConfig = [
  {
    attrs: { label: '序号', type: 'index', width: '50' }
  },
  {
    attrs: {
      label: '物料编码',
      prop: 'materialCode',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '组件编码',
      prop: 'subassemblyCode',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '组件数量',
      prop: 'subassemblyAmount',
      align: 'center'
    }
  },
  {
    slot: 'btn',
    attrs: {
      label: '操作',
      align: 'center',
      fixed: 'right',
      width: '80px'
    }
  }
];
// 定额套料列配置数据
export const quotaNestingConfig = [
  {
    attrs: {
      label: '套料图名称',
      prop: 'nestingName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '套料图页码',
      prop: 'nestingPage',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '划线工艺',
      prop: 'lineation',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '划线定额(元/件)',
      prop: 'lineationQuota',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '切割工艺',
      prop: 'cuttingProcess',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '切割线长(米)',
      prop: 'cuttingLength',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '切割定额(元/件)',
      prop: 'cuttingQuota',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '零件编号',
      prop: 'partNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '零件编码',
      prop: 'partCode',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '坡口名称',
      prop: 'grooveName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '坡口类型',
      prop: 'grooveType',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '坡口长度(单个零件坡口长度/米)',
      prop: 'grooveLength',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '坡口定额(元/件)',
      prop: 'grooveQuota',
      align: 'center'
    }
  }
];
// 定额物料列配置数据
export const quotaMaterialConfig = [
  {
    attrs: {
      label: '物料编码',
      prop: 'materialCode',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料编号',
      prop: 'materialNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '对应工艺',
      prop: 'processName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '工艺定额(元/件)',
      prop: 'processQuota',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '附属信息编号',
      prop: 'subsidiaryNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '附属信息类型',
      prop: 'subsidiaryName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '附属信息物量',
      prop: 'subsidiaryNum',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '单位',
      prop: 'unit',
      align: 'center'
    }
  }
];
// 套料校验配置数据
export const CheckNestingConfig = {
  nestingName: '套料图名称*',
  nestingPage: '套料图页码*',
  rawMaterialTexture: '原材料材质*',
  rawMaterialHeight: '原材料高(厚)度*',
  rawMaterialWidth: '原材料宽(毫米)*',
  rawMaterialLength: '原材料长(毫米)*',
  rawMaterialWeight: '原材料重量(单重/千克)*',
  rawMaterialSize: '原材料数量(块)*',
  lineation: '划线工艺*',
  lineationLength: '划线线长(米)*',
  cuttingProcess: '切割工艺*',
  cuttingLength: '切割线长(米)*',
  partNumber: '零件编号*',
  partCode: '零件编码*',
  partSize: '零件数量(件)*',
  partWeight: '零件重量(单重/千克)*',
  partProcessFlow: '零件工艺流向*',
  grooveName: '坡口名称*',
  grooveType: '坡口类型*',
  grooveLength: '坡口长度(米)*',
  nestingAreaType1: '面积类型1*',
  area1: '面积(平方米)*',
  nestingAreaType2: '面积类型2*',
  area2: '面积(平方米)*',
  nestingAreaType3: '面积类型3*',
  area3: '面积(平方米)*',
  nestingAreaType4: '面积类型4*',
  area4: '面积(平方米)*',
  checkRemark: '提示信息'
};
// 物料校验配置数据
export const CheckMaterialConfig = {
  materialCode: '物料编码',
  materialNumber: '物料编号',
  materialQuality: '物料材质',
  materialHeight: '物料高(厚)度(毫米)',
  materialWidth: '物料宽度(毫米)',
  materialLength: '物料长度(毫米)',
  materialAmount: '物料数量(件)',
  materialWeight: '物料重量(千克)',
  processName: '对应工艺',
  subsidiaryNumber: '附属信息编号',
  subsidiaryName: '附属信息类型',
  subsidiaryNum: '附属信息物量',
  unit: '单位',
  outsideArea: '外表面面积(平方米)',
  internalArea: '内表面面积(平方米)',
  topArea: '顶板面面积(平方米)',
  frictionArea: '摩擦面面积(平方米)',
  checkRemark: '提示信息'
};
// BOM校验配置数据
export const CheckBomConfig = {
  materialCode: '物料编码',
  subassemblyCode: '组件编码',
  subassemblyAmount: '组件数量',
  checkRemark: '提示信息'
};

// 定额编辑配置数据(套料)
export const quota_allocation_Config_nesting = {
  nestingName: '套料图名称',
  nestingPage: '套料图页码',
  lineation: '划线工艺',
  lineationQuota: '划线定额(元/件)',
  cuttingProcess: '切割工艺',
  cuttingLength: '切割线长(米)',
  cuttingQuota: '切割定额(元/件)',
  partNumber: '零件编号',
  partCode: '零件编码',
  grooveName: '坡口名称',
  grooveType: '坡口类型',
  grooveLength: '坡口长度(单个零件坡口长度/米)',
  grooveQuota: '坡口定额(元/件)'
};

// 定额编辑配置数据(物料)
export const quota_allocation_Config_material = {
  materialCode: '物料编码',
  materialNumber: '物料编号',
  processName: '对应工艺',
  processQuota: '工艺定额',
  subsidiaryNumber: '附属信息编号',
  subsidiaryName: '附属信息类型',
  subsidiaryNum: '附属信息物量',
  unit: '单位'
};

// 工序作业计划列配置数据-(物料/运输)
export const workingMaterialConfigYS = [
  /* 勾选框 */
  {
    attrs: {
      align: 'center',
      type: 'selection',
      'reserve-selection': true
    }
  },
  /* 序号 */
  {
    slot: 'index',
    attrs: {
      label: '序号',
      align: 'center',
      width: '50'
    }
  },
  {
    attrs: {
      label: '车次编号',
      prop: 'tranNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '轮次',
      prop: 'roundsPlanName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '最大高度(毫米)',
      prop: 'maxHeight',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '最大宽度(毫米)',
      prop: 'maxWidth',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '最大长度(毫米)',
      prop: 'maxLength',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料数量',
      prop: 'totalAmount',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料重量(千克)',
      prop: 'totalWeight',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '装配计划时间',
      prop: 'assemblePlanTime',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '运输计划时间',
      prop: 'transPlanTime',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '节点计划开始时间',
      prop: 'startTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    attrs: {
      label: '节点计划完成时间',
      prop: 'endTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    attrs: {
      label: '计划责任单位',
      prop: 'departmentName',
      align: 'center'
    }
  },
  {
    slot: 'status',
    attrs: {
      label: '状态',
      prop: 'isApprove',
      align: 'center'
    }
  },
  {
    slot: 'btn',
    attrs: { label: '操作', prop: 'btn', align: 'center' }
  }
]

// 工序作业计划列配置数据-父(套料)
export const workingNestingConfig = [
  /* 勾选框 */
  {
    attrs: {
      align: 'center',
      type: 'selection',
      'reserve-selection': true
    }
  },
  /* 折叠 */
  {
    slot: 'expand',
    attrs: {
      align: 'center',
      type: 'expand'
    }
  },
  /* 序号 */
  {
    attrs: {
      label: '序号',
      prop: 'index',
      align: 'center',
      type: 'index',
      width: '50'
    }
  },
  // 字段
  {
    attrs: {
      label: '项目名称',
      prop: 'engineeringProjectName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '联段名称',
      prop: 'couplingName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '图纸名称',
      prop: 'nestingName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '图纸页码',
      prop: 'nestingPage',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '数量(件)',
      prop: 'rawMaterialSize',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '责任单位',
      prop: 'departmentName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '节点计划时间',
      prop: 'endTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    attrs: {
      label: '数控划线长度（米）',
      prop: 'lineationLength',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '数控划线计划时间',
      prop: 'lineationDate',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    attrs: {
      label: '数控切割长度（米）',
      prop: 'cuttingLength',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '数控切割计划时间',
      prop: 'cuttingDate',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    slot: 'status',
    attrs: {
      label: '状态',
      prop: 'isApprove',
      align: 'center'
    }
  },
  {
    attrs: { label: '备注', prop: 'remark', align: 'center' }
  },
  {
    slot: 'btn',
    attrs: { label: '操作', prop: 'btn', align: 'center' }
  }
];
// 工序作业计划列配置数据-子(套料)
export const workingNestingChildConfig = [
  {
    attrs: {
      label: '零件编号',
      prop: 'partNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '零件数量(件)',
      prop: 'partSize',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '零件重量(千克)',
      prop: 'partWeight',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '坡口开制计划时间',
      prop: 'grooveDate',
      align: 'center',
      formatter: tableTimeFilter
    }
  }
];

// 工序作业计划新增计划配置数据-父(套料)
export const workingNestingAddPlanConfig = [
  /* 勾选框 */
  {
    attrs: { align: 'center', type: 'selection', 'reserve-selection': true }
  },
  /* 折叠 */
  {
    slot: 'expand',
    attrs: {
      align: 'center',
      type: 'expand'
    }
  },
  /* 序号 */
  {
    attrs: {
      label: '序号',
      prop: 'index',
      align: 'center',
      type: 'index',
      width: '50'
    }
  },
  {
    attrs: { label: '图纸名称', prop: 'nestingName', align: 'center' }
  },
  {
    attrs: { label: '图纸页码', prop: 'nestingPage', align: 'center' }
  },
  {
    attrs: { label: '数量（件）', prop: 'rawMaterialSize', align: 'center' }
  },
  {
    attrs: { label: '节点计划时间', prop: 'endTime', align: 'center', formatter: tableTimeFilter }
  },
  {
    attrs: { label: '数控划线长度（米）', prop: 'lineationLength', align: 'center' }
  },
  {
    attrs: { label: '数控划线计划时间', prop: 'lineationDate', align: 'center', formatter: tableTimeFilter }
  },
  {
    attrs: { label: '数控切割长度（米）', prop: 'cuttingLength', align: 'center' }
  },
  {
    attrs: { label: '数控切割计划时间', prop: 'cuttingDate', align: 'center', formatter: tableTimeFilter }
  },
  {
    attrs: { label: '备注', prop: 'remark', align: 'center' }
  }
]
// 工序作业计划新增计划配置数据-子(套料)
export const workingNestingAddPlanChildConfig = [
  {
    attrs: { label: '零件编号', prop: 'partNumber', align: 'center' }
  },
  {
    attrs: { label: '零件数量', prop: 'partSize', align: 'center' }
  },
  {
    attrs: { label: '零件重量（千克）', prop: 'partWeight', align: 'center' }
  },
  {
    attrs: { label: '坡口开制计划时间', prop: 'grooveDate', align: 'center', formatter: tableTimeFilter }
  }
]

// 工序作业计划列配置数据-父(物料)
export const workingMaterialConfig = [
  /* 勾选框 */
  {
    attrs: {
      align: 'center',
      type: 'selection',
      'reserve-selection': true
    }
  },
  /* 折叠 */
  {
    slot: 'expand',
    attrs: {
      align: 'center',
      type: 'expand'
    }
  },
  /* 序号 */
  {
    attrs: {
      label: '序号',
      prop: 'index',
      align: 'center',
      type: 'index',
      width: '50'
    }
  },
  {
    attrs: {
      label: '物料编码',
      prop: 'materialCode',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料编号',
      prop: 'materialNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料数量',
      prop: 'materialAmount',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '节点计划时间',
      prop: 'endTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    attrs: {
      label: '责任单位',
      prop: 'departmentName',
      align: 'center'
    }
  },
  {
    slot: 'status',
    attrs: {
      label: '状态',
      prop: 'isApprove',
      align: 'center'
    }
  },
  {
    attrs: { label: '备注', prop: 'remark', align: 'center' }
  },
  {
    slot: 'btn',
    attrs: { label: '操作', prop: 'btn', align: 'center' }
  }
]
// 工序作业计划列配置数据-子(物料)
export const workingMaterialChildConfig = [
  {
    attrs: {
      label: '工艺名称',
      prop: 'processName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '计划完成时间',
      prop: 'planTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  }
]

// 工序作业计划新增计划配置数据-父(物料)
export const workingMaterialAddPlanConfig = [
  /* 勾选框 */
  {
    attrs: {
      align: 'center',
      type: 'selection',
      'reserve-selection': true
    }
  },
  /* 折叠 */
  {
    slot: 'expand',
    attrs: {
      align: 'center',
      type: 'expand'
    }
  },
  /* 序号 */
  {
    attrs: {
      label: '序号',
      prop: 'index',
      align: 'center',
      type: 'index',
      width: '50'
    }
  },
  {
    attrs: {
      label: '物料编码',
      prop: 'materialCode',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料编号',
      prop: 'materialNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '物料数量',
      prop: 'materialAmount',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '节点计划时间',
      prop: 'endTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    attrs: {
      label: '责任单位',
      prop: 'departmentName',
      align: 'center'
    }
  },
  {
    attrs: { label: '备注', prop: 'remark', align: 'center' }
  }
]
// 工序作业计划新增计划配置数据-子(物料)
export const workingMaterialAddPlanChildConfig = [
  {
    attrs: {
      label: '工艺名称',
      prop: 'processName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '计划完成时间',
      prop: 'planTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  }
]

// 工序作业计划新增计划配置数据(套料)
export const working_procedure_edit_Config = {
  nestingName: '图纸名称',
  nestingPage: '图纸页码',
  rawMaterialSize: '数量',
  endTime: '节点计划时间',
  lineationLength: '数控划线长度（米）',
  lineationDate: '数控划线计划时间',
  cuttingLength: '数控切割长度（米）',
  cuttingDate: '数控切割计划时间',
  partNumber: '零件编号',
  partSize: '零件数量',
  partWeight: '零件重量(千克)',
  grooveDate: '坡口开制计划时间',
  remark: '备注'
};

// 工序作业计划新增计划配置数据(物料)
export const working_procedure_edit_material_Config = {
  materialCode: '物料编码',
  materialNumber: '物料编号',
  materialAmount: '物料数量',
  processName: '工艺名称',
  endTime: '节点计划时间',
  planTime: '计划完成时间',
  departmentName: '责任单位',
  remark: '备注'
}

// 质量未检验配置数据
export const quality_check_config = [
  {
    attrs: {
      label: '序号',
      prop: 'index',
      align: 'center',
      type: 'index'
    }
  },
  {
    attrs: { label: '图纸名称', prop: 'nestingName', align: 'center' }
  },
  {
    attrs: { label: '图纸页码', prop: 'nestingPage', align: 'center' }
  },
  {
    attrs: { label: '零件编号', prop: 'partNumber', align: 'center' }
  },
  {
    attrs: { label: '零件数量(件)', prop: 'partSize', align: 'center' }
  },
  {
    attrs: {
      label: '工序',
      prop: 'procedureName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '工艺',
      prop: 'processName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '责任单位',
      prop: 'departmentName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '申请人',
      prop: 'addName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '申请时间',
      prop: 'reportTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    slot: 'status',
    attrs: {
      label: '检验状态',
      prop: 'status',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '检验时间',
      prop: 'orderCompleteTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    slot: 'btns',
    attrs: {
      label: '操作',
      prop: 'btns',
      align: 'center',
      fixed: 'right'
    }
  }
];

// 质量未检验配置数据(物料)
export const quality_check_material_config = [
  {
    attrs: {
      label: '序号',
      prop: 'index',
      align: 'center',
      type: 'index'
    }
  },
  {
    attrs: { label: '物料编码', prop: 'materialCode', align: 'center' }
  },
  {
    attrs: { label: '物料编号', prop: 'materialNumber', align: 'center' }
  },
  {
    attrs: {
      label: '工艺',
      prop: 'processName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '附属件名称',
      prop: 'subsidiaryName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '附属件编号',
      prop: 'subsidiaryNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '工作量（米）',
      prop: 'workload',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '责任单位',
      prop: 'departmentName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '申请人',
      prop: 'addName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '申请时间',
      prop: 'reportTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    slot: 'status',
    attrs: {
      label: '检验状态',
      prop: 'status',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '检验时间',
      prop: 'orderCompleteTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    slot: 'btns',
    attrs: {
      label: '操作',
      prop: 'btns',
      align: 'center',
      fixed: 'right'
    }
  }
];

// 质量已检验配置数据
export const quality_checked_config = [
  {
    attrs: {
      label: '序号',
      prop: 'index',
      align: 'center',
      type: 'index'
    }
  },
  {
    attrs: { label: '零件编号', prop: 'partNumber', align: 'center' }
  },
  {
    attrs: {
      label: '工序',
      prop: 'procedureName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '工艺',
      prop: 'processName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '责任单位',
      prop: 'departmentName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '申请人',
      prop: 'addName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '申请时间',
      prop: 'reportTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    slot: 'status',
    attrs: {
      label: '检验状态',
      prop: 'status',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '检验时间',
      prop: 'orderCompleteTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    slot: 'btns',
    attrs: {
      label: '操作',
      prop: 'btns',
      align: 'center',
      fixed: 'right'
    }
  }
];

// 合供方管理列表页字段
export const supplier_config = [
  {
    attrs: {
      label: '序号',
      prop: 'index',
      align: 'center',
      type: 'index'
    }
  },
  {
    attrs: {
      label: '供应商名称',
      prop: 'supplierName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '法定代表',
      prop: 'corporateRepresentative',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '联系人',
      prop: 'contactPerson',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '联系方式',
      prop: 'contactNumber',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '供应商类型',
      prop: 'supplierType',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '业务部门',
      prop: 'departmentName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '经办人',
      prop: 'addName',
      align: 'center'
    }
  },
  {
    attrs: {
      label: '申请时间',
      prop: 'addTime',
      align: 'center',
      formatter: tableTimeFilter
    }
  },
  {
    slot: 'btn',
    attrs: {
      label: '操作',
      align: 'center',
      fixed: 'right'
    }
  }
]
