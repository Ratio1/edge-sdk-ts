import createEdgeSdk from '../index'
import crossFetch from 'cross-fetch'
import nock from 'nock'

const cstoreBase = process.env.CSTORE_API_URL || 'http://localhost:31234'
const r1fsBase = process.env.R1FS_API_URL || 'http://localhost:31235'
const client = createEdgeSdk({ cstoreUrl: cstoreBase, r1fsUrl: r1fsBase, httpAdapter: { fetch: crossFetch as any } })

describe('EdgeSdk e2e', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  it('performs cstore hgetall and r1fs get_status', async () => {
    nock(cstoreBase)
      .get('/hgetall')
      .query({ hkey: 'mykey' })
      .reply(200, { result: {} })
    nock(r1fsBase)
      .get('/get_status')
      .reply(200, { result: {} })
    const cstoreRes = await client.cstore.hgetall({ hkey: 'mykey' })
    const r1fsRes = await client.r1fs.getStatus()
    expect(cstoreRes).toBeDefined()
    expect(r1fsRes).toBeDefined()
  })
})
