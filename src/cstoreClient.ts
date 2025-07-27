import { BaseClient } from './baseClient'
import { CStoreStatusResponse, CStoreValueResponse, CStoreHashResponse, ChainStoreValue } from './types'

export class CStoreClient extends BaseClient {
  async getStatus (): Promise<CStoreStatusResponse> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await res.json()
  }

  async getValue (cstoreKey: string): Promise<CStoreValueResponse> {
    const qs = this.buildQuery({ token: 'admin', cstore_key: cstoreKey })
    const res = await this.request(`/get_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async setValue (cstoreKey: string, value: ChainStoreValue): Promise<CStoreValueResponse> {
    const qs = this.buildQuery({ token: 'admin', cstore_key: cstoreKey, chainstore_value: value })
    const res = await this.request(`/set_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hashSetValue (hkey: string, key: string, value: ChainStoreValue): Promise<CStoreHashResponse> {
    const qs = this.buildQuery({ token: 'admin', hkey, key, value })
    const res = await this.request(`/hash_set_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hashGetValue (hkey: string, key: string): Promise<CStoreHashResponse> {
    const qs = this.buildQuery({ token: 'admin', hkey, key })
    const res = await this.request(`/hash_get_value?${qs}`, { method: 'GET' })
    return await res.json()
  }

  async hgetall (hkey: string): Promise<CStoreHashResponse> {
    const res = await this.request('/hgetall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: 'admin' },
      body: JSON.stringify({ hkey })
    })
    return await res.json()
  }
}
