import createEdgeSdk from '../index'
import crossFetch from 'cross-fetch'
import nock from 'nock'
import { Readable } from 'stream'

const r1fsBase = process.env.R1FS_API_URL || 'http://localhost:31235'
const client = createEdgeSdk({ r1fsUrl: r1fsBase, cstoreUrl: 'http://localhost:31234', verbose: true, httpAdapter: { fetch: crossFetch as any } })

let cidFile: string
let cidB64: string

const fileContent = 'content'
const baseStr = Buffer.from('more').toString('base64')

describe('r1fs e2e', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  it('get_status works', async () => {
    nock(r1fsBase)
      .get('/get_status')
      .reply(200, { result: {}, server_node_addr: '', evm_network: '', ee_node_alias: '', ee_node_address: '', ee_node_eth_address: '', ee_node_network: '', ee_node_ver: '' })
    const res = await client.r1fs.getStatus()
    expect(res).toBeDefined()
  })

  it('add_file streams data from a readable source', async () => {
    const stream = Readable.from([fileContent])

    nock(r1fsBase)
      .post('/add_file')
      .reply(200, { result: { cid: 'mockcid' } })
    const res = await client.r1fs.addFile({
      file: stream,
      filename: 'mock.txt',
      secret: 'test-secret'
    })
    expect((res as any).cid).toBeDefined()
    cidFile = (res as any).cid!
  })

  it('get_file downloads data', async () => {
    nock(r1fsBase)
      .get('/get_file')
      .query({ cid: "QmTmkNsKFDH1xrNF2Ud4Utdx2XFjKoSfqyRjbQFF7E56sp", secret: "test-secret" })
      .reply(200, { result: { file_path: "/path/to/file", meta: { file: "/path/to/file", filename: "test.txt" } } })
    const res = await client.r1fs.getFile({ cid: "QmTmkNsKFDH1xrNF2Ud4Utdx2XFjKoSfqyRjbQFF7E56sp", secret: "test-secret" })
    expect(res.file_path).toBe("/path/to/file")
    expect(res.meta?.filename).toBe("test.txt")
  })

  it('add_yaml stores yaml data', async () => {
    const testData = { name: 'test', value: 123 }
    nock(r1fsBase)
      .post('/add_yaml')
      .reply(200, { result: { cid: 'yaml-cid-123' } })
    const res = await client.r1fs.addYaml({ data: testData, fn: 'test.yaml', secret: 'test-secret' })
    expect((res as any).cid).toBe('yaml-cid-123')
  })

  it('get_yaml retrieves yaml data', async () => {
    const testData = { name: 'test', value: 123 }
    nock(r1fsBase)
      .get('/get_yaml')
      .query({ cid: 'yaml-cid-123', secret: 'test-secret' })
      .reply(200, { result: { file_data: testData } })
    const res = await client.r1fs.getYaml({ cid: 'yaml-cid-123', secret: 'test-secret' })
    expect(res.file_data).toEqual(testData)
  })

  it('add_json stores json data', async () => {
    const testData = { name: 'test', value: 123 }
    nock(r1fsBase)
      .post('/add_json')
      .reply(200, { result: { cid: 'json-cid-123' } })
    const res = await client.r1fs.addJson({ data: testData, fn: 'test.json', secret: 'test-secret', nonce: 1 })
    expect((res as any).cid).toBe('json-cid-123')
  })

  it('add_pickle stores pickle data', async () => {
    const testData = { name: 'test', value: 123 }
    nock(r1fsBase)
      .post('/add_pickle')
      .reply(200, { result: { cid: 'pickle-cid-123' } })
    const res = await client.r1fs.addPickle({ data: testData, fn: 'test.pkl', secret: 'test-secret', nonce: 1 })
    expect((res as any).cid).toBe('pickle-cid-123')
  })

  it('calculate_json_cid calculates cid without storing', async () => {
    const testData = { name: 'test', value: 123 }
    nock(r1fsBase)
      .post('/calculate_json_cid')
      .reply(200, { result: { cid: 'calculated-json-cid-123' } })
    const res = await client.r1fs.calculateJsonCid({ data: testData, nonce: 1, fn: 'test.json', secret: 'test-secret' })
    expect((res as any).cid).toBe('calculated-json-cid-123')
  })

  it('calculate_pickle_cid calculates cid without storing', async () => {
    const testData = { name: 'test', value: 123 }
    nock(r1fsBase)
      .post('/calculate_pickle_cid')
      .reply(200, { result: { cid: 'calculated-pickle-cid-123' } })
    const res = await client.r1fs.calculatePickleCid({ data: testData, nonce: 1, fn: 'test.pkl', secret: 'test-secret' })
    expect((res as any).cid).toBe('calculated-pickle-cid-123')
  })
  //
  // it('add_file_base64 uploads data', async () => {
  //   const res = await client.r1fs.addFileBase64({ file_base64_str: baseStr, filename: 'mock.txt' })
  //   expect(res.success).toBe(true)
  //   expect(res.cid).toBeDefined()
  //   cidB64 = res.cid!
  // })
  //
  // it('get_file_base64 downloads data', async () => {
  //   const res = await client.r1fs.getFileBase64({ cid: cidB64 })
  //   expect(res.file_base64_str).toBe(baseStr)
  // })
})
