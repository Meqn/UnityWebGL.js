const pkg = require('./package.json')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? `/${pkg.name}/example/`
    : '',
  outputDir: 'docs/.vuepress/dist/example',
  assetsDir: 'assets',
  indexPath: 'index.html',
  chainWebpack (config) {
    config
      .plugin('html')
      .tap(args => {
        args[0].template = 'example/template.html'
        return args
      })
  }
}
