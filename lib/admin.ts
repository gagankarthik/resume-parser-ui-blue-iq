// Admin gating.
//
// Source of truth is the Cognito `admin` group: membership is granted in the
// user pool, travels in the ID token as `cognito:groups`, and is verified
// server-side with the token signature. Nothing about it is client-editable.
//
// There is deliberately no "user" group. Absence from the admin group IS the
// default role, so regular users need no group at all - one less thing to keep
// in sync, and the check fails closed if group data is ever missing.
//
// ADMIN_EMAILS is kept as a fallback so existing operators keep access while
// they are added to the group. Once everyone is in the group, unset it.

import { getSessionClaims, type SessionClaims } from "@/lib/session";

/** Group name in the Cognito user pool. Override if yours is named differently. */
const ADMIN_GROUP = process.env.COGNITO_ADMIN_GROUP || "admin";

function legacyAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** True if these verified claims carry admin rights. */
export function isAdmin(claims: SessionClaims | null | undefined): boolean {
  if (!claims) return false;
  if (claims.groups?.some((g) => g.toLowerCase() === ADMIN_GROUP.toLowerCase())) return true;
  return legacyAdminEmails().includes(claims.email.toLowerCase());
}

/**
 * True if this email is an allow-listed operator.
 *
 * Email-only check, retained for call sites that have an address but no token.
 * Prefer `isAdmin(claims)` - group membership cannot be inferred from an email.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return legacyAdminEmails().includes(email.toLowerCase());
}

/** True if the current verified session belongs to an admin. Server-only. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  return isAdmin(await getSessionClaims());
}
