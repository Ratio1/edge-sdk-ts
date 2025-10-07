import nock from 'nock'
import createRatio1EdgeNodeClient from '../index'
import crossFetch from 'cross-fetch'
import { Readable } from 'stream'
import FormData from 'form-data'
import http from 'node:http'
import type { AddressInfo } from 'node:net'

describe('R1FSClient', () => {
  const baseUrl = 'http://localhost:31235'
  const client = createRatio1EdgeNodeClient({ r1fsUrl: baseUrl, cstoreUrl: 'http://localhost:31234', httpAdapter: { fetch: crossFetch as any } })

  afterEach(() => {
    nock.cleanAll()
  })

  it('getStatus calls /get_status', async () => {
    nock(baseUrl)
      .get('/get_status')
      .reply(200, { result: { ok: true } })

    const res = await client.r1fs.getStatus()
    expect((res as any).ok).toBe(true)
  })

  it('addFile streams data when provided with a readable', async () => {
    // Mock the server response
    nock(baseUrl)
      .post('/add_file')
      .reply(200, { result: { cid: 'test-cid-123', message: 'ok' } })

    const readable = Readable.from(['test content'])

    const res = await client.r1fs.addFile({
      file: readable,
      filename: 'test.txt',
      secret: 'test-secret',
      nonce: 7,
      contentType: 'text/plain'
    })
    expect((res as any).cid).toBe('test-cid-123')
  })

  it('addFile reuses provided FormData instances', async () => {
    nock(baseUrl)
      .post('/add_file')
      .reply(200, { result: { cid: 'legacy-cid', message: 'ok' } })

    const fd = new FormData()
    fd.append('file', Buffer.from('legacy content'), { filename: 'legacy.txt', contentType: 'text/plain' })

    const res = await client.r1fs.addFile({
      formData: fd as any,
      metadata: { filename: 'legacy.txt', secret: 'legacy-secret' }
    })

    expect((res as any).cid).toBe('legacy-cid')
  })

  it('addYaml calls /add_yaml with correct data', async () => {
    const testData = { name: 'test', value: 123 }
    nock(baseUrl)
      .post('/add_yaml', { data: testData, fn: 'test.yaml', secret: 'test-secret' })
      .reply(200, { result: { cid: 'yaml-cid-123' } })

    const res = await client.r1fs.addYaml({ data: testData, fn: 'test.yaml', secret: 'test-secret' })
    expect((res as any).cid).toBe('yaml-cid-123')
  })

  it('getYaml calls /get_yaml with correct query params', async () => {
    const testData = { name: 'test', value: 123 }
    nock(baseUrl)
      .get('/get_yaml')
      .query({ cid: 'yaml-cid-123', secret: 'test-secret' })
      .reply(200, { result: { file_data: testData } })

    const res = await client.r1fs.getYaml({ cid: 'yaml-cid-123', secret: 'test-secret' })
    expect(res.file_data).toEqual(testData)
  })

  it('addJson calls /add_json with correct data', async () => {
    const testData = { name: 'test', value: 123 }
    nock(baseUrl)
      .post('/add_json', { data: testData, fn: 'test.json', secret: 'test-secret', nonce: 1 })
      .reply(200, { result: { cid: 'json-cid-123' } })

    const res = await client.r1fs.addJson({ data: testData, fn: 'test.json', secret: 'test-secret', nonce: 1 })
    expect((res as any).cid).toBe('json-cid-123')
  })

  it('addPickle calls /add_pickle with correct data', async () => {
    const testData = { name: 'test', value: 123 }
    nock(baseUrl)
      .post('/add_pickle', { data: testData, fn: 'test.pkl', secret: 'test-secret', nonce: 1 })
      .reply(200, { result: { cid: 'pickle-cid-123' } })

    const res = await client.r1fs.addPickle({ data: testData, fn: 'test.pkl', secret: 'test-secret', nonce: 1 })
    expect((res as any).cid).toBe('pickle-cid-123')
  })

  it('calculateJsonCid calls /calculate_json_cid with correct data', async () => {
    const testData = { name: 'test', value: 123 }
    nock(baseUrl)
      .post('/calculate_json_cid', { data: testData, nonce: 1, fn: 'test.json', secret: 'test-secret' })
      .reply(200, { result: { cid: 'calculated-json-cid-123' } })

    const res = await client.r1fs.calculateJsonCid({ data: testData, nonce: 1, fn: 'test.json', secret: 'test-secret' })
    expect((res as any).cid).toBe('calculated-json-cid-123')
  })

  it('calculatePickleCid calls /calculate_pickle_cid with correct data', async () => {
    const testData = { name: 'test', value: 123 }
    nock(baseUrl)
      .post('/calculate_pickle_cid', { data: testData, nonce: 1, fn: 'test.pkl', secret: 'test-secret' })
      .reply(200, { result: { cid: 'calculated-pickle-cid-123' } })

    const res = await client.r1fs.calculatePickleCid({ data: testData, nonce: 1, fn: 'test.pkl', secret: 'test-secret' })
    expect((res as any).cid).toBe('calculated-pickle-cid-123')
})
})

describe('R1FSClient multipart streaming with undici', () => {
  it('sends streaming multipart requests with boundary headers', async () => {
    await new Promise<void>((resolve, reject) => {
      let settled = false
      const finish = (err?: Error) => {
        if (settled) return
        settled = true
        if (err) reject(err)
        else resolve()
      }

      const server = http.createServer((req, res) => {
        const chunks: Buffer[] = []

        const handleFailure = (err: Error) => {
          server.close(() => finish(err))
        }

        req.on('data', (chunk) => {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
        })
        req.on('error', (err) => {
          handleFailure(err as Error)
        })
        req.on('end', () => {
          try {
            expect(req.headers['content-type']).toMatch(/multipart\/form-data; boundary=/)
            const bodyStr = Buffer.concat(chunks).toString('utf8')
            expect(bodyStr).toContain('name="file"; filename="stream.txt"')
            expect(bodyStr).toContain('name="body"')
            expect(bodyStr).toContain('"filename":"stream.txt"')
            expect(bodyStr).toContain('"secret":"node-secret"')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ result: { cid: 'test-cid', message: 'ok' } }))
          } catch (err) {
            res.statusCode = 500
            res.end('error')
            return handleFailure(err as Error)
          }
        })
      })

      server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EACCES' || err.code === 'EPERM') {
          finish()
        } else {
          finish(err)
        }
      })

      server.listen(0, '127.0.0.1', async () => {
        const { port } = server.address() as AddressInfo
        const sdk = createRatio1EdgeNodeClient({ r1fsUrl: `http://127.0.0.1:${port}`, cstoreUrl: 'http://localhost:31234' })

        try {
          const stream = Readable.from(['streaming payload'])
          const result = await sdk.r1fs.addFile({ file: stream, filename: 'stream.txt', secret: 'node-secret' })
          expect((result as any).cid).toBe('test-cid')
          server.close((err) => finish(err ?? undefined))
        } catch (err) {
          if (settled) return
          server.close(() => finish(err as Error))
        }
      })
    })
  }, 10000)
})
