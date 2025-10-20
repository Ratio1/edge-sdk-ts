import { createDefaultHttpAdapter, type HttpAdapter } from './http/adapter'
import type { BaseResponse } from './types'

export interface RequestOptions {
  method: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: string | FormData | any
}

export class BaseHttpClient {
  constructor(
    protected readonly baseUrl: string,
    protected readonly verbose = false,
    private readonly http: HttpAdapter = createDefaultHttpAdapter()
  ) {}

  protected async request(endpoint: string, options: RequestOptions): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`
    const start = Date.now()
    if (this.verbose) {
      console.debug('[edge-sdk-ts] request', { url, ...options })
    }

    const res = await this.http.fetch(url, options)
    const duration = Date.now() - start
    if (this.verbose) {
      console.debug('[edge-sdk-ts] response', { url, status: res.status, duration })
    }
    if (!res.ok) {
      const err = new Error(`Request failed with status ${res.status}`)
      ;(err as any).response = res
      throw err
    }
    return res
  }

  protected async parseResponse<T>(
    res: Response,
    opts?: { fullResponse?: boolean }
  ): Promise<T | BaseResponse<T>> {
    let data: BaseResponse<T>
    try {
      data = await res.json()
    } catch (err) {
      const e = new Error('Failed to parse response')
      ;(e as any).cause = err
      throw e
    }
    return (opts?.fullResponse ?? false) ? data : data.result
  }

  protected buildQuery(params: Record<string, any>): string {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null)
        sp.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v))
    }
    return sp.toString()
  }
}
