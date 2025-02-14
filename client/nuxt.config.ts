import { createResolver } from '@nuxt/kit'
import { DEVTOOLS_UI_PATH } from '../src/contants'

const resolver = createResolver(import.meta.url)


export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools-ui-kit',
  ],

  ssr: false,

  app: {
    baseURL: DEVTOOLS_UI_PATH,
  },

  nitro: {
    output: {
      publicDir: resolver.resolve('../dist/client'),
    },
  },

  compatibilityDate: '2025-02-13',
})