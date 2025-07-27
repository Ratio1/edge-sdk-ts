import createClient from '../index'

const cstoreBase = process.env.CSTORE_API_URL || 'http://localhost:31234'
const client = createClient({ cstoreUrl: cstoreBase })

let storedKey = 'e2e-key'

describe('cstore e2e', () => {
  it('get_status returns info', async () => {
    const status = await client.cstore.getStatus()
    expect(status.ee_node_alias).toBeDefined()
  })

  it('set_value stores a value', async () => {
    const res = await client.cstore.setValue({ cstoreKey: storedKey, chainstoreValue: 1 })
    expect(res[storedKey]).toBe(1)
  })

  it('get_value returns the stored value', async () => {
    const res = await client.cstore.getValue({ cstoreKey: storedKey })
    expect(res[storedKey]).toBe(1)
  })

  it('hash_set_value stores a hash entry', async () => {
    const res = await client.cstore.hashSetValue({ hkey: 'e2e-hkey', key: 'k1', value: 'v1' })
    expect(res['e2e-hkey'].k1).toBe('v1')
  })

  it('hash_get_value retrieves the hash entry', async () => {
    const res = await client.cstore.hashGetValue({ hkey: 'e2e-hkey', key: 'k1' })
    expect(res['e2e-hkey'].k1).toBe('v1')
  })

  it('hgetall returns all hash values', async () => {
    const res = await client.cstore.hgetall({ hkey: 'e2e-hkey' })
    expect(res['e2e-hkey'].k1).toBeDefined()
  })
})
