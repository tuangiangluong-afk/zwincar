/**
 * Limiteur de débit en mémoire (fenêtre glissante).
 *
 * Suffisant pour une instance unique et pour arrêter le spam basique sur les
 * routes publiques de réservation. En multi-instances, remplacer par Redis/Upstash
 * en gardant la même signature.
 */

interface Bucket {
    hits: number[];
}

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5_000;

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number, now: number = Date.now()): RateLimitResult {
    if (buckets.size > MAX_KEYS) {
        // Éviction simple : on vide les fenêtres expirées pour éviter une fuite mémoire.
        for (const [bucketKey, bucket] of buckets) {
            if (bucket.hits.length === 0 || bucket.hits[bucket.hits.length - 1] < now - windowMs) {
                buckets.delete(bucketKey);
            }
        }
    }

    const bucket = buckets.get(key) ?? { hits: [] };
    bucket.hits = bucket.hits.filter((timestamp) => timestamp > now - windowMs);

    if (bucket.hits.length >= limit) {
        const oldest = bucket.hits[0];
        const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
        buckets.set(key, bucket);
        return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    bucket.hits.push(now);
    buckets.set(key, bucket);
    return { allowed: true, remaining: limit - bucket.hits.length, retryAfterSeconds: 0 };
}

/** Utilisé par les tests pour repartir d'un état propre. */
export function resetRateLimits(): void {
    buckets.clear();
}
