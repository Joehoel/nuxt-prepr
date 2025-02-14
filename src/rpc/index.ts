import { DEVTOOLS_MODULE_NAME } from '../contants'
import type { DevtoolsServerContext, ServerFunctions } from '../types'

export function setupRPC(ctx: DevtoolsServerContext): ServerFunctions {
  return {
    getOptions() {
      return ctx.options
    },
  }
}
