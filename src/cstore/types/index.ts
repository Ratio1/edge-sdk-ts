import { BaseResponse } from '../../common/types'

export interface CStoreBaseResponse<T = unknown> extends BaseResponse<T> {}

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

export interface CStoreHGetAllResponse extends CStoreBaseResponse<{ keys: string[] }> {
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
