const {
    merge
} = require('webpack-merge');
const common = require('./webpack.config.js');
const path = require('path');
const env = require("../config/dev.env");
const webpack = require("webpack");

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map', //在 development 模式里，建议使用 eval-source-map 和 eval-cheap-module-source-map，前者可以追踪到源码的行列，后者只能追踪到行，当然后者的构建速度会块一点。
    // lintOnSave:false,
    devServer: { //提供一个本地服务(serve)：
        port: 3000,
        // 根据需要是否开启以下配置
        hot: true, //热更新
        open: true, //编译完自动打开浏览器
        compress: true, //开启gzip压缩
        // static: { //托管静态资源文件
        //     directory: path.join(__dirname, "../public"),
        // },
        // client: { //在浏览器端打印编译进度-
        //     progress: true,
        // },

        client: { //将错误和警告展示到浏览器窗口
            overlay: {
                errors: false,
                warnings: false,
            },
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": env,
        }),
    ],
});