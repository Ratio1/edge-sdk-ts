import nock from 'nock'
import createClient from '../index'
import crossFetch from 'cross-fetch'

describe('CStoreClient', () => {
  const baseUrl = 'http://localhost:31234'
  const client = createClient({ cstoreUrl: baseUrl, r1fsUrl: 'http://localhost:31235', httpAdapter: { fetch: crossFetch as any } })

  afterEach(() => {
    nock.cleanAll()
  })

  it('hgetall calls correct endpoint', async () => {
    nock(baseUrl)
      .get('/hgetall')
      .query({ hkey: 'test' })
      .reply(200, { result: { test: { key: 'value' } } })

    const res = await client.cstore.hgetall({ hkey: 'test' })
    expect(res).toBeDefined()
  })
})
