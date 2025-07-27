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
})
