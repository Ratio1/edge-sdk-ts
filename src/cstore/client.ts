import { BaseClient } from '../baseClient'
import {
  CStoreStatusResponse,
  CStoreGetResponse,
  CStoreSetResponse,
  CStoreHSetResponse,
  CStoreHGetResponse,
  CStoreHGetAllResponse,
  ChainStoreValue,
  GetValueRequest,
  SetValueRequest,
  HashSetValueRequest,
  HashGetValueRequest,
  HGetAllRequest
} from './types'

export class CStoreClient extends BaseClient {
  async getStatus (): Promise<CStoreStatusResponse> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await res.json()
  }


  async setValue ({ key, value }: SetValueRequest): Promise<CStoreSetResponse> {
    const res = await this.request('/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: String(value) })
    })
    return await res.json()
  }

  async getValue ({ key }: GetValueRequest): Promise<CStoreGetResponse> {
    const qs = this.buildQuery({ key: key })
    const res = await this.request(`/get?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hashSetValue ({ hkey, key, value }: HashSetValueRequest): Promise<CStoreHSetResponse> {
    const res = await this.request('/hset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hkey, key, value: String(value) })
    })
    return await res.json()
  }

  async hashGetValue ({ hkey, key }: HashGetValueRequest): Promise<CStoreHGetResponse> {
    const qs = this.buildQuery({ hkey, key })
    const res = await this.request(`/hget?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hgetall ({ hkey }: HGetAllRequest): Promise<CStoreHGetAllResponse> {
    const qs = this.buildQuery({ hkey })
    const res = await this.request(`/hgetall?${qs}`, { method: 'GET' })
    return await res.json()
  }
}
