import {
  BaseHttpClient,
  type FullResponseOptions,
  type ResponseOptions,
  type ResultOnlyOptions
} from '../common/baseHttpClient'
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

  async getStatus(opts: FullResponseOptions): Promise<CStoreStatusResponse>
  async getStatus(opts?: ResultOnlyOptions): Promise<CStoreStatusResult>
  async getStatus(opts?: ResponseOptions): Promise<CStoreStatusResult | CStoreStatusResponse> {
    const res = await this.request('/get_status', { method: 'GET' })
    if (opts?.fullResponse) {
      return await this.parseResponse<CStoreStatusResult>(res, opts)
    }
    return await this.parseResponse<CStoreStatusResult>(res, opts)
  }

  async setValue(request: SetValueRequest, opts: FullResponseOptions): Promise<CStoreSetResponse>
  async setValue(request: SetValueRequest, opts?: ResultOnlyOptions): Promise<CStoreSetResult>
  async setValue(
    { key, value }: SetValueRequest,
    opts?: ResponseOptions
  ): Promise<CStoreSetResult | CStoreSetResponse> {
    const chainstorePeers = this.chainstorePeers.length > 0 ? this.chainstorePeers : []
    const res = await this.request('/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: String(value), chainstore_peers: chainstorePeers })
    })
    if (opts?.fullResponse) {
      return await this.parseResponse<CStoreSetResult>(res, opts)
    }
    return await this.parseResponse<CStoreSetResult>(res, opts)
  }

  async getValue(request: GetValueRequest, opts: FullResponseOptions): Promise<CStoreGetResponse>
  async getValue(request: GetValueRequest, opts?: ResultOnlyOptions): Promise<CStoreGetResult>
  async getValue(
    { key }: GetValueRequest,
    opts?: ResponseOptions
  ): Promise<CStoreGetResult | CStoreGetResponse> {
    const qs = this.buildQuery({ key })
    const res = await this.request(`/get?${qs}`, { method: 'GET' })
    if (opts?.fullResponse) {
      return await this.parseResponse<CStoreGetResult>(res, opts)
    }
    return await this.parseResponse<CStoreGetResult>(res, opts)
  }

  async hset(request: HSetRequest, opts: FullResponseOptions): Promise<CStoreHSetResponse>
  async hset(request: HSetRequest, opts?: ResultOnlyOptions): Promise<CStoreHSetResult>
  async hset(
    { hkey, key, value }: HSetRequest,
    opts?: ResponseOptions
  ): Promise<CStoreHSetResult | CStoreHSetResponse> {
    const chainstorePeers = this.chainstorePeers.length > 0 ? this.chainstorePeers : []
    const res = await this.request('/hset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hkey, key, value: String(value), chainstore_peers: chainstorePeers })
    })
    if (opts?.fullResponse) {
      return await this.parseResponse<CStoreHSetResult>(res, opts)
    }
    return await this.parseResponse<CStoreHSetResult>(res, opts)
  }

  async hget(request: HGetRequest, opts: FullResponseOptions): Promise<CStoreHGetResponse>
  async hget(request: HGetRequest, opts?: ResultOnlyOptions): Promise<CStoreHGetResult>
  async hget(
    { hkey, key }: HGetRequest,
    opts?: ResponseOptions
  ): Promise<CStoreHGetResult | CStoreHGetResponse> {
    const qs = this.buildQuery({ hkey, key })
    const res = await this.request(`/hget?${qs}`, { method: 'GET' })
    if (opts?.fullResponse) {
      return await this.parseResponse<CStoreHGetResult>(res, opts)
    }
    return await this.parseResponse<CStoreHGetResult>(res, opts)
  }

  async hgetall(request: HGetAllRequest, opts: FullResponseOptions): Promise<CStoreHGetAllResponse>
  async hgetall(request: HGetAllRequest, opts?: ResultOnlyOptions): Promise<CStoreHGetAllResult>
  async hgetall(
    { hkey }: HGetAllRequest,
    opts?: ResponseOptions
  ): Promise<CStoreHGetAllResult | CStoreHGetAllResponse> {
    const qs = this.buildQuery({ hkey })
    const res = await this.request(`/hgetall?${qs}`, { method: 'GET' })
    if (opts?.fullResponse) {
      return await this.parseResponse<CStoreHGetAllResult>(res, opts)
    }
    return await this.parseResponse<CStoreHGetAllResult>(res, opts)
  }
}
