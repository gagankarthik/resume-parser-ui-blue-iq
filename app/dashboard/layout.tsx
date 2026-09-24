import Link from "next/link";
import { redirect } from "next/navigation";

import { MobileNav, Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { Logo } from "@/components/ui";
import { isAdmin as hasAdminRights } from "@/lib/admin";
import { getSessionClaims } from "@/lib/session";

// Everything under /dashboard sits behind a verified session. Inherit the site
// defaults but flip robots off: these URLs only ever redirect a crawler to
// /login, so indexing them wastes crawl budget and surfaces dead results.
export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Security: server-side verification of the Cognito session on every request.
  const claims = await getSessionClaims();
  if (!claims) redirect("/login");

  // Group membership lives on the verified token, not on the address.
  const isAdmin = hasAdminRights(claims);

  return (
    <div className="flex min-h-screen bg-dash">
      {/* Collapsible fixed rail on md+ (manages its own width) */}
      <Sidebar email={claims.email} isAdmin={isAdmin} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar with slide-over nav */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-black/[0.06] bg-dash/90 px-3 backdrop-blur-md md:hidden">
          <MobileNav email={claims.email} isAdmin={isAdmin} />
          <Link href="/dashboard" aria-label="Blue-IQ dashboard">
            <Logo className="h-[22px] w-auto" />
          </Link>
          <UserMenu email={claims.email} isAdmin={isAdmin} />
        </header>

        <Topbar email={claims.email} isAdmin={isAdmin} />

        <main className="mx-auto w-full max-w-[1480px] flex-1 px-4 py-7 sm:px-7 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
