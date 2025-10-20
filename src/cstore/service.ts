import {
  type FullResponseOptions,
  type ResponseOptions,
  type ResultOnlyOptions
} from '../common/baseHttpClient'
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

  async getStatus(opts: FullResponseOptions): Promise<CStoreStatusResponse>
  async getStatus(opts?: ResultOnlyOptions): Promise<CStoreStatusResult>
  async getStatus(opts?: ResponseOptions): Promise<CStoreStatusResult | CStoreStatusResponse> {
    if (opts?.fullResponse) {
      return await this.http.getStatus(opts)
    }
    return await this.http.getStatus(opts)
  }

  async setValue(data: SetValueRequest, opts: FullResponseOptions): Promise<CStoreSetResponse>
  async setValue(data: SetValueRequest, opts?: ResultOnlyOptions): Promise<CStoreSetResult>
  async setValue(
    data: SetValueRequest,
    opts?: ResponseOptions
  ): Promise<CStoreSetResult | CStoreSetResponse> {
    if (data.key === '') throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    if (opts?.fullResponse) {
      return await this.http.setValue(data, opts)
    }
    return await this.http.setValue(data, opts)
  }

  async getValue(data: GetValueRequest, opts: FullResponseOptions): Promise<CStoreGetResponse>
  async getValue(data: GetValueRequest, opts?: ResultOnlyOptions): Promise<CStoreGetResult>
  async getValue(
    data: GetValueRequest,
    opts?: ResponseOptions
  ): Promise<CStoreGetResult | CStoreGetResponse> {
    if (data.key === '') throw new Error('key is required')
    if (opts?.fullResponse) {
      return await this.http.getValue(data, opts)
    }
    return await this.http.getValue(data, opts)
  }

  async hset(data: HSetRequest, opts: FullResponseOptions): Promise<CStoreHSetResponse>
  async hset(data: HSetRequest, opts?: ResultOnlyOptions): Promise<CStoreHSetResult>
  async hset(
    data: HSetRequest,
    opts?: ResponseOptions
  ): Promise<CStoreHSetResult | CStoreHSetResponse> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    if (data.value === undefined) throw new Error('value is required')
    if (opts?.fullResponse) {
      return await this.http.hset(data, opts)
    }
    return await this.http.hset(data, opts)
  }

  async hget(data: HGetRequest, opts: FullResponseOptions): Promise<CStoreHGetResponse>
  async hget(data: HGetRequest, opts?: ResultOnlyOptions): Promise<CStoreHGetResult>
  async hget(
    data: HGetRequest,
    opts?: ResponseOptions
  ): Promise<CStoreHGetResult | CStoreHGetResponse> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (data.key === '') throw new Error('key is required')
    if (opts?.fullResponse) {
      return await this.http.hget(data, opts)
    }
    return await this.http.hget(data, opts)
  }

  async hgetall(data: HGetAllRequest, opts: FullResponseOptions): Promise<CStoreHGetAllResponse>
  async hgetall(data: HGetAllRequest, opts?: ResultOnlyOptions): Promise<CStoreHGetAllResult>
  async hgetall(
    data: HGetAllRequest,
    opts?: ResponseOptions
  ): Promise<CStoreHGetAllResult | CStoreHGetAllResponse> {
    if (data.hkey === '') throw new Error('hkey is required')
    if (opts?.fullResponse) {
      return await this.http.hgetall(data, opts)
    }
    return await this.http.hgetall(data, opts)
  }
}
