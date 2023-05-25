import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json' assert { type: 'json' }

const name = 'VueUnity'
const env = process.env.NODE_ENV
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const outputs = [
  {
    name,
    file: `dist/${pkg.unpkg.split('/').pop()}`,
    format: 'iife',
    globals: {
      vue: 'Vue',
      'vue-demi': 'VueDemi'
    }
  },
  {
    file: `dist/${pkg.main.split('/').pop()}`,
    format: 'cjs',
    exports: 'default'
  },
  {
    file: `dist/${pkg.module.split('/').pop()}`,
    format: 'esm'
  }
]

function generateLib(outputs) {
  return outputs.map(item => {
    const config = defineConfig({
      input: path.resolve(__dirname, 'src/index.ts'),
      output: item,
      plugins: [
        json({
          namedExports: false
        }),
        nodeResolve(),
        commonjs(),
        typescript({
          useTsconfigDeclarationDir: true,
          cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache')
        })
      ],
      external: ['vue-demi']
    })

    if (env === 'production' && item.format === 'iife') {
      config.plugins.push(terser())
    }

    return config
  })
}

export default [...generateLib(outputs)]
