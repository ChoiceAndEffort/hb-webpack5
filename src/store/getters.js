// 引入基座的仓库
import gggjMainGetters from './gggj-main/getters.js'
import gggjProductionManagementGetters from './gggj-production-management/getters.js'

const getters = {
  ...gggjMainGetters,
  ...gggjProductionManagementGetters
};
export default getters;
