# vue-component-template

基于rollup打包 `vue@2.x` 组件开发模板.


```
.
├── README.md
├── babel.config.js
├── build
│   ├── rollup.config.base.js
│   ├── rollup.config.browser.js
│   ├── rollup.config.es.js
│   └── rollup.config.umd.js
├── docs
│   ├── .vuepress
│   │   └── config.js
│   └── README.md
├── example
│   ├── App.vue
│   ├── components
│   └── main.js
├── jest.config.js
├── package.json
├── sr
│   ├── component.vue
│   └── index.js
├── tests
│   └── unit
├── types
│   └── index.d.ts
├── vue.config.js
└── yarn.lock
```

## Install

### 1. 创建 vue 项目
> 用于开发、测试
```bash
vue create vue-component
```

### 2. 使用rollup 打包
> 打包配置在`build` 目录下，默认支持 `es`、`umd`、`iife` 模式
```bash
yarn add --dev rollup

rollup
@rollup/plugin-babel
@rollup/plugin-node-resolve #查找外部模块 (rollup只能加载相对路径模块)
@rollup/plugin-commonjs #将 CommonJS模块转换为 es模块
@rollup/plugin-replace
rollup-plugin-vue
rollup-plugin-css-only #提取css为独立文件
rollup-plugin-analyzer
rollup-plugin-terser #代码压缩
rollup-plugin-postcss #css处理，默认集成sass,less,stylus支持
```

> 1. `rollup-plugin-commonjs` 应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏 CommonJS 的检测。  
> 2. `rollup-plugin-postcss` 默认将css生成style标签插入到head中
> 3. `rollup-plugin-css-only` 提取.vue文件中的css，需要设置 `rollup-plugin-vue`的css属性
> 4. `rollup-plugin-vue` 用于处理.vue文件，需注意vue2和vue3项目使用的版本不一样。
>     - `vue@2x`: `rollup-plugin-vue^5.1.9 + vue-template-compiler`
>     - `vue@3x`: `rollup-plugin-vue^6.0.0 + @vue/compiler-sfc`

包含 Babel 模块化运行时助手和 regenerator-runtime 版本的库
```bash
yarn add --dev @babel/runtime
```

babel配置
```js
module.exports = {
  presets: [
    // "@vue/cli-plugin-babel/preset",
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ]
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime"
  ],
  env: {
    test: {
      presets: [
        [
          "@babel/env", {
            "targets": { "node": "current" }
          }
        ],
      ],
      plugins: [
        "@babel/plugin-syntax-dynamic-import"
      ]
    }
  }
}
```

### 3. Vuepress文档
```bash
yarn add --dev vuepress
```

## Useage

### 1. rollup打包
```bash
yarn build
```

### 2. 测试example
```bash
yarn dev #开发
yarn demo:build #打包
```

### 3. Vuepress编写文档
```bash
yarn docs:dev #开发
yarn docs:build #打包
```
