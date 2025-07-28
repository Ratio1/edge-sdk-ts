// Example: Using ratio1-edge-node-client in a Next.js application

// For client-side usage (in React components)
import { createBrowserClient } from 'ratio1-edge-node-client/browser'

// Example client-side usage
export async function clientSideExample() {
  const client = createBrowserClient({
    cstoreUrl: process.env.NEXT_PUBLIC_CSTORE_API_URL,
    r1fsUrl: process.env.NEXT_PUBLIC_R1FS_API_URL
  })

  try {
    // Store a value
    await client.cstore.setValue({ 
      key: 'user-preference', 
      value: 'dark-mode' 
    })

    // Retrieve the value
    const result = await client.cstore.getValue({ 
      key: 'user-preference' 
    })

    console.log('Retrieved value:', result.result)
  } catch (error) {
    console.error('Error:', error)
  }
}

// For server-side usage (in API routes or getServerSideProps)
import createClient from 'ratio1-edge-node-client'

export async function getServerSideProps() {
  const client = createClient({
    cstoreUrl: process.env.CSTORE_API_URL,
    r1fsUrl: process.env.R1FS_API_URL
  })

  try {
    const status = await client.cstore.getStatus()
    
    return {
      props: {
        status: status
      }
    }
  } catch (error) {
    return {
      props: {
        status: null,
        error: error.message
      }
    }
  }
}

// Example API route
export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const client = createClient({
      cstoreUrl: process.env.CSTORE_API_URL,
      r1fsUrl: process.env.R1FS_API_URL
    })

    client.cstore.setValue({
      key: req.body.key,
      value: req.body.value
    })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(error => {
      res.status(500).json({ error: error.message })
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
} 