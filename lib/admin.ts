// Admin gating.
//
// Single source of truth: membership of the Cognito `admin` group. It is granted
// in the user pool, travels in the ID token as `cognito:groups`, and is verified
// server-side against the token signature - so it cannot be forged or edited by
// the client.
//
// There is deliberately no `user` group. Absence from `admin` IS the default
// role, so a regular user needs no group at all. That is one less thing to keep
// in sync, and the check fails closed when group data is missing.

import { getSessionClaims, type SessionClaims } from "@/lib/session";

/** Group name in the Cognito user pool. */
const ADMIN_GROUP = (process.env.COGNITO_ADMIN_GROUP || "admin").toLowerCase();

/** True if these verified claims carry admin rights. */
export function isAdmin(claims: SessionClaims | null | undefined): boolean {
  return !!claims?.groups?.some((g) => g.toLowerCase() === ADMIN_GROUP);
}

/** True if the current verified session belongs to an admin. Server-only. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  return isAdmin(await getSessionClaims());
}
