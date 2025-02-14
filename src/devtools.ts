import { existsSync } from 'node:fs'
import type { Nuxt } from 'nuxt/schema'
import { createResolver, logger, useNuxt, type Resolver } from '@nuxt/kit'
import { addCustomTab, extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import type { ClientFunctions, ServerFunctions } from './types'
import type { ModuleOptions } from './module'
import { useViteWebSocket } from './utils'

import { setupRPC } from './rpc'
import { DEVTOOLS_MODULE_ICON, DEVTOOLS_MODULE_NAME, DEVTOOLS_MODULE_TITLE, DEVTOOLS_RPC_NAMESPACE, DEVTOOLS_UI_PATH, DEVTOOLS_UI_PORT } from './contants'

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

  const wsServer = useViteWebSocket(nuxt)
  onDevToolsInitialized(async () => {
    const rpcFunctions = setupRPC({ options, wsServer, nuxt })

    extendServerRpc<ClientFunctions, ServerFunctions>(DEVTOOLS_RPC_NAMESPACE, rpcFunctions)
  })
}