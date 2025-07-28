import { BaseClient } from './baseClient'
import { 
  CStoreStatusResult,
  CStoreGetResult,
  CStoreSetResult,
  CStoreHSetResult,
  CStoreHGetResult,
  CStoreHGetAllResult,
  CStoreBaseResponse,
  ChainStoreValue
} from './cstore/types'

export class CStoreClient extends BaseClient {
  async getStatus (): Promise<CStoreBaseResponse<CStoreStatusResult>> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await res.json()
  }

  async getValue (cstoreKey: string): Promise<CStoreBaseResponse<CStoreGetResult>> {
    const qs = this.buildQuery({ token: 'admin', cstore_key: cstoreKey })
    const res = await this.request(`/get_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async setValue (cstoreKey: string, value: ChainStoreValue): Promise<CStoreBaseResponse<CStoreSetResult>> {
    const qs = this.buildQuery({ token: 'admin', cstore_key: cstoreKey, chainstore_value: value })
    const res = await this.request(`/set_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hashSetValue (hkey: string, key: string, value: ChainStoreValue): Promise<CStoreBaseResponse<CStoreHSetResult>> {
    const qs = this.buildQuery({ token: 'admin', hkey, key, value })
    const res = await this.request(`/hash_set_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hashGetValue (hkey: string, key: string): Promise<CStoreBaseResponse<CStoreHGetResult>> {
    const qs = this.buildQuery({ token: 'admin', hkey, key })
    const res = await this.request(`/hash_get_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hgetall (hkey: string): Promise<CStoreBaseResponse<CStoreHGetAllResult>> {
    const res = await this.request('/hgetall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: 'admin' },
      body: JSON.stringify({ hkey })
    })
    return await res.json()
  }
}
