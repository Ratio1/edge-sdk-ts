function isBrowserEnv(): boolean {
  return typeof window?.document !== 'undefined'
}

function hasFormDataPackage(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- optional dependency in Node only
    require('form-data')
    return true
  } catch {
    return false
  }
}

export function getFetch(): typeof fetch {
  if (isBrowserEnv() && typeof window.fetch !== 'undefined') {
    return window.fetch.bind(window)
  }

  if (hasFormDataPackage()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- avoid bundling cross-fetch in browsers
    const cf = require('cross-fetch')
    return cf.default || cf
  }

  if (typeof globalThis?.fetch !== 'undefined') {
    return globalThis.fetch.bind(globalThis)
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires -- Node fallback when global fetch is missing
  const cf = require('cross-fetch')
  return cf.default || cf
}

export function getFormData(): typeof FormData {
  if (isBrowserEnv() && typeof window.FormData !== 'undefined') {
    return window.FormData
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- optional dependency in Node only
    const fd = require('form-data')
    return fd.default || fd
  } catch (err) {
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).FormData !== 'undefined') {
      return (globalThis as any).FormData
    }
    throw err
  }
}
