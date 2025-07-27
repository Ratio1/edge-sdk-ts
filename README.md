# ratio1-edge-node-client

SDK for interacting with Ratio1 Edge Node services such as **CStore** and **R1FS**.

```ts
import createClient from 'ratio1-edge-node-client'

const client = createClient({
  cstoreUrl: 'http://localhost:31234',
  r1fsUrl: 'http://localhost:31235'
})

const allValues = await client.cstore.hgetall('my-hkey')
```

URLs can also be provided via the `CSTORE_API_URL` and `R1FS_API_URL` environment variables.
