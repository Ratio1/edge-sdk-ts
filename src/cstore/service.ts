import { CStoreHttpClient } from './httpClient'
import type {
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
  GetValueRequest,
  SetValueRequest,
  HSetRequest,
  HGetRequest,
  HGetAllRequest
} from './types'

export class CStoreService {
  constructor(private readonly http: CStoreHttpClient) {}

  getStatus(opts?: { fullResponse?: boolean }): Promise<CStoreStatusResult | CStoreStatusResponse> {
    return this.http.getStatus(opts)
  }

  setValue(data: SetValueRequest, opts?: { fullResponse?: boolean }): Promise<CStoreSetResult | CStoreSetResponse> {
    if (!data.key) throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    return this.http.setValue(data, opts)
  }

  getValue(data: GetValueRequest, opts?: { fullResponse?: boolean }): Promise<CStoreGetResult | CStoreGetResponse> {
    if (!data.key) throw new Error('key is required')
    return this.http.getValue(data, opts)
  }

  hset(data: HSetRequest, opts?: { fullResponse?: boolean }): Promise<CStoreHSetResult | CStoreHSetResponse> {
    if (!data.hkey) throw new Error('hkey is required')
    if (!data.key) throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    return this.http.hset(data, opts)
  }

  hget(data: HGetRequest, opts?: { fullResponse?: boolean }): Promise<CStoreHGetResult | CStoreHGetResponse> {
    if (!data.hkey) throw new Error('hkey is required')
    if (!data.key) throw new Error('key is required')
    return this.http.hget(data, opts)
  }

  hgetall(data: HGetAllRequest, opts?: { fullResponse?: boolean }): Promise<CStoreHGetAllResult | CStoreHGetAllResponse> {
    if (!data.hkey) throw new Error('hkey is required')
    return this.http.hgetall(data, opts)
  }
}
