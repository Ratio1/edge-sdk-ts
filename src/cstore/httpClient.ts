import { BaseHttpClient } from '../common/baseHttpClient'
import type { HttpAdapter } from '../common/http/adapter'
import {
  type CStoreGetResponse,
  type CStoreGetResult,
  type CStoreHGetAllResponse,
  type CStoreHGetAllResult,
  type CStoreHGetResponse,
  type CStoreHGetResult,
  type CStoreHSetResponse,
  type CStoreHSetResult,
  type CStoreSetResponse,
  type CStoreSetResult,
  type CStoreStatusResponse,
  type CStoreStatusResult,
  type GetValueRequest,
  type HGetAllRequest,
  type HGetRequest,
  type HSetRequest,
  type SetValueRequest
} from './types'

export class CStoreHttpClient extends BaseHttpClient {
  protected readonly chainstorePeers: string[] = []
  constructor(
    baseUrl: string,
    verbose = false,
    adapter?: HttpAdapter,
    chainstorePeers: string[] = []
  ) {
    super(baseUrl, verbose, adapter)
    this.chainstorePeers = chainstorePeers
  }

  async getStatus(): Promise<CStoreStatusResult> {
    const res = await this.getStatusFull()
    return res.result
  }

  async getStatusFull(): Promise<CStoreStatusResponse> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await this.parseResponseFull<CStoreStatusResult, CStoreStatusResponse>(res)
  }

  async setValue(request: SetValueRequest): Promise<CStoreSetResult> {
    const res = await this.setValueFull(request)
    return res.result
  }

  async setValueFull(request: SetValueRequest): Promise<CStoreSetResponse> {
    const chainstorePeers = this.resolveChainstorePeers()
    const res = await this.request('/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: request.key,
        value: request.value,
        chainstore_peers: chainstorePeers
      })
    })
    return await this.parseResponseFull<CStoreSetResult, CStoreSetResponse>(res)
  }

  async getValue<T = unknown>(request: GetValueRequest): Promise<CStoreGetResult<T>> {
    const res = await this.getValueFull<T>(request)
    return res.result
  }

  async getValueFull<T = unknown>(request: GetValueRequest): Promise<CStoreGetResponse<T>> {
    const qs = this.buildQuery({ key: request.key })
    const res = await this.request(`/get?${qs}`, { method: 'GET' })
    return await this.parseResponseFull<CStoreGetResult<T>, CStoreGetResponse<T>>(res)
  }

  async hset(request: HSetRequest): Promise<CStoreHSetResult> {
    const res = await this.hsetFull(request)
    return res.result
  }

  async hsetFull(request: HSetRequest): Promise<CStoreHSetResponse> {
    const chainstorePeers = this.resolveChainstorePeers()
    const res = await this.request('/hset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hkey: request.hkey,
        key: request.key,
        value: request.value,
        chainstore_peers: chainstorePeers
      })
    })
    return await this.parseResponseFull<CStoreHSetResult, CStoreHSetResponse>(res)
  }

  async hget<T = unknown>(request: HGetRequest): Promise<CStoreHGetResult<T>> {
    const res = await this.hgetFull<T>(request)
    return res.result
  }

  async hgetFull<T = unknown>(request: HGetRequest): Promise<CStoreHGetResponse<T>> {
    const qs = this.buildQuery({ hkey: request.hkey, key: request.key })
    const res = await this.request(`/hget?${qs}`, { method: 'GET' })
    return await this.parseResponseFull<CStoreHGetResult<T>, CStoreHGetResponse<T>>(res)
  }

  async hgetall<T = unknown>(request: HGetAllRequest): Promise<CStoreHGetAllResult<T>> {
    const res = await this.hgetallFull<T>(request)
    return res.result
  }

  async hgetallFull<T = unknown>(request: HGetAllRequest): Promise<CStoreHGetAllResponse<T>> {
    const qs = this.buildQuery({ hkey: request.hkey })
    const res = await this.request(`/hgetall?${qs}`, { method: 'GET' })
    return await this.parseResponseFull<CStoreHGetAllResult<T>, CStoreHGetAllResponse<T>>(res)
  }

  private resolveChainstorePeers(): string[] {
    return this.chainstorePeers.length > 0 ? this.chainstorePeers : []
  }
}
