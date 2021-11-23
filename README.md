# vue-component-template

基于rollup打包 `vue@2.x` 组件开发模板.
> @vue/cli 4.5.15

## features

1. 基于rollup打包，默认支持 `es`,`umd`,`iife`模式
2. 基于vuepress编写文档
3. 支持部署演示demo
4. 配合`travis`自动部署到`gh`

## useage
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

## refs
- [rollup API列表](https://www.rollupjs.com/guide/big-list-of-options)
- [rollup从入门到打包一个按需加载的组件库](https://juejin.cn/post/6934698510436859912)
