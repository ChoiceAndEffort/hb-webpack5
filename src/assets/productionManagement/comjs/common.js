import { getDictData } from '@/api/productionManagement/systemManagement.js'
/* 获取字典表*/
const getDictdata = (data) => {
  const res = getDictData(data)
  return res
}
export default {
  getDictdata
}

