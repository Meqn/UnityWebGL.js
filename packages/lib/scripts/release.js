const path = require('path')
const fse = require('fs-extra')

const resolve = (dir) => path.resolve(__dirname, '..', dir)

async function createVueModule() {
  try {
    await fse.mkdirp(resolve('vue'))
    await fse.copy(resolve('dist/VueUnity.esm.js'), resolve('vue/index.js'))
    await fse.copy(resolve('README.md'), resolve('../../README.md'), { overwrite: true })
  } catch (error) {
    throw new Error(error.message)
  }
}

createVueModule()
