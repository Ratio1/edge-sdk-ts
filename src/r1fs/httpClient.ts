import { BaseHttpClient, type RequestOptions } from '../common/baseHttpClient'
import type { HttpAdapter } from '../common/http/adapter'
import type { BaseResponse } from '../common/types'
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
  type R1FSCidResponse,
  type StorePickleRequest,
  type CalculatePickleCidRequest
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

  async addFile (request: UploadFileRequest, opts?: { fullResponse?: boolean }): Promise<R1FSUploadResult | R1FSUploadResponse> {
    if (!request) throw new Error('Upload request is required')

    const {
      formData,
      file,
      fieldName = 'file',
      filename,
      secret,
      nonce,
      metadata,
      contentType
    } = request

    if (!formData && !file) {
      throw new Error('Either formData or file must be provided')
    }

    const uploadFormData = formData ?? new this.formDataCtor()

    const resolvedMetadata: UploadMetadata = { ...(metadata ?? {}) }

    if (filename && resolvedMetadata.filename === undefined) {
      resolvedMetadata.filename = filename
    }
    if (secret && resolvedMetadata.secret === undefined) {
      resolvedMetadata.secret = secret
    }
    if (nonce !== undefined && resolvedMetadata.nonce === undefined) {
      resolvedMetadata.nonce = nonce
    }

    if (resolvedMetadata.filename === undefined) {
      const existing = this.getTextField(uploadFormData, 'filename')
      if (existing) resolvedMetadata.filename = existing
    }
    if (resolvedMetadata.secret === undefined) {
      const existing = this.getTextField(uploadFormData, 'secret')
      if (existing) resolvedMetadata.secret = existing
    }
    if (resolvedMetadata.nonce === undefined) {
      const existing = this.getTextField(uploadFormData, 'nonce')
      if (existing) {
        const parsed = Number(existing)
        if (!Number.isNaN(parsed)) {
          resolvedMetadata.nonce = parsed
        }
      }
    }

    if (file) {
      await this.appendFile(uploadFormData, fieldName, file, {
        filename: resolvedMetadata.filename ?? filename,
        contentType
      })
    }

    this.appendMetadata(uploadFormData, resolvedMetadata)

    const requestOptions: RequestOptions = { method: 'POST', body: uploadFormData as any }

    if (this.isNodeFormData(uploadFormData) && typeof (uploadFormData as any).getHeaders === 'function') {
      const formHeaders = (uploadFormData as any).getHeaders() ?? {}
      if (formHeaders && Object.keys(formHeaders).length > 0) {
        requestOptions.headers = { ...formHeaders, ...(requestOptions.headers ?? {}) }
      }
    }

    const res = await this.request('/add_file', requestOptions)
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
    return await this.parseFileResponse<R1FSDownloadResult>(res, opts)
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

  async addPickle (data: StorePickleRequest, opts?: { fullResponse?: boolean }): Promise<R1FSCidResult | R1FSCidResponse> {
    const res = await this.request('/add_pickle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSCidResult>(res, opts)
  }

  async calculatePickleCid (data: CalculatePickleCidRequest, opts?: { fullResponse?: boolean }): Promise<R1FSCidResult | R1FSCidResponse> {
    const res = await this.request('/calculate_pickle_cid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSCidResult>(res, opts)
  }

  private appendMetadata (formData: UploadFileRequest['formData'] | FormData, metadata: UploadMetadata): void {
    if (!formData) return

    const payload: UploadMetadata = {}
    if (metadata.filename !== undefined) payload.filename = metadata.filename
    if (metadata.secret !== undefined) payload.secret = metadata.secret
    if (typeof metadata.nonce === 'number') payload.nonce = metadata.nonce

    if (Object.keys(payload).length === 0) return

    const json = JSON.stringify(payload)
    const target: any = formData

    if (typeof target.set === 'function') {
      target.set('body', json)
      return
    }

    if (typeof target.delete === 'function') {
      target.delete('body')
    }

    target.append('body', json)
  }

  private getTextField (formData: UploadFileRequest['formData'] | FormData, key: string): string | undefined {
    if (!formData) return undefined
    const target: any = formData
    if (typeof target.get !== 'function') return undefined
    try {
      const value = target.get(key)
      if (typeof value === 'string') return value
      if (value == null) return undefined
      if (typeof (value as any).toString === 'function' && !(this.isNodeReadable(value) || this.isBlob(value))) {
        return (value as any).toString()
      }
    } catch (_) {}
    return undefined
  }

  private async appendFile (
    formData: UploadFileRequest['formData'] | FormData,
    fieldName: string,
    file: UploadFileRequest['file'],
    options: { filename?: string, contentType?: string }
  ): Promise<void> {
    if (!file) return

    const filename = options.filename ?? this.inferFileName(file) ?? 'file'
    const mime = options.contentType ?? this.inferContentType(file)

    if (this.isNodeFormData(formData)) {
      const value = await this.toNodeFormDataValue(file)
      const appendOptions: any = { filename }
      if (mime) {
        appendOptions.contentType = mime
      }
      (formData as UploadFileRequest['formData'] & any).append(fieldName, value, appendOptions)
      return
    }

    const browserFormData = formData as FormData

    if (this.isBlob(file)) {
      browserFormData.append(fieldName, file as Blob, filename)
      return
    }

    if (typeof File !== 'undefined' && file instanceof File) {
      browserFormData.append(fieldName, file, filename ?? file.name)
      return
    }

    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(file)) {
      const blob = new Blob([file], { type: mime ?? 'application/octet-stream' })
      browserFormData.append(fieldName, blob, filename)
      return
    }

    throw new Error('Unsupported file type for browser FormData uploads')
  }

  private isNodeFormData (formData: UploadFileRequest['formData'] | FormData): formData is UploadFileRequest['formData'] {
    const target: any = formData
    return !!target && typeof target.getHeaders === 'function'
  }

  private isNodeReadable (value: any): value is NodeJS.ReadableStream {
    return !!value && typeof value.pipe === 'function' && typeof value.on === 'function'
  }

  private isBlob (value: any): value is Blob {
    return typeof Blob !== 'undefined' && value instanceof Blob
  }

  private inferFileName (file: UploadFileRequest['file']): string | undefined {
    if (!file) return undefined
    if (typeof File !== 'undefined' && file instanceof File) return file.name
    if (this.isBlob(file) && typeof (file as any).name === 'string') return (file as any).name
    if (typeof (file as any)?.name === 'string') return (file as any).name
    return undefined
  }

  private inferContentType (file: UploadFileRequest['file']): string | undefined {
    if (!file) return undefined
    if (this.isBlob(file) && (file as Blob).type) return (file as Blob).type
    if (typeof File !== 'undefined' && file instanceof File && file.type) return file.type
    return undefined
  }

  private async toNodeFormDataValue (file: UploadFileRequest['file']): Promise<NodeJS.ReadableStream | Buffer> {
    if (!file) {
      throw new Error('File is required for upload')
    }

    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(file)) {
      return file
    }

    if (this.isNodeReadable(file)) {
      return file
    }

    if (this.isBlob(file) || (typeof File !== 'undefined' && file instanceof File)) {
      if (typeof (file as any).stream === 'function') {
        const webStream = (file as any).stream()
        const { Readable } = await import('stream')
        if (typeof (Readable as any).fromWeb === 'function') {
          return (Readable as any).fromWeb(webStream)
        }
        return (Readable as any).from(webStream as any)
      }
      const arrayBuffer = await (file as Blob).arrayBuffer()
      return Buffer.from(arrayBuffer)
    }

    throw new Error('Unsupported Node.js upload source')
  }

  /**
   * Parse file response that may contain binary data
   * For getFile operations, the server returns binary data directly, not JSON
   */
  protected async parseFileResponse<T>(res: Response, opts?: { fullResponse?: boolean }): Promise<T | BaseResponse<T>> {
    const contentType = res.headers.get('content-type') || ''
    
    // If content-type indicates JSON, use standard parsing
    if (contentType.includes('application/json')) {
      return await this.parseResponse<T>(res, opts)
    }
    
    // For binary content, return the response object directly
    // This allows the caller to access .blob(), .arrayBuffer(), etc.
    const result = {
      result: res as any, // The response object itself
      server_node_addr: '',
      evm_network: '',
      ee_node_alias: '',
      ee_node_address: '',
      ee_node_eth_address: '',
      ee_node_network: '',
      ee_node_ver: ''
    } as BaseResponse<T>
    
    return opts?.fullResponse ? result : result.result
  }
}
