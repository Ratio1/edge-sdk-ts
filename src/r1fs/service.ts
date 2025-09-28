import { R1FSHttpClient } from './httpClient'
import type {
  R1FSStatusResult,
  R1FSStatusResponse,
  R1FSUploadResult,
  R1FSUploadResponse,
  R1FSDownloadResult,
  R1FSDownloadResponse,
  UploadFileRequest,
  UploadBase64Request,
  DownloadFileRequest,
  StoreYamlRequest,
  RetrieveYamlRequest,
  R1FSYamlDataResult,
  R1FSYamlDataResponse,
  StoreJsonRequest,
  CalculateCidRequest,
  R1FSCidResult,
  R1FSCidResponse
} from './types'

export class R1FSService {
  constructor(private readonly http: R1FSHttpClient) {}

  getStatus(opts?: { fullResponse?: boolean }): Promise<R1FSStatusResult | R1FSStatusResponse> {
    return this.http.getStatus(opts)
  }

  addFile(data: UploadFileRequest, opts?: { fullResponse?: boolean }): Promise<R1FSUploadResult | R1FSUploadResponse> {
    if (!data?.formData) throw new Error('formData is required')
    return this.http.addFile(data, opts)
  }

  addFileBase64(data: UploadBase64Request, opts?: { fullResponse?: boolean }): Promise<R1FSUploadResult | R1FSUploadResponse> {
    if (!data.file_base64_str) throw new Error('file_base64_str is required')
    return this.http.addFileBase64(data, opts)
  }

  getFile(data: DownloadFileRequest, opts?: { fullResponse?: boolean }): Promise<R1FSDownloadResult | R1FSDownloadResponse> {
    if (!data.cid) throw new Error('cid is required')
    return this.http.getFile(data, opts)
  }

  getFileBase64(data: DownloadFileRequest, opts?: { fullResponse?: boolean }): Promise<R1FSDownloadResult | R1FSDownloadResponse> {
    if (!data.cid) throw new Error('cid is required')
    return this.http.getFileBase64(data, opts)
  }

  addYaml(data: StoreYamlRequest, opts?: { fullResponse?: boolean }): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    return this.http.addYaml(data, opts)
  }

  getYaml(data: RetrieveYamlRequest, opts?: { fullResponse?: boolean }): Promise<R1FSYamlDataResult | R1FSYamlDataResponse> {
    if (!data.cid) throw new Error('cid is required')
    return this.http.getYaml(data, opts)
  }

  addJson(data: StoreJsonRequest, opts?: { fullResponse?: boolean }): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    return this.http.addJson(data, opts)
  }

  calculateJsonCid(data: CalculateCidRequest, opts?: { fullResponse?: boolean }): Promise<R1FSCidResult | R1FSCidResponse> {
    if (!data.data) throw new Error('data is required')
    if (data.nonce === undefined || data.nonce === null) throw new Error('nonce is required')
    return this.http.calculateJsonCid(data, opts)
  }
}
