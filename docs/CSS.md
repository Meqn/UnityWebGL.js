# CSS处理

css处理方式包含: 单css文件处理、import css文件处理、.vue内部style处理。

> `rollup-plugin-postcss` 默认集成 `less/sass/stylus` ,支持配置postcss插件。  
> 若不提取css文件，则在rollup的`plugins`属性中配置`postcss()`即可。

## 提取CSS文件
安装依赖
```bash
yarn add -D postcss rollup-plugin-postcss
```

### 1. 单独css文件
创建rollup配置文件，执行 `rollup --config ./rollup.css.config.js` 即可。
```js
// rollup.css.config.js
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer' // 自动兼容前缀

export default {
  input: 'src/index.scss',
  output: {
    file: 'dist/style.css'
  },
  plugins: [
    postcss({
      minimize: true, // 压缩
      modules: false, // 模块化
      extract: true, // 提取css文件
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            'android 4.1',
            'iOS 7.1',
            'chrome > 31',
            'ie > 9',
            'last 10 versions'
          ]
        })
      ]
    })
  ]
}
```

### 2. import引入css文件
在 `rollup.config.js` 中配置如下
```js
// rollup.config.js
export default {
  plugins: [
    postcss({
      minimize: true,
      plugins: [
        autoprefixer()
      ],
      extract: 'style/index.min.css'
    })
  ]
}
```

### 3. .vue文件内部style
提取`.vue`文件内部style，参见 [官方文档 Extract CSS](https://rollup-plugin-vue.vuejs.org/examples.html#extract-css) 、 [rollup-plugin-css-only 文档](https://github.com/thgh/rollup-plugin-css-only)

```js
// rollup.config.js

import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'

export default {
  input: 'src/MyComponent.vue',
  output: {
    format: 'esm',
    file: 'dist/MyComponent.js'
  },
  plugins: [
    css({
      output: 'bundle.css' //提取css文件
    }),
    vue({
      css: false // 将 <style> 块转换为import语句, rollup-plugin-css-only可以提取.vue文件中的样式
    })
  ]
}
```

`rollup-plugin-css-only` 更多配置
```js
import css from 'rollup-plugin-css-only' // 提取css
import CleanCSS from 'clean-css'   // 压缩css
import { writeFileSync } from 'fs' // 写文件

export default {
  plugins: [
    css({
      // Callback that will be called ongenerate with two arguments:
      // - styles: the contents of all style tags combined: 'body { color: green }'
      // - styleNodes: an array of style objects: [{lang: 'css', content: 'body { color: green }'}]
      output: function (styles, styleNodes) {
        // writeFileSync('bundle.css', styles)
        writeFileSync('dist/base-ui.css', new CleanCSS().minify(style).styles)
      }
    }),
    vue({ css: false })
  ]
}
```


> `rollup-plugin-vue` 用于处理.vue文件，需注意vue2和vue3项目使用的版本不一样。
>   - `vue@2x`: `rollup-plugin-vue^5.1.9 + vue-template-compiler`
>   - `vue@3x`: `rollup-plugin-vue^6.0.0 + @vue/compiler-sfc`