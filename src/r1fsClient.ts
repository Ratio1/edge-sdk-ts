import { BaseClient } from './baseClient'
import { StatusResponse, UploadResponse, DownloadResponse } from './types'

export class R1FSClient extends BaseClient {
  async getStatus (): Promise<StatusResponse> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await res.json()
  }

  async addFile (formData: FormData): Promise<UploadResponse> {
    const res = await this.request('/add_file', { method: 'POST', body: formData })
    return await res.json()
  }

  async addFileBase64 (data: { file_base64_str: string, filename?: string, secret?: string }): Promise<UploadResponse> {
    const res = await this.request('/add_file_base64', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    return await res.json()
  }

  async getFile (cid: string, secret?: string): Promise<Response> {
    const qs = this.buildQuery({ cid, ...(secret ? { secret } : {}) })
    return await this.request(`/get_file?${qs}`, { method: 'GET' })
  }

  async getFileBase64 (cid: string, secret?: string): Promise<DownloadResponse> {
    const res = await this.request('/get_file_base64', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cid, secret }) })
    return await res.json()
  }
}
