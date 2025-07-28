import { BaseResponse } from '../../common/types'

export interface StatusResponse {
  [key: string]: any
  EE_ID?: string
}

// Interface for the metadata that gets sent in the body field
export interface UploadMetadata {
  filename?: string
  secret?: string
}

// Interface for the FormData-like object that addFile expects
export interface UploadFormData {
  get(name: string): File | Buffer | string | null
  append(name: string, value: any, options?: any): void
}

export interface UploadFileRequest {
  formData: UploadFormData
}

export interface UploadBase64Request {
  file_base64_str: string
  filename?: string
  secret?: string
}

// Upload response specific to r1fs
export interface UploadResponse extends BaseResponse<{
  message: string
  cid: string
}> {}

export interface DownloadFileRequest {
  cid: string
  secret?: string
}

export interface DownloadResponse {
  file?: any
  file_base64_str?: string
  filename: string
}
