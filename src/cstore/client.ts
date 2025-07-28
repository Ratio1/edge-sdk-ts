import { BaseClient } from '../baseClient'
import {
  CStoreStatusResult,
  CStoreGetResult,
  CStoreSetResult,
  CStoreHSetResult,
  CStoreHGetResult,
  CStoreHGetAllResult,
  CStoreBaseResponse,
  ChainStoreValue,
  GetValueRequest,
  SetValueRequest,
  HashSetValueRequest,
  HashGetValueRequest,
  HGetAllRequest
} from './types'

export class CStoreClient extends BaseClient {
  async getStatus (): Promise<CStoreBaseResponse<CStoreStatusResult>> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await res.json()
  }

  async setValue ({ key, value }: SetValueRequest): Promise<CStoreBaseResponse<CStoreSetResult>> {
    const res = await this.request('/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: String(value) })
    })
    return await res.json()
  }

  async getValue ({ key }: GetValueRequest): Promise<CStoreBaseResponse<CStoreGetResult>> {
    const qs = this.buildQuery({ key: key })
    const res = await this.request(`/get?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hashSetValue ({ hkey, key, value }: HashSetValueRequest): Promise<CStoreBaseResponse<CStoreHSetResult>> {
    const res = await this.request('/hset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hkey, key, value: String(value) })
    })
    return await res.json()
  }

  async hashGetValue ({ hkey, key }: HashGetValueRequest): Promise<CStoreBaseResponse<CStoreHGetResult>> {
    const qs = this.buildQuery({ hkey, key })
    const res = await this.request(`/hget?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hgetall ({ hkey }: HGetAllRequest): Promise<CStoreBaseResponse<CStoreHGetAllResult>> {
    const qs = this.buildQuery({ hkey })
    const res = await this.request(`/hgetall?${qs}`, { method: 'GET' })
    return await res.json()
  }
}
