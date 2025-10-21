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
        value: String(request.value),
        chainstore_peers: chainstorePeers
      })
    })
    return await this.parseResponseFull<CStoreSetResult, CStoreSetResponse>(res)
  }

  async getValue(request: GetValueRequest): Promise<CStoreGetResult> {
    const res = await this.getValueFull(request)
    return res.result
  }

  async getValueFull(request: GetValueRequest): Promise<CStoreGetResponse> {
    const qs = this.buildQuery({ key: request.key })
    const res = await this.request(`/get?${qs}`, { method: 'GET' })
    return await this.parseResponseFull<CStoreGetResult, CStoreGetResponse>(res)
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
        value: String(request.value),
        chainstore_peers: chainstorePeers
      })
    })
    return await this.parseResponseFull<CStoreHSetResult, CStoreHSetResponse>(res)
  }

  async hget(request: HGetRequest): Promise<CStoreHGetResult> {
    const res = await this.hgetFull(request)
    return res.result
  }

  async hgetFull(request: HGetRequest): Promise<CStoreHGetResponse> {
    const qs = this.buildQuery({ hkey: request.hkey, key: request.key })
    const res = await this.request(`/hget?${qs}`, { method: 'GET' })
    return await this.parseResponseFull<CStoreHGetResult, CStoreHGetResponse>(res)
  }

  async hgetall(request: HGetAllRequest): Promise<CStoreHGetAllResult> {
    const res = await this.hgetallFull(request)
    return res.result
  }

  async hgetallFull(request: HGetAllRequest): Promise<CStoreHGetAllResponse> {
    const qs = this.buildQuery({ hkey: request.hkey })
    const res = await this.request(`/hgetall?${qs}`, { method: 'GET' })
    return await this.parseResponseFull<CStoreHGetAllResult, CStoreHGetAllResponse>(res)
  }

  private resolveChainstorePeers(): string[] {
    return this.chainstorePeers.length > 0 ? this.chainstorePeers : []
  }
}
