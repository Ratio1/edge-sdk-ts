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
  file_path?: string
  file_base64_str?: string
  filename?: string
  meta?: {
    file: string
    filename: string
  }
  file_data?: any
}

// Specific response types with proper result typing
export interface R1FSStatusResponse extends R1FSBaseResponse<R1FSStatusResult> {}

export interface R1FSUploadResponse extends R1FSBaseResponse<R1FSUploadResult> {}

export interface R1FSDownloadResponse extends R1FSBaseResponse<R1FSDownloadResult> {}

// Interface for the metadata that gets sent in the body field
export interface UploadMetadata {
  filename?: string
  secret?: string
  nonce?: number
}

// Interface for the FormData-like object that addFile can re-use (Node form-data package)
export interface UploadFormData {
  append(name: string, value: any, options?: any): void
  get?(name: string): File | Buffer | string | null
  set?(name: string, value: any, options?: any): void
  delete?(name: string): void
}

export type UploadFileLike = File | Blob | Buffer | NodeJS.ReadableStream

export interface UploadFileRequest {
  /**
   * Provide an existing FormData instance. When omitted the client will create a new one.
   * When provided, ensure it already contains a `file` field pointing to the payload.
   */
  formData?: UploadFormData | FormData
  /**
   * Optional raw file source. Supports File/Blob in the browser, Buffer or Readable stream in Node.js.
   * When supplied, the client will create the multipart body and stream it when possible.
   */
  file?: UploadFileLike
  /**
   * Controls the multipart field name. Defaults to `file`.
   */
  fieldName?: string
  /**
   * Friendly filename reported to the server. Used as a fallback when metadata.filename is absent.
   */
  filename?: string
  /**
   * Secret associated with the upload.
   */
  secret?: string
  /**
   * Nonce associated with the upload.
   */
  nonce?: number
  /**
   * Explicit metadata payload. Overrides values derived from filename/secret/nonce.
   */
  metadata?: UploadMetadata
  /**
   * Optional content-type hint for Node.js streaming uploads.
   */
  contentType?: string
}

export interface UploadBase64Request {
  file_base64_str: string
  filename?: string
  secret?: string
  nonce?: number
}

export interface DownloadFileRequest {
  cid: string
  secret?: string
}

// YAML operation interfaces
export interface StoreYamlRequest {
  data: Record<string, any>
  fn?: string
  secret?: string
  nonce?: number
}

export interface RetrieveYamlRequest {
  cid: string
  secret?: string
}

export interface R1FSYamlDataResult {
  file_data: Record<string, any>
}

export interface R1FSYamlDataResponse extends R1FSBaseResponse<R1FSYamlDataResult> {}

// JSON operation interfaces
export interface StoreJsonRequest {
  data: Record<string, any>
  fn?: string
  secret?: string
  nonce?: number
}

export interface CalculateCidRequest {
  data: Record<string, any>
  nonce: number
  fn?: string
  secret?: string
}

export interface R1FSCidResult {
  cid: string
}

export interface R1FSCidResponse extends R1FSBaseResponse<R1FSCidResult> {}

// Pickle operation interfaces
export interface StorePickleRequest {
  data: any
  fn?: string
  secret?: string
  nonce?: number
}

export interface CalculatePickleCidRequest {
  data: any
  nonce: number
  fn?: string
  secret?: string
}
