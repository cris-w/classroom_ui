
const path = require('path')
const defaultSettings = require('./src/settings.js')
const name = defaultSettings.title || '翻转课堂' // page title

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 关闭语法检查
    lintOnSave: false,
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    productionSourceMap: false,
    // devServer: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:8081',
    //             // 通过正则表达式重写路径，去掉前缀，解决404问题
    //             pathRewrite: { '^/api': '' },
    //             // ws: true, // 支持 websocket 默认为true
    //             // changeOrange: true // 用户控制请求头中的 host 值，默认为true ，true：host值与目标地址相同，false：host值为当前脚手架的host
    //         },
    //         '/demo': {
    //             target: 'http://localhost:8082',
    //             pathRewrite: { '^/demo': '' },
    //         }
    //     }
    // },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    chainWebpack(config) {
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    }
}