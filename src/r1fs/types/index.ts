export interface StatusResponse {
  [key: string]: any
  EE_ID?: string
}

export interface UploadFileRequest {
  formData: FormData
}

export interface UploadBase64Request {
  file_base64_str: string
  filename?: string
  secret?: string
}

export interface UploadResponse {
  success: boolean
  message?: string
  cid?: string
}

export interface DownloadFileRequest {
  cid: string
  secret?: string
}

export interface DownloadResponse {
  file?: any
  file_base64_str?: string
  filename: string
}
