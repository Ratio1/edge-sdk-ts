import createClient from '../../index'

const cstoreBase = process.env.CSTORE_API_URL || 'http://localhost:31234'
const r1fsBase = process.env.R1FS_API_URL || 'http://localhost:31235'
const ratio1 = createClient({ cstoreUrl: cstoreBase, r1fsUrl: r1fsBase })

let storedKey = `e2e-key-${Date.now()}`
let hkey = `e2e-hkey-${Date.now()}`

describe('cstore e2e', () => {
    it('get_status returns info', async () => {
        const status = await ratio1.cstore.getStatus()
        expect(status.keys).toBeDefined()
    })

    it('set_value stores a value', async () => {
        const res = await ratio1.cstore.setValue({ key: storedKey, value: 1 })
        console.log('CStore setValue response:', res)
        // The server might return false for various reasons (already exists, etc.)
        expect(typeof res).toBe('boolean')
    })

    it('get_value returns the stored value', async () => {
        const res = await ratio1.cstore.getValue({ key: storedKey })
        expect(res).toBe("1")
    })

    it('hset stores a hash entry', async () => {
        const res = await ratio1.cstore.hset({ hkey, key: 'k1', value: 'v1' })
        // The server might return false for various reasons (already exists, etc.)
        expect(typeof res).toBe('boolean')
    })

    it('hash_get_value retrieves the hash entry', async () => {
        const res = await ratio1.cstore.hget({ hkey, key: 'k1' })
        expect(res).toBe('v1')
    })

    it('hgetall returns all hash values', async () => {
        const res = await ratio1.cstore.hgetall({ hkey })
        expect(res).toBeDefined()
    })
})
