// Base response structure with proper typing
export interface CStoreBaseResponse<T = unknown> {
  result: T
  server_node_addr: string
  evm_network: string
  ee_node_alias: string
  ee_node_address: string
  ee_node_eth_address: string
  ee_node_network: string
  ee_node_ver: string
  [key: string]: any
}

// Specific response types with proper result typing
export interface CStoreStatusResponse extends CStoreBaseResponse<boolean> {
  keys?: string[]
}

export interface CStoreGetResponse extends CStoreBaseResponse<string> {
}

export interface CStoreSetResponse extends CStoreBaseResponse<boolean> {
}

export interface CStoreHSetResponse extends CStoreBaseResponse<boolean> {
}

export interface CStoreHGetResponse extends CStoreBaseResponse<string> {
}

export interface CStoreHGetAllResponse extends CStoreBaseResponse<Record<string, any>> {
}

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
