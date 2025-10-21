import {
  BaseHttpClient,
  type FullResponseOptions,
  type RequestOptions,
  type ResponseOptions
} from '../common/baseHttpClient'
import type { HttpAdapter } from '../common/http/adapter'
import { getFormData } from '../common/platform'
import type { BaseResponse } from '../common/types'
import {
  type CalculateCidRequest,
  type CalculatePickleCidRequest,
  type DownloadFileRequest,
  type R1FSCidResponse,
  type R1FSCidResult,
  type R1FSDownloadResponse,
  type R1FSDownloadResult,
  type R1FSStatusResponse,
  type R1FSStatusResult,
  type R1FSUploadResponse,
  type R1FSUploadResult,
  type R1FSYamlDataResponse,
  type R1FSYamlDataResult,
  type RetrieveYamlRequest,
  type StoreJsonRequest,
  type StorePickleRequest,
  type StoreYamlRequest,
  type UploadBase64Request,
  type UploadFileRequest,
  type UploadMetadata
} from './types'

export class R1FSHttpClient extends BaseHttpClient {
  protected readonly chainstorePeers: string[] = []
  constructor(
    baseUrl: string,
    verbose = false,
    adapter?: HttpAdapter,
    private readonly FormDataCtor: typeof FormData = getFormData(),
    chainstorePeers: string[] = []
  ) {
    super(baseUrl, verbose, adapter)
    this.chainstorePeers = chainstorePeers
  }

  async getStatus<R extends ResponseOptions | undefined = undefined>(
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSStatusResponse : R1FSStatusResult> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await this.parseResponse<R1FSStatusResult, R>(res, opts)
  }

  async addFile<R extends ResponseOptions | undefined = undefined>(
    request: UploadFileRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSUploadResponse : R1FSUploadResult> {
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

    const uploadFormData = formData ?? new this.FormDataCtor()

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

    if (
      this.isNodeFormData(uploadFormData) &&
      typeof (uploadFormData as any).getHeaders === 'function'
    ) {
      const formHeaders = (uploadFormData as any).getHeaders() ?? {}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (formHeaders && Object.keys(formHeaders).length > 0) {
        requestOptions.headers = { ...formHeaders, ...(requestOptions.headers ?? {}) }
      }
    }

    const res = await this.request('/add_file', requestOptions)
    return await this.parseResponse<R1FSUploadResult, R>(res, opts)
  }

  async addFileBase64<R extends ResponseOptions | undefined = undefined>(
    data: UploadBase64Request,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSUploadResponse : R1FSUploadResult> {
    const res = await this.request('/add_file_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSUploadResult, R>(res, opts)
  }

  async getFile<R extends ResponseOptions | undefined = undefined>(
    { cid, secret }: DownloadFileRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSDownloadResponse : R1FSDownloadResult> {
    const qs = this.buildQuery({ cid, ...(secret ? { secret } : {}) })
    const res = await this.request(`/get_file?${qs}`, { method: 'GET' })
    return await this.parseFileResponse<R1FSDownloadResult, R>(res, opts)
  }

  async getFileBase64<R extends ResponseOptions | undefined = undefined>(
    { cid, secret }: DownloadFileRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSDownloadResponse : R1FSDownloadResult> {
    const res = await this.request('/get_file_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid, secret })
    })
    return await this.parseResponse<R1FSDownloadResult, R>(res, opts)
  }

  async addYaml<R extends ResponseOptions | undefined = undefined>(
    data: StoreYamlRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSCidResponse : R1FSCidResult> {
    const res = await this.request('/add_yaml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSCidResult, R>(res, opts)
  }

  async getYaml<R extends ResponseOptions | undefined = undefined>(
    { cid, secret }: RetrieveYamlRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSYamlDataResponse : R1FSYamlDataResult> {
    const qs = this.buildQuery({ cid, ...(secret ? { secret } : {}) })
    const res = await this.request(`/get_yaml?${qs}`, { method: 'GET' })
    return await this.parseResponse<R1FSYamlDataResult, R>(res, opts)
  }

  async addJson<R extends ResponseOptions | undefined = undefined>(
    data: StoreJsonRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSCidResponse : R1FSCidResult> {
    const res = await this.request('/add_json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSCidResult, R>(res, opts)
  }

  async calculateJsonCid<R extends ResponseOptions | undefined = undefined>(
    data: CalculateCidRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSCidResponse : R1FSCidResult> {
    const res = await this.request('/calculate_json_cid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSCidResult, R>(res, opts)
  }

  async addPickle<R extends ResponseOptions | undefined = undefined>(
    data: StorePickleRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSCidResponse : R1FSCidResult> {
    const res = await this.request('/add_pickle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSCidResult, R>(res, opts)
  }

  async calculatePickleCid<R extends ResponseOptions | undefined = undefined>(
    data: CalculatePickleCidRequest,
    opts?: R
  ): Promise<R extends FullResponseOptions ? R1FSCidResponse : R1FSCidResult> {
    const res = await this.request('/calculate_pickle_cid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponse<R1FSCidResult, R>(res, opts)
  }

  private appendMetadata(
    formData: UploadFileRequest['formData'] | FormData,
    metadata: UploadMetadata
  ): void {
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

  private getTextField(
    formData: UploadFileRequest['formData'] | FormData,
    key: string
  ): string | undefined {
    if (!formData) return undefined
    const target: any = formData
    if (typeof target.get !== 'function') return undefined
    try {
      const value = target.get(key)
      if (typeof value === 'string') return value
      if (value == null) return undefined
      if (
        typeof value.toString === 'function' &&
        !(this.isNodeReadable(value) || this.isBlob(value))
      ) {
        return value.toString()
      }
    } catch (_) {}
    return undefined
  }

  private async appendFile(
    formData: UploadFileRequest['formData'] | FormData,
    fieldName: string,
    file: UploadFileRequest['file'],
    options: { filename?: string; contentType?: string }
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
      ;(formData as UploadFileRequest['formData'] & any).append(fieldName, value, appendOptions)
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
      const blob = new Blob([new Uint8Array(file)], { type: mime ?? 'application/octet-stream' })
      browserFormData.append(fieldName, blob, filename)
      return
    }

    throw new Error('Unsupported file type for browser FormData uploads')
  }

  private isNodeFormData(
    formData: UploadFileRequest['formData'] | FormData
  ): formData is UploadFileRequest['formData'] {
    const target: any = formData
    return !!target && typeof target.getHeaders === 'function'
  }

  private isNodeReadable(value: any): value is NodeJS.ReadableStream {
    return !!value && typeof value.pipe === 'function' && typeof value.on === 'function'
  }

  private isBlob(value: any): value is Blob {
    return typeof Blob !== 'undefined' && value instanceof Blob
  }

  private inferFileName(file: UploadFileRequest['file']): string | undefined {
    if (!file) return undefined
    if (typeof File !== 'undefined' && file instanceof File) return file.name
    if (this.isBlob(file) && typeof (file as any).name === 'string') return (file as any).name
    if (typeof (file as any)?.name === 'string') return (file as any).name
    return undefined
  }

  private inferContentType(file: UploadFileRequest['file']): string | undefined {
    if (!file) return undefined
    if (this.isBlob(file) && (file as Blob).type) return (file as Blob).type
    if (typeof File !== 'undefined' && file instanceof File && file.type) return file.type
    return undefined
  }

  private async toNodeFormDataValue(
    file: UploadFileRequest['file']
  ): Promise<NodeJS.ReadableStream | Buffer> {
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
        return (Readable as any).from(webStream)
      }
      const arrayBuffer = await file.arrayBuffer()
      return Buffer.from(arrayBuffer)
    }

    throw new Error('Unsupported Node.js upload source')
  }

  /**
   * Parse file response that may contain binary data
   * For getFile operations, the server returns binary data directly, not JSON
   */
  protected async parseFileResponse<T, O extends ResponseOptions | undefined = undefined>(
    res: Response,
    opts?: O
  ): Promise<O extends FullResponseOptions ? BaseResponse<T> : T> {
    const contentType = res.headers.get('content-type') ?? ''

    // If content-type indicates JSON, use standard parsing
    if (contentType.includes('application/json')) {
      return await this.parseResponse<T, O>(res, opts)
    }

    // For binary content, return the response object directly
    // This allows the caller to access .blob(), .arrayBuffer(), etc.
    const result: BaseResponse<T> = {
      result: res as any, // The response object itself
      server_node_addr: '',
      evm_network: '',
      ee_node_alias: '',
      ee_node_address: '',
      ee_node_eth_address: '',
      ee_node_network: '',
      ee_node_ver: ''
    }

    const wantsFull = (opts as FullResponseOptions | undefined)?.fullResponse ?? false
    type Return = O extends FullResponseOptions ? BaseResponse<T> : T
    return (wantsFull ? result : result.result) as Return
  }
}
