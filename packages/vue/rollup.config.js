import path from 'path'
import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache')
    })
  ],
  external: ['vue-demi'],
  input: 'src/index.ts',
  output: [
    {
      format: 'esm',
      file: 'dist/index.js'
    },
    {
      name: 'VueUnity',
      format: 'umd',
      file: 'dist/index.umd.js',
      globals: {
        vue: 'Vue',
        'vue-demi': 'VueDemi'
      }
    }
  ]
})
