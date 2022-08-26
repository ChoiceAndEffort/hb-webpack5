module.exports = {
    "presets": [

        // /**
        //  * 使用推荐预设
        //  * 这里不配置 useBuiltIns: 'usage'，和`@babel/plugin-transform-runtime`冲突，原因如下
        //  */
        // ["@babel/preset-env", {
        //     "modules": false
        // }],
        "@vue/babel-preset-jsx"
    ],
    compact:false,//关闭The following entrypoint(s) combined asset size exceeds the recommended limit
    "plugins": [
        /**
         * 1、通过`@babel/plugin-transform-runtime`，收敛通用的babel helper方法，通过require的使用，而非在每个文件重新定义helper方法
         * 2、会针对`Promise`之类的变量名做替换处理，例如：
         *    `var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));`
         * 3、默认使用corejs@3，因为corejs@2的版本已经停止更新了，后续新的特性需要通过corejs@3支持
         */
        // [
        //     "@babel/plugin-transform-runtime",
        //     {
        //         "corejs": 3
        //     }
        // ],
        /**
         * 支持webpack 动态引入 import
         */
        [
            "@babel/plugin-syntax-dynamic-import",
            {
                options: {
                    exclude: 'node_modules',
                }
            }
        ]
    ]
};