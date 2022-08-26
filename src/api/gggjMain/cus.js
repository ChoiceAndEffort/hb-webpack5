import axios from 'axios'

// 发送短信验证码
export const sendSmsVerificationCode = (data) => axios.get('/cus/v1/smsTools/sendSmsVerificationCode', {
  params: {
    mobile: data
  }
});

// 获取子项目地址
export const getSysConfigValue = (data) => axios.get('/cus/v1/sysConfig/getSysConfigValue', data);

// tss(任务督办服务)首页看板接口-获取获取提示数量（目前督办在用）
export const getTips = () => axios.post('/tss/c/v1/bulletinBoard/getTips');
// tss(任务督办服务)消息提醒接口-更改显示状态为不显示
export const updateStatus = (data) => axios.get('/tss/c/v1/alertMessage/updateStatus', {
  params: {
    id: data
  }
});
// tss(任务督办服务)任务催办记录接口-获取任务催办记录详情数据
export const getDetail = (data) => axios.get('/tss/c/v1/taskSuperviseRecord/getDetail', {
  params: {
    id: data
  }
});
// tss(任务督办服务)任务接收记录接口-通过任务ID查询所有
export const taskFeedbackRecord = (data) => axios.get('/tss/c/v1/taskReceive/getAllByTaskId', {
  params: {
    id: data
  }
});
// tss(任务督办服务)任务分解接口-获取主任务id(目的是获取主任务的基本信息)
export const getMainTaskIdByID = (data) => axios.get('/tss/c/v1/taskDecentralised/getMainTaskIdByID', {
  params: {
    id: data
  }
});
// tss(任务督办服务)任务点评意见记录接口-获取主任务id(目的是获取主任务的基本信息)
export const getAllByEventIdAndDiscussTypeEquals = (data) => axios.get('/tss/c/v1/taskDiscussRecord/getAllByEventIdAndDiscussTypeEquals', {
  params: {
    discussType: data.discussType,
    taskId: data.taskId
  }
});
// tss(任务督办服务)建议接口-获取建议详情数据
export const infoCollectgetDetail = (data) => axios.get('/tss/c/v1/infoCollect/getDetail', {
  params: {
    id: data
  }
});
