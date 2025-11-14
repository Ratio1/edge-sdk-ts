import { BaseHttpClient, type RequestOptions } from '../common/baseHttpClient'
import type { HttpAdapter } from '../common/http/adapter'
import { getFormData } from '../common/platform'
import type { BaseResponse } from '../common/types'
import {
  type CalculateCidRequest,
  type CalculatePickleCidRequest,
  type DownloadFileRequest,
  type DeleteFileRequest,
  type DeleteFileResponse,
  type DeleteFileResult,
  type DeleteFilesRequest,
  type DeleteFilesResponse,
  type DeleteFilesResult,
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

  async getStatus(): Promise<R1FSStatusResult> {
    const res = await this.getStatusFull()
    return res.result
  }

  async getStatusFull(): Promise<R1FSStatusResponse> {
    const res = await this.request('/get_status', { method: 'GET' })
    return await this.parseResponseFull<R1FSStatusResult, R1FSStatusResponse>(res)
  }

  async addFile(request: UploadFileRequest): Promise<R1FSUploadResult> {
    const res = await this.addFileFull(request)
    return res.result
  }

  async addFileFull(request: UploadFileRequest): Promise<R1FSUploadResponse> {
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
      if (formHeaders && Object.keys(formHeaders).length > 0) {
        requestOptions.headers = { ...formHeaders, ...(requestOptions.headers ?? {}) }
      }
    }

    const res = await this.request('/add_file', requestOptions)
    return await this.parseResponseFull<R1FSUploadResult, R1FSUploadResponse>(res)
  }

  async addFileBase64(data: UploadBase64Request): Promise<R1FSUploadResult> {
    const res = await this.addFileBase64Full(data)
    return res.result
  }

  async addFileBase64Full(data: UploadBase64Request): Promise<R1FSUploadResponse> {
    const res = await this.request('/add_file_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponseFull<R1FSUploadResult, R1FSUploadResponse>(res)
  }

  async getFile(request: DownloadFileRequest): Promise<R1FSDownloadResult> {
    const res = await this.getFileFull(request)
    return res.result
  }

  async getFileFull(request: DownloadFileRequest): Promise<R1FSDownloadResponse> {
    const qs = this.buildQuery({
      cid: request.cid,
      ...(request.secret ? { secret: request.secret } : {})
    })
    const res = await this.request(`/get_file?${qs}`, { method: 'GET' })
    return await this.parseFileResponseFull<R1FSDownloadResult, R1FSDownloadResponse>(res)
  }

  async getFileBase64(request: DownloadFileRequest): Promise<R1FSDownloadResult> {
    const res = await this.getFileBase64Full(request)
    return res.result
  }

  async getFileBase64Full(request: DownloadFileRequest): Promise<R1FSDownloadResponse> {
    const res = await this.request('/get_file_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid: request.cid, secret: request.secret })
    })
    return await this.parseResponseFull<R1FSDownloadResult, R1FSDownloadResponse>(res)
  }

  async addYaml(data: StoreYamlRequest): Promise<R1FSCidResult> {
    const res = await this.addYamlFull(data)
    return res.result
  }

  async addYamlFull(data: StoreYamlRequest): Promise<R1FSCidResponse> {
    const res = await this.request('/add_yaml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponseFull<R1FSCidResult, R1FSCidResponse>(res)
  }

  async getYaml(request: RetrieveYamlRequest): Promise<R1FSYamlDataResult> {
    const res = await this.getYamlFull(request)
    return res.result
  }

  async getYamlFull(request: RetrieveYamlRequest): Promise<R1FSYamlDataResponse> {
    const qs = this.buildQuery({
      cid: request.cid,
      ...(request.secret ? { secret: request.secret } : {})
    })
    const res = await this.request(`/get_yaml?${qs}`, { method: 'GET' })
    return await this.parseResponseFull<R1FSYamlDataResult, R1FSYamlDataResponse>(res)
  }

  async addJson(data: StoreJsonRequest): Promise<R1FSCidResult> {
    const res = await this.addJsonFull(data)
    return res.result
  }

  async addJsonFull(data: StoreJsonRequest): Promise<R1FSCidResponse> {
    const res = await this.request('/add_json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponseFull<R1FSCidResult, R1FSCidResponse>(res)
  }

  async calculateJsonCid(data: CalculateCidRequest): Promise<R1FSCidResult> {
    const res = await this.calculateJsonCidFull(data)
    return res.result
  }

  async calculateJsonCidFull(data: CalculateCidRequest): Promise<R1FSCidResponse> {
    const res = await this.request('/calculate_json_cid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponseFull<R1FSCidResult, R1FSCidResponse>(res)
  }

  async addPickle(data: StorePickleRequest): Promise<R1FSCidResult> {
    const res = await this.addPickleFull(data)
    return res.result
  }

  async addPickleFull(data: StorePickleRequest): Promise<R1FSCidResponse> {
    const res = await this.request('/add_pickle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponseFull<R1FSCidResult, R1FSCidResponse>(res)
  }

  async calculatePickleCid(data: CalculatePickleCidRequest): Promise<R1FSCidResult> {
    const res = await this.calculatePickleCidFull(data)
    return res.result
  }

  async calculatePickleCidFull(data: CalculatePickleCidRequest): Promise<R1FSCidResponse> {
    const res = await this.request('/calculate_pickle_cid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.parseResponseFull<R1FSCidResult, R1FSCidResponse>(res)
  }

  async deleteFile(request: DeleteFileRequest): Promise<DeleteFileResult> {
    const res = await this.deleteFileFull(request)
    return res.result
  }

  async deleteFileFull(request: DeleteFileRequest): Promise<DeleteFileResponse> {
    const payload: Record<string, unknown> = { cid: request.cid }
    if (request.unpin_remote !== undefined) payload.unpin_remote = request.unpin_remote
    if (request.run_gc !== undefined) payload.run_gc = request.run_gc
    if (request.cleanup_local_files !== undefined) {
      payload.cleanup_local_files = request.cleanup_local_files
    }

    const res = await this.request('/delete_file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    return await this.parseResponseFull<DeleteFileResult, DeleteFileResponse>(res)
  }

  async deleteFiles(request: DeleteFilesRequest): Promise<DeleteFilesResult> {
    const res = await this.deleteFilesFull(request)
    return res.result
  }

  async deleteFilesFull(request: DeleteFilesRequest): Promise<DeleteFilesResponse> {
    const payload: Record<string, unknown> = { cids: request.cids }
    if (request.unpin_remote !== undefined) payload.unpin_remote = request.unpin_remote
    if (request.run_gc_after_all !== undefined) {
      payload.run_gc_after_all = request.run_gc_after_all
    }
    if (request.cleanup_local_files !== undefined) {
      payload.cleanup_local_files = request.cleanup_local_files
    }

    const res = await this.request('/delete_files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    return await this.parseResponseFull<DeleteFilesResult, DeleteFilesResponse>(res)
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
  protected async parseFileResponse<TResult>(res: Response): Promise<TResult> {
    const full = await this.parseFileResponseFull<TResult>(res)
    return full.result
  }

  protected async parseFileResponseFull<
    TResult,
    TResponse extends BaseResponse<TResult> = BaseResponse<TResult>
  >(res: Response): Promise<TResponse> {
    const contentType = res.headers.get('content-type') ?? ''

    // If content-type indicates JSON, use standard parsing
    if (contentType.includes('application/json')) {
      return await this.parseResponseFull<TResult, TResponse>(res)
    }

    // For binary content, return the response object directly
    // This allows the caller to access .blob(), .arrayBuffer(), etc.
    const result: BaseResponse<TResult> = {
      result: res as any, // The response object itself
      server_node_addr: '',
      evm_network: '',
      ee_node_alias: '',
      ee_node_address: '',
      ee_node_eth_address: '',
      ee_node_network: '',
      ee_node_ver: ''
    }

    return result as TResponse
  }
}
