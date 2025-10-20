import {
  type FullResponseOptions,
  type ResponseOptions,
  type ResultOnlyOptions
} from '../common/baseHttpClient'
import { type R1FSHttpClient } from './httpClient'
import type {
  CalculateCidRequest,
  CalculatePickleCidRequest,
  DownloadFileRequest,
  R1FSCidResponse,
  R1FSCidResult,
  R1FSDownloadResponse,
  R1FSDownloadResult,
  R1FSStatusResponse,
  R1FSStatusResult,
  R1FSUploadResponse,
  R1FSUploadResult,
  R1FSYamlDataResponse,
  R1FSYamlDataResult,
  RetrieveYamlRequest,
  StoreJsonRequest,
  StorePickleRequest,
  StoreYamlRequest,
  UploadBase64Request,
  UploadFileRequest
} from './types'

export class R1FSService {
  constructor(private readonly http: R1FSHttpClient) {}

  async getStatus(opts: FullResponseOptions): Promise<R1FSStatusResponse>
  async getStatus(opts?: ResultOnlyOptions): Promise<R1FSStatusResult>
  async getStatus(opts?: ResponseOptions): Promise<R1FSStatusResult | R1FSStatusResponse> {
    if (opts?.fullResponse) {
      return await this.http.getStatus(opts)
    }
    return await this.http.getStatus(opts)
  }

  async addFile(data: UploadFileRequest, opts: FullResponseOptions): Promise<R1FSUploadResponse>
  async addFile(data: UploadFileRequest, opts?: ResultOnlyOptions): Promise<R1FSUploadResult>
  async addFile(
    data: UploadFileRequest,
    opts?: ResponseOptions
  ): Promise<R1FSUploadResult | R1FSUploadResponse> {
    if (data?.formData == null && data?.file == null)
      throw new Error('file or formData is required')
    if (opts?.fullResponse) {
      return await this.http.addFile(data, opts)
    }
    return await this.http.addFile(data, opts)
  }

  async addFileBase64(
    data: UploadBase64Request,
    opts: FullResponseOptions
  ): Promise<R1FSUploadResponse>
  async addFileBase64(
    data: UploadBase64Request,
    opts?: ResultOnlyOptions
  ): Promise<R1FSUploadResult>
  async addFileBase64(
    data: UploadBase64Request,
    opts?: ResponseOptions
  ): Promise<R1FSUploadResult | R1FSUploadResponse> {
    if (data.file_base64_str === '') throw new Error('file_base64_str is required')
    if (opts?.fullResponse) {
      return await this.http.addFileBase64(data, opts)
    }
    return await this.http.addFileBase64(data, opts)
  }

  async getFile(data: DownloadFileRequest, opts: FullResponseOptions): Promise<R1FSDownloadResponse>
  async getFile(data: DownloadFileRequest, opts?: ResultOnlyOptions): Promise<R1FSDownloadResult>
  async getFile(
    data: DownloadFileRequest,
    opts?: ResponseOptions
  ): Promise<R1FSDownloadResult | R1FSDownloadResponse> {
    if (data.cid === '') throw new Error('cid is required')
    if (opts?.fullResponse) {
      return await this.http.getFile(data, opts)
    }
    return await this.http.getFile(data, opts)
  }

  async getFileBase64(
    data: DownloadFileRequest,
    opts: FullResponseOptions
  ): Promise<R1FSDownloadResponse>
  async getFileBase64(
    data: DownloadFileRequest,
    opts?: ResultOnlyOptions
  ): Promise<R1FSDownloadResult>
  async getFileBase64(
    data: DownloadFileRequest,
    opts?: ResponseOptions
  ): Promise<R1FSDownloadResult | R1FSDownloadResponse> {
    if (data.cid === '') throw new Error('cid is required')
    if (opts?.fullResponse) {
      return await this.http.getFileBase64(data, opts)
    }
    return await this.http.getFileBase64(data, opts)
  }

  async addYaml(data: StoreYamlRequest, opts: FullResponseOptions): Promise<R1FSCidResponse>
  async addYaml(data: StoreYamlRequest, opts?: ResultOnlyOptions): Promise<R1FSCidResult>
  async addYaml(
    data: StoreYamlRequest,
    opts?: ResponseOptions
  ): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    if (opts?.fullResponse) {
      return await this.http.addYaml(data, opts)
    }
    return await this.http.addYaml(data, opts)
  }

  async getYaml(data: RetrieveYamlRequest, opts: FullResponseOptions): Promise<R1FSYamlDataResponse>
  async getYaml(data: RetrieveYamlRequest, opts?: ResultOnlyOptions): Promise<R1FSYamlDataResult>
  async getYaml(
    data: RetrieveYamlRequest,
    opts?: ResponseOptions
  ): Promise<R1FSYamlDataResult | R1FSYamlDataResponse> {
    if (data.cid === '') throw new Error('cid is required')
    if (opts?.fullResponse) {
      return await this.http.getYaml(data, opts)
    }
    return await this.http.getYaml(data, opts)
  }

  async addJson(data: StoreJsonRequest, opts: FullResponseOptions): Promise<R1FSCidResponse>
  async addJson(data: StoreJsonRequest, opts?: ResultOnlyOptions): Promise<R1FSCidResult>
  async addJson(
    data: StoreJsonRequest,
    opts?: ResponseOptions
  ): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    if (opts?.fullResponse) {
      return await this.http.addJson(data, opts)
    }
    return await this.http.addJson(data, opts)
  }

  async calculateJsonCid(
    data: CalculateCidRequest,
    opts: FullResponseOptions
  ): Promise<R1FSCidResponse>
  async calculateJsonCid(
    data: CalculateCidRequest,
    opts?: ResultOnlyOptions
  ): Promise<R1FSCidResult>
  async calculateJsonCid(
    data: CalculateCidRequest,
    opts?: ResponseOptions
  ): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    if (opts?.fullResponse) {
      return await this.http.calculateJsonCid(data, opts)
    }
    return await this.http.calculateJsonCid(data, opts)
  }

  async addPickle(data: StorePickleRequest, opts: FullResponseOptions): Promise<R1FSCidResponse>
  async addPickle(data: StorePickleRequest, opts?: ResultOnlyOptions): Promise<R1FSCidResult>
  async addPickle(
    data: StorePickleRequest,
    opts?: ResponseOptions
  ): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    if (opts?.fullResponse) {
      return await this.http.addPickle(data, opts)
    }
    return await this.http.addPickle(data, opts)
  }

  async calculatePickleCid(
    data: CalculatePickleCidRequest,
    opts: FullResponseOptions
  ): Promise<R1FSCidResponse>
  async calculatePickleCid(
    data: CalculatePickleCidRequest,
    opts?: ResultOnlyOptions
  ): Promise<R1FSCidResult>
  async calculatePickleCid(
    data: CalculatePickleCidRequest,
    opts?: ResponseOptions
  ): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    if (opts?.fullResponse) {
      return await this.http.calculatePickleCid(data, opts)
    }
    return await this.http.calculatePickleCid(data, opts)
  }
}
