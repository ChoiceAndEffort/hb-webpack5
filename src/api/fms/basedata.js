import axios from 'axios';

// 凭证字翻页查询
export const voucherWordList = (data) => axios.post('/fms/c/v1/voucherWord/pageList', data);
// 保存
export const voucherWordStore = (data) => axios.post('/fms/c/v1/voucherWord/store', data);
// 获取
export const voucherWordGet = (id) => axios.get('/fms/c/v1/voucherWord/get/' + id);
// 删除
export const voucherWordDel = (id) => axios.get('/fms/c/v1/voucherWord/del/' + id);
