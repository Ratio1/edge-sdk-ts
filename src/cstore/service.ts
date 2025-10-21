import { type FullResponseOptions, type ResponseOptions } from '../common/baseHttpClient'
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

  async getStatus<R extends ResponseOptions | undefined = undefined>(
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreStatusResponse : CStoreStatusResult> {
    return await this.http.getStatus<R>(opts)
  }

  async setValue<R extends ResponseOptions | undefined = undefined>(
    data: SetValueRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreSetResponse : CStoreSetResult> {
    if (data.key === '') throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    return await this.http.setValue<R>(data, opts)
  }

  async getValue<R extends ResponseOptions | undefined = undefined>(
    data: GetValueRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreGetResponse : CStoreGetResult> {
    if (data.key === '') throw new Error('key is required')
    return await this.http.getValue<R>(data, opts)
  }

  async hset<R extends ResponseOptions | undefined = undefined>(
    data: HSetRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreHSetResponse : CStoreHSetResult> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    return await this.http.hset<R>(data, opts)
  }

  async hget<R extends ResponseOptions | undefined = undefined>(
    data: HGetRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreHGetResponse : CStoreHGetResult> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    return await this.http.hget<R>(data, opts)
  }

  async hgetall<R extends ResponseOptions | undefined = undefined>(
    data: HGetAllRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? CStoreHGetAllResponse : CStoreHGetAllResult> {
    if (data.hkey === '') throw new Error('hkey is required')
    return await this.http.hgetall<R>(data, opts)
  }
}
