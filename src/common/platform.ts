export function getFetch (): typeof fetch {
  if (typeof globalThis !== 'undefined' && typeof globalThis.fetch !== 'undefined') {
    return globalThis.fetch.bind(globalThis) as typeof fetch
  }
  const cf = require('cross-fetch')
  return cf.default || cf
}

export function getFormData (): typeof FormData {
  if (typeof globalThis !== 'undefined' && typeof (globalThis as any).FormData !== 'undefined') {
    return (globalThis as any).FormData
  }
  const fd = require('form-data')
  return fd.default || fd
}
