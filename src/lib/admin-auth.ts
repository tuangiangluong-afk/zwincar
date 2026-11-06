import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: "super_admin" | "admin" | "ops";
}

const SCRYPT_KEYLEN = 64;
const SCRYPT_COST = { N: 16384, r: 8, p: 1 };
function getAdminSecret(): string {
    const secret = process.env.ADMIN_AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("ADMIN_AUTH_SECRET must be set in production");
        }
        // shortcut: dev-only fallback, set ADMIN_AUTH_SECRET on Vercel before launch
        return "zwincar_admin_secret_guard_2026_dev_only";
    }
    return secret;
}

// Compte Super-Admin officiel ZwinCar
const ADMIN_SALT = "admin_salt_locapartoo_2026";
// Hash scrypt de "ZwinAdmin2026!"
const ADMIN_HASH = "2fcf35f771fc2e8b588dc9cd782cd92d694dccf2e07cb72810588ee01bfa6576afbf3e02edf067da1503ee12e4695147be9e493a92bab7ab0f2fb8c33004d299";

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
    const derived = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_COST);
    const expected = Buffer.from(storedHash, "hex");
    return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export async function authenticateAdmin(emailPlain: string, passwordPlain: string): Promise<{ admin: AdminUser; token: string } | null> {
    const cleanEmail = emailPlain.trim().toLowerCase();
    if (cleanEmail !== "locapartoo@gmail.com") {
        return null;
    }

    if (!verifyPassword(passwordPlain, ADMIN_SALT, ADMIN_HASH)) {
        return null;
    }

    const admin: AdminUser = {
        id: "adm-locapartoo",
        email: "locapartoo@gmail.com",
        name: "Admin Principal ZwinCar",
        role: "super_admin",
    };

    const token = createAdminSession(admin);
    return { admin, token };
}

export function createAdminSession(admin: AdminUser): string {
    const expiresAt = Date.now() + 14 * 86_400_000; // 14 jours
    const payloadB64 = Buffer.from(JSON.stringify({ admin, expiresAt }), "utf8").toString("base64url");
    const sig = createHmac("sha256", getAdminSecret()).update(payloadB64).digest("base64url");
    return `zwin_adm_${payloadB64}.${sig}`;
}

export function getAdminFromToken(token: string): AdminUser | null {
    if (!token || !token.startsWith("zwin_adm_") || !token.includes(".")) {
        return null;
    }

    const raw = token.slice("zwin_adm_".length);
    const dotIdx = raw.indexOf(".");
    const payloadB64 = raw.slice(0, dotIdx);
    const sig = raw.slice(dotIdx + 1);

    const expectedSig = createHmac("sha256", getAdminSecret()).update(payloadB64).digest("base64url");
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expectedSig, "utf8");

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return null;
    }

    try {
        const decoded = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as {
            admin: AdminUser;
            expiresAt: number;
        };

        if (decoded.expiresAt > Date.now() && decoded.admin?.email) {
            return decoded.admin;
        }
    } catch {
        return null;
    }

    return null;
}

/** Extracts admin token from Authorization header or cookie. */
export function extractAdminToken(request: Request): string | null {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.substring(7).trim();
    }
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/zwincar_admin_token=([^;]+)/);
    return match ? match[1].trim() : null;
}
