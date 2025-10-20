import crossFetch from 'cross-fetch'
import nock from 'nock'
import createEdgeSdk from '../index'

const cstoreBase = process.env.CSTORE_API_URL ?? 'http://localhost:31234'
const client = createEdgeSdk({
  cstoreUrl: cstoreBase,
  r1fsUrl: 'http://localhost:31235',
  httpAdapter: { fetch: crossFetch as any }
})

const storedKey = 'e2e-key'

describe('cstore e2e', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  it('get_status returns info', async () => {
    nock(cstoreBase).get('/get_status').reply(200, { result: {}, ee_node_alias: 'node' })
    const status = await client.cstore.getStatus({ fullResponse: true })
    expect((status as any).ee_node_alias).toBeDefined()
  })

  it('set_value stores a value', async () => {
    nock(cstoreBase)
      .post('/set', { key: storedKey, value: '1', chainstore_peers: [] })
      .reply(200, { result: true })
    const res = await client.cstore.setValue({ key: storedKey, value: 1 })
    expect(res).toBe(true)
  })

  it('get_value returns the stored value', async () => {
    nock(cstoreBase).get('/get').query({ key: storedKey }).reply(200, { result: '1' })
    const res = await client.cstore.getValue({ key: storedKey })
    expect(res).toBe('1')
  })

  it('hset stores a hash entry', async () => {
    nock(cstoreBase)
      .post('/hset', { hkey: 'e2e-hkey', key: 'k1', value: 'v1', chainstore_peers: [] })
      .reply(200, { result: true })
    const res = await client.cstore.hset({ hkey: 'e2e-hkey', key: 'k1', value: 'v1' })
    expect(res).toBe(true)
  })

  it('hget retrieves the hash entry', async () => {
    nock(cstoreBase)
      .get('/hget')
      .query({ hkey: 'e2e-hkey', key: 'k1' })
      .reply(200, { result: 'v1' })
    const res = await client.cstore.hget({ hkey: 'e2e-hkey', key: 'k1' })
    expect(res).toBe('v1')
  })

  it('hgetall returns all hash values', async () => {
    nock(cstoreBase)
      .get('/hgetall')
      .query({ hkey: 'e2e-hkey' })
      .reply(200, { result: { k1: 'v1' } })
    const res = await client.cstore.hgetall({ hkey: 'e2e-hkey' })
    expect(res).toBeTruthy()
  })
})
