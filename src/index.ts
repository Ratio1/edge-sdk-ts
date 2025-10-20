import type { HttpAdapter } from './common/http/adapter'
import { CStoreHttpClient } from './cstore/httpClient'
import { CStoreService } from './cstore/service'
import { ensureProtocol } from './helpers'
import { R1FSHttpClient } from './r1fs/httpClient'
import { R1FSService } from './r1fs/service'

export interface EdgeSdkOptions {
  cstoreUrl?: string
  r1fsUrl?: string
  chainstorePeers?: string[]
  debug?: boolean
  verbose?: boolean
  httpAdapter?: HttpAdapter
  formDataCtor?: typeof FormData
}

// Helper function to get environment variables safely
function getEnvVar(keys: string[]): string | undefined {
  // Check browser environment first
  if (typeof window !== 'undefined') {
    if (window.__RATIO1_ENV__) {
      for (const k of keys) {
        if (window.__RATIO1_ENV__[k]) return window.__RATIO1_ENV__[k]
      }
    }
    return undefined
  }

  // Check Node.js environment
  if (process?.env) {
    for (const k of keys) {
      const val = process.env[k]
      if (val) return val
    }
  }

  return undefined
}

export class EdgeSdk {
  readonly cstore: CStoreService
  readonly r1fs: R1FSService

  constructor(opts: EdgeSdkOptions = {}) {
    let cstoreUrl =
      opts.cstoreUrl ?? getEnvVar(['CSTORE_API_URL', 'EE_CHAINSTORE_API_URL']) ?? 'localhost:31234'
    let r1fsUrl =
      opts.r1fsUrl ?? getEnvVar(['R1FS_API_URL', 'EE_R1FS_API_URL']) ?? 'localhost:31235'
    const chainstorePeersStr = opts.chainstorePeers ?? getEnvVar(['EE_CHAINSTORE_PEERS']) ?? []
    cstoreUrl = ensureProtocol(cstoreUrl)
    r1fsUrl = ensureProtocol(r1fsUrl)
    const verbose = opts.verbose ?? opts.debug ?? false

    if (verbose) {
      console.log('[edge-sdk-ts] Initializing EdgeSdk with peers', chainstorePeersStr)
    }

    const adapter = opts.httpAdapter
    const formDataCtor = opts.formDataCtor

    let chainstorePeers: string[] = []
    try {
      chainstorePeers = Array.isArray(chainstorePeersStr)
        ? chainstorePeersStr
        : JSON.parse(chainstorePeersStr)
    } catch (e) {
      console.warn('Failed to parse chainstorePeers, using empty array', e)
    }

    const cstoreHttp = new CStoreHttpClient(cstoreUrl, verbose, adapter, chainstorePeers)
    const r1fsHttp = new R1FSHttpClient(r1fsUrl, verbose, adapter, formDataCtor, chainstorePeers)

    this.cstore = new CStoreService(cstoreHttp)
    this.r1fs = new R1FSService(r1fsHttp)
  }
}

export default function createEdgeSdk(opts?: EdgeSdkOptions): EdgeSdk {
  return new EdgeSdk(opts)
}

export * from './types'

// Type declaration for browser environment
declare global {
  interface Window {
    __RATIO1_ENV__?: Record<string, string>
  }
}
