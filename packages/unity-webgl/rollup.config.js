import path from 'path'
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const name = 'UnityWebgl'
const env = process.env.NODE_ENV

const banner =
  '/*!\n' +
  ` * unity-webgl.js v${pkg.version}\n` +
  ` * (c) ${new Date().getFullYear()} Mervin<mengqing723@gmail.com>\n` +
  ' * Released under the MIT License.\n' +
  ' */'

const config = defineConfig({
  input: path.resolve(__dirname, 'src/index.ts'),
  output: [
    {
      name,
      file: pkg.main,
      format: 'umd',
      banner
    },
    {
      file: pkg.module,
      format: 'es',
      banner
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    })
  ]
})

console.log('process.env', process.env.NODE_ENV)

if (env === 'production') {
  config.plugins.push(terser())
}

export default config
