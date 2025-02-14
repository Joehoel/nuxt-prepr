import { addPlugin, addServerHandler, createResolver, defineNuxtModule, logger } from '@nuxt/kit'
import { defu } from 'defu'
import { DEVTOOLS_MODULE_KEY, DEVTOOLS_MODULE_NAME } from './contants'
import { setupDevToolsUI } from './devtools'


// Module options TypeScript interface definition
export interface ModuleOptions {
  apiUrl: string
  adminUrl?: string
  devtools?: boolean
  accessToken: string;
  env: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: DEVTOOLS_MODULE_NAME,
    configKey: DEVTOOLS_MODULE_KEY,
  },
  // Default configuration options of the Nuxt module
  defaults: {
    devtools: true,
    env: 'preview',
    accessToken: "",
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.prepr = defu(nuxt.options.runtimeConfig.public.prepr, options)
    nuxt.options.runtimeConfig.prepr = defu(nuxt.options.runtimeConfig.prepr, options)

    addPlugin(resolve('./runtime/plugin'))

    addServerHandler({
      handler: resolve('./runtime/server/headers'),
    })

    const isDevToolsEnabled = typeof nuxt.options.devtools === 'boolean' ? nuxt.options.devtools : nuxt.options.devtools.enabled
    if (nuxt.options.dev && isDevToolsEnabled) {
      setupDevToolsUI(options)
    }

    logger.success(`${DEVTOOLS_MODULE_NAME} is ready!`)
  },
})
