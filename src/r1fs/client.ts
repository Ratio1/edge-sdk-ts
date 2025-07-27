import { BaseClient } from '../baseClient'
import {
  StatusResponse,
  UploadFileRequest,
  UploadBase64Request,
  UploadResponse,
  DownloadFileRequest,
  DownloadResponse
} from './types'

export class R1FSClient extends BaseClient {
  async getStatus (): Promise<StatusResponse> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await res.json()
  }

  async addFile ({ formData }: UploadFileRequest): Promise<UploadResponse> {
    const res = await this.request('/add_file', { method: 'POST', body: formData })
    return await res.json()
  }

  async addFileBase64 (data: UploadBase64Request): Promise<UploadResponse> {
    const res = await this.request('/add_file_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  }

  async getFile ({ cid, secret }: DownloadFileRequest): Promise<Response> {
    const qs = this.buildQuery({ cid, ...(secret ? { secret } : {}) })
    return await this.request(`/get_file?${qs}`, { method: 'GET' })
  }

  async getFileBase64 ({ cid, secret }: DownloadFileRequest): Promise<DownloadResponse> {
    const res = await this.request('/get_file_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid, secret })
    })
    return await res.json()
  }
}
