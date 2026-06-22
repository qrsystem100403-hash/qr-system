export function normalizeHost(host: string) {
  return host
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(":")[0]
    .trim()
    .toLowerCase()
}