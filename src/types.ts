import { BaseResponse } from './common/types'

// Legacy interfaces - keeping for backward compatibility
export interface CStoreBaseResponse {
  server_alias: string
  server_version: string
  server_time: string
  server_current_epoch: number
  server_uptime: string
  [key: string]: any
}

export type ChainStoreValue = string | number | boolean | object | any[]

// Re-export BaseResponse for convenience
export { BaseResponse }
