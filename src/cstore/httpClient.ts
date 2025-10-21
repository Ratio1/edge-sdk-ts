import {
  BaseHttpClient,
  type FullResponseOptions,
  type ResponseOptions
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

  async getStatus<R extends ResponseOptions | undefined = undefined>(
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreStatusResponse : CStoreStatusResult> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await this.parseResponse<CStoreStatusResult, R>(res, opts)
  }

  async setValue<R extends ResponseOptions | undefined = undefined>(
    { key, value }: SetValueRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreSetResponse : CStoreSetResult> {
    const chainstorePeers = this.chainstorePeers.length > 0 ? this.chainstorePeers : []
    const res = await this.request('/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: String(value), chainstore_peers: chainstorePeers })
    })
    return await this.parseResponse<CStoreSetResult, R>(res, opts)
  }

  async getValue<R extends ResponseOptions | undefined = undefined>(
    { key }: GetValueRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreGetResponse : CStoreGetResult> {
    const qs = this.buildQuery({ key })
    const res = await this.request(`/get?${qs}`, { method: 'GET' })
    return await this.parseResponse<CStoreGetResult, R>(res, opts)
  }

  async hset<R extends ResponseOptions | undefined = undefined>(
    { hkey, key, value }: HSetRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreHSetResponse : CStoreHSetResult> {
    const chainstorePeers = this.chainstorePeers.length > 0 ? this.chainstorePeers : []
    const res = await this.request('/hset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hkey, key, value: String(value), chainstore_peers: chainstorePeers })
    })
    return await this.parseResponse<CStoreHSetResult, R>(res, opts)
  }

  async hget<R extends ResponseOptions | undefined = undefined>(
    { hkey, key }: HGetRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreHGetResponse : CStoreHGetResult> {
    const qs = this.buildQuery({ hkey, key })
    const res = await this.request(`/hget?${qs}`, { method: 'GET' })
    return await this.parseResponse<CStoreHGetResult, R>(res, opts)
  }

  async hgetall<R extends ResponseOptions | undefined = undefined>(
    { hkey }: HGetAllRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreHGetAllResponse : CStoreHGetAllResult> {
    const qs = this.buildQuery({ hkey })
    const res = await this.request(`/hgetall?${qs}`, { method: 'GET' })
    return await this.parseResponse<CStoreHGetAllResult, R>(res, opts)
  }
}
