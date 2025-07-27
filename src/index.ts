import { CStoreClient } from './cstore/client'
import { R1FSClient } from './r1fs/client'

export interface Ratio1EdgeNodeClientOptions {
  cstoreUrl?: string
  r1fsUrl?: string
  debug?: boolean
}

export class Ratio1EdgeNodeClient {
  readonly cstore: CStoreClient
  readonly r1fs: R1FSClient

  constructor (opts: Ratio1EdgeNodeClientOptions = {}) {
    const cstoreUrl = opts.cstoreUrl ?? process.env.CSTORE_API_URL ?? 'http://localhost:31234'
    const r1fsUrl = opts.r1fsUrl ?? process.env.R1FS_API_URL ?? 'http://localhost:31235'
    const debug = !!opts.debug

    this.cstore = new CStoreClient(cstoreUrl, debug)
    this.r1fs = new R1FSClient(r1fsUrl, debug)
  }
}

export default function createClient (opts?: Ratio1EdgeNodeClientOptions): Ratio1EdgeNodeClient {
  return new Ratio1EdgeNodeClient(opts)
}

export * from './cstore/types'
export * from './r1fs/types'
