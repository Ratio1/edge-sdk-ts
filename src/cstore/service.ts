import { type CStoreHttpClient } from './httpClient'
import type {
  CStoreGetResponse,
  CStoreGetResult,
  CStoreHGetAllResponse,
  CStoreHGetAllResult,
  CStoreHGetResponse,
  CStoreHGetResult,
  CStoreHSetResponse,
  CStoreHSetResult,
  CStoreHSyncResponse,
  CStoreHSyncResult,
  CStoreSetResponse,
  CStoreSetResult,
  CStoreStatusResponse,
  CStoreStatusResult,
  GetValueRequest,
  HGetAllRequest,
  HGetRequest,
  HSetRequest,
  HSyncRequest,
  SetValueRequest
} from './types'

export class CStoreService {
  constructor(private readonly http: CStoreHttpClient) {}

  async getStatus(): Promise<CStoreStatusResult> {
    return await this.http.getStatus()
  }

  async getStatusFull(): Promise<CStoreStatusResponse> {
    return await this.http.getStatusFull()
  }

  async setValue(data: SetValueRequest): Promise<CStoreSetResult> {
    if (data.key === '') throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    return await this.http.setValue(data)
  }

  async setValueFull(data: SetValueRequest): Promise<CStoreSetResponse> {
    if (data.key === '') throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    return await this.http.setValueFull(data)
  }

  async getValue<T = unknown>(data: GetValueRequest): Promise<CStoreGetResult<T>> {
    if (data.key === '') throw new Error('key is required')
    return await this.http.getValue<T>(data)
  }

  async getValueFull<T = unknown>(data: GetValueRequest): Promise<CStoreGetResponse<T>> {
    if (data.key === '') throw new Error('key is required')
    return await this.http.getValueFull<T>(data)
  }

  async hset(data: HSetRequest): Promise<CStoreHSetResult> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    return await this.http.hset(data)
  }

  async hsetFull(data: HSetRequest): Promise<CStoreHSetResponse> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    return await this.http.hsetFull(data)
  }

  async hget<T = unknown>(data: HGetRequest): Promise<CStoreHGetResult<T>> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    return await this.http.hget<T>(data)
  }

  async hgetFull<T = unknown>(data: HGetRequest): Promise<CStoreHGetResponse<T>> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    return await this.http.hgetFull<T>(data)
  }

  async hgetall<T = unknown>(data: HGetAllRequest): Promise<CStoreHGetAllResult<T>> {
    if (data.hkey === '') throw new Error('hkey is required')
    return await this.http.hgetall<T>(data)
  }

  async hgetallFull<T = unknown>(data: HGetAllRequest): Promise<CStoreHGetAllResponse<T>> {
    if (data.hkey === '') throw new Error('hkey is required')
    return await this.http.hgetallFull<T>(data)
  }

  async hsync(data: HSyncRequest): Promise<CStoreHSyncResult> {
    if (data.hkey === '') throw new Error('hkey is required')
    return await this.http.hsync(data)
  }

  async hsyncFull(data: HSyncRequest): Promise<CStoreHSyncResponse> {
    if (data.hkey === '') throw new Error('hkey is required')
    return await this.http.hsyncFull(data)
  }
}
