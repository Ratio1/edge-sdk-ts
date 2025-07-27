import nock from 'nock'
import createClient from '../index'

describe('CStoreClient', () => {
  const baseUrl = 'http://localhost:31234'
  const client = createClient({ cstoreUrl: baseUrl })

  afterEach(() => {
    nock.cleanAll()
  })

  it('hgetall calls correct endpoint', async () => {
    nock(baseUrl)
      .post('/hgetall', { hkey: 'test' })
      .reply(200, { result: { test: { key: 'value' } } })

    const res = await client.cstore.hgetall({ hkey: 'test' })
    expect(res.result).toBeDefined()
  })
})
