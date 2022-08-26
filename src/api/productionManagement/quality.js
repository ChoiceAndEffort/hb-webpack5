import axios from 'axios'
// 获取互检-专检-监理--待、已检验列表(套料)
export const getMutualInspectionPage = data => axios.post('/pms/c/v1/workreport/jobWorkReport/getMutualInspectionPage', data)
// 项目报工审核维护--互检填报(套料)
export const mutualInspection = data => axios.post('/pms/c/v1/workreport/jobWorkReportExamine/mutualInspection', data)
// 项目报工审核维护--专检填报(套料)
export const specialInspection = data => axios.post('/pms/c/v1/workreport/jobWorkReportExamine/specialInspection', data)
// 项目报工审核维护--监理填报(套料)
export const externalInspection = data => axios.post('/pms/c/v1/workreport/jobWorkReportExamine/supervisorInspection', data)
// 检验详情查看(套料)
export const inspectionDetails = data => axios.get('/pms/c/v1/workreport/jobWorkReport/inspectionDetails', {
  params: {
    jobWorkReportId: data
  }
})
// 获取互检-专检-监理--待、已检验列表(物料)
export const getMutualInspectionMaterialPage = data => axios.post('/pms/c/v1/workreport/materialWorkReport/getMutualInspectionPage', data)
// 项目报工审核维护--互检填报(物料)
export const mutualInspectionMaterial = data => axios.post('/pms/c/v1/workreport/jobWorkReportExamine/mutualInspectionMaterial', data)
// 项目报工审核维护--专检填报(物料)
export const specialInspectionMaterial = data => axios.post('/pms/c/v1/workreport/jobWorkReportExamine/specialInspectionMaterial', data)
// 项目报工审核维护--监理填报(物料)
export const externalInspectionMaterial = data => axios.post('/pms/c/v1/workreport/jobWorkReportExamine/supervisorInspectionMaterial', data)
// 检验详情查看(物料)
export const inspectionMaterialDetails = data => axios.get('/pms/c/v1/workreport/materialWorkReport/inspectionDetails', {
  params: {
    materialWorkReportId: data
  }
})
