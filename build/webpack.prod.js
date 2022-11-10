const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const prodEnv = require('../config/prod.env');
const testEnv = require('../config/test.env');
const showEnv = require('../config/show.env');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

// 代码分离
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// gzip压缩
const CompressionPlugin = require('compression-webpack-plugin');
// css压缩
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

console.log('获取打包环境-------', process.env.NODE_ENV);
console.log('获取打包URL-------', testEnv.URL);
let curEnv;
let isProduction = ['production'].includes(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'test') {
  curEnv = testEnv;
} else if (process.env.NODE_ENV === 'show') {
  curEnv = showEnv;
} else {
  curEnv = prodEnv;
}

module.exports = merge(common, {
  mode: 'production',
  devtool: ['test'].includes(curEnv) ? 'eval-cheap-module-source-map' : false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': curEnv
    }),
    // new BundleAnalyzerPlugin(),
    new CompressionPlugin({
      test: /\.js$|\.html$|\.css$/,
      // 超过1M压缩
      threshold: 10240,
      deleteOriginalAssets: true //是否删除原始文件
    }),
    new CssMinimizerPlugin(),
    new TerserPlugin({
      extractComments: false, //不将注释提取到单独的文件中
      parallel: 4, //使用多进程并发运行以提高构建速度
      terserOptions: {
        compress: {
          warnings: isProduction,
          drop_debugger: isProduction, // 删除debugger
          drop_console: isProduction // 删除console
        }
      }
    })
  ],
  optimization: {
    nodeEnv: false, //让webpack不会自动读取配置文件中的mode给process.env.NODE_ENV赋值
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 2,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        lodash: {
          name: 'lodash',
          chunks: 'async',
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          priority: 40
        }
      }
    }
  }
});
