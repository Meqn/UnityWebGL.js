# rollup

- [官方文档](https://rollupjs.org/)
- [rollup API列表](https://www.rollupjs.com/guide/big-list-of-options)


## plugins

常用的`rollup`插件说明

| 插件                        | 说明                                                         |
| --------------------------- | ------------------------------------------------------------ |
| rollup-plugin-terser        | 帮助我们在打包过程中实现代码压缩 (uglify仅支持es5)           |
| rollup-plugin-progress      | 输出Rollup打包的进度                                         |
| @rollup/plugin-alias        | 提供了为模块起别名的功能，用过webpack的小伙伴应该对这个功能非常熟悉 |
| @rollup/plugin-commonjs     | 帮助我们支持CommonJS模块                                     |
| @rollup/plugin-json         | 帮助我们把.json转换成`ES6`模块                               |
| @rollup/plugin-node-resolve | 帮助我们在`node_modules`中找到并捆绑第三方依赖项             |
| @rollup/plugin-replace      | 捆绑文件时替换文件中的字符串                                 |
| @rollup/plugin-url          | 内联导入文件作为数据URI，或将其复制到输出目录                |

Babel相关：

| 插件                                      | 说明                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| @rollup/plugin-babel                      | 帮助我们对`ES6`等语法进行编译转换成`ES5`                     |
| @babel/preset-env                         | 一个智能预设，可让您使用最新的JavaScript，而无需微观管理目标环境所需的语法转换（以及可选的浏览器polyfill），JavaScript包更小 |
| @babel/plugin-proposal-decorators         | 允许使用修饰器的jsx语法                                      |
| @babel/plugin-proposal-class-properties   | 用于编译类组件                                               |
| @babel/plugin-proposal-object-rest-spread | 用于使用spread操作符                                         |

处理样式相关：

| 插件                                | 说明                                                    |
| ----------------------------------- | ------------------------------------------------------- |
| rollup-plugin-postcss               | 用于处理sass/less/stylus                                |
| postcss-plugin-pxtoviewport         | 把px换成为vw单位                                        |
| postcss-url                         | 处理样式`url()`图片，复制到输出目录或者转成Base64等操作 |
| autoprefixer                        | 自动给样式属性添加`-webkit-`等前缀用于兼容浏览器        |
| rollup-plugin-postcss-inject-to-css | 把postcss`inject`模式下的样式引用从内联转换成外联       |

