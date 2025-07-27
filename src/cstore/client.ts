import { BaseClient } from '../baseClient'
import {
  CStoreStatusResponse,
  CStoreValueResponse,
  CStoreHashResponse,
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

  async getValue ({ cstoreKey }: GetValueRequest): Promise<CStoreValueResponse> {
    const qs = this.buildQuery({ cstore_key: cstoreKey })
    const res = await this.request(`/get_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async setValue ({ cstoreKey, chainstoreValue }: SetValueRequest): Promise<CStoreValueResponse> {
    const qs = this.buildQuery({ cstore_key: cstoreKey, chainstore_value: chainstoreValue })
    const res = await this.request(`/set_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hashSetValue ({ hkey, key, value }: HashSetValueRequest): Promise<CStoreHashResponse> {
    const qs = this.buildQuery({ hkey, key, value })
    const res = await this.request(`/hash_set_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hashGetValue ({ hkey, key }: HashGetValueRequest): Promise<CStoreHashResponse> {
    const qs = this.buildQuery({ hkey, key })
    const res = await this.request(`/hash_get_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hgetall ({ hkey }: HGetAllRequest): Promise<CStoreHashResponse> {
    const res = await this.request('/hgetall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hkey })
    })
    return await res.json()
  }
}
