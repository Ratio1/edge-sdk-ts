import createClient from '../index'

const r1fsBase = process.env.R1FS_API_URL || 'http://localhost:31235'
const client = createClient({ r1fsUrl: r1fsBase, debug: true })

let cidFile: string
let cidB64: string

const fileContent = 'content'
const baseStr = Buffer.from('more').toString('base64')

describe('r1fs e2e', () => {
  it('get_status works', async () => {
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
    
    const res = await client.r1fs.addFile({ formData: mockFormData as any })
    expect(res.result.cid).toBeDefined()
    cidFile = res.result.cid!
  })

  it('get_file downloads data', async () => {
    // const res = await client.r1fs.getFile({ cid: cidFile })
    const res = await client.r1fs.getFile({ cid: "QmTmkNsKFDH1xrNF2Ud4Utdx2XFjKoSfqyRjbQFF7E56sp", secret: "test-secret" })
    const text = await res.text()
    expect(text).toBe(fileContent)
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
