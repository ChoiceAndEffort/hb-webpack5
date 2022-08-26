import axios from 'axios'
// ----运输相关接口------
// 运输管理-列表查询
export const pageOfLeaveFactoryInventory = data => axios.post('/pms/c/v1/transit/transport/pageOfLeaveFactoryInventory', data)

// 运输详情
export const getTransportOrderWithDetailed = data => axios.get('/pms/c/v1/transit/transport/getTransportOrderWithDetailed', {
  params: {
    id: data
  }
})

// 非产品新增运输需求
export const addTransportWithNonProduct = data => axios.post('/pms/c/v1/transit/transport/addTransportWithNonProduct', data)

// 运输-取消（作废）
export const cancelTransportTask = data => axios.post('/pms/c/v1/transit/transport/cancelTransportTask', data)
