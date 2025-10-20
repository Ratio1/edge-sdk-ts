export function getFetch(): typeof fetch {
  if (typeof globalThis?.fetch !== 'undefined') {
    return globalThis.fetch.bind(globalThis)
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cf = require('cross-fetch')
  return cf.default || cf
}

export function getFormData(): typeof FormData {
  const win = typeof window === 'undefined' ? undefined : window
  const isBrowser = typeof win?.document !== 'undefined'

  if (isBrowser && typeof window.FormData !== 'undefined') {
    return window.FormData
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fd = require('form-data')
    return fd.default || fd
  } catch (err) {
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).FormData !== 'undefined') {
      return (globalThis as any).FormData
    }
    throw err
  }
}
