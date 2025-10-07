import createClient from '../../index'


const cstoreBase = process.env.CSTORE_API_URL || 'http://localhost:31234'
const r1fsBase = process.env.R1FS_API_URL || 'http://localhost:31235'
const ratio1 = createClient({ cstoreUrl: cstoreBase, r1fsUrl: r1fsBase })

let cidFile: string
let cidB64: string

const fileContent = 'content'
const baseStr = Buffer.from('more').toString('base64')

function delay (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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
        expect(res).toBeDefined()
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
        const secret = 'test-secret-get'
        const addRes = await ratio1.r1fs.addYaml({ data: testData, fn: 'test.yaml', secret }, { fullResponse: true }) as any
        console.log("====================")
        console.log("====================---------")
        console.log(addRes)
        expect(addRes.result.cid).toBeDefined()
        const cid = addRes.result.cid

        let attempts = 0
        let received: any = null
        while (attempts < 5 && !received) {
            console.log(`[r1fs:get_yaml] attempt ${attempts + 1} for cid ${cid}`)
            const res = await ratio1.r1fs.getYaml({ cid, secret })
            if (res?.file_data) {
                console.log(`[r1fs:get_yaml] received payload for cid ${cid}`)
                received = res.file_data
                break
            }
            console.log(`[r1fs:get_yaml] retrying cid ${cid} after delay`)
            await delay(500)
            attempts += 1
        }

        expect(received).toEqual(testData)
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
