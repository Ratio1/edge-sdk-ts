import createClient from '../index'

const cstoreBase = process.env.CSTORE_API_URL || 'http://localhost:31234'
const r1fsBase = process.env.R1FS_API_URL || 'http://localhost:31235'
const client = createClient({ cstoreUrl: cstoreBase, r1fsUrl: r1fsBase })

describe('Ratio1EdgeNodeClient e2e', () => {
  it('performs cstore hgetall and r1fs get_status', async () => {
    const cstoreRes = await client.cstore.hgetall({ hkey: 'mykey' })
    const r1fsRes = await client.r1fs.getStatus()
    expect(cstoreRes).toBeDefined()
    expect(r1fsRes).toBeDefined()
  })
})
