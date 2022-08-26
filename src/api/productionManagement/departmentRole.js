import axios from 'axios'
// 部门管理 - 部门维护 - 新增/编辑部门
export const operationDepartment = (data) => axios.post('/aas/v1/department/operationDepartment', data);

// 部门管理 - 获取部门列表数据
export const getDepartmentList = (data) => axios.post('/aas/v1/department/getDepartmentList', data);

// 部门管理 - 获取部门详情数据
export const getDepartmentDetail = (data) => axios.get('/aas/v1/department/getDepartmentDetail', {
  params: {
    id: data
  }
});

// 开启禁用部门
export const operationDepartmentStatus = (data) => axios.get('/aas/v1/department/operationDepartmentStatus', {
  params: {
    id: data
  }
});
// 岗位 - 获取岗位列表数据
export const getPositionList = (data) => axios.post('/aas/v1/position/getPositionList', data);
// 岗位 - 岗位维护 - 新增/编辑
export const operationPosition = (data) => axios.post('/aas/v1/position/operationPosition', data);
// 获取岗位角色
export const getPositionRole = (data) => axios.get('/aas/v1/position/getPositionRole', {
  params: {
    id: data
  }
});
// 角色 - 获取列表数据
export const getRoleList = (data) => axios.post('/aas/v1/role/getRoleList', data);
// 批量设置岗位角色
export const positionSetRole = (data) => axios.post('/aas/v1/position/positionBatchSetRole', data);
// 移除岗位角色
export const positionRemoveRole = (data) => axios.post('/aas/v1/position/positionRemoveRole', data);

// 角色维护 - 新增、 编辑
export const operationRole = (data) => axios.post('/aas/v1/role/operationRole', data);
// 角色 - 获取角色分页数据
export const getRolePage = (data) => axios.post('/aas/v1/role/getRolePage', data);
// 角色 - 禁用开启角色
export const operationAdminRoleStatus = (data) => axios.get('/aas/v1/role/operationRoleStatus', {
  params: {
    id: data
  }
});
// 角色 - 获取角色及其权限
export const getRoleAndPower = (data) => axios.get('/aas/v1/role/getRoleAndPower', {
  params: {
    id: data
  }
});
// 权限 - 获取权限列表
export const getPowerList = (data) => axios.post('/aas/v1/power/getPowerList', data);
// 角色 - 维护角色权限
export const operationRolePower = (data) => axios.post('/aas/v1/role/operationRolePower', data);
// 角色 - 获取角色详情数据
export const getRoleDetail = (data) => axios.get('/aas/v1/role/getRoleDetail', {
  params: {
    id: data
  }
});
// 企业 - 获取企业及其权限
export const getEnterpriseAndPower = (data) => axios.get('/aas/v1/enterprise/getEnterpriseAndPower', {
  params: {
    id: data
  }
});
// 企业 -分页列表
export const getEnterprisePage = (data) => axios.post('/aas/v1/enterprise/getEnterprisePage', data);
// 企业 - 企业维护
export const operationEnterprise = (data) => axios.post('/aas/v1/enterprise/operationEnterprise', data);
// 企业 - 禁用开启企业
export const operationEnterpriseStatus = (data) => axios.get('/aas/v1/enterprise/operationEnterpriseStatus', {
  params: {
    id: data
  }
});
// 企业 - 维护企业权限
export const operationEnterprisePower = (data) => axios.post('/aas/v1/enterprise/operationEnterprisePower', data);
// 权限 - 维护
export const operationPower = (data) => axios.post('/aas/v1/power/operationPower', data);
// 权限 - 删除权限
export const deletePower = (data) => axios.get('/aas/v1/power/deletePower', {
  params: {
    id: data
  }
});
// 权限 - 禁用/开启权限
export const operationPowerStatus = (data) => axios.get('/aas/v1/power/operationPowerStatus', {
  params: {
    id: data
  }
});
/** 系统管理*/
// 系统配置维护
export const getSysConfigPage = (data) => axios.post('/cus/v1/sysConfig/getSysConfigPage', data);

// 系统配置维护
export const operationSysConfig = (data) => axios.post('/cus/v1/sysConfig/operationSysConfig', data);

/* 组织架构*/
// 获取部门列表数据
// export const getDepartmentList = (data) => axios.post('/aas/v1/department/getDepartmentList', data);
// 获取员工分页数据
export const getStaffPage = (data) => axios.post('/aas/v1/staff/getStaffPage', data);
// 员工信息整体维护
export const operationStaffAllInfo = (data) => axios.post('/aas/v1/staff/operationStaffAllInfo', data);
// 员工 - 获取员工整体信息
export const getStaffAllInfo = (data) => axios.get('/aas/v1/staff/getStaffAllInfo', {
  params: {
    id: data
  }
});
// 移除生产架构人员
export const removeProduction = (data) => axios.post('/aas/v1/staff/staffRemoveProductionDepartment', data);
// 禁用-开启员工账号
export const operationStaffIsLock = (data) => axios.get('/aas/v1/staff/operationStaffIsLock', {
  params: {
    id: data
  }
});
// 设置人员生产部门
export const staffSetProductionDepartment = (data) => axios.post('/aas/v1/staff/staffSetProductionDepartment', data);
// 工种 - 获取工种列表数据
export const getWorkTypeList = (data) => axios.post('/aas/v1/workType/getWorkTypeList', data);
// 工种等级 -获取工种列表数据
export const getWorkTypeLevelList = (data) => axios.post('/aas/v1/workType/getWorkTypeLevelList', data);
// 工种 - 工种维护
export const operationWorkType = (data) => axios.post('/aas/v1/workType/operationWorkType', data);
// 工种等级 - 工种等级维护
export const operationWorkTypeLevel = (data) => axios.post('/aas/v1/workType/operationWorkTypeLevel', data);
// 企业 -获取企业列表数据
export const getcorpPage = (data) => axios.post('/aas/v1/enterprise/getEnterpriseList', data);
