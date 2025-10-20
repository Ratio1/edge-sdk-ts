import { getFetch } from '../platform'

export interface HttpAdapter {
  fetch: (url: string, options?: RequestInit) => Promise<Response>
}

export function createDefaultHttpAdapter(): HttpAdapter {
  const fetchImpl = getFetch()
  return {
    fetch: async (url: string, options?: RequestInit) => await fetchImpl(url, options)
  }
}
