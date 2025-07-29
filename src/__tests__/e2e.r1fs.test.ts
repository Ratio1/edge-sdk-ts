import createClient from '../index'


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
        const res = await ratio1.r1fs.addFile({ formData })
        expect(res.cid).toBeDefined()
        cidFile = res.cid!
    })

    it('get_file downloads data', async () => {
        const res = await ratio1.r1fs.getFile({ cid: cidFile })
        const text = await res.text()
        expect(text).toBe(fileContent)
    })

    it('add_file_base64 uploads data', async () => {
        const res = await ratio1.r1fs.addFileBase64({ file_base64_str: baseStr, filename: 'mock.txt' })
        expect(res.cid).toBeDefined()
        cidB64 = res.cid!
    })

    it('get_file_base64 downloads data', async () => {
        const res = await ratio1.r1fs.getFileBase64({ cid: cidB64 })
        expect(res.file_base64_str).toBe(baseStr)
    })
})
