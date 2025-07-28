// Browser-specific entry point for Next.js SSR compatibility
import { CStoreClient } from './browser/cstoreClient'
import { R1FSClient } from './browser/r1fsClient'

export interface Ratio1EdgeNodeClientOptions {
  cstoreUrl?: string
  r1fsUrl?: string
  debug?: boolean
}

// Helper function to get environment variables safely
function getEnvVar(key: string, defaultValue: string): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In browser, try to get from window.__RATIO1_ENV__ if available
    if (window.__RATIO1_ENV__ && window.__RATIO1_ENV__[key]) {
      return window.__RATIO1_ENV__[key]
    }
  }
  return defaultValue
}

export class Ratio1EdgeNodeClient {
  readonly cstore: CStoreClient
  readonly r1fs: R1FSClient

  constructor (opts: Ratio1EdgeNodeClientOptions = {}) {
    const cstoreUrl = opts.cstoreUrl ?? getEnvVar('CSTORE_API_URL', 'http://localhost:31234')
    const r1fsUrl = opts.r1fsUrl ?? getEnvVar('R1FS_API_URL', 'http://localhost:31235')
    const debug = !!opts.debug

    this.cstore = new CStoreClient(cstoreUrl, debug)
    this.r1fs = new R1FSClient(r1fsUrl, debug)
  }
}

// Browser-safe client creation
export function createBrowserClient(opts?: Ratio1EdgeNodeClientOptions): Ratio1EdgeNodeClient {
  return new Ratio1EdgeNodeClient(opts)
}

// Export everything from the main module
export * from './cstore/types'
export * from './r1fs/types'

// Type declaration for browser environment
declare global {
  interface Window {
    __RATIO1_ENV__?: Record<string, string>
  }
} 