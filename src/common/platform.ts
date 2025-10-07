export function getFetch (): typeof fetch {
  if (typeof globalThis !== 'undefined' && typeof globalThis.fetch !== 'undefined') {
    return globalThis.fetch.bind(globalThis) as typeof fetch
  }
  const cf = require('cross-fetch')
  return cf.default || cf
}

export function getFormData (): typeof FormData {
  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

  if (isBrowser && typeof window.FormData !== 'undefined') {
    return window.FormData
  }

  try {
    const fd = require('form-data')
    return fd.default || fd
  } catch (err) {
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).FormData !== 'undefined') {
      return (globalThis as any).FormData
    }
    throw err
  }
}
