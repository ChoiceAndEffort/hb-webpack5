const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css提取插件
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin'); // css压缩插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
// const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/main.js') // 入口文件
  },
  output: {
    filename: 'scripts/[name].[contenthash].js', // [name] 指entry属性名字, 默认为main
    path: path.resolve(__dirname, '../dist'), // 打包后的目录
    clean: true // 打包前清空输出目录，相当于clean-webpack-plugin插件的作用,webpack5新增。
  },
  plugins: [
    new VueLoaderPlugin(),
    new CssMinimizerWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css' // contenthash是针对文件内容级别的，只有你自己的内容变了，那么hash值才改变
      // chunkFilename: "[id].css",
    }),
    new ESLintPlugin({
      exclude: 'node_modules', // 排除node_modules文件夹的eslint检查
      fix: true // 自动修复js格式错误
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    })
  ],
  module: {
    rules: [
      {
        // 用正则去匹配要用该 loader 转换的 CSS 文件
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /.scss$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env']]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.svg$/,
        type: 'asset',
        generator: {
          filename: 'icons/[name].[contenthash].[ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash].[ext]'
        }
      },

      // {
      //   test: /\.(png|jpe?g|gif)(\?.*)?$/,
      //   loader: 'url-loader',
      //   options: {
      //     esModule: false,
      //     limit: 2 * 1024,
      //     name: 'images/[name].[contenthash].[ext]',
      //   },
      // },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1 * 1024,
          name: 'media/[name].[contenthash].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1 * 1024,
          name: 'fonts/[name].[contenthash].[ext]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 3,
                    targets: {
                      //兼容浏览器最后两个版本的，小于等于ie9版本的
                      browsers: ['last 2 versions', 'not ie <= 9']
                    }
                  }
                ]
              ],
              plugins: [
                // `style: true` 会加载 less 文件
                [
                  'import',
                  {
                    libraryName: 'ant-design-vue',
                    libraryDirectory: 'es',
                    style: 'true'
                  }
                ]
              ]
            }
          }
        ]
      },
      // 这一个loader必须放在最前面,解析vue文件
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    // 设置路径别名
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src')
    },
    // 尝试按顺序解析这些后缀名。
    // 如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ['*', '.js', '.json', '.vue']
  },
  externals: {
    jquery: 'jQuery'
  }
};
