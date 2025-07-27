export interface CStoreBaseResponse {
  ee_node_alias: string
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

export interface GetValueRequest {
  cstoreKey: string
}

export interface SetValueRequest {
  cstoreKey: string
  chainstoreValue: ChainStoreValue
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
