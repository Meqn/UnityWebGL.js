import base, { name } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named', // 文档：https://www.rollupjs.com/guide/big-list-of-options#exports
    name,
    file: `dist/${name}.umd.js`,
    format: 'umd',
  },
})

export default config
