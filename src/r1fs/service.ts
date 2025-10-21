import { type FullResponseOptions, type ResponseOptions } from '../common/baseHttpClient'
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

  async getStatus<R extends ResponseOptions | undefined = undefined>(
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSStatusResponse : R1FSStatusResult> {
    return await this.http.getStatus<R>(opts)
  }

  async addFile<R extends ResponseOptions | undefined = undefined>(
    data: UploadFileRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSUploadResponse : R1FSUploadResult> {
    if (data?.formData == null && data?.file == null)
      throw new Error('file or formData is required')
    return await this.http.addFile<R>(data, opts)
  }

  async addFileBase64<R extends ResponseOptions | undefined = undefined>(
    data: UploadBase64Request,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSUploadResponse : R1FSUploadResult> {
    if (data.file_base64_str === '') throw new Error('file_base64_str is required')
    return await this.http.addFileBase64<R>(data, opts)
  }

  async getFile<R extends ResponseOptions | undefined = undefined>(
    data: DownloadFileRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSDownloadResponse : R1FSDownloadResult> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getFile<R>(data, opts)
  }

  async getFileBase64<R extends ResponseOptions | undefined = undefined>(
    data: DownloadFileRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSDownloadResponse : R1FSDownloadResult> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getFileBase64<R>(data, opts)
  }

  async addYaml<R extends ResponseOptions | undefined = undefined>(
    data: StoreYamlRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSCidResponse : R1FSCidResult> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addYaml<R>(data, opts)
  }

  async getYaml<R extends ResponseOptions | undefined = undefined>(
    data: RetrieveYamlRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSYamlDataResponse : R1FSYamlDataResult> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getYaml<R>(data, opts)
  }

  async addJson<R extends ResponseOptions | undefined = undefined>(
    data: StoreJsonRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSCidResponse : R1FSCidResult> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addJson<R>(data, opts)
  }

  async calculateJsonCid<R extends ResponseOptions | undefined = undefined>(
    data: CalculateCidRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSCidResponse : R1FSCidResult> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    return await this.http.calculateJsonCid<R>(data, opts)
  }

  async addPickle<R extends ResponseOptions | undefined = undefined>(
    data: StorePickleRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSCidResponse : R1FSCidResult> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addPickle<R>(data, opts)
  }

  async calculatePickleCid<R extends ResponseOptions | undefined = undefined>(
    data: CalculatePickleCidRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSCidResponse : R1FSCidResult> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    return await this.http.calculatePickleCid<R>(data, opts)
  }
}
