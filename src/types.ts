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

export interface CStoreStatusResponse extends CStoreBaseResponse {
  keys: string[]
}

export interface CStoreValueResponse extends CStoreBaseResponse {
  [cstore_key: string]: any
}

export interface CStoreHashResponse extends CStoreBaseResponse {
  [hkey: string]: { [key: string]: any } | any
}

export type ChainStoreValue = string | number | boolean | object | any[]

export interface StatusResponse {
  [key: string]: any
  EE_ID?: string
}

export interface DownloadResponse {
  file?: any
  file_base64_str?: string
  filename: string
}

// Re-export BaseResponse for convenience
export { BaseResponse }
