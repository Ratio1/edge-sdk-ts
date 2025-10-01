import createClient from '../../index'


const cstoreBase = process.env.CSTORE_API_URL || 'http://localhost:31234'
const r1fsBase = process.env.R1FS_API_URL || 'http://localhost:31235'
const ratio1 = createClient({ cstoreUrl: cstoreBase, r1fsUrl: r1fsBase })

let cidFile: string
let cidB64: string

const fileContent = 'content'
const baseStr = Buffer.from('more').toString('base64')

describe('r1fs e2e', () => {
    it('get_status works', async () => {
        const res = await ratio1.r1fs.getStatus()
        expect(res).toBeDefined()
    })

    it('add_file uploads data', async () => {
        const formData = new FormData()
        formData.append('file', new Blob([fileContent]), 'mock.txt')
        const res = await ratio1.r1fs.addFile({ formData }, {fullResponse: true}) as any
        expect(res.result.cid).toBeDefined()
        cidFile = res.result.cid!
    })

    it('get_file downloads data', async () => {
        const res = await ratio1.r1fs.getFile({ cid: cidFile })
        // getFile now returns the raw Response object for binary data
        expect(res).toBeDefined()
        console.log("#2222")
        console.log("#aaaaasds")
        console.log(res)
        // The response should be a Response object that can be used to get binary data
        expect(typeof res).toBe('object')
    })

    it('add_file_base64 uploads data', async () => {
        const res = await ratio1.r1fs.addFileBase64({ file_base64_str: baseStr, filename: 'mock.txt' }, {fullResponse: true}) as any
        expect(res.result.cid).toBeDefined()
        cidB64 = res.result.cid!
    })

    it('get_file_base64 downloads data', async () => {
        const res = await ratio1.r1fs.getFileBase64({ cid: cidB64 })
        expect(res.file_base64_str).toBe(baseStr)
    })

    it('add_yaml stores yaml data', async () => {
        const testData = { name: 'test', value: 123, nested: { key: 'value' } }
        const res = await ratio1.r1fs.addYaml({ data: testData, fn: 'test.yaml', secret: 'test-secret' }, {fullResponse: true}) as any
        expect(res.result.cid).toBeDefined()
    })

    it('get_yaml retrieves yaml data', async () => {
        const testData = { name: 'test', value: 123, nested: { key: 'value' } }
        const addRes = await ratio1.r1fs.addYaml({ data: testData, fn: 'test.yaml' }, {fullResponse: true}) as any
        expect(addRes.result.cid).toBeDefined()
        const cid = addRes.result.cid
        
        const res = await ratio1.r1fs.getYaml({ cid })
        expect(res.file_data).toEqual(testData)
    })

    it('add_json stores json data', async () => {
        const testData = { name: 'test', value: 123, nested: { key: 'value' } }
        const res = await ratio1.r1fs.addJson({ data: testData, fn: 'test.json', secret: 'test-secret', nonce: 1 }, {fullResponse: true}) as any
        expect(res.result.cid).toBeDefined()
    })

    it('add_pickle stores pickle data', async () => {
        const testData = { name: 'test', value: 123, nested: { key: 'value' } }
        const res = await ratio1.r1fs.addPickle({ data: testData, fn: 'test.pkl', secret: 'test-secret', nonce: 1 }, {fullResponse: true}) as any
        expect(res.result.cid).toBeDefined()
    })

    it('calculate_json_cid calculates cid without storing', async () => {
        const testData = { name: 'test', value: 123, nested: { key: 'value' } }
        const res = await ratio1.r1fs.calculateJsonCid({ data: testData, nonce: 1, fn: 'test.json', secret: 'test-secret' }, {fullResponse: true}) as any
        expect(res.result.cid).toBeDefined()
    })

    it('calculate_pickle_cid calculates cid without storing', async () => {
        const testData = { name: 'test', value: 123, nested: { key: 'value' } }
        const res = await ratio1.r1fs.calculatePickleCid({ data: testData, nonce: 1, fn: 'test.pkl', secret: 'test-secret' }, {fullResponse: true}) as any
        expect(res.result.cid).toBeDefined()
    })
})
