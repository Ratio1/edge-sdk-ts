import { BaseHttpClient } from '../common/baseHttpClient'
import type { HttpAdapter } from '../common/http/adapter'
import {
  type R1FSStatusResult,
  type R1FSUploadResult,
  type R1FSDownloadResult,
  type R1FSStatusResponse,
  type R1FSUploadResponse,
  type R1FSDownloadResponse,
  type UploadFileRequest,
  type UploadBase64Request,
  type DownloadFileRequest,
  type UploadMetadata,
  type StoreYamlRequest,
  type RetrieveYamlRequest,
  type R1FSYamlDataResult,
  type R1FSYamlDataResponse,
  type StoreJsonRequest,
  type CalculateCidRequest,
  type R1FSCidResult,
  type R1FSCidResponse
} from './types'
import { getFormData } from '../common/platform'

export class R1FSHttpClient extends BaseHttpClient {
  protected readonly chainstorePeers: string[] = []
  constructor (
    baseUrl: string,
    verbose = false,
    adapter?: HttpAdapter,
    private readonly formDataCtor: typeof FormData = getFormData(),
    chainstorePeers: string[] = []
  ) {
    super(baseUrl, verbose, adapter)
    this.chainstorePeers = chainstorePeers
  }

  async getStatus (opts?: { fullResponse?: boolean }): Promise<R1FSStatusResult | R1FSStatusResponse> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await this.parseResponse<R1FSStatusResult>(res, opts)
  }

  async addFile ({ formData }: UploadFileRequest, opts?: { fullResponse?: boolean }): Promise<R1FSUploadResult | R1FSUploadResponse> {
    // Extract metadata from the original FormData
    const file = formData.get('file') as File | Buffer;
    const filename = formData.get('filename') as string;
    const secret = formData.get('secret') as string;
    const nonceStr = formData.get('nonce') as string;

    // Create a new FormData with the correct structure
    const uploadFormData = new this.formDataCtor()

    // Handle file upload based on environment and file type
    if (typeof globalThis !== 'undefined' && globalThis.FormData) {
      // Browser environment - use native FormData
      if (file instanceof Blob || file instanceof File) {
        // Native browser File/Blob
        uploadFormData.append('file', file);
      } else if (file instanceof Buffer) {
        // Convert Buffer to Blob for browser FormData
        const arrayBuffer = file.buffer instanceof ArrayBuffer ? file.buffer : new ArrayBuffer(file.length);
        if (!(file.buffer instanceof ArrayBuffer)) {
          const view = new Uint8Array(arrayBuffer);
          view.set(new Uint8Array(file.buffer, file.byteOffset, file.byteLength));
        }
        const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
        uploadFormData.append('file', blob, filename || 'file');
      } else {
        // Fallback for other cases
        uploadFormData.append('file', file as any);
      }
    } else {
      // Node.js environment - use form-data package
      if (file instanceof Buffer) {
        // Node.js Buffer
        (uploadFormData as any).append('file', file, { filename: filename || 'file' });
      } else {
        // Fallback for other cases
        (uploadFormData as any).append('file', file, { filename: filename || 'file' });
      }
    }

    // Create body object with metadata and stringify it
    const bodyData: UploadMetadata = {};
    if (filename) bodyData.filename = filename;
    if (secret) bodyData.secret = secret;
    if (nonceStr) {
      const nonce = parseInt(nonceStr);
      if (!isNaN(nonce)) {
        bodyData.nonce = nonce;
      }
    }

    // Add the stringified body as a separate field
    uploadFormData.append('body', JSON.stringify(bodyData));

    const res = await this.request('/add_file', { method: 'POST', body: uploadFormData })
    return await this.parseResponse<R1FSUploadResult>(res, opts)
  }

  async addFileBase64 (data: UploadBase64Request, opts?: { fullResponse?: boolean }): Promise<R1FSUploadResult | R1FSUploadResponse> {
    const res = await this.request('/add_file_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSUploadResult>(res, opts)
  }

  async getFile ({ cid, secret }: DownloadFileRequest, opts?: { fullResponse?: boolean }): Promise<R1FSDownloadResult | R1FSDownloadResponse> {
    const qs = this.buildQuery({ cid, ...(secret ? { secret } : {}) })
    const res = await this.request(`/get_file?${qs}`, { method: 'GET' })
    return await this.parseResponse<R1FSDownloadResult>(res, opts)
  }

  async getFileBase64 ({ cid, secret }: DownloadFileRequest, opts?: { fullResponse?: boolean }): Promise<R1FSDownloadResult | R1FSDownloadResponse> {
    const res = await this.request('/get_file_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid, secret })
    })
    return await this.parseResponse<R1FSDownloadResult>(res, opts)
  }

  async addYaml (data: StoreYamlRequest, opts?: { fullResponse?: boolean }): Promise<R1FSCidResult | R1FSCidResponse> {
    const res = await this.request('/add_yaml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSCidResult>(res, opts)
  }

  async getYaml ({ cid, secret }: RetrieveYamlRequest, opts?: { fullResponse?: boolean }): Promise<R1FSYamlDataResult | R1FSYamlDataResponse> {
    const qs = this.buildQuery({ cid, ...(secret ? { secret } : {}) })
    const res = await this.request(`/get_yaml?${qs}`, { method: 'GET' })
    return await this.parseResponse<R1FSYamlDataResult>(res, opts)
  }

  async addJson (data: StoreJsonRequest, opts?: { fullResponse?: boolean }): Promise<R1FSCidResult | R1FSCidResponse> {
    const res = await this.request('/add_json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSCidResult>(res, opts)
  }

  async calculateJsonCid (data: CalculateCidRequest, opts?: { fullResponse?: boolean }): Promise<R1FSCidResult | R1FSCidResponse> {
    const res = await this.request('/calculate_json_cid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSCidResult>(res, opts)
  }
}
