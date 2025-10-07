// Example usage of @ratio1/edge-node-client inside a Next.js application

import { createRatio1EdgeNodeClient } from '@ratio1/edge-node-client/browser'
import createRatio1EdgeNodeClientServer from '@ratio1/edge-node-client'
import { Readable } from 'node:stream'

// -------------------------------------------------------------------------------------
// Client Components / Browser usage
// -------------------------------------------------------------------------------------
export async function clientSideExample (): Promise<void> {
  const ratio1 = createRatio1EdgeNodeClient({
    cstoreUrl: process.env.NEXT_PUBLIC_CSTORE_API_URL,
    r1fsUrl: process.env.NEXT_PUBLIC_R1FS_API_URL
  })

  await ratio1.cstore.setValue({
    key: 'user:123:preference',
    value: JSON.stringify({ theme: 'dark' })
  })

  const preference = await ratio1.cstore.getValue({ key: 'user:123:preference' })
  console.log('Preference:', JSON.parse(preference))
}

// -------------------------------------------------------------------------------------
// App Router (app/api/upload/route.ts)
// -------------------------------------------------------------------------------------
export async function appRouterUploadExample (req: Request): Promise<Response> {
  const form = await req.formData()
  const file = form.get('file')

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'file field missing' }), { status: 400 })
  }

  const ratio1 = createRatio1EdgeNodeClientServer({
    cstoreUrl: process.env.CSTORE_API_URL,
    r1fsUrl: process.env.R1FS_API_URL
  })

  const readable = Readable.fromWeb(file.stream())

  const upload = await ratio1.r1fs.addFile({
    file: readable,
    filename: file.name,
    contentType: file.type,
    secret: form.get('secret')?.toString()
  })

  await ratio1.cstore.setValue({
    key: `upload:${upload.cid}`,
    value: JSON.stringify({ filename: file.name, cid: upload.cid })
  })

  return new Response(JSON.stringify({ cid: upload.cid }))
}

// -------------------------------------------------------------------------------------
// Pages Router (pages/api/upload.ts)
// -------------------------------------------------------------------------------------
export async function pagesApiRouteExample (req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const ratio1 = createRatio1EdgeNodeClientServer({
    cstoreUrl: process.env.CSTORE_API_URL,
    r1fsUrl: process.env.R1FS_API_URL
  })

  const readable = req.file?.stream || req.file
  if (!readable) {
    res.status(400).json({ error: 'file field missing' })
    return
  }

  const upload = await ratio1.r1fs.addFile({
    file: readable,
    filename: req.file?.originalname || 'upload.bin',
    contentType: req.file?.mimetype
  })

  res.status(200).json({ cid: upload.cid })
}
