const buckets = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 10 * 60 * 1000
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const timestamps = (buckets.get(key) || []).filter((ts) => now - ts < windowMs);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    buckets.set(key, timestamps);
    return { allowed: false, retryAfterSec };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);

  // 防止内存无限增长
  if (buckets.size > 5000) {
    for (const [k, list] of buckets.entries()) {
      const fresh = list.filter((ts) => now - ts < windowMs);
      if (fresh.length === 0) buckets.delete(k);
      else buckets.set(k, fresh);
    }
  }

  return { allowed: true, retryAfterSec: 0 };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
