let icons = [];
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
icons = requireAll(req)
export default icons
