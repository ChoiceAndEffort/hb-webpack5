import axios from 'axios';

// 用户登录 - 账号密码登录
export const accountLogin = (data) => axios.post('/aas/v1/account/staffPasswordlogin', data);

// 用户登录 - 手机号验证码登录
export const codeLogin = (data) => axios.post('/aas/v1/account/staffSmsCodelogin', data);

// 找回密码
export const retrievalPassword = (data) => axios.post('/aas/v1/account/retrievalPassword', data);

// 根据员工获取企业
// export const queryEnterpriseDetail = (data) => axios.post('/aas/v1/enterprise/queryEnterpriseDetail', data);
export const queryEnterpriseDetail = (data) => axios.get('/aas/v1/enterprise/queryEnterpriseDetail', {
  params: {
    staffId: data
  }
});
export const chooseEnterprise = (data) => axios.post('/aas/v1/account/chooseEnterprise', data);
/** 设置默认企业 */
export const setDefaultEnterprise = (data) => axios.post('/aas/v1/staff/staffSetDefaultEnterprise', data);
