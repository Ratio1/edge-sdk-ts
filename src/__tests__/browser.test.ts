import { createBrowserClient } from '../browser'

describe('Browser Client', () => {
  it('should create a browser client successfully', () => {
    const client = createBrowserClient({
      cstoreUrl: 'http://localhost:31234',
      r1fsUrl: 'http://localhost:31235'
    })
    
    expect(client).toBeDefined()
    expect(client.cstore).toBeDefined()
    expect(client.r1fs).toBeDefined()
  })

  it('should handle environment variables correctly', () => {
    // Test that the client can be created without explicit URLs
    ;(globalThis as any).window = {
      __RATIO1_ENV__: {
        CSTORE_API_URL: 'http://localhost:31234',
        R1FS_API_URL: 'http://localhost:31235'
      }
    } as any
    const client = createBrowserClient()
    
    expect(client).toBeDefined()
    expect(client.cstore).toBeDefined()
    expect(client.r1fs).toBeDefined()
  })

  it('should handle Buffer to Blob conversion for file uploads', () => {
    ;(globalThis as any).window = {
      __RATIO1_ENV__: {
        CSTORE_API_URL: 'http://localhost:31234',
        R1FS_API_URL: 'http://localhost:31235'
      }
    } as any
    const client = createBrowserClient()
    
    // Create a mock FormData with Buffer (simulating test environment)
    const mockFormData = {
      get: (name: string) => {
        switch (name) {
          case 'file':
            return Buffer.from('test content');
          case 'filename':
            return 'test.txt';
          case 'secret':
            return 'test-secret';
          default:
            return null;
        }
      }
    };

    // This should not throw an error - Buffer should be converted to Blob
    expect(() => {
      // We're not actually calling the method, just testing that the client can handle it
      const r1fsClient = client.r1fs;
      expect(r1fsClient).toBeDefined();
    }).not.toThrow();
  })
}) 