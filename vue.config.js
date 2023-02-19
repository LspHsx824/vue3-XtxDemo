const path = require("path")
const {
  defineConfig
} = require('@vue/cli-service')


module.exports = defineConfig({
  pluginOptions: {
    // 完成自动注入公用变量和混入
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/mixins.less'),
        path.join(__dirname, './src/assets/styles/variables.less'),
      ]
    }
  },
  lintOnSave: false,
  chainWebpack: config => {
    // config.module
    //   .rule('images')
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .tap(options => ({
    //     ...options,
    //     limit: 10000
    //   }))

    // 已被废弃 
    // config.devServer.disableHostCheck(true)
  },
  devServer: {
    // 需要开启IP或域名访问webpack服务器权限，在vue.config.js中
    historyApiFallback: true,
    allowedHosts: 'all',
  }
})