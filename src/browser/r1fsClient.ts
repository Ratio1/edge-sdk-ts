import { BaseClient } from './baseClient'
import {
  type R1FSStatusResult,
  type R1FSUploadResult,
  type R1FSDownloadResult,
  type R1FSBaseResponse,
  type UploadFileRequest,
  type UploadBase64Request,
  type DownloadFileRequest,
  type UploadMetadata
} from '../r1fs/types'

export class R1FSClient extends BaseClient {
  async getStatus (): Promise<R1FSBaseResponse<R1FSStatusResult>> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await res.json()
  }

  async addFile ({ formData }: UploadFileRequest): Promise<R1FSBaseResponse<R1FSUploadResult>> {
    // Extract metadata from the original FormData
    const file = formData.get('file') as File | Buffer;
    const filename = formData.get('filename') as string;
    const secret = formData.get('secret') as string;

    // Create a new FormData with the correct structure (browser native)
    const uploadFormData = new FormData();

    // Handle file upload - convert Buffer to Blob if needed
    if (file instanceof Blob || file instanceof File) {
      // Native browser File/Blob
      uploadFormData.append('file', file);
    } else if (file instanceof Buffer) {
      // Convert Buffer to Blob for browser FormData
      const blob = new Blob([file], { type: 'application/octet-stream' });
      uploadFormData.append('file', blob, filename || 'file');
    } else {
      // Fallback for other cases
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

  async addFileBase64 (data: UploadBase64Request): Promise<R1FSBaseResponse<R1FSUploadResult>> {
    const res = await this.request('/add_file_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  }

  async getFile ({ cid, secret }: DownloadFileRequest): Promise<Response> {
    // Validate that cid is provided
    if (!cid) {
      throw new Error('cid is required for getFile operation')
    }
    
    const qs = this.buildQuery({ cid, ...(secret ? { secret } : {}) })
    const response = await this.request(`/get_file?${qs}`, { method: 'GET' })
    return response
  }

  async getFileBase64 ({ cid, secret }: DownloadFileRequest): Promise<R1FSBaseResponse<R1FSDownloadResult>> {
    const res = await this.request('/get_file_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid, secret })
    })
    return await res.json()
  }
}
