"use client";

// Account menu at the right end of the top bar (and the mobile header): who is
// signed in, a link to Profile, and Sign out. Follows the menu-button pattern:
// Escape or a click outside closes it and returns focus to the button, and the
// arrow keys move between items.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { ChevronIcon, LogoutIcon, ProfileIcon } from "@/components/icons";
import { logout } from "@/lib/account";

export function UserMenu({ email, isAdmin = false }: { email: string; isAdmin?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const initial = (email || "?").charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    // Move focus into the menu when it opens.
    wrap.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function close() {
    setOpen(false);
    button.current?.focus();
  }

  function onMenuKey(e: KeyboardEvent<HTMLDivElement>) {
    const items = [...(wrap.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  async function onSignOut() {
    setSigningOut(true);
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <div ref={wrap} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Account menu for ${email}`}
        className="flex h-10 items-center gap-2 rounded-full border border-control bg-white py-1 pl-1 pr-2.5 transition-colors hover:border-ink"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-600 text-sm font-semibold text-white">{initial}</span>
        <span className="hidden max-w-[12rem] truncate text-[13px] font-medium text-ink lg:block">{email}</span>
        <ChevronIcon className={"h-3.5 w-3.5 text-ink-soft transition-transform " + (open ? "-rotate-90" : "rotate-90")} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          onKeyDown={onMenuKey}
          className="animate-menu absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-[16px] bg-white p-1.5 shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_18px_40px_-12px_rgba(15,23,42,0.35)]"
        >
          <div className="px-3 pb-2.5 pt-2">
            <p className="text-xs text-ink-soft">Signed in as</p>
            <p className="truncate text-sm font-semibold text-ink" title={email}>
              {email}
            </p>
            {isAdmin && <p className="mt-1 text-xs font-medium text-accent-700">Platform admin</p>}
          </div>
          <div className="my-1 h-px bg-line" />
          <Link
            href="/dashboard/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm font-medium text-ink outline-none hover:bg-paper focus-visible:bg-paper"
          >
            <ProfileIcon className="h-[18px] w-[18px] text-ink-soft" />
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={onSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-sm font-medium text-red-700 outline-none hover:bg-red-50 focus-visible:bg-red-50 disabled:opacity-60"
          >
            <LogoutIcon className="h-[18px] w-[18px]" />
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
