import { BaseHttpClient } from '../common/baseHttpClient'
import {
  CStoreStatusResult,
  CStoreStatusResponse,
  CStoreGetResult,
  CStoreGetResponse,
  CStoreSetResult,
  CStoreSetResponse,
  CStoreHSetResult,
  CStoreHSetResponse,
  CStoreHGetResult,
  CStoreHGetResponse,
  CStoreHGetAllResult,
  CStoreHGetAllResponse,
  ChainStoreValue,
  GetValueRequest,
  SetValueRequest,
  HSetRequest,
  HGetRequest,
  HGetAllRequest
} from './types'

export class CStoreHttpClient extends BaseHttpClient {
  async getStatus (opts?: { fullResponse?: boolean }): Promise<CStoreStatusResult | CStoreStatusResponse> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await this.parseResponse<CStoreStatusResult>(res, opts)
  }

  async setValue ({ key, value }: SetValueRequest, opts?: { fullResponse?: boolean }): Promise<CStoreSetResult | CStoreSetResponse> {
    const res = await this.request('/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: String(value) })
    })
    return await this.parseResponse<CStoreSetResult>(res, opts)
  }

  async getValue ({ key }: GetValueRequest, opts?: { fullResponse?: boolean }): Promise<CStoreGetResult | CStoreGetResponse> {
    const qs = this.buildQuery({ key: key })
    const res = await this.request(`/get?${qs}`, { method: 'GET' })
    return await this.parseResponse<CStoreGetResult>(res, opts)
  }

  async hset ({ hkey, key, value }: HSetRequest, opts?: { fullResponse?: boolean }): Promise<CStoreHSetResult | CStoreHSetResponse> {
    const res = await this.request('/hset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hkey, key, value: String(value) })
    })
    return await this.parseResponse<CStoreHSetResult>(res, opts)
  }

  async hget ({ hkey, key }: HGetRequest, opts?: { fullResponse?: boolean }): Promise<CStoreHGetResult | CStoreHGetResponse> {
    const qs = this.buildQuery({ hkey, key })
    const res = await this.request(`/hget?${qs}`, { method: 'GET' })
    return await this.parseResponse<CStoreHGetResult>(res, opts)
  }

  async hgetall ({ hkey }: HGetAllRequest, opts?: { fullResponse?: boolean }): Promise<CStoreHGetAllResult | CStoreHGetAllResponse> {
    const qs = this.buildQuery({ hkey })
    const res = await this.request(`/hgetall?${qs}`, { method: 'GET' })
    return await this.parseResponse<CStoreHGetAllResult>(res, opts)
  }
}
