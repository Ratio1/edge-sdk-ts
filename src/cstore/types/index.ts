import { BaseResponse } from '../../common/types'

export interface CStoreBaseResponse<T = unknown> extends BaseResponse<T> {}

// Result types for specific operations
export interface CStoreStatusResult {
  keys: string[]
}

export interface CStoreGetResult {
  value: string
}

export interface CStoreSetResult {
  success: boolean
}

export interface CStoreHSetResult {
  success: boolean
}

export interface CStoreHGetResult {
  value: string
}

export interface CStoreHGetAllResult {
  keys: string[]
}

// Specific response types with proper result typing
export interface CStoreStatusResponse extends CStoreBaseResponse<CStoreStatusResult> {
  server_node_addr: string
  evm_network: string
  ee_node_alias: string
  ee_node_address: string
  ee_node_eth_address: string
  ee_node_network: string
  ee_node_ver: string
}

export interface CStoreGetResponse extends CStoreBaseResponse<CStoreGetResult> {}

export interface CStoreSetResponse extends CStoreBaseResponse<CStoreSetResult> {}

export interface CStoreHSetResponse extends CStoreBaseResponse<CStoreHSetResult> {}

export interface CStoreHGetResponse extends CStoreBaseResponse<CStoreHGetResult> {}

export interface CStoreHGetAllResponse extends CStoreBaseResponse<CStoreHGetAllResult> {}

// Value types for chain store operations
export type ChainStoreValue = string | number | boolean | object | any[]

// Request interfaces
export interface GetValueRequest {
  key: string
}

export interface SetValueRequest {
  key: string
  value: ChainStoreValue
}

export interface HashSetValueRequest {
  hkey: string
  key: string
  value: ChainStoreValue
}

export interface HashGetValueRequest {
  hkey: string
  key: string
}

export interface HGetAllRequest {
  hkey: string
}
