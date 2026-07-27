/**
 * In-memory sliding-window rate limit.
 *
 * Good enough on purpose: this site runs as a single container on one VPS, so a
 * process-local map is the real shared state. If it ever runs on more than one
 * instance this becomes a lie and needs Postgres or Redis behind the same
 * interface — which is why the check lives here and not inlined in the action.
 */
type Hit = { count: number; firstSeen: number }

const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 3
const MAX_KEYS = 5000

const hits = new Map<string, Hit>()

const sweep = (now: number) => {
  for (const [key, hit] of hits) {
    if (now - hit.firstSeen > WINDOW_MS) hits.delete(key)
  }
}

export const checkRateLimit = (key: string): { allowed: boolean; retryAfterMinutes: number } => {
  const now = Date.now()

  // Cheap guard against unbounded growth under a flood.
  if (hits.size > MAX_KEYS) sweep(now)

  const existing = hits.get(key)

  if (!existing || now - existing.firstSeen > WINDOW_MS) {
    hits.set(key, { count: 1, firstSeen: now })
    return { allowed: true, retryAfterMinutes: 0 }
  }

  if (existing.count >= MAX_PER_WINDOW) {
    const elapsed = now - existing.firstSeen
    return {
      allowed: false,
      retryAfterMinutes: Math.max(1, Math.ceil((WINDOW_MS - elapsed) / 60000)),
    }
  }

  existing.count += 1
  return { allowed: true, retryAfterMinutes: 0 }
}
