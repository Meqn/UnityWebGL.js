import base, { name } from './rollup.config.base'
import { terser } from 'rollup-plugin-terser'

const config = Object.assign({}, base, {
  output: {
    name,
    file: `dist/${name}.min.js`,
    format: 'umd',
  },
})

config.plugins.push(terser())

export default config
