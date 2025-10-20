export function ensureProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `http://${url}`
}
