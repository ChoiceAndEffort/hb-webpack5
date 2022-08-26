import axios from 'axios'

// 查询所有物料计划
export const getMaterialPlan = data => axios.post('/pms/c/v1/plan/materialPlan/getPage', data)

// 获取车次
export const getSerialNumber = data => axios.get('/pms/c/v1/plan/transPlan/generateSerialNumber')

// 轮次计划不分页
export const getRoundsPlan = data => axios.post('/pms/c/v1/plan/projectWorkingProcedureRoundsPlan/getProjectWorkingProcedureRoundsPlanList', data)

// 保存车次
export const savePlan = data => axios.post('/pms/c/v1/plan/transPlan/saveTransAndShipmentPlan', data)

// 获取运输车次计划分页数据
export const getTransPlan = data => axios.post('/pms/c/v1/plan/transPlan/getPage', data)

// 作废运输车次计划
export const nullifyPlan = data => axios.get('/pms/c/v1/plan/transPlan/becomeInvalid', {
  params: {
    id: data
  }
})

// 获取车次详情数据
export const getVehicleDetail = data => axios.get('/pms/c/v1/plan/transPlan/getTransAndShipmentPlanDetail', {
  params: {
    id: data
  }
})

// 修改运输作业计划时间
export const editYSPlanTime = data => axios.post('/pms/c/v1/plan/transPlan/modifyPlanTime', data)

// 提交车次运输作业计划（生成预派工单）
export const submitYSPlanTime = data => axios.post('/pms/c/v1/plan/transPlan/submitApprove', data)

// 获取运输计划详情
export const getTransportDetail = data => axios.get('/pms/c/v1/transit/transport/getTransportOrderWithDetailed', {
  params: {
    id: data
  }
})

// 获取运输-工单列表,支持项目、联段、工艺、工单状态查询
export const pageOfTransportWorkOrder = data => axios.post('/pms/c/v1/transit/transportWorkReport/pageOfTransportWorkOrder', data)

// 运输 - 工单下发
export const allocationTransportOrders = data => axios.post('/pms/c/v1/transit/transportWorkReport/allocationWithBatch', data)
