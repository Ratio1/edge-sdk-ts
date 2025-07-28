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
  DownloadFileRequest
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

  getFile(data: DownloadFileRequest): Promise<Response> {
    if (!data.cid) throw new Error('cid is required')
    return this.http.getFile(data)
  }

  getFileBase64(data: DownloadFileRequest, opts?: { fullResponse?: boolean }): Promise<R1FSDownloadResult | R1FSDownloadResponse> {
    if (!data.cid) throw new Error('cid is required')
    return this.http.getFileBase64(data, opts)
  }
}
