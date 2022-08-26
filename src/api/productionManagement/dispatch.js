import axios from 'axios'
// 派工 -  下料派工单预制
export const getjobOrderdetailed = (data) => axios.post('/pms/c/v1/workreport/jobOrderDetailed/getPage', data);
// 派工 -  其它工序派工单预制
export const getmaterialOrderdetailed = (data) => axios.post('/pms/c/v1/workreport/materialOrderDetailed/getPage', data);
// 派工 - 工序派工
export const findJobOrderPage = (data) => axios.post('/pms/c/v1/workreport/jobOrderDetailed/findJobOrderPage', data);
// 派工 - 其它工序工序派工
export const findMaterialOrderPage = (data) => axios.post('/pms/c/v1/workreport/materialOrderDetailed/findJobOrderPage', data);
// 派工 - 维护下料报工
export const operationJobwork = (data) => axios.post('/pms/c/v1/workreport/jobWorkReport/operationJobWorkReport', data);
// 派工 - 工单下发
export const workOrderDistribution = (data) => axios.post('/pms/c/v1/workreport/jobOrderDetailed/workOrderDistribution', data);
// 派工 - 涂装工单下发
export const outSourcingDistribution = (data) => axios.post('/pms/c/v1/workreport/materialOrderDetailed/outSourcingDistribution', data);

// 派工 - 工单派工
export const operationJobWorkReportStaff = (data) => axios.post('/pms/c/v1/workreport/jobWorkReportStaff/operationJobWorkReportStaff', data);

// 获取工序外协单位配置列表数据
export const getProcedureSupplierConfigurationList = data => axios.post('/pms/c/v1/project/procedureSupplierConfiguration/getProcedureSupplierConfigurationList', data)

// 派工下料工序 - 已派工详情
export const getCompletedOrderDetail = (data) => axios.get('/pms/c/v1/workreport/jobOrderDetailed/getCompletedOrderDetail', {
  params: data
});
// 派工其它工序 - 已派工详情
export const getmaterialCompletedOrderDetail = (data) => axios.get('/pms/c/v1/workreport/materialOrderDetailed/getCompletedOrderDetail', {
  params: data
});
// 派工 - 查看检验历史集合
export const getExamineHistory = (data) => axios.post('/pms/c/v1/workreport/jobWorkReportExamine/getExamineHistory', data);

// 派工 - 转运派工查询
export const getTransDispatch = (data) => axios.post('/pms/c/v1/transit/transport/getPageOfDispatched', data)

// 派工 - 转运派工确认派工
export const confirmDispatched = (data) => axios.post('/pms/c/v1/transit/transport/confirmDispatched', data)

// 物料工单下发
export const workOrderDistr = (data) => axios.post('/pms/c/v1/workreport/materialOrderDetailed/workOrderDistribution', data)
