
import {
  dealStoreModule
} from '@/utils/dealStoreModule.js'
const modulesFiles = require.context('./modules', true, /\.js$/);
export default dealStoreModule(modulesFiles)
