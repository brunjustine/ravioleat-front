// vue.config.js
module.exports = {
    chainWebpack: config => {
        config
        .plugin('html')
        .tap(args => {
        args[0].title = 'Ravioleat'
        return args
        })
    }
}