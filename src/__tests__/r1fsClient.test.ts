import nock from 'nock'
import createClient from '../index'

describe('R1FSClient', () => {
  const baseUrl = 'http://localhost:31235'
  const client = createClient({ r1fsUrl: baseUrl })

  afterEach(() => {
    nock.cleanAll()
  })

  it('getStatus calls /get_status', async () => {
    nock(baseUrl)
      .get('/get_status')
      .reply(200, { ok: true })

    const res = await client.r1fs.getStatus()
    expect(res.ok).toBe(true)
  })

  it('addFile uploads data with correct structure', async () => {
    // Mock the server response
    nock(baseUrl)
      .post('/add_file')
      .reply(200, { success: true, cid: 'test-cid-123' })

    // Create a mock FormData-like object for testing
    const mockFormData = {
      get: (name: string) => {
        switch (name) {
          case 'file':
            return Buffer.from('test content');
          case 'filename':
            return 'test.txt';
          case 'secret':
            return 'test-secret';
          default:
            return null;
        }
      }
    };

    const res = await client.r1fs.addFile({ formData: mockFormData as any })
    expect(res.success).toBe(true)
    expect(res.cid).toBe('test-cid-123')
  })
})
