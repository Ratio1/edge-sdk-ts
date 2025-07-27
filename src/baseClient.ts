import fetch from "cross-fetch"
export interface RequestOptions {
  method: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: string | FormData
}

export class BaseClient {
  constructor (protected readonly baseUrl: string, protected readonly debug = false) {}

  protected async request (endpoint: string, options: RequestOptions): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`
    const start = Date.now()
    if (this.debug) {
      console.debug('[ratio1-edge-node-client] request', { url, ...options })
    }

    const res = await fetch(url, options)
    const duration = Date.now() - start
    if (this.debug) {
      console.debug('[ratio1-edge-node-client] response', { url, status: res.status, duration })
    }
    if (!res.ok) {
      const err = new Error(`Request failed with status ${res.status}`)
      ;(err as any).response = res
      throw err
    }
    return res
  }

  protected buildQuery (params: Record<string, any>): string {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) sp.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v))
    }
    return sp.toString()
  }
}
