import axios from 'axios'

// ========== 项目总计划 =================
// 创建项目总计划
export const generateProjectAndCouplingPlan = (data) => axios.post('/pms/c/v1/plan/projectMasterPlan/generateProjectAndCouplingPlan', data);

// 获取项目总计划分页数据
export const projectMasterPlan = (data) => axios.post('/pms/c/v1/plan/projectMasterPlan/getPage', data);

// 项目总计划维护
export const projectMasterPlanSave = (data) => axios.post('/pms/c/v1/plan/projectMasterPlan/save', data);

// 项目联段计划维护
export const projectCouplingPlanSave = (data) => axios.post('/pms/c/v1/plan/projectCouplingPlan/save', data);

// 项目联段工序计划维护
export const projectWorkingProcedurePlanSave = (data) => axios.post('/pms/c/v1/plan/projectWorkingProcedurePlan/save', data);

// 项目工序轮次计划维护
export const projectWorkingProcedureRoundsPlanSave = (data) => axios.post('/pms/c/v1/plan/projectWorkingProcedureRoundsPlan/save', data);

// 生成工序轮次计划与套料计划
export const generateRoundsAndNestingPlan = (data) => axios.post('/pms/c/v1/plan/projectWorkingProcedureRoundsPlan/generateRoundsAndNestingPlan', data);

// 生成工序轮次计划与物料计划
export const generateMaterialAndAttachmentPlan = (data) => axios.post('/pms/c/v1/plan/materialPlan/generateMaterialAndAttachmentPlan', data);

// ========== 物料计划接口 ==============
// 获取物料分页数据
export const materialGetPage = (data) => axios.post('/pms/c/v1/datamanagement/material/getPage', data);

// ========== 套料计划接口 ==============
// 套料计划维护
export const nestingPlanSave = (data) => axios.post('/pms/c/v1/plan/nestingPlan/save', data);

// 获取套料计划分页数据
export const nestingPlanGetPage = (data) => axios.post('/pms/c/v1/plan/nestingPlan/getPage', data);

// 获取套料计划详情数据
export const nestingPlanGetDetail = (data) => axios.get('/pms/c/v1/plan/nestingPlan/getDetail', {
  params: {
    id: data
  }
});

// 套料批量维护
export const saveNestingPlanList = (data) => axios.post('/pms/c/v1/plan/nestingPlan/saveNestingPlanList', data);

// 生成项目总计划与联段计划
export const achieveProjectAndCouplingPlan = (data) => axios.post('/pms/c/v1/plan/projectMasterPlan/achieveProjectAndCouplingPlan', data);

// 生成项目联段的工序计划
export const generateProcedurePlan = (data) => axios.post('/pms/c/v1/plan/projectCouplingPlan/generateProcedurePlan', data);

// 获取项目联段工序不分页
export const getProjectWorkingProcedurePlanList = (data) => axios.post('/pms/c/v1/plan/projectWorkingProcedurePlan/getProjectWorkingProcedurePlanList', data);

// 轮次计划不分页
export const getProjectWorkingProcedureRoundsPlanList = (data) => axios.post('/pms/c/v1/plan/projectWorkingProcedureRoundsPlan/getProjectWorkingProcedureRoundsPlanList', data);

// 获取套料图列表数据
export const getNestingPoolList = (data) => axios.post('/pms/c/v1/datamanagement/nesting/getNestingPoolList', data);
// 根据套料图获取套料图页码
export const getNestingList = (data) => axios.post('/pms/c/v1/datamanagement/nesting/getNestingList', data);

// 获取联段计划不分页
export const getProjectCouplingPlanList = (data) => axios.post('/pms/c/v1/plan/projectCouplingPlan/getProjectCouplingPlanList', data);

// 项目工序轮次计划维护(有返回值)
export const modifyRoundsPlan = data => axios.post('/pms/c/v1/plan/projectWorkingProcedureRoundsPlan/modifyRoundsPlan', data)

// 获取轮次下套料计划不分页
export const getNestingPlanList = data => axios.post('/pms/c/v1/plan/nestingPlan/getNestingPlanList', data)

// 获取轮次下物料计划分页
export const getMaterialPlanPage = data => axios.post('/pms/c/v1/plan/materialPlan/getPage', data)
// 获取轮次下物料计划不分页
export const getMaterialPlanList = data => axios.post('/pms/c/v1/plan/materialPlan/getMaterialPlanList', data)

// 获取套料列表
export const getNestingPage = data => axios.post('/pms/c/v1/datamanagement/nesting/getNestingPage', data)

// 删除轮次计划
export const deletedRoundsPlan = (data) => axios.get('/pms/c/v1/plan/projectWorkingProcedureRoundsPlan/deletedRoundsPlan', {
  params: {
    id: data
  }
});

// 删除套料零件坡口
export const deletedNestingPlan = (data) => axios.get('/pms/c/v1/plan/nestingPlan/deletedNestingPlan', {
  params: {
    id: data
  }
});

// 删除物料计划数据
export const deletedMaterialPlan = (data) => axios.get('/pms/c/v1/plan/materialPlan/deletedMaterialPlan', {
  params: {
    id: data
  }
});

// 获取工序作业计划分页(套料)
export const workingProcedurePage = data => axios.post('/pms/c/v1/plan/nestingPlan/getNestingAndPartChildPage', data)

// 获取工序作业计划分页(物料)
export const workingMaterialPage = data => axios.post('/pms/c/v1/plan/materialPlan/getMaterialAndAttachmentChildPage', data)

// 维护工序作业计划(套料)
export const saveWorkingProcedure = data => axios.post('/pms/c/v1/plan/nestingPlan/modifyNestingAndPartPlan', data)

// 维护工序作业计划(物料)
export const saveMaterialWorkingProcedure = data => axios.post('/pms/c/v1/plan/materialPlan/modifyMaterialPlan', data)

// 提交工序作业计划(套料)
export const submitApprove = data => axios.post('/pms/c/v1/plan/nestingPlan/submitApprove', data)

// 提交工序作业计划(套料)
export const submitMaterialApprove = data => axios.post('/pms/c/v1/plan/materialPlan/submitApprove', data)
