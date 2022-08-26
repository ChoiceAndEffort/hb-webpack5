import axios from 'axios'
// 项目 - 项目列表分页
export const getProjectpage = (data) => axios.post('/pms/c/v1/project/engineeringProject/getPage', data);
// 项目 - 新增修改项目
export const saveProject = (data) => axios.post('/pms/c/v1/project/engineeringProject/uniformAddition', data);
// 套料数据导入校验
export const checkNestingImport = (data) => axios.post('/pms/c/v1/datamanagement/nesting/checkNestingImport', data);
// 套料数据导入
export const executionNestingImport = (data) => axios.post('/pms/c/v1/datamanagement/nesting/executionNestingImport', data);
// 获取套料分页数据(含零件坡口及面积信息)
export const getNestingPage = (data) => axios.post('/pms/c/v1/datamanagement/nesting/getNestingPage', data);
// 获取套料分页数据
export const getnestingListPage = (data) => axios.post('/pms/c/v1/datamanagement/nesting/getPage', data);
// 获取项目不分页数据
export const getEngineeringProjectList = (data) => axios.post('/pms/c/v1/project/engineeringProject/getEngineeringProjectList', data);

// 获取模板工序以及子工序列表数据
export const getWorkingProcedureList = (data) => axios.post('/pms/c/v1/template/workingProcedure/getChildList', data);
// 批量添加模板工序数据
export const addProjectWorkingProcedureBatch = (data) => axios.post('/pms/c/v1/project/projectWorkingProcedure/addProjectWorkingProcedureAndChildBatch', data);
// 获取项目联段工序
export const getprojecworkingList = (data) => axios.post('/pms/c/v1/project/projectWorkingProcedure/getProjectWorkingProcedureList', data);
// 项目 - 获取项目详情
export const getProjectdetail = (data) => axios.get('/pms/c/v1/project/engineeringProject/getProjectDetails', {
  params: {
    id: data
  }
});
// 联段 - 联段修改保存
export const saveCoupling = (data) => axios.post('/pms/c/v1/project/coupling/save', data);
// 联段 - 获取联段分页数据
export const getCouplingpage = (data) => axios.post('/pms/c/v1/project/coupling/getPage', data);
// 联段 - 获取联段(不分页)
export const getCouplinglist = (data) => axios.post('/pms/c/v1/project/coupling/getCouplingList', data);
// 项目工序维护
export const saveOperation = (data) => axios.post('/pms/c/v1/project/projectWorkingProcedure/save', data);

// 项目工艺维护
export const saveprojectprocess = (data) => axios.post('/pms/c/v1/project/projectProcess/save', data);

// 获取项目工艺分页
export const getprojectprocessPage = (data) => axios.post('/pms/c/v1/project/projectProcess/getPage', data);
// 获取项目工艺不分页
export const getProjectProcessList = (data) => axios.post('/pms/c/v1/project/projectProcess/getProjectProcessList', data);
// 新增工艺
export const projectProcesave = (data) => axios.post('/pms/c/v1/project/projectProcess/save', data);
// 根据工艺获取检验人员
export const getMultipleListByProjectProcessId = (data) => axios.get('/pms/c/v1/system/inspectorConfigure/getMultipleListByProjectProcessId', {
  params: data
});
/** 检验人员批量维护*/
export const inspectorsaveBatch = (data) => axios.post('/pms/c/v1/system/inspectorConfigure/saveBatch', data);

// 维护套料信息(含零件坡口和面积信息)
export const operationNesting = (data) => axios.post('/pms/c/v1/datamanagement/nesting/operationNesting', data);

// 获取文件上传分页数据
export const getfileUploadPage = (data) => axios.post('/pms/c/v1/project/fileUpload/getPage', data);

// 批量添加文件上传数据
export const addBatchProject = (data) => axios.post('/pms/c/v1/project/fileUpload/addBatchProjectAttachmentBeforeDeleteAll', data);

// 批量删除文件上传详情数据
export const deleteAllByMappingId = (data) => axios.get('/pms/c/v1/project/fileUpload/deleteAllByMappingId', {
  params: {
    fileUploadId: data
  }
});

// 项目 - 获取套料详情(含零件坡口及面积信息)
export const getNestingDetail = (data) => axios.get('/pms/c/v1/datamanagement/nesting/getNestingDetail', {
  params: {
    id: data
  }
});

// 获取物料分页数据
export const getMaterialPage = (data) => axios.post('/pms/c/v1/datamanagement/material/getMaterialPage', data);

// 修改物料详情数据
export const editMaterialDetail = (data) => axios.post('/pms/c/v1/datamanagement/material/operationMaterial', data);

// 导入物料数据
export const executionMaterialImport = (data) => axios.post('/pms/c/v1/datamanagement/material/executionMaterialImport', data);

// 导入校验物料数据
export const checkMaterialImport = (data) => axios.post('/pms/c/v1/datamanagement/material/checkMaterialImport', data);

// 上传套料/物料/bom文件数据
export const uploadMaterialFile = (data) => axios({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  url: '/pms/c/v1/project/fileUpload/uploadSingleFile',
  method: 'post',
  data
})

// 获取Bom分页数据
export const getBomPage = (data) => axios.post('/pms/c/v1/datamanagement/bom/getPage', data);

// 修改Bom详情数据
export const editBomDetail = (data) => axios.post('/pms/c/v1/datamanagement/bom/addBomBatch', data);

// 导入Bom数据
export const executionBomImport = (data) => axios.post('/pms/c/v1/datamanagement/bom/executionBomImport', data);

// 导入校验Bom数据
export const checkBomImport = (data) => axios.post('/pms/c/v1/datamanagement/bom/checkBomImport', data);

/** 配置人员*/
export const getProjectOrganizationList = (data) => axios.get(`/pms/c/v1/project/projectOrganization/automaticGenerationProjectOrganizationV2`, {
  params: {
    ...data
  }
});

// 获取文件上传分页数据
export const getUploadPage = (data) => axios.post('/pms/c/v1/project/fileUpload/getPage', data);

// 删除文件上传数据
export const delUploadDetail = (data) => axios.get(`/pms/c/v1/project/fileUpload/deleteAllByMappingId?fileUploadId=${data.fileUploadId}`);

// 获取项目工序分页数据
// export const getProcedureList = (data) => axios.post('/pms/c/v1/project/projectWorkingProcedure/getProjectWorkingProcedureList', data);
export const getProcedureList = (params) => axios.get('/pms/c/v1/project/projectWorkingProcedure/getChildDetail', { params });

// 获取套料计划分页数据
export const getnestingPlan = (data) => axios.post('/pms/c/v1/plan/nestingPlan/getPage', data);

// 项目组织维护
export const editProjectOrganizationList = (data) => axios.post('/pms/c/v1/project/projectOrganization/operationOrganizationDetail', data);

// 删除项目组织人员
export const deletePositionOrStaff = (data) => axios.get('/pms/c/v1/project/projectOrganization/deletePositionOrStaff', {
  params: {
    ...data
  }
})

// 物料导入重新校验
export const checkMaterialBlankingAgain = data => axios.post('/pms/c/v1/datamanagement/material/checkMaterialAgain', data)

// 套料导入重新校验
export const checkNestingAgain = data => axios.post('/pms/c/v1/datamanagement/nesting/checkNestingAgain', data)

// bom导入重新校验
export const checkBomAgain = data => axios.post('/pms/c/v1/datamanagement/bom/checkBomAgain', data)

// 套料定额数据维护
export const batchOperationNesting = data => axios.post('/pms/c/v1/datamanagement/nesting/batchOperationNesting', data)

// 获取套料定额列表数据
export const getNestingQuotallocationList = data => axios.post('/pms/c/v1/datamanagement/nesting/getNestingQuotallocationList', data)

// 获取物料定额列表数据(分页)
export const getMaterialQuotallocationList = data => axios.post('/pms/c/v1/datamanagement/materialAttachment/getPage', data)

// 获取物料定额列表数据(不分页)
export const getMaterialProcessList = data => axios.post('/pms/c/v1/datamanagement/materialAttachment/getMaterialAttachmentList', data)

// 删除套料零件坡口
export const deleteNestingPartGroove = data => axios.get('/pms/c/v1/datamanagement/nesting/deleteNestingPartGroove', {
  params: {
    id: data
  }
})

// 物料定额数据维护
export const batchOperationMaterial = data => axios.post('/pms/c/v1/datamanagement/materialAttachment/batchOperationMaterialAttachment', data)

/** 项目列表工序下面配置外协单位*/
// 获取工序外协单位配置分页数据
export const procedureSupplierConfiguration = data => axios.post('/pms/c/v1/project/procedureSupplierConfiguration/getPage', data)
// 获取供应商分页数据
export const suppliergetPage = data => axios.post('/pms/c/v1/system/supplier/getPage', data)
// 获取所有供应商类型
export const getSupplierType = data => axios.get('/pms/c/v1/system/supplier/getSupplierType', {
  params: {}
})
// 工序外协单位配置批量维护
export const saveBatchprocedureSupplier = data => axios.post('/pms/c/v1/project/procedureSupplierConfiguration/saveBatch', data)

// 删除工序外协单位配置
export const deleteProcedureSupplierConfiguration = data => axios.get('/pms/c/v1/project/procedureSupplierConfiguration/deleteProcedureSupplierConfiguration', {
  params: {
    id: data
  }
})

// 车间报表接口
// 获取项目计划进度情况分页数据
export const getPmsTdProjectScheduleStatusPage = data => axios.post('/rms/c/v1/pms/t/workshopReport/getPmsTdProjectScheduleStatusPage', data)
// 获取项目派工及成本情况分页数据
export const getPmsTdProjectStaffingCostPage = data => axios.post('/rms/c/v1/pms/t/workshopReport/getPmsTdProjectStaffingCostPage', data)
// 目标比与人均效能
export const getPmsTdGoalsPerCapitaCapacityPage = data => axios.post('/rms/c/v1/pms/t/workshopReport/getPmsTdGoalsPerCapitaCapacityPage', data)
// 获取目标对比与人均效能分页数据
export const getPmsTdWorkAttendancePage = data => axios.post('/rms/c/v1/pms/t/workshopReport/getPmsTdWorkAttendancePage', data)
// 获取车间每日出勤情况分页数据（图形表）
export const getPmsGdAttendanceSituation = data => axios.post('/rms/c/v1/pms/t/workshopReport/getPmsGdAttendanceSituation', data)
// 获取车间人均产量产值分页数据（图形表）
export const getPmsGdPerCapitaOutputPage = data => axios.post('/rms/c/v1/pms/t/workshopReport/getPmsGdPerCapitaOutputPage', data)
// 获取项目派工对比及成本对比分页数据(图形表)
export const getPmsGdProjectStaffingCostPage = data => axios.post('/rms/c/v1/pms/t/workshopReport/getPmsGdProjectStaffingCostPage', data)
// 生产工人排行（不分页）
export const getWorkAttendanceOrder = data => axios.post('/rms/c/v1/pms/t/workshopReport/getWorkAttendanceOrderByDistributionAmountDesc', data)
// 【图形报表】趋势线行
export const getGoalsPerCapacity = data => axios.post('/rms/c/v1/pms/t/workshopReport/getGoalsPerCapacity', data)

// 产量报表接口
// 报表-获取企业、项目、工序的产量(月报)
export const getReportOfOutputByMonth = data => axios.post('/rms/c/v1/pms/t/report/output/getReportOfOutputByMonth', data)
// 报表明细-获取厂区、项目、工序的产量(月报
export const getReportMxOfOutputByMonth = data => axios.post('/rms/c/v1/pms/t/report/output/getReportMxOfOutputByMonth', data)
// 图形表-获取企业的产量
export const getChartOfEnterpriseOutputByMonth = data => axios.post('rms/c/v1/pms/t/report/output/getChartOfEnterpriseOutputByMonth', data)
// 图形表-获取厂区的产量
export const getChartOfPlantAreaOutputByMonth = data => axios.post('rms/c/v1/pms/t/report/output/getChartOfPlantAreaOutputByMonth', data)
// 产量趋势
export const getTrendChartOfOutputByMonth = data => axios.post('rms/c/v1/pms/t/report/output/getTrendChartOfOutputByMonth', data)
// 产量主表导出
export const getReportOfOutputByMonthExel = (params) => axios.get('/rms/c/v1/pms/excel/export/output/getReportOfOutputByMonth', { params });

// 产值报表接口
// 图形表-获取企业的产值、工费(月报)
export const getChartOfEnterpriseOutputValueByMonth = data => axios.post('rms/c/v1/pms/t/report/outputValue/getChartOfEnterpriseOutputValueByMonth', data)
// 图形表-获取部门的产值、工费(月报)
export const getChartOfWorkShopOutputValueByMonth = data => axios.post('rms/c/v1/pms/t/report/outputValue/getChartOfWorkShopOutputValueByMonth', data)
// 报表-根据企业ID、年月查询
export const getReportOfOutputValueByMonth = data => axios.post('rms/c/v1/pms/t/report/outputValue/getReportOfOutputValueByMonth', data)
// 报表-根据企业ID、年月查询产值、工费明细
export const getReportOfOutputValueMxByMonth = data => axios.post('rms/c/v1/pms/t/report/outputValue/getReportOfOutputValueMxByMonth', data)
// 报表-根据企业ID、年月查询产值、工费明细
export const getListOfWorkOutputValueMxByMonth = data => axios.post('rms/c/v1/pms/t/report/outputValue/getListOfWorkOutputValueMxByMonth', data)
// 报表-根据车间id、工序、工艺、年月查询工费工单明细
export const getListOfWorkLaborCostMxVoByMonth = data => axios.post('rms/c/v1/pms/t/report/outputValue/getListOfWorkLaborCostMxVoByMonth', data)
// 趋势图-产值
export const getTrendChartOfOutputValueByYear = data => axios.post('rms/c/v1/pms/t/report/outputValue/getTrendChartOfOutputValueByYear', data)
// 获取厂区集合
export const getDepartmentList = data => axios.post('aas/v1/department/getDepartmentList', data)
// 报表-根据企业ID、年月查询[导出]
export const getReportOfOutputValueByMonthExel = data => axios.post('rms/c/v1/pms/excel/export/outputValue/getReportOfOutputValueByMonth', data)

// 转序管理-待转序列表(分页)
export const getPageOfToBeWithSwitched = data => axios.post('pms/c/v1/transit/switch/getPageOfToBeWithSwitched', data)
// 转序管理-已转序列表(分页)
export const getPageOfAlreadyWithSwitched = data => axios.post('/pms/c/v1/transit/switch/getPageOfAlreadyWithSwitched', data)
// 转序管理-接收确认(转序单确认)
export const confirmOfSwitchOrderInfo = data => axios.post('/pms/c/v1/transit/switch/confirmOfSwitchOrderInfo', data)
// 转序管理-转序单详情(含明细)
export const getDetailsOfSwitchOrderInfo = data => axios.post('/pms/c/v1/transit/switch/getDetailsOfSwitchOrderInfo', data)
// 转序管理-获取转序单号
export const getOrderNumber = data => axios.post('/pms/c/v1/transit/switch/getOrderNumber', data)
// 转序管理-转序操作（转序单生成）
export const generateOfSwitchOrderInfo = data => axios.post('/pms/c/v1/transit/switch/generateOfSwitchOrderInfo', data)
// 转序管理-待接收转序单列表(分页)
export const getPageOfToBeAcceptWithSwitched = data => axios.post('/pms/c/v1/transit/switch/getPageOfToBeAcceptWithSwitched', data)

