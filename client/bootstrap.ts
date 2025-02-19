import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { startSubprocess } from '@nuxt/devtools-kit'
import { DEVTOOLS_UI_PORT } from '../src/contants'


const resolver = createResolver(import.meta.url)

export default defineNuxtModule((_, nuxt) => {  
  if (!nuxt.options.dev || !nuxt.options.modules?.includes('nuxt-prepr')) return

  startSubprocess(
    {
      command: 'npx',
      args: ['nuxi', 'dev', '--port', DEVTOOLS_UI_PORT.toString()],
      cwd: resolver.resolve('.'),
    },
    {
      id: 'nuxt-devtools:prepr-client',
      name: 'Nuxt DevTools Prepr Client',
    },
  )
})