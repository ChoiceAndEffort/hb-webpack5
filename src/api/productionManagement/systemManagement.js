import axios from 'axios'
// 字典 - 获取字典分页
export const getDictPage = (data) => axios.post('/cus/v1/dict/getDictPage', data);

// 字典 - 维护
export const operationDict = (data) => axios.post('/cus/v1/dict/operationDict', data);

// 字典项 - 列表
export const getDictItemList = (data) => axios.post('/cus/v1/dict/getDictItemList', data);

// 字典项 - 维护
export const operationDictItem = (data) => axios.post('/cus/v1/dict/operationDictItem', data);
// 通过字典code获取字典值
export const getDictData = (data) => axios.get('/cus/v1/dict/getDictData', {
  params: {
    code: data
  }
});
// 工序定额 - 获取工序定额模板分页数据
export const getProcessQuotaTemplatePage = (data) => axios.post('/pms/c/v1/template/processQuotaTemplate/getProcessQuotaTemplatePage', data);
// 工序定额 - 维护工序定额模板
export const operationProcessQuotaTemplate = (data) => axios.post('/pms/c/v1/template/processQuotaTemplate/operationProcessQuotaTemplate', data);
// 工序定额 - 修改工序定额模板状态
export const operationProcessQuotaTemplateStatus = (data) => axios.post('/pms/c/v1/template/processQuotaTemplate/operationProcessQuotaTemplateStatus', data);
// 工艺 - 获取工艺列表数据
export const getProcessList = (data) => axios.post('/pms/c/v1/template/process/getProcessList', data);
// 工艺 - 删除工艺
export const deleteProcess = (data) => axios.get('/pms/c/v1/template/process/deleteProcess', {
  params: {
    id: data
  }
});
// 工艺 - 维护
export const operationProcess = (data) => axios.post('/pms/c/v1/template/process/save', data);
// 工艺 - 批量添加工艺
export const addProcessBatch = (data) => axios.post('/pms/c/v1/template/process/addProcessBatch', data);
// 工序 - 批量添加工序数据
export const addWorkingProcedureBatch = (data) => axios.post('/pms/c/v1/template/workingProcedure/saveParentChildWorkingProcedureList', data);

// 工序 - 获取工序列表数据
export const getWorkingProcedureList = (data) => axios.get('/pms/c/v1/template/workingProcedure/getParentChildWorkingProcedureList', {
  params: data
});

// 定额 - 获取定额分页列表
export const getQuotaPage = (data) => axios.post('/pms/c/v1/template/quota/getPage', data);
// 定额 - 获取定额列表
export const getQuotaList = (data) => axios.post('/pms/v1/quota/getQuotaList', data);
// 定额 - 新增定额维护
export const operationQuota = (data) => axios.post('/pms/c/v1/template/quota/save', data);
// 定额 - 禁用/开启定额
export const operationQuotaStatus = (data) => axios.get('/pms/c/v1/template/quota/operationQuotaStatus', {
  params: {
    id: data
  }
});

// 项目配置 - 获取列表数据(分页)
export const getInspectioItemPage = (data) => axios.post('/pms/c/v1/system/inspectionItemConfiguration/getInspectionItemConfigurationListPageDataByPage', data)
// 项目配置 - 新增项目配置
export const addInspectioItem = (data) => axios.post('/pms/c/v1/system/inspectionItemConfiguration/addInspectionItemConfigurationDetailPagedataBatch', data)
// 项目配置 - 获取列表详情数据(不分页)
export const getInspectioItemDetailPage = (data) => axios.get('/pms/c/v1/system/inspectionItemConfiguration/getInspectionItemConfigurationDetailPageData', {
  params: {
    id: data
  }
})

// 涂装用量配置 - 获取详情数据
export const getCoatingDosageConfigurationList = data => axios.get('/pms/c/v1/system/coatingDosageConfiguration/getCoatingDosageConfigurationList', {
  params: {
    couplingId: data
  }
})
// 涂装用量配置 - 批量新增
export const coatingSaveBatch = data => axios.post('/pms/c/v1/system/coatingDosageConfiguration/saveBatch', data)
// 涂装用量配置 - 删除配置
export const coatingDel = data => axios.get('/pms/c/v1/system/coatingDosageConfiguration/deleteCoatingDosageConfiguration', {
  params: {
    id: data
  }
})

// 合供商管理 - 获取业务部门
export const getSupDepartment = data => axios.get('/pms/c/v1/system/supplier/getDepartmentName')
// 合供商管理 - 数据维护
export const supplierSave = data => axios.post('/pms/c/v1/system/supplier/operationSupplier', data)
// 合供商管理 - 获取分页数据
export const getSupplierList = data => axios.post('/pms/c/v1/system/supplier/getPage', data)
// 合供商管理 - 获取详情数据
export const getSupplierDetail = data => axios.get('/pms/c/v1/system/supplier/getSupplierDetail', {
  params: {
    id: data
  }
})
// 合供商管理 - 删除合供商
export const delSupplier = data => axios.get('/pms/c/v1/system/supplier/removeSupplier', {
  params: {
    id: data
  }
})

// 工序峰值产能接口 - 根据企业id获取厂区
export const getPlantAreaList = data => axios.post('/pms/c/v1/system/configProcedurePeakProductivity/getPlantAreaList', data)

// 工序峰值产能接口 - 获取峰值产能配置列表数据
export const getListpack = data => axios.post('/pms/c/v1/system/configProcedurePeakProductivity/getList', data)

// 工序峰值产能接口 - 批量维护产能配置接口
export const batchOperation = data => axios.post('/pms/c/v1/system/configProcedurePeakProductivity/batchOperation', { configProcedurePeakProductivityBoList: data })

/* 项目工序接口 */
// 获取父子级工序和工艺列表数据
export const ProcessList = data => axios.get('/pms/c/v1/project/projectWorkingProcedure/getParentChildWorkingProcedureAndProcessList', {
  params: {
    couplingId: data
  }
})
/* 批量维护车间产值配置 */
export const batchOperationkid = data => axios.post('/pms/c/v1/project/projectProcess/batchOperation', { projectProcessBoList: data })
