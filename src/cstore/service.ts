import { type CStoreHttpClient } from './httpClient'
import type {
  CStoreGetResponse,
  CStoreGetResult,
  CStoreHGetAllResponse,
  CStoreHGetAllResult,
  CStoreHGetResponse,
  CStoreHGetResult,
  CStoreHSetResponse,
  CStoreHSetResult,
  CStoreSetResponse,
  CStoreSetResult,
  CStoreStatusResponse,
  CStoreStatusResult,
  GetValueRequest,
  HGetAllRequest,
  HGetRequest,
  HSetRequest,
  SetValueRequest
} from './types'

export class CStoreService {
  constructor(private readonly http: CStoreHttpClient) {}

  async getStatus(opts?: {
    fullResponse?: boolean
  }): Promise<CStoreStatusResult | CStoreStatusResponse> {
    return await this.http.getStatus(opts)
  }

  async setValue(
    data: SetValueRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<CStoreSetResult | CStoreSetResponse> {
    if (data.key === '') throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    return await this.http.setValue(data, opts)
  }

  async getValue(
    data: GetValueRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<CStoreGetResult | CStoreGetResponse> {
    if (data.key === '') throw new Error('key is required')
    return await this.http.getValue(data, opts)
  }

  async hset(
    data: HSetRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<CStoreHSetResult | CStoreHSetResponse> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    return await this.http.hset(data, opts)
  }

  async hget(
    data: HGetRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<CStoreHGetResult | CStoreHGetResponse> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    return await this.http.hget(data, opts)
  }

  async hgetall(
    data: HGetAllRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<CStoreHGetAllResult | CStoreHGetAllResponse> {
    if (data.hkey === '') throw new Error('hkey is required')
    return await this.http.hgetall(data, opts)
  }
}
