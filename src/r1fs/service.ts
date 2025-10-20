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

  async getStatus(opts?: {
    fullResponse?: boolean
  }): Promise<R1FSStatusResult | R1FSStatusResponse> {
    return await this.http.getStatus(opts)
  }

  async addFile(
    data: UploadFileRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<R1FSUploadResult | R1FSUploadResponse> {
    if (data?.formData == null && data?.file == null)
      throw new Error('file or formData is required')
    return await this.http.addFile(data, opts)
  }

  async addFileBase64(
    data: UploadBase64Request,
    opts?: { fullResponse?: boolean }
  ): Promise<R1FSUploadResult | R1FSUploadResponse> {
    if (data.file_base64_str === '') throw new Error('file_base64_str is required')
    return await this.http.addFileBase64(data, opts)
  }

  async getFile(
    data: DownloadFileRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<R1FSDownloadResult | R1FSDownloadResponse> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getFile(data, opts)
  }

  async getFileBase64(
    data: DownloadFileRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<R1FSDownloadResult | R1FSDownloadResponse> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getFileBase64(data, opts)
  }

  async addYaml(
    data: StoreYamlRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addYaml(data, opts)
  }

  async getYaml(
    data: RetrieveYamlRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<R1FSYamlDataResult | R1FSYamlDataResponse> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getYaml(data, opts)
  }

  async addJson(
    data: StoreJsonRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addJson(data, opts)
  }

  async calculateJsonCid(
    data: CalculateCidRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    return await this.http.calculateJsonCid(data, opts)
  }

  async addPickle(
    data: StorePickleRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addPickle(data, opts)
  }

  async calculatePickleCid(
    data: CalculatePickleCidRequest,
    opts?: { fullResponse?: boolean }
  ): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    return await this.http.calculatePickleCid(data, opts)
  }
}
