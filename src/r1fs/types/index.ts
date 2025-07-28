import { BaseResponse } from '../../common/types'

export interface R1FSBaseResponse<T = unknown> extends BaseResponse<T> {}

// Result types for specific operations
export interface R1FSStatusResult {
  [key: string]: any
  EE_ID?: string
}

export interface R1FSUploadResult {
  message: string
  cid: string
}

export interface R1FSDownloadResult {
  file?: any
  file_base64_str?: string
  filename: string
}

// Specific response types with proper result typing
export interface R1FSStatusResponse extends R1FSBaseResponse<R1FSStatusResult> {}

export interface R1FSUploadResponse extends R1FSBaseResponse<R1FSUploadResult> {}

export interface R1FSDownloadResponse extends R1FSBaseResponse<R1FSDownloadResult> {}

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

export interface DownloadFileRequest {
  cid: string
  secret?: string
}
