import { type R1FSHttpClient } from './httpClient'
import type {
  CalculateCidRequest,
  CalculatePickleCidRequest,
  DownloadFileRequest,
  DeleteFileRequest,
  DeleteFileResponse,
  DeleteFileResult,
  DeleteFilesRequest,
  DeleteFilesResponse,
  DeleteFilesResult,
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

  async getStatus(): Promise<R1FSStatusResult> {
    return await this.http.getStatus()
  }

  async getStatusFull(): Promise<R1FSStatusResponse> {
    return await this.http.getStatusFull()
  }

  async addFile(data: UploadFileRequest): Promise<R1FSUploadResult> {
    if (data?.formData == null && data?.file == null)
      throw new Error('file or formData is required')
    return await this.http.addFile(data)
  }

  async addFileFull(data: UploadFileRequest): Promise<R1FSUploadResponse> {
    if (data?.formData == null && data?.file == null)
      throw new Error('file or formData is required')
    return await this.http.addFileFull(data)
  }

  async addFileBase64(data: UploadBase64Request): Promise<R1FSUploadResult> {
    if (data.file_base64_str === '') throw new Error('file_base64_str is required')
    return await this.http.addFileBase64(data)
  }

  async addFileBase64Full(data: UploadBase64Request): Promise<R1FSUploadResponse> {
    if (data.file_base64_str === '') throw new Error('file_base64_str is required')
    return await this.http.addFileBase64Full(data)
  }

  async getFile(data: DownloadFileRequest): Promise<R1FSDownloadResult> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getFile(data)
  }

  async getFileFull(data: DownloadFileRequest): Promise<R1FSDownloadResponse> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getFileFull(data)
  }

  async getFileBase64(data: DownloadFileRequest): Promise<R1FSDownloadResult> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getFileBase64(data)
  }

  async getFileBase64Full(data: DownloadFileRequest): Promise<R1FSDownloadResponse> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getFileBase64Full(data)
  }

  async addYaml(data: StoreYamlRequest): Promise<R1FSCidResult> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addYaml(data)
  }

  async addYamlFull(data: StoreYamlRequest): Promise<R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addYamlFull(data)
  }

  async getYaml(data: RetrieveYamlRequest): Promise<R1FSYamlDataResult> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getYaml(data)
  }

  async getYamlFull(data: RetrieveYamlRequest): Promise<R1FSYamlDataResponse> {
    if (data.cid === '') throw new Error('cid is required')
    return await this.http.getYamlFull(data)
  }

  async addJson(data: StoreJsonRequest): Promise<R1FSCidResult> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addJson(data)
  }

  async addJsonFull(data: StoreJsonRequest): Promise<R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addJsonFull(data)
  }

  async calculateJsonCid(data: CalculateCidRequest): Promise<R1FSCidResult> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    return await this.http.calculateJsonCid(data)
  }

  async calculateJsonCidFull(data: CalculateCidRequest): Promise<R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    return await this.http.calculateJsonCidFull(data)
  }

  async addPickle(data: StorePickleRequest): Promise<R1FSCidResult> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addPickle(data)
  }

  async addPickleFull(data: StorePickleRequest): Promise<R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    return await this.http.addPickleFull(data)
  }

  async calculatePickleCid(data: CalculatePickleCidRequest): Promise<R1FSCidResult> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    return await this.http.calculatePickleCid(data)
  }

  async calculatePickleCidFull(data: CalculatePickleCidRequest): Promise<R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    return await this.http.calculatePickleCidFull(data)
  }

  async deleteFile(request: DeleteFileRequest): Promise<DeleteFileResult> {
    if (!request.cid) throw new Error('cid is required')
    return await this.http.deleteFile(request)
  }

  async deleteFileFull(request: DeleteFileRequest): Promise<DeleteFileResponse> {
    if (!request.cid) throw new Error('cid is required')
    return await this.http.deleteFileFull(request)
  }

  async deleteFiles(request: DeleteFilesRequest): Promise<DeleteFilesResult> {
    if (!Array.isArray(request.cids) || request.cids.length === 0) {
      throw new Error('cids is required')
    }
    return await this.http.deleteFiles(request)
  }

  async deleteFilesFull(request: DeleteFilesRequest): Promise<DeleteFilesResponse> {
    if (!Array.isArray(request.cids) || request.cids.length === 0) {
      throw new Error('cids is required')
    }
    return await this.http.deleteFilesFull(request)
  }
}
