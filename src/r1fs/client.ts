import { BaseClient } from '../baseClient'
import FormData from 'form-data'
import {
  StatusResponse,
  UploadFileRequest,
  UploadBase64Request,
  UploadResponse,
  DownloadFileRequest,
  DownloadResponse,
  UploadMetadata
} from './types'

export class R1FSClient extends BaseClient {
  async getStatus (): Promise<StatusResponse> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await res.json()
  }

  async addFile ({ formData }: UploadFileRequest): Promise<UploadResponse> {
    // Extract metadata from the original FormData
    const file = formData.get('file') as File | Buffer;
    const filename = formData.get('filename') as string;
    const secret = formData.get('secret') as string;
    
    // Create a new FormData with the correct structure
    const uploadFormData = new FormData();
    
    // Add the file as a proper file upload with filename
    if (file instanceof Buffer) {
      uploadFormData.append('file', file, { filename: filename || 'file' });
    } else {
      uploadFormData.append('file', file as any);
    }
    
    // Create body object with metadata and stringify it
    const bodyData: UploadMetadata = {};
    if (filename) bodyData.filename = filename;
    if (secret) bodyData.secret = secret;
    
    // Add the stringified body as a separate field
    uploadFormData.append('body', JSON.stringify(bodyData));

    const res = await this.request('/add_file', { method: 'POST', body: uploadFormData })
    const responseData = await res.json()
    return responseData
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
    const response = await this.request(`/get_file?${qs}`, { method: 'GET' })
    return response
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
