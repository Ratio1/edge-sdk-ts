import nock from 'nock'
import createClient from '../index'
import crossFetch from 'cross-fetch'

describe('R1FSClient', () => {
  const baseUrl = 'http://localhost:31235'
  const client = createClient({ r1fsUrl: baseUrl, cstoreUrl: 'http://localhost:31234', httpAdapter: { fetch: crossFetch as any } })

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

  it('addFile uploads data with correct structure', async () => {
    // Mock the server response
    nock(baseUrl)
      .post('/add_file')
      .reply(200, { result: { cid: 'test-cid-123', message: 'ok' } })

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
    expect((res as any).cid).toBe('test-cid-123')
  })
})
