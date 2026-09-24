"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import {
  AdminIcon,
  CollapseIcon,
  CustomersIcon,
  DatabaseIcon,
  DocsIcon,
  EndpointIcon,
  KeyIcon,
  OverviewIcon,
  WebhookIcon,
} from "@/components/icons";
import { BrandMark, Logo } from "@/components/ui";

type NavItem = { href: string; label: string; icon: (p: { className?: string }) => React.ReactElement };

// One sidebar for everyone. Users see the user section; admins see the same
// section plus an Admin group beneath it. The old design was two separate navs
// behind a mode switch, which hid half the app behind a toggle and made "where
// am I" a question the user had to answer twice.
const USER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: OverviewIcon },
  { href: "/dashboard/api", label: "API Endpoints", icon: EndpointIcon },
  { href: "/dashboard/keys", label: "API Keys", icon: KeyIcon },
  { href: "/dashboard/webhooks", label: "Webhooks", icon: WebhookIcon },
  { href: "/docs", label: "Docs", icon: DocsIcon },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard/admin", label: "Admin overview", icon: AdminIcon },
  { href: "/dashboard/admin/customers", label: "Customers", icon: CustomersIcon },
  { href: "/dashboard/admin/data", label: "Data", icon: DatabaseIcon },
];





function isActive(pathname: string, href: string): boolean {
  // The two section roots ("/dashboard", "/dashboard/admin") match exactly so a
  // sub-route (e.g. /dashboard/admin/customers) doesn't also light up the root.
  if (href === "/dashboard" || href === "/dashboard/admin") return pathname === href;
  return pathname.startsWith(href);
}

/** Admin-only switch between the user dashboard and the admin console. */

function NavLinks({
  pathname,
  collapsed,
  onNavigate,
  isAdmin,
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  isAdmin?: boolean;
}) {
  const items = isAdmin ? [...USER_NAV, ...ADMIN_NAV] : USER_NAV;
  const adminStartsAt = USER_NAV.length;
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {items.map(({ href, label, icon: Icon }, i) => {
        const startsAdmin = isAdmin && i === adminStartsAt;
        const active = isActive(pathname, href);
        return (
          <Fragment key={href}>
            {startsAdmin && (
              <div className="pt-4">
                {!collapsed && (
                  <p className="px-3 pb-2 text-xs font-semibold text-ink-soft">
                    Admin
                  </p>
                )}
                {collapsed && <div className="mx-3 mb-2 border-t border-line" />}
              </div>
            )}
          <Link
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            aria-label={label}
            className={
              "group relative flex items-center gap-3 rounded-[12px] border px-3 py-2.5 text-sm font-medium transition-colors " +
              (collapsed ? "justify-center " : "") +
              (active
                ? "pill-lift border-black bg-white text-[#0f172a]"
                : "border-transparent text-[#475569] hover:bg-white/70 hover:text-[#0f172a]")
            }
          >
                        <span className={active ? "text-accent-600" : "text-ink-soft group-hover:text-[#0f172a]"}>
              <Icon className="h-[19px] w-[19px] shrink-0" />
            </span>
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
          </Fragment>
        );
      })}
    </nav>
  );
}

/** Desktop rail (md+) - collapsible, persisted to localStorage. */
export function Sidebar({ isAdmin }: { email?: string; isAdmin?: boolean }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("sb_collapsed") === "1");
  }, []);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("sb_collapsed", next ? "1" : "0");
      return next;
    });
  }

  const w = collapsed ? "w-[76px]" : "w-64";

  return (
    <div className={"hidden shrink-0 md:block " + w}>
      <div className={"fixed h-screen " + w}>
        <aside className="flex h-full flex-col border-r border-black/[0.06] bg-dash">
          {/* Header */}
          <div className={"flex h-16 shrink-0 items-center " + (collapsed ? "justify-center px-2" : "justify-between px-4")}>
            <Link href="/dashboard" aria-label="Blue-IQ dashboard">
              {collapsed ? <BrandMark className="h-7 w-7" /> : <Logo className="h-[22px] w-auto" />}
            </Link>
            {!collapsed && (
              <button
                onClick={toggle}
                aria-label="Collapse sidebar"
                title="Collapse"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-white/70 hover:text-[#0f172a]"
              >
                <CollapseIcon className="h-[18px] w-[18px]" />
              </button>
            )}
          </div>

          <NavLinks pathname={pathname} collapsed={collapsed} isAdmin={isAdmin} />

          {collapsed && (
            <div className="flex shrink-0 justify-center pb-1">
              <button
                onClick={toggle}
                aria-label="Expand sidebar"
                title="Expand"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-white/70 hover:text-[#0f172a]"
              >
                <CollapseIcon collapsed className="h-[18px] w-[18px]" />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/** Mobile hamburger + slide-over drawer. */
export function MobileNav({ isAdmin }: { email?: string; isAdmin?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="grid h-10 w-10 place-items-center rounded-full border border-black bg-white text-ink"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="animate-fade absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div role="dialog" aria-modal="true" aria-label="Navigation" className="animate-drawer absolute inset-y-0 left-0 bg-dash flex w-72 max-w-[85%] flex-col gap-1 px-3 py-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between px-2">
              <Logo className="h-[22px] w-auto" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-full text-[#475569] hover:bg-white/70 hover:text-[#0f172a]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} isAdmin={isAdmin} />
          </div>
        </div>
      )}
    </>
  );
}
