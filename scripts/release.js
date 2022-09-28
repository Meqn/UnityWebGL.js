const path = require('path')
const fse = require('fs-extra')
const logger = require('diy-log')
const { name } = require('../packages/lib/package.json')

const resolve = dir => path.resolve(__dirname, '..', dir)

async function createVueModule() {
  try {
    await fse.copy(resolve('packages/vue/dist'), resolve('packages/lib/vue'))
    await fse.copy(
      resolve('packages/vue/package.json'),
      resolve('packages/lib/vue/package.json')
    )
    await fse.copy(resolve('packages/lib/README.md'), resolve('README.md'), {
      overwrite: true
    })

    logger.success(`[${logger.colors.gray(name)}]`, 'Build succeeded!')
  } catch (error) {
    logger.error(`[${logger.colors.red(name)}]`, 'Build failed!')
    throw error
  }
}

createVueModule()
