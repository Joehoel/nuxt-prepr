import { addCustomTab, extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import { createResolver, logger, useNuxt } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import type { ModuleOptions } from './module'
import type { ClientFunctions, ServerFunctions } from './types'
import { useViteWebSocket } from './utils'

import { DEVTOOLS_MODULE_ICON, DEVTOOLS_MODULE_NAME, DEVTOOLS_MODULE_TITLE, DEVTOOLS_RPC_NAMESPACE, DEVTOOLS_UI_PATH, DEVTOOLS_UI_PORT } from './contants'
import { setupRPC } from './rpc'

export function setupDevToolsUI(options: ModuleOptions) {
  const nuxt = useNuxt()
  const resolver = createResolver(import.meta.url)

  const clientPath = resolver.resolve('./client')
  const isProductionBuild = existsSync(clientPath)

  if (isProductionBuild) {
    nuxt.hook('vite:serverCreated', async (server) => {
      const sirv = await import('sirv').then(r => r.default || r)
      server.middlewares.use(
        DEVTOOLS_UI_PATH,
        sirv(clientPath, { dev: true, single: true }),
      )
    })
  }
  else {
    nuxt.hook('vite:extendConfig', (config) => {
      config.server = config.server || {}
      config.server.proxy = config.server.proxy || {}
      config.server.proxy[DEVTOOLS_UI_PATH] = {
        target: `http://localhost:${DEVTOOLS_UI_PORT}${DEVTOOLS_UI_PATH}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: path => path.replace(DEVTOOLS_UI_PATH, ''),
      }
    })
  }

  logger.success("DevTools client running at:" , `http://localhost:${DEVTOOLS_UI_PORT}${DEVTOOLS_UI_PATH}`)

  addCustomTab({
      name: DEVTOOLS_MODULE_NAME,
      title: DEVTOOLS_MODULE_TITLE,
      icon: DEVTOOLS_MODULE_ICON,
      view: {
        type: 'iframe',
        src: DEVTOOLS_UI_PATH,
      },
  })
}