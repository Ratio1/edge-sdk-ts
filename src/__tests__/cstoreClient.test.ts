import crossFetch from 'cross-fetch'
import nock from 'nock'
import createEdgeSdk from '../index'

describe('CStoreClient', () => {
  const baseUrl = 'http://localhost:31234'
  const ratio1 = createEdgeSdk({
    cstoreUrl: baseUrl,
    r1fsUrl: 'http://localhost:31235',
    httpAdapter: { fetch: crossFetch as any }
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('hgetall calls correct endpoint', async () => {
    nock(baseUrl)
      .get('/hgetall')
      .query({ hkey: 'test' })
      .reply(200, { result: { test: { key: 'value' } } })

    const res = await ratio1.cstore.hgetall({ hkey: 'test' })
    expect(res).toBeDefined()
  })

  it('hsync posts to the hsync endpoint with configured chainstore peers', async () => {
    const ratio1 = createEdgeSdk({
      cstoreUrl: baseUrl,
      r1fsUrl: 'http://localhost:31235',
      chainstorePeers: ['peer-a', 'peer-b'],
      httpAdapter: { fetch: crossFetch as any }
    })

    nock(baseUrl)
      .post('/hsync', { hkey: 'players', chainstore_peers: ['peer-a', 'peer-b'] })
      .reply(200, {
        result: { hkey: 'players', source_peer: 'peer-a', merged_fields: 2 }
      })

    const res = await ratio1.cstore.hsync({ hkey: 'players' })
    expect(res).toEqual({ hkey: 'players', source_peer: 'peer-a', merged_fields: 2 })
  })
})
