const path = require('path')
const fse = require('fs-extra')

const resolve = (dir) => path.resolve(__dirname, '..', dir)

async function createVueModule() {
  try {
    await fse.mkdirp(resolve('vue'))
    fse.copy(resolve('dist/VueUnity.esm.js'), resolve('vue/index.js'))
  } catch (error) {
    throw new Error(error.message)
  }
}

createVueModule()
