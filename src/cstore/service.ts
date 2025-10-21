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
  CStoreSetResponse,
  CStoreSetResult,
  CStoreStatusResponse,
  CStoreStatusResult,
  GetValueRequest,
  HGetAllRequest,
  HGetRequest,
  HSetRequest,
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

  async getValue(data: GetValueRequest): Promise<CStoreGetResult> {
    if (data.key === '') throw new Error('key is required')
    return await this.http.getValue(data)
  }

  async getValueFull(data: GetValueRequest): Promise<CStoreGetResponse> {
    if (data.key === '') throw new Error('key is required')
    return await this.http.getValueFull(data)
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

  async hget(data: HGetRequest): Promise<CStoreHGetResult> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    return await this.http.hget(data)
  }

  async hgetFull(data: HGetRequest): Promise<CStoreHGetResponse> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    return await this.http.hgetFull(data)
  }

  async hgetall(data: HGetAllRequest): Promise<CStoreHGetAllResult> {
    if (data.hkey === '') throw new Error('hkey is required')
    return await this.http.hgetall(data)
  }

  async hgetallFull(data: HGetAllRequest): Promise<CStoreHGetAllResponse> {
    if (data.hkey === '') throw new Error('hkey is required')
    return await this.http.hgetallFull(data)
  }
}
