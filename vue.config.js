// vue.config.js
module.exports = {
    chainWebpack: config => {
        config
        .plugin('html')
        .tap(args => {
        args[0].title = 'Ravioleat'
        return args
        })
    },
    devServer: {
      disableHostCheck: true,
      port: 8080,
      public: '0.0.0.0:8080'
    },
}
