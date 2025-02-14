import type { H3Event } from 'h3'
import { defu } from 'defu'
import { useRuntimeConfig } from 'nitropack/runtime'

export function useSchemaOrgConfig(e?: H3Event) {
  const runtimeConfig = useRuntimeConfig(e)
  return defu(import.meta.client ? runtimeConfig.public['prepr'] : runtimeConfig['prepr'])
}
