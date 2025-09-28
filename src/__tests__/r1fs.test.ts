import createRatio1EdgeNodeClient from '../index'
import crossFetch from 'cross-fetch'
import nock from 'nock'

const r1fsBase = process.env.R1FS_API_URL || 'http://localhost:31235'
const client = createRatio1EdgeNodeClient({ r1fsUrl: r1fsBase, cstoreUrl: 'http://localhost:31234', verbose: true, httpAdapter: { fetch: crossFetch as any } })

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

  it('add_file uploads data', async () => {
    // Create a mock FormData-like object for testing
    const mockFormData = {
      get: (name: string) => {
        switch (name) {
          case 'file':
            return Buffer.from(fileContent);
          case 'filename':
            return 'mock.txt';
          case 'secret':
            return 'test-secret';
          default:
            return null;
        }
      }
    };

    nock(r1fsBase)
      .post('/add_file')
      .reply(200, { result: { cid: 'mockcid' } })
    const res = await client.r1fs.addFile({ formData: mockFormData as any })
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
