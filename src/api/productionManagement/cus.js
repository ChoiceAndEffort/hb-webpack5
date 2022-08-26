import axios from 'axios'
const defaultSettings = require('@/settings.js')
let baseUrl = ''
if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_TITLE === 'test') {
    baseUrl = defaultSettings.testApi;
  } else {
    baseUrl = defaultSettings.productionApi;
  }
} else if (process.env.NODE_ENV === 'development') {
  baseUrl = defaultSettings.developmentApi;
}

// 文件工具 - 上传单文件
export const uploadSingleFile = (data) => axios({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  method: 'post',
  url: '/cus/v1/fileTools/uploadSingleFile',
  data: data
})

// 文件工具 - 上传多文件
export const uploadmoreleFile = (data) => axios({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  method: 'post',
  url: '/cus/v1/fileTools/uploadSomeFile',
  data: data
})

// 文件工具 - 删除单文件
export const deleteFile = (data) => axios.get('/cus/v1/fileTools/deleteFile', {
  params: {
    fileUrl: data
  }
})

export const imgUrl = baseUrl + 'cus/utils/view/img?fileId=';

export const uploadSingleurl = baseUrl + '/cus/v1/fileTools/uploadSingleFile' // 单文件上传url
export const uploadmoreleurl = baseUrl + '/cus/v1/fileTools/uploadSomeFile' // 多文件上传url
