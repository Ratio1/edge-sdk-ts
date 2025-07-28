# ratio1-edge-node-client

SDK for interacting with Ratio1 Edge Node services such as **CStore** and **R1FS**.

## Installation

```bash
npm install ratio1-edge-node-client
```

## Usage

### Node.js Environment

```ts
import createClient from 'ratio1-edge-node-client'

const client = createClient({
  cstoreUrl: 'http://localhost:31234',
  r1fsUrl: 'http://localhost:31235'
})

const allValues = await client.cstore.hgetall('my-hkey')
```

### Browser Environment (Next.js, React, etc.)

For browser environments, especially with Next.js SSR, use the browser-specific import:

```ts
import { createBrowserClient } from 'ratio1-edge-node-client/browser'

const client = createBrowserClient({
  cstoreUrl: 'http://localhost:31234',
  r1fsUrl: 'http://localhost:31235'
})

const allValues = await client.cstore.hgetall('my-hkey')
```

### Next.js with Environment Variables

For Next.js applications, you can set environment variables in your `.env.local` file:

```env
NEXT_PUBLIC_CSTORE_API_URL=http://localhost:31234
NEXT_PUBLIC_R1FS_API_URL=http://localhost:31235
```

Then use them in your client:

```ts
import { createBrowserClient } from 'ratio1-edge-node-client/browser'

const client = createBrowserClient({
  cstoreUrl: process.env.NEXT_PUBLIC_CSTORE_API_URL,
  r1fsUrl: process.env.NEXT_PUBLIC_R1FS_API_URL
})
```

### Environment Variables

URLs can also be provided via environment variables:

- **Node.js**: `CSTORE_API_URL` and `R1FS_API_URL`
- **Browser**: Set `window.__RATIO1_ENV__` with your configuration:

```ts
// Set this before importing the client
window.__RATIO1_ENV__ = {
  CSTORE_API_URL: 'http://localhost:31234',
  R1FS_API_URL: 'http://localhost:31235'
}
```

## API Reference

### CStore Client

```ts
// Get status
const status = await client.cstore.getStatus()

// Set a value
await client.cstore.setValue({ key: 'my-key', value: 'my-value' })

// Get a value
const result = await client.cstore.getValue({ key: 'my-key' })

// Hash operations
await client.cstore.hashSetValue({ hkey: 'my-hash', key: 'field', value: 'value' })
const hashValue = await client.cstore.hashGetValue({ hkey: 'my-hash', key: 'field' })
const allHashValues = await client.cstore.hgetall({ hkey: 'my-hash' })
```

### R1FS Client

```ts
// File system operations
// (R1FS client methods will be documented here)
```

## Browser Compatibility

This package is designed to work in both Node.js and browser environments:

- **Node.js**: Uses `cross-fetch` for HTTP requests and `form-data` for file uploads
- **Browser**: Uses native `fetch` API and native `FormData` for optimal performance
- **SSR Support**: Compatible with Next.js Server-Side Rendering
- **Module Formats**: Supports both CommonJS and ES Modules

## Bundle Size Optimization

The package is optimized for browser environments:

- **Browser builds**: Only include native browser APIs (no Node.js dependencies)
- **Tree-shaking friendly**: Marked as `sideEffects: false`
- **Optional dependencies**: Node.js-specific packages are optional dependencies
- **Dynamic imports**: Node.js dependencies are loaded only when needed

### Bundle Size Comparison

- **Node.js build**: ~50KB (includes cross-fetch, form-data)
- **Browser build**: ~15KB (native APIs only)

## Development

```bash
# Install dependencies
npm install

# Build for both Node.js and browser
npm run build

# Run tests
npm test

# Run specific tests
npm run test:e2e:cstore
npm run test:e2e:r1fs
```
